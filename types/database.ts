// ============================================
// types/database.ts - Define your types first
// ============================================

export interface Client {
    id: string;
    client_id: string;
    business_name: string;
    email: string;
    plan_type: 'free' | 'starter' | 'pro' | 'enterprise';
    is_active: boolean;
    google_drive_folder_id?: string;
    google_sheets_id?: string;
    pinecone_namespace?: string;
    created_at: string;
    updated_at: string;
}

export interface ClientInstructions {
    id?: string;
    client_id: string;
    business_name: string;
    business_type?: string;
    tone_style: string;
    communication_style: string;
    formality_level: string;
    special_instructions?: string;
    formatting_rules?: string;
    lead_capture_process?: string;
    conversation_guidelines?: string[];
    response_time: string;
    created_at?: string;
    updated_at?: string;
}

export interface ChatConversation {
    id: string;
    client_id: string;
    conversation_id: string;
    user_message: string;
    bot_response: string;
    chunks_used?: number;
    tokens_used?: number;
    response_time_ms?: number;
    created_at: string;
}