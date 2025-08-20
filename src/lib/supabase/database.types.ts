export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          pricing_tier: 'free' | 'basic' | 'premium' | 'enterprise'
          is_active: boolean
          context_type: 'user_provided' | 'predefined' | 'hybrid'
          system_prompt: string
          knowledge_base_ids: string[] | null
          webhook_url: string | null
          keywords: string[] | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          pricing_tier: 'free' | 'basic' | 'premium' | 'enterprise'
          is_active?: boolean
          context_type: 'user_provided' | 'predefined' | 'hybrid'
          system_prompt: string
          knowledge_base_ids?: string[] | null
          webhook_url?: string | null
          keywords?: string[] | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          pricing_tier?: 'free' | 'basic' | 'premium' | 'enterprise'
          is_active?: boolean
          context_type?: 'user_provided' | 'predefined' | 'hybrid'
          system_prompt?: string
          knowledge_base_ids?: string[] | null
          webhook_url?: string | null
          keywords?: string[] | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          agent_id: string
          title: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          agent_id: string
          title: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          agent_id?: string
          title?: string
          created_at?: string
          updated_at?: string
        }
      }
      knowledge_base: {
        Row: {
          id: string
          agent_id: string
          title: string
          content: string
          file_url: string | null
          embeddings: unknown | null
          created_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          title: string
          content: string
          file_url?: string | null
          embeddings?: unknown | null
          created_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          title?: string
          content?: string
          file_url?: string | null
          embeddings?: unknown | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string
          metadata?: Json | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: 'free' | 'basic' | 'premium' | 'enterprise'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'basic' | 'premium' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'basic' | 'premium' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          agent_id: string
          tier: 'basic' | 'premium' | 'enterprise'
          status: 'active' | 'cancelled' | 'expired'
          stripe_subscription_id: string | null
          current_period_start: string | null
          current_period_end: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          agent_id: string
          tier: 'basic' | 'premium' | 'enterprise'
          status: 'active' | 'cancelled' | 'expired'
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          agent_id?: string
          tier?: 'basic' | 'premium' | 'enterprise'
          status?: 'active' | 'cancelled' | 'expired'
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
        }
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