'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChatInterface } from '@/components/chat/chat-interface';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot } from 'lucide-react';
import Link from 'next/link';
import { findConversation } from '@/lib/store';

export default function ChatPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [conversation, setConversation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (conversationId) {
      // Find conversation in store
      const conv = findConversation(conversationId);
      if (conv) {
        setConversation(conv);
      }
      setLoading(false);
    }
  }, [conversationId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/conversations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Conversations
            </Link>
          </Button>
        </div>
        <div className="text-center py-12">
          <Bot className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Conversation not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The conversation you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/conversations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <h1 className="text-xl font-semibold">{conversation.title}</h1>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="h-[calc(100vh-200px)]">
        <ChatInterface
          agentId={conversation.agent_id}
          agentName={conversation.agents?.name || 'Agent'}
          conversationId={conversationId}
        />
      </div>
    </div>
  );
}