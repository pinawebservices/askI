// app/api/chat/route.js - Enhanced with Supabase
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import validator from 'validator';
import { isPersonName } from 'people-names';

export async function POST(request) {
    try {
        const { messages, clientId = 'demo-wellness', conversationId } = await request.json();
        const userMessage = messages[messages.length - 1].content;

        // Require conversation ID from frontend
        let convId;
        if (!conversationId) {
            console.error(`No conversation ID provided_clientId: ${clientId}, Date: ${Date.now()} .. creating fallback convId`);

            // Fallback create convId
            convId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        } else {
            convId = conversationId;
        }

        // 1. Get client instructions from Supabase
        const { data: instructions, error: instructionsError } = await supabaseAdmin
            .from('client_instructions')
            .select('*')
            .eq('client_id', clientId)
            .single();

        if (instructionsError) {
            console.log('No custom instructions found, using defaults');
        }

        // 2. Initialize Pinecone and OpenAI
        const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const index = pinecone.index('chatbot-knowledge');
        const namespace = index.namespace(clientId);

        // 3. Search Pinecone for relevant content
        const embedding = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: userMessage
        });

        const searchResults = await namespace.query({
            vector: embedding.data[0].embedding,
            topK: 5,
            includeMetadata: true
        });

        const relevantContext = searchResults.matches
            .map(match => match.metadata.text)
            .join('\n\n');

        // 4. Build enhanced prompt with instructions
        const systemPrompt = `You are a customer service assistant for ${instructions?.business_name || 'the business'}.

RELEVANT INFORMATION:
${relevantContext}

${instructions?.special_instructions ? `SPECIAL INSTRUCTIONS:
${instructions.special_instructions}` : ''}

${instructions?.tone_style ? `TONE: Be ${instructions.tone_style} and professional.` : ''}

${instructions?.formatting_rules ? `FORMATTING:
${instructions.formatting_rules}` : ''}

${instructions?.lead_capture_process ? `FOR BOOKINGS:
${instructions.lead_capture_process}` : ''}

Answer based on the information provided. Be helpful and professional.`;

        // 5. Generate response
        const completion = await openai.chat.completions.create({
            model: 'gpt-4.1-nano' +
                '',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 400
        });

        // 6. Check if response contains lead capture trigger
        const leadTriggers = [
            'email', 'phone', 'contact', 'book', 'schedule',
            'appointment', 'quote', 'pricing', 'call me'
        ];

        const shouldCaptureInfo = leadTriggers.some(trigger =>
            userMessage.toLowerCase().includes(trigger) ||
            completion.choices[0].message.content.toLowerCase().includes(trigger)
        );

        // 7. Extract and save lead information if detected
        if (shouldCaptureInfo) {
            const leadInfo = extractLeadInfo(userMessage, messages);
            if (leadInfo.email || leadInfo.phone || leadInfo.name) {
                leadInfo.score = null; //calculateLeadScore(leadInfo, userMessage);
                await captureAndNotifyLead(leadInfo, clientId, convId);
            }
        }

        // 8. Log conversation to Supabase for analytics
        await supabaseAdmin.from('chat_conversations').insert({
            client_id: clientId,
            conversation_id: `conv_${Date.now()}`,
            user_message: userMessage,
            bot_response: completion.choices[0].message.content,
            chunks_used: searchResults.matches.length,
            tokens_used: completion.usage?.total_tokens || 0
        });

        return Response.json({
            message: completion.choices[0].message.content,
            debug: {
                hasCustomInstructions: !!instructions,
                chunksUsed: searchResults.matches.length
            }
        });

    } catch (error) {
        console.error('Chat error:', error);
        return Response.json({ error: 'Failed to process' }, { status: 500 });
    }
}


// Helpers
/**
 * Extract email from text using validator
 * @param {string} text - Text to search for email
 * @returns {string|null} - Normalized email or null
 */
function extractEmail(text) {
    try {
        const words = text.split(/[\s,;<>()[\]{}]+/);

        for (const word of words) {
            const cleanedEmail = word.trim();
            if (validator.isEmail(cleanedEmail)) {
                // DON'T normalize - keep exactly what customer provided
                return cleanedEmail.toLowerCase(); // Just lowercase for consistency
            }
        }

        // Fallback pattern matching
        const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const matches = text.match(emailPattern);

        if (matches) {
            for (const match of matches) {
                if (validator.isEmail(match)) {
                    return match.toLowerCase(); // Keep original structure
                }
            }
        }
    } catch (e) {
        console.error('Email extraction error:', e);
    }
    return null;
}

/**
 * Extract US phone number from text
 * @param {string} text - Text to search for phone number
 * @returns {string|null} - Formatted phone number or null
 */
function extractPhone(text) {
    try {
        // Match anything that looks like a phone number
        const phoneRegex = /[\+]?[1]?[\s.-]?\(?[\d]{3}\)?[\s.-]?[\d]{3,4}[\s.-]?[\d]{4}/g;
        const matches = text.match(phoneRegex);

        if (matches) {
            for (const match of matches) {
                // Remove everything except digits
                const digitsOnly = match.replace(/\D/g, '');

                // Add country code if it's exactly 10 digits
                const normalized = digitsOnly.length === 10 ? '1' + digitsOnly : digitsOnly;

                // Parse with libphonenumber
                const parsed = parsePhoneNumberFromString('+' + normalized, 'US');
                if (parsed && parsed.isValid()) {
                    return parsed.formatNational(); // (754) 485-9632
                }
            }
        }
    } catch (e) {
        console.error('Phone extraction error:', e);
    }
    return null;
}

/**
 * Extract name from conversation context
 * @param {string} currentMessage - The most recent user message
 * @param {Array} conversationHistory - Full conversation history
 * @returns {string|null} - Extracted name or null
 */
function extractName(currentMessage, conversationHistory) {
    try {

        // Get the last bot message if it exists
        const lastBotMessage = conversationHistory.length >= 2
            ? conversationHistory[conversationHistory.length - 2]
            : null;

        // Check if bot specifically asked for name
        const nameQuestions = [
            'what is your name',
            "what's your name",
            'may i have your name',
            'can i get your name',
            'who am i speaking with',
            'may i ask who',
            'can i ask your name',
            'mind if i get your name',
            'could you tell me your name'
        ];

        // ONLY extract from current message if bot just asked for name
        if (lastBotMessage?.role === 'assistant') {
            const botAskedForName = nameQuestions.some(q =>
                lastBotMessage.content.toLowerCase().includes(q)
            );

            if (botAskedForName) {
                // Bot specifically asked for name, so parse the response carefully
                return parseNameFromResponse(currentMessage);
            }
        }

        const potentialName = parseNameFromResponse(currentMessage);

        // Validate with library
        if (potentialName && isPersonName(potentialName)) {
            return potentialName;
        }

        return null;
    } catch (e) {
        console.error('Name extraction error:', e);
        return null;
    }
}

/**
 * Main function to extract all lead information
 * @param {string} message - Current message
 * @param {Array} conversationHistory - Conversation history
 * @returns {Object} - Extracted lead information
 */
function extractLeadInfo(message, conversationHistory) {
    // Combine full conversation for email/phone extraction
    const fullConversation = conversationHistory.map(m => m.content).join(' ') + ' ' + message;

    // Extract each piece of information independently
    const email = extractEmail(fullConversation);
    const phone = extractPhone(fullConversation);
    const name = extractName(message, conversationHistory);
    const score = null;

    return {
        email,
        phone,
        name,
        score,
        timestamp: new Date().toISOString(),
        conversation: conversationHistory
    };
}

/**
 * Captures lead information from chat conversations and sends notifications to clients.
 * Prevents duplicate leads by checking for existing records with the same conversation ID.
 * Updates existing leads with new information when available.
 *
 * @async
 * @function captureAndNotifyLead
 * @param {Object} leadInfo - The extracted lead information
 * @param {string|null} leadInfo.email - Lead's email address
 * @param {string|null} leadInfo.phone - Lead's phone number formatted as (XXX) XXX-XXXX
 * @param {string|null} leadInfo.name - Lead's full name
 * @param {number | null} leadInfo.score - Lead quality score from 0-100
 * @param {string} leadInfo.timestamp - ISO timestamp when lead was captured
 * @param {Array<Object>} leadInfo.conversation - Full conversation history array
 * @param {string} clientId - Unique identifier for the client (e.g., 'demo-wellness')
 * @param {string} conversationId - Unique identifier for the conversation session
 * @returns {Promise<void>} - Returns nothing, performs side effects (database insert and notifications)
 * @throws {Error} - Logs errors but doesn't throw to prevent chat disruption
 *
 * @example
 * // Capture a new lead with email and phone
 * await captureAndNotifyLead(
 *   {
 *     email: 'john@example.com',
 *     phone: '(754) 485-9632',
 *     name: 'John Smith',
 *     score: 75,
 *     timestamp: '2024-01-15T10:30:00Z',
 *     conversation: [{role: 'user', content: 'I need a quote'}]
 *   },
 *   'client-123',
 *   'conv_abc123'
 * );
 */
async function captureAndNotifyLead(leadInfo, clientId, conversationId) {
    // Check if we already captured a lead for this conversation
    const { data: existingLead } = await supabaseAdmin
        .from('captured_leads')
        .select('id, email, phone, name, notification_sent')
        .eq('client_id', clientId)
        .eq('conversation_id', conversationId)
        .single();

    if (existingLead) {
        // Update existing lead with new info instead of creating duplicate
        const updates = {};
        if (leadInfo.email && !existingLead.email) updates.email = leadInfo.email;
        if (leadInfo.phone && !existingLead.phone) updates.phone = leadInfo.phone;
        if (leadInfo.name && !existingLead.name) updates.name = leadInfo.name;

        if (Object.keys(updates).length > 0) {
            await supabaseAdmin
                .from('captured_leads')
                .update(updates)
                .eq('id', existingLead.id);

            // Send notification if this is significant new info
            if ((updates.email || updates.phone) && !existingLead.notification_sent) {
                // await sendLeadNotification({...existingLead, ...updates}, clientId);
                await supabaseAdmin
                    .from('captured_leads')
                    .update({ notification_sent: true })
                    .eq('id', existingLead.id);
            }
        }
        return;
    }

    // Create new lead if none exists
    const { data, error } = await supabaseAdmin
        .from('captured_leads')
        .insert({
            client_id: clientId,
            conversation_id: conversationId,  // Add this!
            email: leadInfo.email,
            phone: leadInfo.phone,
            name: leadInfo.name,
            lead_score: leadInfo.score,
            captured_at: leadInfo.timestamp,
            conversation_summary: leadInfo.conversation
        })
        .select()
        .single();

    if (!error && data) {
        //await sendLeadNotification(leadInfo, clientId);
        await supabaseAdmin
            .from('captured_leads')
            .update({ notification_sent: true })
            .eq('id', data.id);
    }
}

/**
 * Parse name from a direct response to name question
 * @param {string} response - User's response to name question
 * @returns {string|null} - Parsed name or null
 */
function parseNameFromResponse(response) {
    const cleaned = response.trim();

    // Handle common response patterns
    const patterns = [
        // "It's John" / "I'm John" / "I am John"
        /^(?:it's|its|i'm|im|i am)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
        // "My name is John"
        /^(?:my name is|my name's)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
        // "John" or "John Doe" (just the name)
        /^([A-Z][a-z]+(?:\s+[A-Z]?\.?\s*[A-Z][a-z]+)*)$/,
        // "John, nice to meet you"
        /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),/,
    ];

    for (const pattern of patterns) {
        const match = cleaned.match(pattern);
        if (match && match[1]) {
            const name = match[1].trim();
            if (isValidName(name)) {
                return name;
            }
        }
    }

    // If no patterns match but it looks like it could be a name
    if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(cleaned) && isValidName(cleaned)) {
        return cleaned;
    }

    return null;
}

/**
 * (BETA - UNTESTED - FUTURE FEATURE IDEA )Lead Score Interpretation Guide:
 *
 * 0-30:   Low Intent - Browsing, no contact info
 * 31-50:  Moderate Intent - Some interest, partial contact info
 * 51-70:  Good Lead - Clear interest, has contact info
 * 71-85:  High Intent - Strong buying signals, complete info
 * 86-100: Hot Lead - Immediate purchase intent, fully qualified
 *
 * Scoring Components:
 * - Email provided: +30 points
 * - Phone provided: +20 points
 * - Each high-intent keyword: +10 points
 * - Conversation engagement: +5 per exchange (max 30)
 * - Quote/pricing inquiry: +15 points
 * - Meeting/appointment request: +15 points
 */
/**
 * Calculates a quality score for a captured lead based on contact information
 * completeness and conversation intent signals.
 * Score ranges from 0-100, with higher scores indicating higher quality/intent leads.
 *
 * @function calculateLeadScore
 * @param {Object} leadInfo - The extracted lead information to score
 * @param {string|null} leadInfo.email - Lead's email address
 * @param {string|null} leadInfo.phone - Lead's phone number
 * @param {string|null} leadInfo.name - Lead's full name
 * @param {Array<Object>} conversation - Full conversation history array
 * @param {string} conversation[].role - Message role ('user' or 'assistant')
 * @param {string} conversation[].content - Message content text
 * @returns {number} Score from 0-100 indicating lead quality (100 = highest quality)
 *
 * @example
 * // High-intent lead with email and buying signals
 * const score = calculateLeadScore(
 *   { email: 'john@example.com', phone: '(754) 485-9632', name: 'John' },
 *   [
 *     { role: 'user', content: 'I need pricing for your service' },
 *     { role: 'assistant', content: 'Our plans start at $50/month' },
 *     { role: 'user', content: 'I want to purchase today' }
 *   ]
 * );
 * // Returns: 95 (high score due to contact info + purchase intent)
 *
 * @example
 * // Low-intent lead with minimal information
 * const score = calculateLeadScore(
 *   { email: null, phone: null, name: 'Jane' },
 *   [{ role: 'user', content: 'Just browsing' }]
 * );
 * // Returns: 5 (low score, no contact info, low intent)
 */
// function calculateLeadScore(leadInfo, conversation) {
//     let score = 0;
//
//     // Has contact info (50 points possible)
//     if (leadInfo.email) score += 30;
//     if (leadInfo.phone) score += 20;
//
//     // High-intent keywords (up to 80 points with multiple matches)
//     const highIntentWords = ['appointment', 'consultation', 'consult', 'price','pricing', 'rate','rates', 'urgent', 'immediately', 'today','soon','tomorrow','week','weeks','hour','hours'];
//     const messageContent = conversation.map(m => m.content).join(' ').toLowerCase();
//
//     highIntentWords.forEach(word => {
//         if (messageContent.includes(word)) score += 10;
//     });
//
//     // Conversation engagement (max 30 points)
//     score += Math.min(conversation.length * 5, 30);
//
//     // Specific business inquiries (15 points each)
//     if (messageContent.includes('quote') || messageContent.includes('cost')) score += 15;
//     if (messageContent.includes('appointment') || messageContent.includes('meeting')) score += 15;
//
//     return Math.min(score, 100); // Cap at 100
// }

// // Export functions if needed elsewhere
// export {
//     extractEmail,
//     extractPhone,
//     extractName,
//     extractLeadInfo
// };