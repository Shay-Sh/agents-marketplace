import { NextRequest, NextResponse } from 'next/server';

interface Subscription {
  id: string;
  user_id: string;
  agent_id: string;
  tier: string;
  status: string;
  created_at: string;
  agents: {
    id: string;
    name: string;
    description: string;
    category: string;
    pricing_tier: string;
    icon: string;
    keywords: string[];
    is_active: boolean;
  };
}

// Temporary in-memory storage for development
// In production, this would be replaced with proper database storage
let subscriptionsStore: Subscription[] = [];

// Simple way to share state between API routes (not ideal for production)
if (typeof global !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).subscriptionsStore = (global as any).subscriptionsStore || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriptionsStore = (global as any).subscriptionsStore;
}

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

    // Check if subscription already exists in memory store
    const existingSubscription = subscriptionsStore.find(
      sub => sub.user_id === userId && sub.agent_id === agentId && sub.status === 'active'
    );

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

    // Create new subscription in memory store
    const subscription = {
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

    subscriptionsStore.push(subscription);

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

    // Filter subscriptions from memory store
    const userSubscriptions = subscriptionsStore.filter(
      sub => sub.user_id === userId && sub.status === 'active'
    );

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