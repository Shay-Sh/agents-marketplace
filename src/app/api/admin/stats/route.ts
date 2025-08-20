import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Get total conversations
    const { count: totalConversations } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalConversations: totalConversations || 0,
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}