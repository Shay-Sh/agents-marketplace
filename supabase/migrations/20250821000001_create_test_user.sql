-- Temporary solution for development: remove foreign key constraints to auth.users
-- This allows the subscription system to work without actual Supabase Auth setup

-- Remove foreign key constraint from subscriptions table
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_fkey;

-- Remove foreign key constraint from conversations table
ALTER TABLE public.conversations DROP CONSTRAINT IF EXISTS conversations_user_id_fkey;

-- Remove foreign key constraint from profiles table  
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Change user_id columns to allow any UUID (not just auth.users references)
-- The columns stay as UUID type but without foreign key validation