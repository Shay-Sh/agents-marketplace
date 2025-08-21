import { NextRequest, NextResponse } from 'next/server';
import { findSubscription, addSubscription, getUserSubscriptions, type Subscription } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const { agentId, tier = 'basic' } = await request.json();

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    const userId = '00000000-0000-0000-0000-000000000000';

    // Check if subscription already exists using shared store
    const existingSubscription = findSubscription(userId, agentId);

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'Already subscribed to this agent' },
        { status: 400 }
      );
    }

    // For now, we need to get agent details from the database to populate the subscription
    // We'll use a simple fetch to the admin API
    let agentData = null;
    try {
      const agentResponse = await fetch(`${request.nextUrl.origin}/api/admin/agents/${agentId}`);
      if (agentResponse.ok) {
        const agentResult = await agentResponse.json();
        agentData = agentResult.agent;
      }
    } catch (error) {
      console.error('Error fetching agent data:', error);
    }

    // Create new subscription using shared store
    const subscription: Subscription = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      agent_id: agentId,
      tier: tier,
      status: 'active',
      created_at: new Date().toISOString(),
      agents: agentData || {
        id: agentId,
        name: 'Unknown Agent',
        description: 'Agent details not available',
        category: 'General',
        pricing_tier: tier,
        icon: 'Bot',
        keywords: [],
        is_active: true
      }
    };

    addSubscription(subscription);

    return NextResponse.json({ 
      subscription,
      message: 'Successfully subscribed to agent'
    });
  } catch (error) {
    console.error('Error in subscription creation:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userId = '00000000-0000-0000-0000-000000000000';

    // Get user subscriptions from shared store
    const userSubscriptions = getUserSubscriptions(userId);

    // Sort by created_at descending
    userSubscriptions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ subscriptions: userSubscriptions });
  } catch (error) {
    console.error('Error in subscriptions fetch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}