'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Bot, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Power,
  PowerOff
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing_tier: string;
  is_active: boolean;
  webhook_url: string | null;
  keywords: string[];
  created_at: string;
  created_by: string;
}

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/admin/agents');
      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents || []);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAgentStatus = async (agentId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/agents/${agentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !currentStatus,
        }),
      });

      if (response.ok) {
        setAgents(prev => prev.map(agent => 
          agent.id === agentId 
            ? { ...agent, is_active: !currentStatus }
            : agent
        ));
      }
    } catch (error) {
      console.error('Error toggling agent status:', error);
    }
  };

  const deleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/agents/${agentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAgents(prev => prev.filter(agent => agent.id !== agentId));
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Manage Agents</h1>
          <div className="h-10 w-32 bg-gray-800 rounded animate-pulse"></div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-800 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Manage Agents</h1>
          <p className="text-gray-400">
            {agents.length} agents total • {agents.filter(a => a.is_active).length} active
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/agents/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Agent
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search agents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
        />
      </div>

      {/* Agents List */}
      <div className="space-y-4">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Agent Icon */}
                  <div className="p-3 bg-gray-800 rounded-lg flex-shrink-0">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  
                  {/* Agent Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{agent.name}</h3>
                      <Badge 
                        variant={agent.is_active ? "default" : "secondary"}
                        className={agent.is_active ? "bg-green-600" : "bg-gray-600"}
                      >
                        {agent.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className={getPricingColor(agent.pricing_tier)}
                      >
                        {agent.pricing_tier}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-300 mb-3">{agent.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Category: {agent.category}</span>
                      {agent.webhook_url && (
                        <span>• Webhook configured</span>
                      )}
                      {agent.keywords.length > 0 && (
                        <span>• {agent.keywords.length} keywords</span>
                      )}
                      <span>• Created {new Date(agent.created_at).toLocaleDateString()}</span>
                    </div>

                    {/* Keywords */}
                    {agent.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {agent.keywords.slice(0, 5).map((keyword, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                        {agent.keywords.length > 5 && (
                          <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                            +{agent.keywords.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAgentStatus(agent.id, agent.is_active)}
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    {agent.is_active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end"
                      className="bg-gray-800 border-gray-700"
                    >
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/agents/${agent.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/agents/${agent.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Agent
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteAgent(agent.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Agent
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredAgents.length === 0 && !loading && (
        <div className="text-center py-12">
          <Bot className="mx-auto h-12 w-12 text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            {searchTerm ? 'No agents found' : 'No agents created yet'}
          </h3>
          <p className="text-gray-400 mb-6">
            {searchTerm 
              ? `No agents match "${searchTerm}". Try a different search term.`
              : 'Get started by creating your first AI agent for the marketplace.'
            }
          </p>
          {!searchTerm && (
            <Button asChild>
              <Link href="/admin/agents/new">
                <Plus className="mr-2 h-4 w-4" />
                Create First Agent
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}