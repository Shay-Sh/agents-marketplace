'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ChatStarterProps {
  agentId: string;
  agentName: string;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'default';
  className?: string;
}

export function ChatStarter({ agentId, agentName, variant = 'default', size = 'default', className }: ChatStarterProps) {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleStartChat = async () => {
    if (isCreating) return;
    
    setIsCreating(true);
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agentId }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/dashboard/chat/${data.conversation.id}`);
      } else {
        const error = await response.json();
        console.error('Failed to create conversation:', error.error);
        // Fallback to conversations page
        router.push(`/dashboard/conversations`);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      // Fallback to conversations page
      router.push(`/dashboard/conversations`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleStartChat}
      disabled={isCreating}
      className={className}
    >
      <MessageSquare className="mr-2 h-4 w-4" />
      {isCreating ? 'Starting...' : 'Chat'}
    </Button>
  );
}