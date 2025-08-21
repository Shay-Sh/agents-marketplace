'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  MessageSquare, 
  Settings, 
  TrendingUp, 
  CreditCard,
  Plus,
  ShoppingCart,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { ChatStarter } from '@/components/chat-starter'

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
    is_active: boolean;
  };
}

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

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  
  const user = {
    id: '00000000-0000-0000-0000-000000000000',
    email: 'demo@lab17.ai',
    user_metadata: { full_name: 'Demo User' }
  }
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch subscriptions and conversations in parallel
      const [subscriptionsRes, conversationsRes] = await Promise.all([
        fetch('/api/subscriptions'),
        fetch('/api/conversations')
      ]);
      
      if (subscriptionsRes.ok) {
        const subscriptionsData = await subscriptionsRes.json();
        setSubscriptions(subscriptionsData.subscriptions || []);
      }
      
      if (conversationsRes.ok) {
        const conversationsData = await conversationsRes.json();
        setConversations(conversationsData.conversations || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Real stats based on actual data
  const stats = {
    totalAgents: subscriptions.length,
    activeConversations: conversations.length,
    monthlyUsage: conversations.length * 10, // Mock calculation for now
    subscriptionTier: 'Free' // Default for development
  }

  // Get recent conversations for activity section
  const recentActivity = conversations.slice(0, 3).map(conv => ({
    agent: conv.agents.name,
    action: `Active conversation: ${conv.title}`,
    time: new Date(conv.updated_at).toLocaleDateString()
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Manage your AI agents and track your usage from your dashboard
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/agents/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Agent
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Agents
              </CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAgents}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalAgents === 0 ? 'No subscriptions yet' : 'Active subscriptions'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conversations
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeConversations}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeConversations === 0 ? 'Start chatting with agents' : 'Active chats'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Usage
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthlyUsage.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Estimated API calls
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Subscription
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge variant="default">{stats.subscriptionTier}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Development mode
              </p>
            </CardContent>
          </Card>
        </div>

      {/* Your Agents */}
      <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Your Subscribed Agents</h2>
            <Button variant="outline" asChild>
              <Link href="/dashboard/agents">
                View All
              </Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : subscriptions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subscriptions.slice(0, 3).map((subscription) => (
                <Card key={subscription.id} className="transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{subscription.agents.category}</Badge>
                      <Badge variant="default">
                        {subscription.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{subscription.agents.name}</CardTitle>
                    <CardDescription>{subscription.agents.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        Subscribed: {new Date(subscription.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <ChatStarter 
                          agentId={subscription.agent_id}
                          agentName={subscription.agents.name}
                          size="sm"
                          className="flex-1"
                        />
                        <Button size="sm" variant="outline" asChild>
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
          ) : (
            <Card className="text-center py-12">
              <CardContent className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No Agent Subscriptions Yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Browse our marketplace to discover and subscribe to AI agents that can transform your business operations.
                  </p>
                </div>
                <Button asChild>
                  <Link href="/marketplace">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Browse Marketplace
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

      {/* Recent Activity */}
      <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest interactions with AI agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 rounded-lg border p-4">
                    <Bot className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.agent}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No recent activity. Start chatting with your subscribed agents to see activity here.</p>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  )
}