import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;
    
    // For now, we'll use a default user ID
    // In production, this would come from authentication
    const userId = 'default-user-id';

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('agent_id', agentId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking subscription:', error);
      return NextResponse.json(
        { error: 'Failed to check subscription' },
        { status: 500 }
      );
    }

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