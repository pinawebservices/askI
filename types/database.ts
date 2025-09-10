// ============================================
// types/database.ts - Define your types first
// ============================================

// ============================================
// Organization & User Management Types
// ============================================

export interface Organization {
    id: string;
    name: string;
    slug: string;
    plan_type: 'basic' | 'pro' | 'premium';
    subscription_status: 'trial' | 'active' | 'cancelled' | 'past_due';
    trial_ends_at: string;
    monthly_message_limit: number;
    current_message_count: number;
    billing_email?: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;  // This matches auth.users.id
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    organization_id: string;
    role: 'owner' | 'admin' | 'member';
    invited_by?: string;  // User ID of inviter
    created_at: string;
    updated_at: string;
}

// ============================================
// Client Configuration Types
// ============================================

export interface Client {
    id: string;
    client_id: string;
    business_name: string;
    email: string;
    plan_type: 'basic' | 'pro' | 'premium';
    is_active: boolean;
    organization_id: string;  // Changed from user_id
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

export interface CapturedLead {
    id: string;
    client_id: string;
    conversation_id: string;
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    inquiry_type?: string;
    custom_fields?: Record<string, any>;
    lead_score?: number;
    captured_at: string;
    notification_sent: boolean;
}

// ============================================
// Invitation System Types (for team members)
// ============================================

export interface Invitation {
    id: string;
    email: string;
    organization_id: string;
    role: 'admin' | 'member';
    invited_by: string;  // User ID
    token: string;
    created_at: string;
    expires_at: string;
    used_at?: string;
}

// ============================================
// Notification Preferences (for Basic tier)
// ============================================

export interface NotificationPreferences {
    id: string;
    user_id: string;
    organization_id: string;
    email_notifications: boolean;
    email_for_new_leads: boolean;
    email_for_daily_summary: boolean;
    // Pro tier additions would go here:
    // sms_notifications?: boolean;
    // sms_for_new_leads?: boolean;
    notification_email?: string;  // Different from account email
    created_at: string;
    updated_at: string;
}

// ============================================
// Helper Types for API Responses
// ============================================

export interface UserWithOrganization extends User {
    organization: Organization;
}

export interface ClientWithInstructions extends Client {
    instructions?: ClientInstructions;
}

export interface OrganizationWithMembers extends Organization {
    members: User[];
    owner: User;
}

// ============================================
// Tier-Specific Feature Types
// ============================================

export interface BasicTierFeatures {
    dashboard_access: boolean;
    email_notifications: boolean;
    generic_prompts: boolean;
    instructions_customization: boolean;
    max_conversations_per_month: number;
}

// export interface ProTierFeatures extends BasicTierFeatures {
//     document_training: boolean;
//     industry_prompts: boolean;
//     sms_notifications: boolean;
// }
//
// export interface PremiumTierFeatures extends ProTierFeatures {
//     custom_prompts: boolean;
//     white_glove_setup: boolean;
//     widget_customization: boolean;
//     priority_support: boolean;
//     custom_integrations: boolean;
// }