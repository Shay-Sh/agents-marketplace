-- SQL to add missing columns to agents table
-- Run this in your Supabase SQL Editor

-- Add icon column
ALTER TABLE public.agents 
ADD COLUMN IF NOT EXISTS icon text DEFAULT 'Bot';

-- Add webhook_url column  
ALTER TABLE public.agents
ADD COLUMN IF NOT EXISTS webhook_url text;

-- Add keywords column
ALTER TABLE public.agents
ADD COLUMN IF NOT EXISTS keywords text[] DEFAULT '{}';

-- Create index for keywords for better search performance
CREATE INDEX IF NOT EXISTS idx_agents_keywords ON public.agents USING GIN (keywords);

-- Add comments to document the columns
COMMENT ON COLUMN public.agents.icon IS 'Visual icon identifier for the agent';
COMMENT ON COLUMN public.agents.webhook_url IS 'Optional webhook URL for agent interactions';
COMMENT ON COLUMN public.agents.keywords IS 'Searchable keywords for agent discovery';

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'agents' 
ORDER BY ordinal_position;