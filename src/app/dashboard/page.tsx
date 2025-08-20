import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  MessageSquare, 
  Settings, 
  TrendingUp, 
  CreditCard,
  Plus
} from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  let user = null
  
  try {
    const supabase = await createClient()
    const { data: { user: authUser }, error } = await supabase.auth.getUser()
    
    if (error || !authUser) {
      redirect('/auth/login')
    }
    
    user = authUser
  } catch {
    // Handle case where Supabase is not properly configured
    console.warn('Supabase not configured, using mock user for development')
    user = {
      id: 'mock-user-id',
      email: 'demo@lab17.ai',
      user_metadata: { full_name: 'Demo User' }
    }
  }

  // Mock data for now - this will be replaced with real data from Supabase
  const mockStats = {
    totalAgents: 5,
    activeConversations: 12,
    monthlyUsage: 1247,
    subscriptionTier: 'Pro'
  }

  const mockAgents = [
    {
      id: '1',
      name: 'Customer Support AI',
      description: '24/7 intelligent customer service automation',
      category: 'Customer Service',
      status: 'active',
      lastUsed: '2 hours ago'
    },
    {
      id: '2',
      name: 'Content Generator',
      description: 'AI-powered content creation and optimization',
      category: 'Marketing',
      status: 'active',
      lastUsed: '1 day ago'
    },
    {
      id: '3',
      name: 'Data Analyst',
      description: 'Automated data analysis and insights generation',
      category: 'Analytics',
      status: 'inactive',
      lastUsed: '3 days ago'
    }
  ]

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user.user_metadata?.full_name || user.email}!
            </h1>
            <p className="text-muted-foreground">
              Manage your AI agents and track your usage
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/marketplace">
                <Plus className="mr-2 h-4 w-4" />
                Add Agent
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Agents
              </CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalAgents}</div>
              <p className="text-xs text-muted-foreground">
                2 added this month
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
              <div className="text-2xl font-bold">{mockStats.activeConversations}</div>
              <p className="text-xs text-muted-foreground">
                +3 from yesterday
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
              <div className="text-2xl font-bold">{mockStats.monthlyUsage.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                API calls this month
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
                <Badge variant="default">{mockStats.subscriptionTier}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Renews in 15 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Your Agents */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Your Agents</h2>
            <Button variant="outline" asChild>
              <Link href="/dashboard/agents">
                View All
              </Link>
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockAgents.map((agent) => (
              <Card key={agent.id} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{agent.category}</Badge>
                    <Badge 
                      variant={agent.status === 'active' ? 'default' : 'secondary'}
                    >
                      {agent.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Last used: {agent.lastUsed}
                    </span>
                    <Button size="sm" variant="outline">
                      Open Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
            <div className="space-y-4">
              {[
                {
                  agent: 'Customer Support AI',
                  action: 'Handled customer inquiry about billing',
                  time: '2 hours ago'
                },
                {
                  agent: 'Content Generator',
                  action: 'Generated blog post draft',
                  time: '1 day ago'
                },
                {
                  agent: 'Data Analyst',
                  action: 'Analyzed sales performance metrics',
                  time: '3 days ago'
                }
              ].map((activity, index) => (
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}