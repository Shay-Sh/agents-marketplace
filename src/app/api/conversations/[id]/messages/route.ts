import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Get messages for a conversation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error in messages fetch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Send a message and get AI response
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    const { content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Get conversation and agent details
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select(`
        *,
        agents (
          id,
          name,
          system_prompt,
          webhook_url
        )
      `)
      .eq('id', conversationId)
      .single();

    if (conversationError || !conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // For now, we'll use a default user ID
    // In production, this would come from authentication
    const userId = 'default-user-id';

    // Verify user has active subscription to this agent
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('agent_id', conversation.agent_id)
      .eq('status', 'active')
      .single();

    if (!subscription) {
      return NextResponse.json(
        { error: 'Active subscription required to send messages' },
        { status: 403 }
      );
    }

    // Save user message
    const { error: userMessageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content: content,
        role: 'user',
        metadata: {}
      })
      .select()
      .single();

    if (userMessageError) {
      console.error('Error saving user message:', userMessageError);
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    // Generate AI response
    let aiResponse = '';
    try {
      // If agent has a webhook URL, call it
      if (conversation.agents.webhook_url) {
        const webhookResponse = await fetch(conversation.agents.webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            conversationId,
            agentId: conversation.agent_id,
            systemPrompt: conversation.agents.system_prompt
          })
        });

        if (webhookResponse.ok) {
          const webhookData = await webhookResponse.json();
          aiResponse = webhookData.response || webhookData.content || 'I received your message.';
        } else {
          throw new Error('Webhook call failed');
        }
      } else {
        // Default response based on system prompt or fallback
        const systemPrompt = conversation.agents.system_prompt || 
          `You are ${conversation.agents.name}, a helpful AI assistant.`;
        
        // Simple mock response for now - in production, this would call OpenAI API
        aiResponse = `Hello! I'm ${conversation.agents.name}. I understand you said: "${content}". ` +
          `I'm here to help you based on my role: ${systemPrompt.substring(0, 100)}...`;
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      aiResponse = `Hello! I'm ${conversation.agents.name}. I received your message: "${content}". I'm here to help you!`;
    }

    // Save AI response
    const { data: aiMessage, error: aiMessageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content: aiResponse,
        role: 'assistant',
        metadata: { agent_id: conversation.agent_id }
      })
      .select()
      .single();

    if (aiMessageError) {
      console.error('Error saving AI message:', aiMessageError);
      return NextResponse.json(
        { error: 'Failed to save AI response' },
        { status: 500 }
      );
    }

    // Update conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error('Error in message creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}