// app/api/chat/route.js - Enhanced with Supabase
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import validator from 'validator';
import { isPersonName } from 'people-names';

// Add this near the top of your route.js file
const conversationStates = new Map(); // Store state per conversation

const LeadCaptureStage = {
    // Initial states
    IDLE: 'idle',                           // No capture in progress

    // Offer and acceptance
    OFFER_MADE: 'offer_made',               // Bot offered to collect contact info
    ACCEPTED_OFFER: 'accepted_offer',       // User said yes to being contacted
    DECLINED_OFFER: 'declined_offer',       // User said no to being contacted

    // Collection stages
    COLLECTING_NAME: 'collecting_name',     // Waiting for name input
    NAME_COLLECTED: 'name_collected',       // Name captured, ready for phone

    COLLECTING_PHONE: 'collecting_phone',   // Waiting for phone input
    PHONE_COLLECTED: 'phone_collected',     // Phone captured, ready for email

    COLLECTING_EMAIL: 'collecting_email',   // Waiting for email input
    EMAIL_COLLECTED: 'email_collected',     // Email captured, ready to confirm

    // Confirmation stages
    CONFIRMING: 'confirming',               // Waiting for user to confirm info
    AWAITING_CORRECTION: 'awaiting_correction', // User said info is wrong

    // Final states
    COMPLETE: 'complete',                   // Lead captured successfully
    ABANDONED: 'abandoned'                  // User abandoned the flow
};
// For easier debugging
const StageDescriptions = {
    [LeadCaptureStage.IDLE]: 'No lead capture in progress',
    [LeadCaptureStage.OFFER_MADE]: 'Bot offered to collect contact info',
    [LeadCaptureStage.ACCEPTED_OFFER]: 'User agreed to provide contact info',
    [LeadCaptureStage.DECLINED_OFFER]: 'User declined to provide contact info',
    [LeadCaptureStage.COLLECTING_NAME]: 'Waiting for user to provide name',
    [LeadCaptureStage.NAME_COLLECTED]: 'Name captured, asking for phone',
    [LeadCaptureStage.COLLECTING_PHONE]: 'Waiting for user to provide phone',
    [LeadCaptureStage.PHONE_COLLECTED]: 'Phone captured, asking for email',
    [LeadCaptureStage.COLLECTING_EMAIL]: 'Waiting for user to provide email',
    [LeadCaptureStage.EMAIL_COLLECTED]: 'All info collected, asking for confirmation',
    [LeadCaptureStage.CONFIRMING]: 'Waiting for user to confirm information',
    [LeadCaptureStage.AWAITING_CORRECTION]: 'User wants to correct information',
    [LeadCaptureStage.COMPLETE]: 'Lead successfully captured',
    [LeadCaptureStage.ABANDONED]: 'User abandoned the capture flow'
};

/**
 * Track lead capture state
 */
function getLeadCaptureState(conversationId) {
    if (!conversationStates.has(conversationId)) {
        conversationStates.set(conversationId, {
            stage: LeadCaptureStage.IDLE, // idle, collecting_name, collecting_phone, collecting_email, confirming, complete
            tempLead: {
                name: null,
                phone: null,
                email: null
            },
            awaitingCorrection: false,
            lastUpdated: Date.now()
        });
    }
    return conversationStates.get(conversationId);
}

/**
 * Update lead capture based on conversation flow
 */
function updateLeadCapture(currentMessage, conversationHistory, conversationId) {
    const state = getLeadCaptureState(conversationId);
    const lastBotMessage = conversationHistory[conversationHistory.length - 2]?.content?.toLowerCase() || '';

    console.log(`📊 Lead Capture State: ${state.stage}`);

    switch (state.stage) {
        case LeadCaptureStage.ACCEPTED_OFFER:
            // User accepted, bot should ask for name next
            if (lastBotMessage.includes('name')) {
                transitionStage(state, LeadCaptureStage.COLLECTING_NAME, 'Bot asked for name');
            }
            break;

        case LeadCaptureStage.COLLECTING_NAME:
            const name = parseNameFromResponse(currentMessage);
            if (name) {
                state.tempLead.name = name;
                transitionStage(state, LeadCaptureStage.NAME_COLLECTED, `Name captured: ${name}`);
            }
            break;

        case LeadCaptureStage.NAME_COLLECTED:
            if (lastBotMessage.includes('phone')) {
                transitionStage(state, LeadCaptureStage.COLLECTING_PHONE, 'Bot asked for phone');
            }
            break;

        case LeadCaptureStage.COLLECTING_PHONE:
            const phone = extractPhone(currentMessage);
            if (phone) {
                state.tempLead.phone = phone;
                transitionStage(state, LeadCaptureStage.PHONE_COLLECTED, `Phone captured: ${phone}`);
            }
            break;

        case LeadCaptureStage.PHONE_COLLECTED:
            if (lastBotMessage.includes('email')) {
                transitionStage(state, LeadCaptureStage.COLLECTING_EMAIL, 'Bot asked for email');
            }
            break;

        case LeadCaptureStage.COLLECTING_EMAIL:
            const email = extractEmail(currentMessage);
            if (email) {
                state.tempLead.email = email;
                transitionStage(state, LeadCaptureStage.EMAIL_COLLECTED, `Email captured: ${email}`);
            }
            break;

        case LeadCaptureStage.EMAIL_COLLECTED:
            if (lastBotMessage.includes('is this information correct') ||
                lastBotMessage.includes('confirm')) {
                transitionStage(state, LeadCaptureStage.CONFIRMING, 'Bot asked for confirmation');
            }
            break;

        case LeadCaptureStage.CONFIRMING:
            const positive = ['yes', 'yep', 'correct', 'right', 'perfect', 'yea'];
            const negative = ['no', 'wrong', 'incorrect', 'change','that\'s not','thats not'];

            if (positive.some(word => currentMessage.toLowerCase().includes(word))) {
                transitionStage(state, LeadCaptureStage.COMPLETE, 'User confirmed info');
                return state.tempLead; // Return the confirmed lead!
            }

            if (negative.some(word => currentMessage.toLowerCase().includes(word))) {
                transitionStage(state, LeadCaptureStage.AWAITING_CORRECTION, 'User wants corrections');
            }
            break;

        case LeadCaptureStage.AWAITING_CORRECTION:
            // Handle corrections based on what user wants to fix
            const lower = currentMessage.toLowerCase();
            if (lower.includes('name')) {
                transitionStage(state, LeadCaptureStage.COLLECTING_NAME, 'Correcting name');
            } else if (lower.includes('phone')) {
                transitionStage(state, LeadCaptureStage.COLLECTING_PHONE, 'Correcting phone');
            } else if (lower.includes('email')) {
                transitionStage(state, LeadCaptureStage.COLLECTING_EMAIL, 'Correcting email');
            }
            break;

        default:
            console.log(`⚠️ Unhandled stage: ${state.stage}`);
    }

    return null; // No confirmed lead yet
}

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
        const systemPrompt = `You are a helpful assistant for ${instructions?.business_name || 'the business'}.

                RELEVANT INFORMATION:
                ${relevantContext}
                
                ${instructions?.special_instructions ? `SPECIAL INSTRUCTIONS:
                ${instructions.special_instructions}` : ''}
                
                ${instructions?.tone_style ? `TONE: Be ${instructions.tone_style} and professional.` : ''}
                
                ${instructions?.formatting_rules ? `FORMATTING:
                ${instructions.formatting_rules}` : ''}
                
                ${instructions?.lead_capture_process ? `FOR BOOKINGS:
                ${instructions.lead_capture_process}` : ''}
                
                Answer based on the information provided. Be helpful and professional.
                
                LEAD CAPTURE PROCESS:
                When a user shows interest in booking,scheduling,pricing, being contacted, or getting in contact with one of our representatives follow this EXACT sequence:
                
                1. First ask: "We'd be happy to help you with that! May I have your full name?"
                2. After receiving name, ask: "Thank you [Name]! What's the best phone number to reach you?"
                3. After receiving phone, ask: "Perfect! And what's your email address?"
                4. After receiving email, ALWAYS confirm: "Let me confirm your information:
                   - Name: [captured name]
                   - Phone: [captured phone]  
                   - Email: [captured email]
                   Is this information correct?"
                5. If they say something like "I don't have an email" or "I don't want to give my email" → Say that is ok, can you confirm your name and phone number are correct:
                    - Name: [captured name]
                    - Phone: [captured phone]
                6. If they say something like "I don't want to give out my phone number" → Say something professionally and respectfully that you understand but that we need at least a phone number to have someone reach out to them.
                7. If they say something like yes/correct/right/yep → Say "Perfect! Someone will contact you shortly."
                8. If they say something like no/wrong/incorrect → Ask "Which part should I correct?"
                
                IMPORTANT: 
                - Ask for ONE piece of information at a time
                - Wait for their response before moving to the next field
                - Always use the confirmation step
                - Be conversational but stay on track`;

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
            'email', 'phone', 'name','contact', 'book', 'schedule',
            'appointment', 'quote', 'call'
        ];

        const shouldCaptureInfo = leadTriggers.some(trigger =>
            userMessage.toLowerCase().includes(trigger) ||
            completion.choices[0].message.content.toLowerCase().includes(trigger) // <-- If we wanted to use the AI's response to determine if we should capture info
        );

        // 7. Extract and save lead information if detected
        if (shouldCaptureInfo) {
            console.log('🎯 [LEAD CAPTURE] Trigger detected, checking conversation state...');

            const confirmedLead = updateLeadCapture(userMessage, messages, convId);

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
    // FIXME: This is a temporary fix to get the name extraction working
    console.log('🔍 [NAME EXTRACTION] Starting...');
    console.log('  Current message:', currentMessage);
    try {

        // Get the last bot message if it exists
        const lastBotMessage = conversationHistory.length >= 2
            ? conversationHistory[conversationHistory.length - 2]
            : null;

        // FIXME: This is a temporary fix to get the name extraction working
        console.log('  Last bot message:', lastBotMessage?.content?.substring(0, 100));

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

        if (lastBotMessage?.role === 'assistant') {
            const botAskedForName = nameQuestions.some(q =>
                lastBotMessage.content.toLowerCase().includes(q)
            );

            console.log('  Bot asked for name:', botAskedForName);

            if (botAskedForName) {
                // Bot specifically asked for name, so parse the response carefully
                const extractedName = parseNameFromResponse(currentMessage);
                // FIXME: This is a temporary fix to get the name extraction working
                console.log('  ✅ Extracted name from response:', extractedName);
                return extractedName;
            }
        }

        // Check for explicit name declarations in the message
        const declarationPatterns = [
            /(?:my name is|i'm|i am|this is|call me)\s+(.+)/i
        ];

        for (const pattern of declarationPatterns) {
            const match = currentMessage.match(pattern);
            if (match && match[1]) {
                const potentialName = match[1].trim();
                // FIXME: This is a temporary fix to get the name extraction working
                console.log('  Found declaration pattern:', potentialName);

                // Validate with people-names library
                const isValid = isPersonName(potentialName);
                // FIXME: This is a temporary fix to get the name extraction working
                console.log('  Is valid name?', isValid);

                if (isValid) {
                    // FIXME: This is a temporary fix to get the name extraction working
                    console.log('  ✅ Name validated:', potentialName);
                    return potentialName;
                }
            }
        }

        // If message is short and could be just a name, validate it
        if (currentMessage.split(' ').length <= 3) {
            const potentialName = currentMessage.trim();
            const isValid = isPersonName(potentialName);
            console.log('  Short message validation:', potentialName, 'Valid?', isValid);
            if (isValid) {
                // But only accept if there's context suggesting name was requested
                const recentMessages = conversationHistory.slice(-4).map(m => m.content.toLowerCase()).join(' ');
                const hasNameContext = recentMessages.includes('name');
                if (hasNameContext) {
                    console.log('  ✅ Name accepted from short message:', potentialName);
                    return potentialName;
                }
            }
        }

        console.log('  ⚠️ No name extracted');
        return null;
    } catch (e) {
        console.error('❌ Name extraction error:', e);
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
    // FIXME: This is a temporary fix to get the name extraction working
    console.log('  [PARSE NAME] Input:', response);
    const cleaned = response.trim();

    // Handle common response patterns
    const patterns = [
        // "It's John" / "I'm John" / "I am John"
        { regex: /^(?:it's|its|i'm|im|i am)\s+(.+)/i, name: "It's/I'm pattern" },
        // "My name is John"
        { regex: /^(?:my name is|my name's)\s+(.+)/i, name: "My name is pattern" },
        // "This is John"
        { regex: /^(?:this is|call me)\s+(.+)/i, name: "This is pattern" },
        // "John, nice to meet you"
        { regex: /^([^,]+),/, name: "Name with comma pattern" },
        // Just the name by itself
        { regex: /^(.+)$/, name: "Direct name pattern" }
    ];

    for (const {regex, name} of patterns) {
        const match = cleaned.match(regex);
        if (match && match[1]) {
            const potentialName = match[1].trim();
            console.log(`  [PARSE NAME] Matched "${name}":`, potentialName);

            // Use isPersonName to validate
            const isValid = isPersonName(potentialName);
            console.log(`  [PARSE NAME] isPersonName("${potentialName}") =`, isValid);
            if (isValid) {
                console.log('  [PARSE NAME] ✅ Valid name found:', potentialName);
                return potentialName;
            }
        }
    }

    return null;
}

function shouldProcessLeadCapture(userMessage, botResponse, conversationId) {
    const state = getLeadCaptureState(conversationId);

    // Already in a lead capture flow - continue it
    const activeStages = [
        LeadCaptureStage.OFFER_MADE,
        LeadCaptureStage.ACCEPTED_OFFER,
        LeadCaptureStage.COLLECTING_NAME,
        LeadCaptureStage.NAME_COLLECTED,
        LeadCaptureStage.COLLECTING_PHONE,
        LeadCaptureStage.PHONE_COLLECTED,
        LeadCaptureStage.COLLECTING_EMAIL,
        LeadCaptureStage.EMAIL_COLLECTED,
        LeadCaptureStage.CONFIRMING,
        LeadCaptureStage.AWAITING_CORRECTION
    ];

    if (activeStages.includes(state.stage)) {
        console.log(`📋 Continuing lead capture: ${StageDescriptions[state.stage]}`);
        return true;
    }

    const userMessageLower = userMessage.toLowerCase();
    const botResponseLower = botResponse.toLowerCase();

    // Check if bot just offered to help with contact/booking
    const botOffersCapture =
        (botResponseLower.includes('would you like') &&
            (botResponseLower.includes('schedule') ||
                (botResponseLower.includes('scheduling') ||
                botResponseLower.includes('book') ||
                botResponseLower.includes('contact'))) ||
        botResponseLower.includes('can i get your') ||
        botResponseLower.includes('may i have your'));

    if (botOffersCapture && state.stage === LeadCaptureStage.IDLE) {
        transitionStage(state, LeadCaptureStage.OFFER_MADE, 'Bot offered contact');

        // If bot offered and user said yes, START the capture flow
        if (botOffersCapture) {
            const positiveResponses = ['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'please', 'definitely', 'absolutely'];
            const negativeResponses = ['no', 'nope', 'not', 'nah', 'maybe later', 'not now'];

            // Check user's response
            const userResponse = userMessageLower.trim();

            if (positiveResponses.some(resp => userResponse.includes(resp))) {
                console.log('✅ User accepted to provide contact info');
                state.stage = LeadCaptureStage.ACCEPTED_OFFER;  // New stage!
                return true;
            }

            if (negativeResponses.some(resp => userResponse.includes(resp))) {
                console.log('❌ User declined to provide contact info');
                state.stage = LeadCaptureStage.DECLINED_OFFER;
                return false;
            }
        }
    }

    // Check for direct high-intent triggers from user
    const highIntentTriggers = [
        'book an appointment',
        'schedule a meeting',
        'get a quote',
        'contact me',
        'call me back',
        'i want to book',
        'i need to schedule'
    ];

    const userHasIntent = highIntentTriggers.some(trigger =>
        userMessageLower.includes(trigger)
    );

    if (userHasIntent) {
        console.log('🎯 User expressed direct intent');
        transitionStage(state, LeadCaptureStage.ACCEPTED_OFFER, 'Direct user intent');
        return true;
    }

    return false;
}

/**
 * Log stage transitions for debugging
 */
function transitionStage(state, newStage, reason = '') {
    const oldStage = state.stage;
    state.stage = newStage;
    state.lastUpdated = Date.now();

    console.log(`📊 [STAGE TRANSITION] ${oldStage} → ${newStage}`);
    if (reason) console.log(`   Reason: ${reason}`);
    console.log(`   Description: ${StageDescriptions[newStage]}`);
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