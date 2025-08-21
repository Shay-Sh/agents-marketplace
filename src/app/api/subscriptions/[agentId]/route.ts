import { NextRequest, NextResponse } from 'next/server';

interface Subscription {
  id: string;
  user_id: string;
  agent_id: string;
  tier: string;
  status: string;
  created_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  agents: any;
}

// Import the same in-memory store (this is a simple approach for development)
// In a real application, you'd use a proper shared state or database
let subscriptionsStore: Subscription[] = [];

// Simple way to share state between API routes (not ideal for production)
if (typeof global !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).subscriptionsStore = (global as any).subscriptionsStore || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriptionsStore = (global as any).subscriptionsStore;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;
    
    const userId = '00000000-0000-0000-0000-000000000000';

    // Check subscription in memory store
    const subscription = subscriptionsStore.find(
      sub => sub.user_id === userId && sub.agent_id === agentId && sub.status === 'active'
    );

    return NextResponse.json({ 
      isSubscribed: !!subscription,
      subscription: subscription || null
    });
  } catch (error) {
    console.error('Error in subscription check:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}