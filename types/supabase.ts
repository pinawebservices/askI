export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      captured_leads: {
        Row: {
          captured_at: string | null
          client_id: string
          company: string | null
          conversation_id: string | null
          conversation_summary: Json | null
          created_at: string | null
          custom_fields: Json | null
          email: string | null
          id: string
          inquiry_type: string | null
          lead_score: number | null
          name: string | null
          notification_sent: boolean | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          captured_at?: string | null
          client_id: string
          company?: string | null
          conversation_id?: string | null
          conversation_summary?: Json | null
          created_at?: string | null
          custom_fields?: Json | null
          email?: string | null
          id?: string
          inquiry_type?: string | null
          lead_score?: number | null
          name?: string | null
          notification_sent?: boolean | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          captured_at?: string | null
          client_id?: string
          company?: string | null
          conversation_id?: string | null
          conversation_summary?: Json | null
          created_at?: string | null
          custom_fields?: Json | null
          email?: string | null
          id?: string
          inquiry_type?: string | null
          lead_score?: number | null
          name?: string | null
          notification_sent?: boolean | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          bot_response: string
          chunks_used: number | null
          client_id: string
          conversation_id: string
          created_at: string | null
          id: string
          response_time_ms: number | null
          tokens_used: number | null
          user_message: string
        }
        Insert: {
          bot_response: string
          chunks_used?: number | null
          client_id: string
          conversation_id: string
          created_at?: string | null
          id?: string
          response_time_ms?: number | null
          tokens_used?: number | null
          user_message: string
        }
        Update: {
          bot_response?: string
          chunks_used?: number | null
          client_id?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          response_time_ms?: number | null
          tokens_used?: number | null
          user_message?: string
        }
        Relationships: []
      }
      client_content: {
        Row: {
          client_id: string | null
          content: Json
          content_type: string
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          content: Json
          content_type: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          content?: Json
          content_type?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_content_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["client_id"]
          },
        ]
      }
      client_instructions: {
        Row: {
          business_name: string
          business_type: string | null
          client_id: string
          communication_style: string | null
          created_at: string | null
          formality_level: string | null
          formatting_rules: string | null
          id: string
          lead_capture_process: string | null
          response_time: string | null
          special_instructions: string | null
          tone_style: string | null
          updated_at: string | null
        }
        Insert: {
          business_name: string
          business_type?: string | null
          client_id: string
          communication_style?: string | null
          created_at?: string | null
          formality_level?: string | null
          formatting_rules?: string | null
          id?: string
          lead_capture_process?: string | null
          response_time?: string | null
          special_instructions?: string | null
          tone_style?: string | null
          updated_at?: string | null
        }
        Update: {
          business_name?: string
          business_type?: string | null
          client_id?: string
          communication_style?: string | null
          created_at?: string | null
          formality_level?: string | null
          formatting_rules?: string | null
          id?: string
          lead_capture_process?: string | null
          response_time?: string | null
          special_instructions?: string | null
          tone_style?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          business_name: string
          client_id: string
          created_at: string | null
          email: string
          google_drive_folder_id: string | null
          google_sheets_id: string | null
          id: string
          industry: string | null
          is_active: boolean | null
          is_pinecone_configured: boolean | null
          notification_email: string | null
          notification_phone: string | null
          notification_preferences: Json | null
          organization_id: string | null
          pinecone_namespace: string | null
          plan_type: string | null
          updated_at: string | null
        }
        Insert: {
          business_name: string
          client_id: string
          created_at?: string | null
          email: string
          google_drive_folder_id?: string | null
          google_sheets_id?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          is_pinecone_configured?: boolean | null
          notification_email?: string | null
          notification_phone?: string | null
          notification_preferences?: Json | null
          organization_id?: string | null
          pinecone_namespace?: string | null
          plan_type?: string | null
          updated_at?: string | null
        }
        Update: {
          business_name?: string
          client_id?: string
          created_at?: string | null
          email?: string
          google_drive_folder_id?: string | null
          google_sheets_id?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          is_pinecone_configured?: boolean | null
          notification_email?: string | null
          notification_phone?: string | null
          notification_preferences?: Json | null
          organization_id?: string | null
          pinecone_namespace?: string | null
          plan_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          chunks_created: number | null
          client_id: string
          file_name: string
          file_size: number | null
          file_type: string | null
          google_drive_id: string | null
          id: string
          processed_at: string | null
          status: string | null
          storage_path: string | null
          uploaded_at: string | null
        }
        Insert: {
          chunks_created?: number | null
          client_id: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          google_drive_id?: string | null
          id?: string
          processed_at?: string | null
          status?: string | null
          storage_path?: string | null
          uploaded_at?: string | null
        }
        Update: {
          chunks_created?: number | null
          client_id?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          google_drive_id?: string | null
          id?: string
          processed_at?: string | null
          status?: string | null
          storage_path?: string | null
          uploaded_at?: string | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          billing_email: string | null
          created_at: string | null
          current_message_count: number | null
          id: string
          monthly_message_limit: number | null
          name: string
          plan_type: string
          slug: string
          subscription_status: string | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          billing_email?: string | null
          created_at?: string | null
          current_message_count?: number | null
          id?: string
          monthly_message_limit?: number | null
          name: string
          plan_type?: string
          slug: string
          subscription_status?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_email?: string | null
          created_at?: string | null
          current_message_count?: number | null
          id?: string
          monthly_message_limit?: number | null
          name?: string
          plan_type?: string
          slug?: string
          subscription_status?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          organization_id: string | null
          status: string | null
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          organization_id?: string | null
          status?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          organization_id?: string | null
          status?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_customers: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          organization_id: string
          stripe_customer_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          organization_id: string
          stripe_customer_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          organization_id?: string
          stripe_customer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stripe_customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          organization_id: string
          plan_type: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string
          trial_end: string | null
          trial_start: string | null
          updated_at: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          organization_id: string
          plan_type?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          organization_id?: string
          plan_type?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stripe_subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stripe_subscriptions_stripe_customer_id_fkey"
            columns: ["stripe_customer_id"]
            isOneToOne: false
            referencedRelation: "stripe_customers"
            referencedColumns: ["stripe_customer_id"]
          },
        ]
      }
      subscription_history: {
        Row: {
          created_at: string | null
          ended_at: string | null
          event_type: string | null
          id: string
          metadata: Json | null
          organization_id: string | null
          plan_type: string | null
          started_at: string | null
          status: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
        }
        Insert: {
          created_at?: string | null
          ended_at?: string | null
          event_type?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          plan_type?: string | null
          started_at?: string | null
          status?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
        }
        Update: {
          created_at?: string | null
          ended_at?: string | null
          event_type?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          plan_type?: string | null
          started_at?: string | null
          status?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      training_pairs: {
        Row: {
          answer: string
          category: string | null
          client_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          question: string
        }
        Insert: {
          answer: string
          category?: string | null
          client_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          question: string
        }
        Update: {
          answer?: string
          category?: string | null
          client_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          question?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          invited_by: string | null
          last_name: string | null
          organization_id: string | null
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          invited_by?: string | null
          last_name?: string | null
          organization_id?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          invited_by?: string | null
          last_name?: string | null
          organization_id?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
