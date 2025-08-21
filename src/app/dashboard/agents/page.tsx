'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Loader2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { ChatStarter } from "@/components/chat-starter";

interface Subscription {
  id: string;
  agent_id: string;
  tier: string;
  status: string;
  created_at: string;
  agents: {
    id: string;
    name: string;
    description: string;
    category: string;
    pricing_tier: string;
    icon: string;
    keywords: string[];
    is_active: boolean;
  };
}

export default function AgentsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions');
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.subscriptions || []);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter(subscription =>
    subscription.agents.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.agents.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.agents.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasSubscriptions = subscriptions.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Agents</h1>
          <p className="text-muted-foreground">
            {hasSubscriptions ? 'Manage and monitor your subscribed AI agents' : 'Subscribe to agents to start using them'}
          </p>
        </div>
        <Button asChild>
          <Link href="/marketplace">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Browse Marketplace
          </Link>
        </Button>
      </div>

      {/* Subscription Status Message */}
      {!hasSubscriptions && (
        <Card className="text-center py-12">
          <CardContent className="space-y-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No Agent Subscriptions Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Browse our marketplace to discover and subscribe to AI agents that can transform your business operations.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/marketplace">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Browse Marketplace
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/pricing">
                  View Pricing Plans
                </Link>
              </Button>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Coming Soon:</strong> Subscription system will allow you to subscribe to agents and manage them here.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscribed Agents Grid */}
      {hasSubscriptions && loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {hasSubscriptions && !loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubscriptions.map((subscription) => (
            <Card key={subscription.id} className="transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{subscription.agents.name}</h3>
                      <p className="text-sm text-muted-foreground">{subscription.agents.category}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {subscription.tier}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Active
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {subscription.agents.description}
                </p>
                
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Subscribed {new Date(subscription.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <ChatStarter 
                      agentId={subscription.agent_id}
                      agentName={subscription.agents.name}
                      size="sm"
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/agents/${subscription.agent_id}`}>
                        Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {hasSubscriptions && !loading && filteredSubscriptions.length === 0 && (
        <div className="text-center py-12">
          <Bot className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold">No subscribed agents found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or subscribe to more agents.
          </p>
        </div>
      )}
    </div>
  );
}