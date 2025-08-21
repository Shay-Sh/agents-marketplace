import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { agentId, tier = 'basic' } = await request.json();

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    // For now, we'll use a default user ID (valid UUID format)
    // In production, this would come from authentication
    const userId = '00000000-0000-0000-0000-000000000000';

    // Check if subscription already exists
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('agent_id', agentId)
      .eq('status', 'active')
      .single();

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'Already subscribed to this agent' },
        { status: 400 }
      );
    }

    // Create new subscription
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        agent_id: agentId,
        tier: tier,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      subscription,
      message: 'Successfully subscribed to agent'
    });
  } catch (error) {
    console.error('Error in subscription creation:', error);
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

    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        agents (
          id,
          name,
          description,
          category,
          pricing_tier,
          icon,
          keywords,
          is_active
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching subscriptions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      );
    }

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('Error in subscriptions fetch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}