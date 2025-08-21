'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Bot, Loader2 } from "lucide-react";
import Link from "next/link";
import { NewChatDialog } from "@/components/new-chat-dialog";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  agents: {
    id: string;
    name: string;
    icon: string;
  };
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasConversations = conversations.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
          <p className="text-muted-foreground">
            {hasConversations ? 'View and manage all conversations with your AI agents' : 'Start chatting with AI agents to see conversations here'}
          </p>
        </div>
        <div className="flex gap-2">
          <NewChatDialog />
          <Button variant="outline" asChild>
            <Link href="/dashboard/marketplace">
              Browse Agents
            </Link>
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {/* Conversations List */}
      {!loading && hasConversations && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {conversations.map((conversation) => (
            <Card key={conversation.id} className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{conversation.agents.name}</CardTitle>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {conversation.title}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Updated {new Date(conversation.updated_at).toLocaleDateString()}</span>
                    <span>Created {new Date(conversation.created_at).toLocaleDateString()}</span>
                  </div>
                  <Button size="sm" className="w-full" asChild>
                    <Link href={`/dashboard/chat/${conversation.id}`}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Continue Chat
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !hasConversations && (
        <Card className="text-center py-12">
          <CardContent className="space-y-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No Conversations Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Once you subscribe to agents and start chatting, your conversation history will appear here.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NewChatDialog />
              <Button variant="outline" asChild>
                <Link href="/dashboard/marketplace">
                  Browse Agents
                </Link>
              </Button>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Get Started:</strong> Browse agents and start chatting to see your conversations here.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}