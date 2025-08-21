-- Add status column to conversations table
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.conversations (status);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations (user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages (conversation_id);

-- Update database types if needed
COMMENT ON COLUMN public.conversations.status IS 'Conversation status: active, archived, deleted';