import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Bot, 
  Search, 
  Filter,
  Plus,
  MoreHorizontal,
  Play,
  Pause,
  Settings,
  Trash2
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AgentsPage() {
  // Mock data - replace with real data from Supabase
  const agents = [
    {
      id: '1',
      name: 'Customer Support AI',
      description: '24/7 intelligent customer service automation with natural language understanding',
      category: 'Customer Service',
      status: 'active',
      lastUsed: '2 hours ago',
      conversations: 142,
      rating: 4.9,
      created: '2024-01-15'
    },
    {
      id: '2',
      name: 'Content Generator',
      description: 'AI-powered content creation and optimization for marketing and social media',
      category: 'Marketing',
      status: 'active',
      lastUsed: '1 day ago',
      conversations: 89,
      rating: 4.7,
      created: '2024-01-10'
    },
    {
      id: '3',
      name: 'Data Analyst',
      description: 'Automated data analysis and insights generation with visualization capabilities',
      category: 'Analytics',
      status: 'paused',
      lastUsed: '3 days ago',
      conversations: 23,
      rating: 4.8,
      created: '2024-01-05'
    },
    {
      id: '4',
      name: 'Code Reviewer',
      description: 'AI-powered code review and optimization suggestions for development teams',
      category: 'Development',
      status: 'active',
      lastUsed: '5 hours ago',
      conversations: 67,
      rating: 4.6,
      created: '2024-01-20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Agents</h1>
          <p className="text-muted-foreground">
            Manage and monitor your AI agents
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/agents/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Agent
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search agents..."
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            Sort by: Recent
          </Button>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.id} className="transition-all hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs">
                      {agent.category}
                    </Badge>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {agent.status === 'active' ? (
                        <>
                          <Pause className="mr-2 h-4 w-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div>
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {agent.description}
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Status and Stats */}
              <div className="flex items-center justify-between">
                <Badge 
                  variant={agent.status === 'active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {agent.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ⭐ {agent.rating}
                </span>
              </div>
              
              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Conversations</span>
                  <div className="font-semibold">{agent.conversations}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Last used</span>
                  <div className="font-semibold">{agent.lastUsed}</div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" className="flex-1" asChild>
                  <Link href={`/dashboard/conversations?agent=${agent.id}`}>
                    Open Chat
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/dashboard/agents/${agent.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State or Load More */}
      {agents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No agents</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first AI agent.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/dashboard/agents/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Agent
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}