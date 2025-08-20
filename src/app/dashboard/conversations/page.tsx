import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Search, 
  Filter,
  Plus,
  Clock,
  Bot,
  User
} from "lucide-react";
import Link from "next/link";

export default function ConversationsPage() {
  // Mock data - replace with real data from Supabase
  const conversations = [
    {
      id: '1',
      title: 'Customer inquiry about billing',
      agent: {
        name: 'Customer Support AI',
        avatar: null
      },
      lastMessage: 'Thank you for resolving my billing issue!',
      timestamp: '2 minutes ago',
      status: 'resolved',
      messages: 8,
      user: 'john@example.com'
    },
    {
      id: '2', 
      title: 'Blog post content generation',
      agent: {
        name: 'Content Generator',
        avatar: null
      },
      lastMessage: 'Here&apos;s the revised blog post draft with SEO optimization...',
      timestamp: '1 hour ago',
      status: 'active',
      messages: 15,
      user: 'sarah@company.com'
    },
    {
      id: '3',
      title: 'Weekly sales performance analysis',
      agent: {
        name: 'Data Analyst',
        avatar: null
      },
      lastMessage: 'The analysis shows a 23% increase in conversions...',
      timestamp: '3 hours ago',
      status: 'completed',
      messages: 6,
      user: 'mike@startup.io'
    },
    {
      id: '4',
      title: 'React component code review',
      agent: {
        name: 'Code Reviewer',
        avatar: null
      },
      lastMessage: 'Consider using useCallback for the handleSubmit function...',
      timestamp: '5 hours ago',
      status: 'active',
      messages: 12,
      user: 'dev@techcorp.com'
    },
    {
      id: '5',
      title: 'Product description optimization',
      agent: {
        name: 'Content Generator',
        avatar: null
      },
      lastMessage: 'I&apos;ve optimized the product descriptions for better conversion rates.',
      timestamp: '1 day ago',
      status: 'completed',
      messages: 4,
      user: 'marketing@ecommerce.com'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'resolved': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
          <p className="text-muted-foreground">
            View and manage all conversations with your AI agents
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/conversations/new">
            <Plus className="mr-2 h-4 w-4" />
            New Conversation
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search conversations..."
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

      {/* Conversations List */}
      <div className="space-y-4">
        {conversations.map((conversation) => (
          <Card key={conversation.id} className="transition-all hover:shadow-lg cursor-pointer">
            <Link href={`/dashboard/conversations/${conversation.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Agent Avatar */}
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    
                    {/* Conversation Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold truncate">
                          {conversation.title}
                        </h3>
                        <Badge 
                          className={`text-xs ${getStatusColor(conversation.status)}`}
                          variant="secondary"
                        >
                          {conversation.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                        <span className="font-medium">{conversation.agent.name}</span>
                        <span>•</span>
                        <span>{conversation.user}</span>
                        <span>•</span>
                        <span>{conversation.messages} messages</span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                        {conversation.lastMessage}
                      </p>
                      
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{conversation.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* User Avatar */}
                  <div className="flex-shrink-0 ml-4">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {conversations.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No conversations</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start a conversation with one of your AI agents.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/dashboard/agents">
                <MessageSquare className="mr-2 h-4 w-4" />
                Browse Agents
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}