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

    // Generate AI response using OpenAI API
    const agentName = conversation.agents?.name || 'Assistant';
    let aiResponse = '';

    try {
      // Try to make a real API call to OpenAI
      const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are ${agentName}, a helpful AI assistant. Be helpful, friendly, and professional.`
            },
            {
              role: 'user',
              content: content
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (openAIResponse.ok) {
        const openAIData = await openAIResponse.json();
        aiResponse = openAIData.choices[0]?.message?.content || `Hello! I'm ${agentName}. How can I help you today?`;
      } else {
        throw new Error('OpenAI API call failed');
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      // Fallback to a more sophisticated mock response
      const responses = [
        `Hello! I'm ${agentName}. I understand you said: "${content}". Let me help you with that.`,
        `Thanks for your message! As ${agentName}, I'm here to assist you. Could you tell me more about what you need help with?`,
        `I received your message: "${content}". I'm ${agentName}, and I'd be happy to help you. What would you like to know?`,
        `Hi there! I'm ${agentName}. I see you mentioned: "${content}". How can I best assist you with this?`
      ];
      aiResponse = responses[Math.floor(Math.random() * responses.length)];
    }

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