-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type pricing_tier as enum ('free', 'basic', 'premium', 'enterprise');
create type subscription_tier as enum ('free', 'basic', 'premium', 'enterprise');
create type context_type as enum ('user_provided', 'predefined', 'hybrid');
create type subscription_status as enum ('active', 'cancelled', 'expired', 'trialing');
create type message_role as enum ('user', 'assistant', 'system');

-- Create profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  subscription_tier subscription_tier default 'free'::subscription_tier,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create agents table
create table public.agents (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null,
  category text not null,
  pricing_tier pricing_tier not null default 'free'::pricing_tier,
  is_active boolean default true,
  context_type context_type not null,
  system_prompt text not null,
  knowledge_base_ids uuid[] default '{}',
  created_by uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create subscriptions table
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  agent_id uuid references public.agents(id) on delete cascade not null,
  tier subscription_tier not null,
  status subscription_status not null default 'active'::subscription_status,
  stripe_subscription_id text unique,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, agent_id)
);

-- Create conversations table
create table public.conversations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  agent_id uuid references public.agents(id) on delete cascade not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create messages table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  role message_role not null,
  content text not null,
  metadata jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create knowledge_base table
create table public.knowledge_base (
  id uuid default uuid_generate_v4() primary key,
  agent_id uuid references public.agents(id) on delete cascade not null,
  title text not null,
  content text not null,
  file_url text,
  embeddings vector(1536), -- OpenAI embedding dimensions
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create usage_metrics table for tracking API usage
create table public.usage_metrics (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  agent_id uuid references public.agents(id) on delete cascade not null,
  tokens_used integer not null default 0,
  api_calls integer not null default 1,
  cost_cents integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.agents enable row level security;
alter table public.subscriptions enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.knowledge_base enable row level security;
alter table public.usage_metrics enable row level security;

-- Create RLS policies

-- Profiles policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Agents policies
create policy "Anyone can view active agents" on public.agents
  for select using (is_active = true);

create policy "Users can view own agents" on public.agents
  for select using (auth.uid() = created_by);

create policy "Users can create agents" on public.agents
  for insert with check (auth.uid() = created_by);

create policy "Users can update own agents" on public.agents
  for update using (auth.uid() = created_by);

create policy "Users can delete own agents" on public.agents
  for delete using (auth.uid() = created_by);

-- Subscriptions policies
create policy "Users can view own subscriptions" on public.subscriptions
  for select using (auth.uid() = user_id);

create policy "Users can create own subscriptions" on public.subscriptions
  for insert with check (auth.uid() = user_id);

create policy "Users can update own subscriptions" on public.subscriptions
  for update using (auth.uid() = user_id);

-- Conversations policies
create policy "Users can view own conversations" on public.conversations
  for select using (auth.uid() = user_id);

create policy "Users can create own conversations" on public.conversations
  for insert with check (auth.uid() = user_id);

create policy "Users can update own conversations" on public.conversations
  for update using (auth.uid() = user_id);

create policy "Users can delete own conversations" on public.conversations
  for delete using (auth.uid() = user_id);

-- Messages policies
create policy "Users can view messages in own conversations" on public.messages
  for select using (
    exists (
      select 1 from public.conversations 
      where conversations.id = messages.conversation_id 
      and conversations.user_id = auth.uid()
    )
  );

create policy "Users can create messages in own conversations" on public.messages
  for insert with check (
    exists (
      select 1 from public.conversations 
      where conversations.id = messages.conversation_id 
      and conversations.user_id = auth.uid()
    )
  );

-- Knowledge base policies
create policy "Users can view knowledge base for agents they own" on public.knowledge_base
  for select using (
    exists (
      select 1 from public.agents 
      where agents.id = knowledge_base.agent_id 
      and agents.created_by = auth.uid()
    )
  );

create policy "Users can manage knowledge base for own agents" on public.knowledge_base
  for all using (
    exists (
      select 1 from public.agents 
      where agents.id = knowledge_base.agent_id 
      and agents.created_by = auth.uid()
    )
  );

-- Usage metrics policies
create policy "Users can view own usage metrics" on public.usage_metrics
  for select using (auth.uid() = user_id);

create policy "System can insert usage metrics" on public.usage_metrics
  for insert with check (true);

-- Create functions and triggers

-- Function to handle user profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at column
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.agents
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.conversations
  for each row execute procedure public.handle_updated_at();

-- Create indexes for better performance
create index idx_agents_category on public.agents(category);
create index idx_agents_pricing_tier on public.agents(pricing_tier);
create index idx_agents_is_active on public.agents(is_active);
create index idx_conversations_user_id on public.conversations(user_id);
create index idx_conversations_agent_id on public.conversations(agent_id);
create index idx_messages_conversation_id on public.messages(conversation_id);
create index idx_messages_created_at on public.messages(created_at);
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_status on public.subscriptions(status);
create index idx_usage_metrics_user_id on public.usage_metrics(user_id);
create index idx_usage_metrics_created_at on public.usage_metrics(created_at);

-- Insert sample data

-- Sample agents (created by system admin)
insert into public.agents (
  name,
  description,
  category,
  pricing_tier,
  context_type,
  system_prompt,
  created_by
) values 
(
  'Customer Support AI',
  '24/7 intelligent customer service automation with natural language understanding',
  'Customer Service',
  'basic',
  'hybrid',
  'You are a helpful customer service AI assistant. Provide professional, empathetic, and accurate responses to customer inquiries. Always maintain a positive tone and escalate complex issues when necessary.',
  (select id from auth.users limit 1)
),
(
  'Content Generator',
  'AI-powered content creation and optimization for marketing and social media',
  'Marketing',
  'premium',
  'user_provided',
  'You are a creative content writing assistant. Help users create engaging, SEO-optimized content for various platforms including blogs, social media, and marketing materials. Adapt your tone and style to match the brand voice.',
  (select id from auth.users limit 1)
),
(
  'Data Analyst',
  'Automated data analysis and insights generation with visualization capabilities',
  'Analytics',
  'enterprise',
  'predefined',
  'You are a data analysis expert. Help users understand their data by providing insights, identifying trends, and suggesting actionable recommendations. Use clear explanations and visualizations when possible.',
  (select id from auth.users limit 1)
),
(
  'Code Reviewer',
  'AI-powered code review and optimization suggestions for developers',
  'Development',
  'premium',
  'user_provided',
  'You are an expert code reviewer. Analyze code for best practices, security issues, performance optimizations, and maintainability. Provide constructive feedback and suggestions for improvement.',
  (select id from auth.users limit 1)
),
(
  'Email Assistant',
  'Smart email composition and response management for professionals',
  'Productivity',
  'basic',
  'hybrid',
  'You are a professional email assistant. Help users compose clear, professional emails and draft thoughtful responses. Maintain appropriate tone for business communication.',
  (select id from auth.users limit 1)
);