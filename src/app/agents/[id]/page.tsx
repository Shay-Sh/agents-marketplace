'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChatInterface } from "@/components/chat/chat-interface";
import { Bot, MessageSquare, Star, Users, Zap, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing_tier: string;
  system_prompt: string;
  icon: string;
  keywords: string[];
  is_active: boolean;
  created_at: string;
}

export default function AgentDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const agentId = params.id as string;
  const existingConversationId = searchParams.get('conversation');
  const action = searchParams.get('action');
  
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showChat, setShowChat] = useState(!!existingConversationId);
  const [conversationId, setConversationId] = useState<string | undefined>(existingConversationId || undefined);

  const fetchAgent = async () => {
    try {
      const response = await fetch(`/api/admin/agents/${agentId}`);
      if (response.ok) {
        const data = await response.json();
        setAgent(data.agent);
      }
    } catch (error) {
      console.error('Error fetching agent:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    try {
      const response = await fetch(`/api/subscriptions/${agentId}`);
      if (response.ok) {
        const data = await response.json();
        setIsSubscribed(data.isSubscribed);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setIsSubscribed(false);
    }
  };

  useEffect(() => {
    if (agentId) {
      fetchAgent();
      checkSubscription();
    }
    if (existingConversationId) {
      setShowChat(true);
      setConversationId(existingConversationId);
    }
  }, [agentId, existingConversationId]);

  // Separate effect for auto-subscription to prevent loops
  useEffect(() => {
    if (action === 'subscribe' && agent && !isSubscribed && !isSubscribing) {
      handleSubscribe();
    }
  }, [action, agent?.id]); // Only depend on agent.id, not the full agent object or isSubscribed

  const handleSubscribe = async () => {
    if (isSubscribing) return; // Prevent multiple simultaneous subscription attempts
    
    setIsSubscribing(true);
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: agentId,
          tier: agent?.pricing_tier || 'basic'
        }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        // Show success message or redirect to dashboard
      } else {
        const error = await response.json();
        console.error('Subscription failed:', error.error);
        // Show error message to user
        if (error.error.includes('Already subscribed')) {
          setIsSubscribed(true);
        }
      }
    } catch (error) {
      console.error('Error subscribing to agent:', error);
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleStartChat = () => {
    setShowChat(true);
  };

  const getPricingColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'basic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'premium': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'enterprise': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="text-center py-12">
          <Bot className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold">Agent not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The agent you&apos;re looking for doesn&apos;t exist or is no longer available.
          </p>
          <Button asChild className="mt-4">
            <Link href="/marketplace">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Marketplace
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/marketplace">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>
        </Button>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Agent Info */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Bot className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{agent.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{agent.category}</Badge>
                        <Badge className={getPricingColor(agent.pricing_tier)}>
                          {agent.pricing_tier}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {!isSubscribed ? (
                      <Button onClick={handleSubscribe} disabled={isSubscribing}>
                        <Star className="mr-2 h-4 w-4" />
                        {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                      </Button>
                    ) : !showChat ? (
                      <Button onClick={handleStartChat}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Start Chat
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-green-600">
                        <Users className="mr-1 h-3 w-3" />
                        Active Chat
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{agent.description}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">Capabilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {agent.keywords?.map((keyword, index) => (
                      <Badge key={index} variant="secondary">
                        {keyword}
                      </Badge>
                    )) || (
                      <p className="text-muted-foreground text-sm">
                        No specific capabilities listed
                      </p>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">Agent Personality</h3>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      {agent.system_prompt}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Category:</span>
                    <p className="text-muted-foreground">{agent.category}</p>
                  </div>
                  <div>
                    <span className="font-medium">Pricing:</span>
                    <p className="text-muted-foreground capitalize">{agent.pricing_tier}</p>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <p className="text-muted-foreground">
                      {agent.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>
                    <p className="text-muted-foreground">
                      {new Date(agent.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Chat Interface */}
          {showChat && isSubscribed && (
            <div className="lg:w-1/2">
              <ChatInterface
                agentId={agent.id}
                agentName={agent.name}
                conversationId={conversationId}
                onConversationCreated={setConversationId}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Subscription Required Message */}
      {!isSubscribed && (
        <Card className="text-center py-8">
          <CardContent>
            <Zap className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Subscribe to Chat</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to this agent to start chatting and unlock all capabilities.
            </p>
            <Button onClick={handleSubscribe} size="lg" disabled={isSubscribing}>
              {isSubscribing ? 'Subscribing...' : 'Subscribe Now'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}