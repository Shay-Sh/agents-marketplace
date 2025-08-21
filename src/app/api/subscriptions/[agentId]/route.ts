import { NextRequest, NextResponse } from 'next/server';
import { findSubscription } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;
    
    const userId = '00000000-0000-0000-0000-000000000000';

    // Check subscription using shared store
    const subscription = findSubscription(userId, agentId);

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