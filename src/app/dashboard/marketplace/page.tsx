'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing_tier: string;
  is_active: boolean;
  icon: string;
  created_at: string;
}

export default function MarketplacePage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subscribingAgents, setSubscribingAgents] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/admin/agents');
      if (response.ok) {
        const data = await response.json();
        // Only show active agents in marketplace
        setAgents((data.agents || []).filter((agent: Agent) => agent.is_active));
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (agentId: string, agentName: string) => {
    if (subscribingAgents.has(agentId)) return;

    setSubscribingAgents(prev => new Set(prev).add(agentId));
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: agentId,
          tier: 'basic'
        }),
      });

      if (response.ok) {
        // Show success message
        console.log(`Successfully subscribed to ${agentName}`);
      } else {
        const error = await response.json();
        console.error('Subscription failed:', error.error);
      }
    } catch (error) {
      console.error('Error subscribing to agent:', error);
    } finally {
      setSubscribingAgents(prev => {
        const newSet = new Set(prev);
        newSet.delete(agentId);
        return newSet;
      });
    }
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

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Browse & Discover Agents</h1>
          <p className="text-muted-foreground">
            Discover and subscribe to intelligent AI agents that transform your business operations.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{agent.category}</Badge>
                  <Badge 
                    variant="outline"
                    className={getPricingColor(agent.pricing_tier)}
                  >
                    {agent.pricing_tier}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                </div>
                <CardDescription>{agent.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Created {new Date(agent.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleSubscribe(agent.id, agent.name)}
                      disabled={subscribingAgents.has(agent.id)}
                      className="flex-1"
                    >
                      {subscribingAgents.has(agent.id) ? 'Subscribing...' : 'Subscribe'}
                    </Button>
                    <Button variant="outline" size="default" onClick={() => {
                      // TODO: Show agent details in a modal or sidebar instead of navigating away
                      console.log('View details for agent:', agent.id);
                    }}>
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAgents.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <Bot className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No agents found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search terms or browse all available agents.
          </p>
        </div>
      )}

      {!loading && agents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No agents available</h3>
          <p className="mt-1 text-sm text-gray-500">
            Check back later for new AI agents in the marketplace.
          </p>
        </div>
      )}
    </div>
  );
}