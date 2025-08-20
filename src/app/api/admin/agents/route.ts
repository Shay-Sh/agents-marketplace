import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const data = await request.json();

    // For now, create a mock admin user ID - in production you'd verify admin auth
    const adminUserId = '00000000-0000-0000-0000-000000000000';

    const agentData = {
      name: data.name,
      description: data.description,
      category: data.category,
      pricing_tier: data.pricing_tier,
      context_type: data.context_type,
      system_prompt: data.system_prompt,
      icon: data.icon,
      webhook_url: data.webhook_url || null,
      keywords: data.keywords || [],
      created_by: adminUserId,
      is_active: true,
    };

    const { data: agent, error } = await supabase
      .from('agents')
      .insert([agentData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create agent', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, agent });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: agents, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch agents' },
        { status: 500 }
      );
    }

    return NextResponse.json({ agents });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}