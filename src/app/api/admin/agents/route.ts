import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  console.log('🔧 POST /api/admin/agents - Starting agent creation');
  
  try {
    // Use service role client to bypass RLS for admin operations
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const data = await request.json();
    console.log('📝 Request data received:', {
      name: data.name,
      category: data.category,
      pricing_tier: data.pricing_tier,
      context_type: data.context_type,
      icon: data.icon,
      hasWebhookUrl: !!data.webhook_url,
      keywordsLength: data.keywords?.length || 0
    });

    // Get or create admin user
    let adminUserId: string;
    
    console.log('👤 Checking for existing admin user...');
    // Check if admin user exists
    const { data: existingUser, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single();
      
    if (userError) {
      console.log('⚠️ No existing user found, error:', userError.message);
    }
      
    if (existingUser) {
      adminUserId = existingUser.id;
      console.log('✅ Using existing admin user:', adminUserId);
    } else {
      // Create a system admin user if none exists
      adminUserId = '00000000-0000-0000-0000-000000000000';
      console.log('🔨 Creating system admin user:', adminUserId);
      
      // Try to insert the system admin user
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([{
          id: adminUserId,
          full_name: 'System Admin',
          subscription_tier: 'enterprise'
        }]);
        
      if (profileError) {
        console.error('❌ Error creating system admin:', profileError);
      } else {
        console.log('✅ System admin created successfully');
      }
    }

    const agentData = {
      name: data.name,
      description: data.description,
      category: data.category,
      pricing_tier: data.pricing_tier,
      context_type: data.context_type,
      system_prompt: data.system_prompt,
      // Note: icon column doesn't exist in actual database, storing in metadata or handling separately
      webhook_url: data.webhook_url || null,
      keywords: Array.isArray(data.keywords) ? data.keywords : [],
      created_by: adminUserId,
      is_active: true,
    };

    console.log('🚀 Inserting agent data:', {
      ...agentData,
      system_prompt: `${agentData.system_prompt.substring(0, 50)}...`,
      keywordsCount: agentData.keywords.length
    });

    // Simplified insert without complex select operations
    const { data: agent, error } = await supabase
      .from('agents')
      .insert(agentData)
      .select('id, name, description, category, pricing_tier, is_active')
      .single();

    if (error) {
      console.error('❌ Database error inserting agent:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      
      return NextResponse.json(
        { 
          error: 'Failed to create agent', 
          details: error.message,
          code: error.code 
        },
        { status: 400 }
      );
    }

    console.log('✅ Agent created successfully:', agent.id);
    return NextResponse.json({ success: true, agent });
    
  } catch (error) {
    console.error('💥 Server error in POST /api/admin/agents:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  console.log('📋 GET /api/admin/agents - Fetching agents list');
  
  try {
    // Use service role client to bypass RLS for admin operations
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: agents, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Database error fetching agents:', error);
      return NextResponse.json(
        { error: 'Failed to fetch agents', details: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ Fetched ${agents?.length || 0} agents successfully`);
    return NextResponse.json({ agents: agents || [] });
    
  } catch (error) {
    console.error('💥 Server error in GET /api/admin/agents:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}