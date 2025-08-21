'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, MessageSquare, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

interface Subscription {
  agent_id: string;
  agents: Agent;
}

export function NewChatDialog() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      fetchSubscriptions();
    }
  }, [open]);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions');
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.subscriptions || []);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const handleStartChat = async () => {
    if (!selectedAgentId || isCreating) return;
    
    setIsCreating(true);
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agentId: selectedAgentId }),
      });

      if (response.ok) {
        const data = await response.json();
        setOpen(false);
        router.push(`/dashboard/chat/${data.conversation.id}`);
      } else {
        const error = await response.json();
        console.error('Failed to create conversation:', error.error);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const selectedAgent = subscriptions.find(sub => sub.agent_id === selectedAgentId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Chat</DialogTitle>
          <DialogDescription>
            Select an agent to start a new conversation with.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {subscriptions.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <Bot className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No subscribed agents found.</p>
              <p className="text-xs mt-1">Subscribe to agents in the marketplace first.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Choose an agent:</label>
                <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an agent..." />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptions.map((subscription) => (
                      <SelectItem key={subscription.agent_id} value={subscription.agent_id}>
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{subscription.agents.name}</div>
                            <div className="text-xs text-muted-foreground">{subscription.agents.category}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedAgent && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-start gap-2">
                    <Bot className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium">{selectedAgent.agents.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedAgent.agents.description}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleStartChat}
                  disabled={!selectedAgentId || isCreating}
                  className="flex-1"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {isCreating ? 'Starting...' : 'Start Chat'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}