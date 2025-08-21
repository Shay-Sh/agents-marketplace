'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Loader2 } from "lucide-react";
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

export function FeaturedAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedAgents();
  }, []);

  const fetchFeaturedAgents = async () => {
    try {
      const response = await fetch('/api/admin/agents');
      if (response.ok) {
        const data = await response.json();
        // Show only active agents, limit to 3 for featured section
        const activeAgents = (data.agents || [])
          .filter((agent: Agent) => agent.is_active)
          .slice(0, 3);
        setAgents(activeAgents);
      }
    } catch (error) {
      console.error('Error fetching featured agents:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-12">
        <Bot className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No agents available yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Check back soon for featured AI agents.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
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
            <CardTitle>{agent.name}</CardTitle>
            <CardDescription>{agent.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <Bot className="h-4 w-4 inline mr-1" />
                AI Agent
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/agents/${agent.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}