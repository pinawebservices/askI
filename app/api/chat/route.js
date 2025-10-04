// app/api/chat/route.js
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { supabaseAdmin } from '@/lib/supabase-admin';
import validator from 'validator';
import { IndustryConfig, loadIndustryConfigs } from '@/lib/industries';
import {sendLeadNotificationEmail} from "@/lib/services/notifications/emailNotifications.js";

// Add this near the top of your route.js file
const conversationStates = new Map(); // Store state per conversation

const LeadCaptureStage = {
    // Initial states
    IDLE: 'idle',                           // No capture in progress

    // Offer and acceptance
    CAPTURE_INITIALIZED: 'capture_initialized',               // Lead capture initialized
    ACCEPTED_OFFER: 'accepted_offer',
    // ACCEPTED_OFFER_ASSUMED: 'accepted_offer_assumed', // User said yes to being contacted
    DECLINED_OFFER: 'declined_offer',       // User said no to being contacted

    // // Collection stages
    // COLLECTING_NAME: 'collecting_name',     // Waiting for name input
    // NAME_COLLECTED: 'name_collected',       // Name captured, ready for phone
    //
    // COLLECTING_PHONE: 'collecting_phone',   // Waiting for phone input
    // PHONE_COLLECTED: 'phone_collected',     // Phone captured, ready for email
    //
    // COLLECTING_EMAIL: 'collecting_email',   // Waiting for email input
    // EMAIL_COLLECTED: 'email_collected',     // Email captured, ready to confirm

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
    [LeadCaptureStage.CAPTURE_INITIALIZED]: 'Bot offered to collect contact info',
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

const generateBasicIndustryContext = (agentConfig) => {
    const businessName = agentConfig?.business_name || 'our business';
    const businessType = agentConfig?.business_type || 'service provider';

    const basicContexts = {
        // Legal & Financial
        'law_firm': `You are an AI assistant for ${businessName}, a law firm. You can provide general information about legal processes, common terms, and what to expect when working with attorneys. However, you cannot provide legal advice specific to anyone's situation. Always remind visitors that for their specific legal matters, they should consult with an attorney.`,

        'accounting_firm': `You are an AI assistant for ${businessName}, an accounting firm. You can provide general information about accounting practices, tax deadlines, and common business financial concepts. However, you cannot provide specific tax or financial advice. Always remind visitors that for their specific financial situation, they should consult with a qualified accountant.`,

        'tax_preparation': `You are an AI assistant for ${businessName}, a tax preparation service. You can provide general information about tax seasons, common forms, and the tax filing process. However, you cannot provide specific tax advice. Always remind visitors that tax situations are unique and they should consult with a tax professional.`,

        'financial_advisor': `You are an AI assistant for ${businessName}, a financial advisory firm. You can provide general educational information about investment concepts, retirement planning basics, and financial terminology. However, you cannot provide personalized investment advice. Always remind visitors that financial planning should be tailored to individual circumstances by a qualified advisor.`,

        'insurance_agency': `You are an AI assistant for ${businessName}, an insurance agency. You can provide general information about types of insurance, common coverage terms, and how insurance works. However, you cannot recommend specific coverage amounts or policies. Always remind visitors that insurance needs vary and they should speak with an agent for personalized recommendations.`,

        // Medical & Healthcare
        'medical_practice': `You are an AI assistant for ${businessName}, a medical practice. You can provide general health information, explain common medical procedures, and discuss wellness topics. However, you cannot diagnose conditions, recommend treatments, or provide medical advice. Always remind visitors that health concerns should be discussed with a qualified healthcare provider.`,

        'dental_practice': `You are an AI assistant for ${businessName}, a dental practice. You can provide general information about dental hygiene, common procedures, and oral health. However, you cannot diagnose dental conditions or recommend specific treatments. Always remind visitors that dental concerns should be evaluated by a dentist.`,

        'optometry': `You are an AI assistant for ${businessName}, an optometry clinic. You can provide general information about eye health, vision care, and common vision conditions. However, you cannot diagnose vision problems or recommend specific treatments. Always remind visitors that vision concerns should be evaluated by an eye care professional.`,

        'veterinary': `You are an AI assistant for ${businessName}, a veterinary clinic. You can provide general pet care information, discuss common pet health topics, and explain routine procedures. However, you cannot diagnose pet conditions or recommend specific treatments. Always remind visitors that pet health concerns should be evaluated by a veterinarian.`,

        'mental_health': `You are an AI assistant for ${businessName}, a mental health practice. You can provide general wellness information and explain therapy processes. However, you cannot provide mental health diagnoses, therapy, or crisis intervention. If someone appears to be in crisis, provide crisis hotline information. Always remind visitors that mental health concerns should be addressed with a qualified professional.`,

        'physical_therapy': `You are an AI assistant for ${businessName}, a physical therapy clinic. You can provide general information about physical therapy, recovery processes, and wellness. However, you cannot diagnose conditions or recommend specific exercises or treatments. Always remind visitors that physical concerns should be evaluated by a healthcare provider.`,

        'chiropractic': `You are an AI assistant for ${businessName}, a chiropractic clinic. You can provide general information about chiropractic care, spinal health, and wellness. However, you cannot diagnose conditions or recommend specific treatments. Always remind visitors that physical concerns should be evaluated by a healthcare professional.`,

        // Real Estate & Property
        'real_estate': `You are an AI assistant for ${businessName}, a real estate agency. You can provide general information about the buying and selling process, market terminology, and what to expect when working with agents.`,

        'property_management': `You are an AI assistant for ${businessName}, a property management company. You can provide general information about property management services, tenant and owner responsibilities, and rental processes.`,

        'mortgage_broker': `You are an AI assistant for ${businessName}, a mortgage brokerage. You can provide general information about mortgage types, the loan process, and common lending terms. However, you cannot quote specific rates or pre-qualify anyone. Always note that rates and qualification depend on individual circumstances.`,

        // Home Services (keep simple - no liability concerns)
        'hvac': `You are an AI assistant for ${businessName}, an HVAC service company. You can provide general information about heating and cooling systems, maintenance tips, and energy efficiency.`,

        'plumbing': `You are an AI assistant for ${businessName}, a plumbing service. You can provide general information about plumbing maintenance and common issues. For specific problems, always recommend professional evaluation.`,

        'electrical': `You are an AI assistant for ${businessName}, an electrical service company. You can provide general electrical safety information. For any electrical issues, always emphasize the importance of professional evaluation for safety.`,

        'roofing': `You are an AI assistant for ${businessName}, a roofing contractor. You can provide general information about roofing materials, maintenance, and the inspection process. For specific roofing issues, always recommend professional evaluation.`,

        'general_contractor': `You are an AI assistant for ${businessName}, a general contracting company. You can provide general information about construction, renovation processes, and project planning. Specific project recommendations require professional consultation.`,

        'cleaning_service': `You are an AI assistant for ${businessName}, a cleaning service. You can provide general information about cleaning services, maintenance schedules, and service types.`,

// Beauty & Wellness (missing ones)
        'beauty_salon': `You are an AI assistant for ${businessName}, a beauty salon. You can provide general information about beauty treatments, hair care, and salon services.`,

        'barbershop': `You are an AI assistant for ${businessName}, a barbershop. You can provide general information about grooming services, haircut styles, and barbershop culture.`,

        'spa': `You are an AI assistant for ${businessName}, a spa and wellness center. You can provide general information about spa treatments, wellness practices, and relaxation services.`,

        'fitness_center': `You are an AI assistant for ${businessName}, a fitness center. You can provide general fitness information and explain gym amenities. For specific exercise or health advice, always recommend consulting with fitness professionals.`,

// Automotive (missing ones)
        'auto_repair': `You are an AI assistant for ${businessName}, an auto repair shop. You can provide general information about vehicle maintenance, common repairs, and service intervals. Specific diagnostic issues require professional inspection.`,

        'auto_dealership': `You are an AI assistant for ${businessName}, an auto dealership. You can provide general information about vehicle types, financing basics, and the car buying process.`,

        'auto_detailing': `You are an AI assistant for ${businessName}, an auto detailing service. You can provide general information about detailing services, paint protection, and vehicle care.`,

// Education & Consulting (missing ones)
        'tutoring': `You are an AI assistant for ${businessName}, a tutoring service. You can provide general information about educational support, study strategies, and tutoring benefits. Specific learning plans require consultation.`,

        'consulting': `You are an AI assistant for ${businessName}, a business consulting firm. You can provide general information about business improvement concepts and consulting processes. Specific business advice requires professional consultation.`,

        'marketing_agency': `You are an AI assistant for ${businessName}, a marketing agency. You can provide general information about marketing strategies, digital presence, and branding concepts. Specific marketing recommendations require consultation.`,

        // Default for all others
        'default': `You are an AI assistant for ${businessName}. You can provide general information about our type of business and answer common questions.`
    };

    const context = basicContexts[businessType] || basicContexts['default'];

    return `${context}
    
IMPORTANT GUIDELINES:
- Provide helpful general information when possible
- Be clear when something requires professional consultation
- Never provide specific advice for individual situations
- When you don't have specific information about our services or pricing, offer to collect contact information for follow-up`;
};

const getLeadCaptureInstructions = (agentConfig) => {
    return `When a user shows interest in booking, scheduling, pricing, being contacted, or getting in contact with one of our representatives follow this EXACT sequence:
        
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
        7. If they say something like yes/correct/right/yep → Say "Perfect! Someone from our team will contact you within ${agentConfig?.response_time || '24 hours'}."
        8. If they say something like no/wrong/incorrect → Ask "Which part should I correct?"
        
        IMPORTANT: 
        - Ask for ONE piece of information at a time
        - Wait for their response before moving to the next field
        - Always use the confirmation step
        - Be conversational but stay on track`;
};

// For Basic Plan (use this now)
const generateSystemPrompt = (agentConfig, relevantContext, industryEnhancement) => {
    // For Basic plan, use default industry enhancement
    const basicIndustryContext = `You are an AI assistant for ${agentConfig?.business_name || 'this business'}, a ${agentConfig?.business_type || 'professional service provider'}.`;

    return `${industryEnhancement || basicIndustryContext}

        BUSINESS KNOWLEDGE BASE:
        ${relevantContext}
        
        ${agentConfig?.special_instructions ? `SPECIAL INSTRUCTIONS: ${agentConfig.special_instructions}` : ''}
        
        COMMUNICATION STYLE: Be ${agentConfig?.tone_style || 'helpful'} and ${agentConfig?.formality_level || 'professional'}.
        
        Answer based on the information provided. Always maintain professionalism and build trust while gathering necessary information.
        
        LEAD CAPTURE PROCESS:
        ${getLeadCaptureInstructions(agentConfig)}`;
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

loadIndustryConfigs();

/**
 * Update lead capture based on conversation flow
 */

export async function POST(request) {
    try {
        const {messages, clientId, conversationId} = await request.json();
        const userMessage = messages[messages.length - 1].content;
        const leadState = getLeadCaptureState(conversationId);
        let convId;

        // New Conversations reset lead stage
        if (messages.length <= 2) {
            leadState.stage = LeadCaptureStage.IDLE;
            console.log('New conversation, resetting lead stage to IDLE');
        }

        // Require conversation ID from frontend
        if (!conversationId) {
            console.error(`No conversation ID provided_clientId: ${clientId}, Date: ${Date.now()} .. creating fallback convId`);

            // Fallback create convId
            convId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        } else if (!convId){
            console.log('Assigning convId with ConversationId: ', conversationId);
            convId = conversationId;
        }

        // 1. Get agent config from Supabase
        const {data: agentConfig, error: instructionsError} = await supabaseAdmin
            .from('client_instructions')
            .select('*')
            .eq('client_id', clientId)
            .single();

        if (instructionsError) {
            console.log('Error getting agent instructions', instructionsError);
        }



        // 2. Initialize Pinecone and OpenAI
        const pinecone = new Pinecone({apiKey: process.env.PINECONE_API_KEY});
        const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
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
        const promptContext = {
            userMessage,
            businessName: agentConfig?.business_name,
            businessType: agentConfig?.business_type,
            relevantContext,
            instructions: agentConfig
        }

        // Basic Plan Prompts
        const industryEnhancement = generateBasicIndustryContext(agentConfig);

        // Pro+ Prompts
        //const industryEnhancement = IndustryConfig.getSystemPromptEnhancement(agentConfig?.business_type || 'default', promptContext);

        // FIXME: Future Enhancement
        // // Get industry-specific lead qualification
        // const leadQualification = IndustryConfig.getLeadQualificationFlow(
        //     instructions?.industry || 'default'
        // );

        // 4. BUILD SYSTEM PROMPT (NEW - using your function)
        const systemPrompt = generateSystemPrompt(
            agentConfig,
            relevantContext,
            industryEnhancement
        );

        // DEBUGGING:
        // console.log('🤖 ============ OPENAI REQUEST ============');
        // console.log('Prompt Context UserName: ', promptContext.userName)
        // console.log('Prompt Context BusinessName: ', promptContext.businessName)
        // console.log('Prompt Context BusinessType: ', promptContext.businessType)
        // console.log('Prompt Context RelevantContext: ', promptContext.relevantContext)
        // console.log('Prompt Context Instructions: ', promptContext.instructions)
        // console.log('📋 Industry Enhanced Prompt: ', industryEnhancement);
        // console.log('📋 System Prompt:', systemPrompt);
        // console.log('💬 Messages History:', JSON.stringify(messages, null, 2));
        // console.log('🔧 Model:', 'gpt-4.1-nano');
        // console.log('🌡️ Temperature:', 0.7);
        // console.log('📏 Max Tokens:', 400);
        // console.log('=========================================\n');

        // 5. Generate response
        const completion = await openai.chat.completions.create({
            model: 'gpt-4.1-nano' +
                '',
            messages: [
                {role: 'system', content: systemPrompt},
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 800
        });

        const currentAgentMessage = completion.choices[0].message.content.toLowerCase() || '';

        // FIXME - NEED A BETTER WAY TO DO THIS -- Perhaps a entering some sort of lead collecting mode.. because these lead triggers with ever message sent don't seem like the best approach
        // 6. Check if response contains lead capture trigger
        const leadCaptureStartTriggers = [
            'contact', 'book', 'schedule',
            'appointment', 'quote', 'call', 'booking', 'scheduling',

        ];

        const leadCaptureOfferedAndAcceptedTriggers = [
            'your name', 'your full name'
            ];

        const captureAndUpdateLeadName = () => {
            const name = parseNameFromResponse(userMessage);
            if (name) {
                leadState.tempLead.name = name;
                console.log(`👤 Updated Lead State Name`)
            }
        }

        const captureAndUpdateLeadPhone = () => {
            const phone = extractPhone(userMessage);
            if (phone) {
                leadState.tempLead.phone = phone;
                console.log(`☎️ Updated Lead State Phone`)
            }
        }

        const captureAndUpdateLeadEmail = () => {
            const email = extractEmail(userMessage);
            if (email) {
                leadState.tempLead.email = email;
                console.log(`📧 Updated Lead State Email`)
            }
        }

        const captureLeadInfo = () => {
            const lastAgentMessagePriorToUser = messages[messages.length - 2]?.content?.toLowerCase() || '';
            console.log(' Last agent message prior to user\'s: ', lastAgentMessagePriorToUser);
            if (lastAgentMessagePriorToUser.includes('name')) {
                captureAndUpdateLeadName();
            } else if (lastAgentMessagePriorToUser.includes('phone')) {
                captureAndUpdateLeadPhone();
            } else if (lastAgentMessagePriorToUser.includes('email')) {
                captureAndUpdateLeadEmail();
            }
            if (leadState.tempLead.name && leadState.tempLead.phone && leadState.tempLead.email) {
                transitionStage(leadState, LeadCaptureStage.CONFIRMING, 'Confirming captured lead info');
            }
        }

        // 7. Extract and save lead information if detected
        switch (leadState.stage) {
            case LeadCaptureStage.IDLE:
                const lastAgentMessagePriorToUserIdle = messages[messages.length - 2]?.content?.toLowerCase() || '';
                console.log("CAPTURE IDLE STATE:")
                console.log(' messages length:', messages.length)
                console.log(' Current agent message: ', currentAgentMessage);
                console.log(' Last user message: ', userMessage);
                console.log(' Last agent message prior to user: ', lastAgentMessagePriorToUserIdle);
                const shouldInitializeLeadState = leadCaptureStartTriggers.some(trigger =>
                    userMessage.toLowerCase().includes(trigger) ||
                    currentAgentMessage.includes(trigger) // <-- If we wanted to use the AI's response to determine if we should capture info
                );

                const leadCaptureOfferedAndAccepted = leadCaptureOfferedAndAcceptedTriggers.some(trigger =>
                    //userMessage.toLowerCase().includes(trigger) ||
                    currentAgentMessage.includes(trigger)
                );

                if (leadCaptureOfferedAndAccepted) {
                    console.log('🎯 [LEAD Capture Offered And Accepted] Trigger detected');
                    transitionStage(leadState, LeadCaptureStage.ACCEPTED_OFFER, 'User accepted offer assumed');
                } else if (shouldInitializeLeadState) {
                    console.log('🎯 [LEAD CAPTURE Initialize] Trigger detected');
                    transitionStage(leadState, LeadCaptureStage.CAPTURE_INITIALIZED,'lead capture trigger detected');
                }
                break;
            case LeadCaptureStage.CAPTURE_INITIALIZED:
                const lastAgentMessagePriorToUserInitialized = messages[messages.length - 2]?.content?.toLowerCase() || '';
                console.log("CAPTURE INITIALIZED STATE:")
                console.log(' messages length:', messages.length)
                console.log(' Current agent message: ', currentAgentMessage);
                console.log(' Last user message: ', userMessage);
                console.log(' Last agent message prior to user: ', lastAgentMessagePriorToUserInitialized);
                const botOfferedCapture =
                        (currentAgentMessage.includes('schedule') ||
                            currentAgentMessage.includes('scheduling') ||
                            currentAgentMessage.includes('book') ||
                            currentAgentMessage.includes('booking') ||
                            currentAgentMessage.includes('appointment') ||
                            currentAgentMessage.includes('contact')) ||
                    currentAgentMessage.includes('can i get your') ||
                    currentAgentMessage.includes('may i have your');

                if (botOfferedCapture){
                // Check if user just accepted
                const userMessageLower = userMessage.toLowerCase().trim();
                const positiveResponses = ['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'please', 'definitely', 'absolutely','love'];
                const negativeResponses = ['no', 'nope', 'not', 'nah', 'maybe later', 'not now'];

                if (positiveResponses.some(resp => userMessageLower.includes(resp))) {
                    console.log('✅ User accepted offer');
                    transitionStage(leadState, LeadCaptureStage.ACCEPTED_OFFER, 'User accepted offer');
                } else if (negativeResponses.some(resp => userMessageLower.includes(resp))) {
                    console.log('❌ User declined to provide contact info');
                    transitionStage(leadState, LeadCaptureStage.DECLINED_OFFER, 'User declined offer');
                }
                }
                break;
            case LeadCaptureStage.ACCEPTED_OFFER:
                console.log("ACCEPTED OFFER STATE:")
                console.log(' Current agent message: ', currentAgentMessage);
                console.log(' Last user message: ', userMessage);
                captureLeadInfo();
                break;
            // case LeadCaptureStage.ACCEPTED_OFFER_ASSUMED:
            //     console.log("ACCEPTED OFFER ASSUMED STATE:")
            //     console.log(' Current agent message: ', currentAgentMessage);
            //     console.log(' Last user message: ', userMessage);
            //     captureLeadInfo();
            //     break;
            case LeadCaptureStage.CONFIRMING:
                const lastAgentMessagePriorToUserConfirming = messages[messages.length - 2]?.content?.toLowerCase() || '';
                console.log("CONFIRMING OFFER STATE:")
                console.log(' Current agent message: ', currentAgentMessage);
                console.log(' Last user message: ', userMessage);
                console.log(' Last agent message prior to user\'s: ', lastAgentMessagePriorToUserConfirming);
                if (lastAgentMessagePriorToUserConfirming.includes('is this information correct') ||
                    lastAgentMessagePriorToUserConfirming.includes('confirm')) {
                    const positive = ['yes', 'yep', 'correct', 'right', 'perfect', 'yea'];
                    const negative = ['no', 'wrong', 'incorrect', 'change','that\'s not','thats not'];

                    if (positive.some(word => userMessage.toLowerCase().includes(word))) {
                        transitionStage(leadState, LeadCaptureStage.COMPLETE, 'User confirmed info');
                        console.log(`💾 Saving confirmed lead to database: ${leadState.tempLead} and ConversationId: ${convId}`);
                        const leadInfo = {
                            ...leadState.tempLead,
                            score: null,
                            timestamp: new Date().toISOString(),
                            conversation: messages
                        };
                        await captureAndNotifyLead(leadInfo, clientId, convId);
                    }

                    if (negative.some(word => userMessage.toLowerCase().includes(word))) {
                        transitionStage(leadState, LeadCaptureStage.AWAITING_CORRECTION, 'User wants corrections');
                    }
                }
                break;
            case LeadCaptureStage.AWAITING_CORRECTION:
                const lastAgentMessagePriorToUserAwaiting = messages[messages.length - 2]?.content?.toLowerCase() || '';
                console.log("AWAITING CORRECTION STATE:")
                console.log(' Current agent message: ', currentAgentMessage);
                console.log(' Last user message: ', userMessage);
                console.log(' Last agent message prior to user\'s: ', lastAgentMessagePriorToUserAwaiting);
                // Handle corrections based on what user wants to fix
                if (lastAgentMessagePriorToUserAwaiting.includes('name')) {
                    captureAndUpdateLeadName()
                    transitionStage(leadState, LeadCaptureStage.COMPLETE, 'User confirmed info');
                    console.log(`💾 Saving lead with corrected name to database: ${leadState.tempLead} and ConversationId: ${convId}`);
                    const leadInfo = {
                        ...leadState.tempLead,
                        score: null,
                        timestamp: new Date().toISOString(),
                        conversation: messages
                    };
                    await captureAndNotifyLead(leadInfo, clientId, convId);
                } else if (lastAgentMessagePriorToUserAwaiting.includes('phone')) {
                    captureAndUpdateLeadPhone()
                    transitionStage(leadState, LeadCaptureStage.COMPLETE, 'User confirmed info');
                    console.log('💾 Saving lead with corrected phone to database:', leadState.tempLead);
                    const leadInfo = {
                        ...leadState.tempLead,
                        score: null,
                        timestamp: new Date().toISOString(),
                        conversation: messages
                    };
                    await captureAndNotifyLead(leadInfo, clientId, convId);
                } else if (lastAgentMessagePriorToUserAwaiting.includes('email')) {
                    captureAndUpdateLeadEmail()
                    transitionStage(leadState, LeadCaptureStage.COMPLETE, 'User confirmed info');
                    console.log('💾 Saving lead with corrected email to database:', leadState.tempLead);
                    const leadInfo = {
                        ...leadState.tempLead,
                        score: null,
                        timestamp: new Date().toISOString(),
                        conversation: messages
                    };
                    await captureAndNotifyLead(leadInfo, clientId, convId);
                }
                break;
            default:
                break;
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
                hasCustomInstructions: !!agentConfig,
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
        console.log(` 📞 Extracting phone state from ${text}` )
        const phoneRegex = /[\+]?[1]?[\s.-]?\(?[\d]{3}\)?[\s.-]?[\d]{3,4}[\s.-]?[\d]{4}/g;
        const matches = text.match(phoneRegex);

        if (matches) {
            for (const match of matches) {
                // Remove everything except digits
                const digitsOnly = match.replace(/\D/g, '');
                return digitsOnly;
            }
        }

    } catch (e) {
        console.error('Phone extraction error:', e);
    }
    return null;
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

    try {
        console.log('🚀 captureAndNotifyLead called with:', {
            clientId,
            conversationId,
            hasEmail: !!leadInfo.email,
            hasPhone: !!leadInfo.phone,
            hasName: !!leadInfo.name
        });

        // Validate required parameters
        if (!clientId || !conversationId) {
            console.error('❌ Missing required parameters:', { clientId, conversationId });
            return;
        }


        // Check if we already captured a lead for this conversation
        const {data: existingLead} = await supabaseAdmin
            .from('captured_leads')
            .select('id, email, phone, name, notification_sent')
            .eq('client_id', clientId)
            .eq('conversation_id', conversationId)
            .single();

        if (existingLead) {
            // Update existing lead with new info instead of creating duplicate
            console.log('Existing lead found...');
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
                        .update({notification_sent: true})
                        .eq('id', existingLead.id);
                }
            }
            return;
        }

        // Create new lead if none exists
        console.log('📝 Attempting to insert new lead:', {
            client_id: clientId,
            conversation_id: conversationId,
            email: leadInfo.email,
            phone: leadInfo.phone,
            name: leadInfo.name,
            lead_score: leadInfo.score,
            captured_at: leadInfo.timestamp,
            conversation_length: leadInfo.conversation?.length || 0
        });

        const {data, error} = await supabaseAdmin
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

        if (error) {
            console.error('❌ Failed to insert lead:', error);
            console.error('Error details:', {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint
            });
            // Don't throw - just log the error to prevent chat disruption
            return;
        }

        if (data) {
            console.log('✅ Lead successfully saved to database:', data);

            // Send email notification
            const emailId = await sendLeadNotificationEmail(
                { ...leadInfo, id: data.id },
                clientId
            );

            if (emailId){
                console.log('📧 Email notification sent:', emailId);

                // Update notification status
                const {error: updateError} = await supabaseAdmin
                    .from('captured_leads')
                    .update({notification_sent: true})
                    .eq('id', data.id);

                if (updateError) {
                    console.error('⚠️ Failed to update notification status:', updateError);
                } else {
                    console.log('✅ Notification status updated');
                }
            }

        } else {
            console.warn('⚠️ No data returned after insert operation');
        }
    } catch (error) {
        console.error('❌ Unexpected error in captureAndNotifyLead:', error);
        // Don't throw to prevent chat disruption
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
            return potentialName;
        }
    }

    return null;
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