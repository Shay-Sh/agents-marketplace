import { NextRequest, NextResponse } from 'next/server';
import { addConversation, getUserConversations, findSubscription, type Conversation } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const { agentId } = await request.json();

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    // For now, we'll use a default user ID (valid UUID format)
    // In production, this would come from authentication
    const userId = '00000000-0000-0000-0000-000000000000';

    // Check if user is subscribed to this agent
    const subscription = findSubscription(userId, agentId);
    if (!subscription) {
      return NextResponse.json(
        { error: 'You must subscribe to this agent before starting a conversation' },
        { status: 403 }
      );
    }

    // Get agent name from subscription for conversation title
    const agentName = subscription.agents?.name || 'Agent';

    // Create a new conversation using in-memory store
    const conversation: Conversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      agent_id: agentId,
      title: `Chat with ${agentName}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      agents: {
        id: agentId,
        name: agentName,
        icon: subscription.agents?.icon || 'Bot'
      }
    };

    addConversation(conversation);

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error('Error in conversation creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userId = '00000000-0000-0000-0000-000000000000';

    // Get user conversations from in-memory store
    const conversations = getUserConversations(userId);

    // Sort by updated_at descending
    conversations.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error in conversations fetch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}