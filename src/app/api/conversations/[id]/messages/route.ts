import { NextRequest, NextResponse } from 'next/server';
import { 
  findConversation, 
  getConversationMessages, 
  addMessage, 
  updateConversationTimestamp,
  type Message 
} from '@/lib/store';

// Get messages for a conversation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;

    // Check if conversation exists
    const conversation = findConversation(conversationId);
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Get messages from in-memory store
    const messages = getConversationMessages(conversationId);

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

    // Check if conversation exists in memory store
    const conversation = findConversation(conversationId);
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Save user message to in-memory store
    const userMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      conversation_id: conversationId,
      role: 'user',
      content: content,
      metadata: {},
      created_at: new Date().toISOString()
    };

    addMessage(userMessage);

    // Generate AI response (simple mock for now)
    const agentName = conversation.agents?.name || 'Assistant';
    const aiResponse = `Hello! I'm ${agentName}. I received your message: "${content}". How can I help you today?`;

    // Save AI response to in-memory store
    const aiMessage: Message = {
      id: `msg-${Date.now() + 1}-${Math.random().toString(36).substr(2, 9)}`,
      conversation_id: conversationId,
      role: 'assistant',
      content: aiResponse,
      metadata: { agent_id: conversation.agent_id },
      created_at: new Date().toISOString()
    };

    addMessage(aiMessage);

    // Update conversation timestamp
    updateConversationTimestamp(conversationId);

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error('Error in message creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}