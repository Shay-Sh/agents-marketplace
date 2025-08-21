'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Loader2, ShoppingCart } from "lucide-react";
import Link from "next/link";

interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing_tier: string;
  is_active: boolean;
  created_at: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm] = useState('');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/admin/agents');
      if (response.ok) {
        const data = await response.json();
        // For now, show all active agents (subscription system will filter this later)
        setAgents((data.agents || []).filter((agent: Agent) => agent.is_active));
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Note: This will show subscribed agents once subscription system is implemented
  const hasSubscriptions = false; // Will be true when user has subscribed agents

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

      {/* Future: This will show subscribed agents */}
      {hasSubscriptions && loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {hasSubscriptions && !loading && filteredAgents.length === 0 && (
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