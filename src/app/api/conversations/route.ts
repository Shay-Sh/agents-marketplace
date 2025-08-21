import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { agentId } = await request.json();

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    // For now, we'll use a default user ID (valid UUID format)
    // In production, this would come from authentication
    const userId = '00000000-0000-0000-0000-000000000000';

    // Check if user is subscribed to this agent
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('agent_id', agentId)
      .eq('status', 'active')
      .single();

    if (!subscription) {
      return NextResponse.json(
        { error: 'You must subscribe to this agent before starting a conversation' },
        { status: 403 }
      );
    }

    // Create a new conversation
    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert({
        agent_id: agentId,
        user_id: userId,
        title: `Chat with Agent`
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return NextResponse.json(
        { error: 'Failed to create conversation' },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error('Error in conversation creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // For now, we'll use a default user ID (valid UUID format)
    const userId = '00000000-0000-0000-0000-000000000000';

    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        *,
        agents (
          id,
          name,
          icon
        )
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch conversations' },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error in conversations fetch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}