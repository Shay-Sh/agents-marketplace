'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bot, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Plus,
  Settings,
  Database
} from "lucide-react";
import Link from "next/link";

interface Stats {
  totalAgents: number;
  activeAgents: number;
  totalUsers: number;
  totalConversations: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({
    totalAgents: 0,
    activeAgents: 0,
    totalUsers: 0,
    totalConversations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [agentsResponse, profilesResponse] = await Promise.all([
        fetch('/api/admin/agents'),
        fetch('/api/admin/stats')
      ]);

      let agentStats = { totalAgents: 0, activeAgents: 0 };
      let userStats = { totalUsers: 0, totalConversations: 0 };

      if (agentsResponse.ok) {
        const agentsData = await agentsResponse.json();
        const agents = agentsData.agents || [];
        agentStats = {
          totalAgents: agents.length,
          activeAgents: agents.filter((agent: { is_active: boolean }) => agent.is_active).length
        };
      }

      if (profilesResponse.ok) {
        const profilesData = await profilesResponse.json();
        userStats = {
          totalUsers: profilesData.totalUsers || 0,
          totalConversations: profilesData.totalConversations || 0
        };
      }

      setStats({
        ...agentStats,
        ...userStats
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-400">
            Manage agents, users, and system settings
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/agents/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Agent
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Total Agents
            </CardTitle>
            <Bot className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loading ? '...' : stats.totalAgents}
            </div>
            <p className="text-xs text-gray-400">
              {loading ? '...' : `${stats.activeAgents} active`}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loading ? '...' : stats.totalUsers}
            </div>
            <p className="text-xs text-gray-400">
              Registered users
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Conversations
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loading ? '...' : stats.totalConversations.toLocaleString()}
            </div>
            <p className="text-xs text-gray-400">
              Total conversations
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              System Status
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">Online</div>
            <p className="text-xs text-gray-400">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
          <Link href="/admin/agents">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-white" />
                <CardTitle className="text-white">Manage Agents</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Create, edit, and manage AI agents in the marketplace
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
          <Link href="/admin/users">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-white" />
                <CardTitle className="text-white">User Management</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                View and manage user accounts and subscriptions
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
          <Link href="/admin/analytics">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-white" />
                <CardTitle className="text-white">Analytics</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                View detailed analytics and usage metrics
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
          <Link href="/admin/conversations">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-white" />
                <CardTitle className="text-white">Conversations</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Monitor and moderate user conversations
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
          <Link href="/admin/database">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-white" />
                <CardTitle className="text-white">Database</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Direct database access and management tools
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
          <Link href="/admin/settings">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-white" />
                <CardTitle className="text-white">System Settings</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Configure system-wide settings and preferences
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  );
}