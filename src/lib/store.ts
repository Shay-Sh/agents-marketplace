// Shared in-memory store for development
// In production, this would be replaced with proper database storage

export interface Subscription {
  id: string;
  user_id: string;
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
    icon: string;
    keywords: string[];
    is_active: boolean;
  };
}

// Use global object to persist data across API calls during development
declare global {
  var subscriptionsStore: Subscription[] | undefined;
}

// Initialize global store if it doesn't exist
if (!global.subscriptionsStore) {
  global.subscriptionsStore = [];
}

export const getSubscriptionsStore = (): Subscription[] => {
  return global.subscriptionsStore || [];
};

export const addSubscription = (subscription: Subscription): void => {
  if (!global.subscriptionsStore) {
    global.subscriptionsStore = [];
  }
  console.log('[STORE] Adding subscription:', subscription.id, 'for agent:', subscription.agent_id);
  global.subscriptionsStore.push(subscription);
  console.log('[STORE] Total subscriptions:', global.subscriptionsStore.length);
};

export const findSubscription = (userId: string, agentId: string): Subscription | undefined => {
  const store = getSubscriptionsStore();
  return store.find(sub => sub.user_id === userId && sub.agent_id === agentId && sub.status === 'active');
};

export const getUserSubscriptions = (userId: string): Subscription[] => {
  const store = getSubscriptionsStore();
  const userSubs = store.filter(sub => sub.user_id === userId && sub.status === 'active');
  console.log('[STORE] Getting user subscriptions for:', userId, 'found:', userSubs.length);
  return userSubs;
};

// Conversations store
export interface Conversation {
  id: string;
  user_id: string;
  agent_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  agents?: {
    id: string;
    name: string;
    icon: string;
  };
}

declare global {
  var conversationsStore: Conversation[] | undefined;
}

if (!global.conversationsStore) {
  global.conversationsStore = [];
}

export const getConversationsStore = (): Conversation[] => {
  return global.conversationsStore || [];
};

export const addConversation = (conversation: Conversation): void => {
  if (!global.conversationsStore) {
    global.conversationsStore = [];
  }
  global.conversationsStore.push(conversation);
};

export const findConversation = (conversationId: string): Conversation | undefined => {
  const store = getConversationsStore();
  return store.find(conv => conv.id === conversationId);
};

export const getUserConversations = (userId: string): Conversation[] => {
  const store = getConversationsStore();
  return store.filter(conv => conv.user_id === userId);
};

// Messages store
export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
  created_at: string;
}

declare global {
  var messagesStore: Message[] | undefined;
}

if (!global.messagesStore) {
  global.messagesStore = [];
}

export const getMessagesStore = (): Message[] => {
  return global.messagesStore || [];
};

export const addMessage = (message: Message): void => {
  if (!global.messagesStore) {
    global.messagesStore = [];
  }
  global.messagesStore.push(message);
};

export const getConversationMessages = (conversationId: string): Message[] => {
  const store = getMessagesStore();
  return store.filter(msg => msg.conversation_id === conversationId)
              .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
};

export const updateConversationTimestamp = (conversationId: string): void => {
  if (!global.conversationsStore) return;
  
  const conversation = global.conversationsStore.find(conv => conv.id === conversationId);
  if (conversation) {
    conversation.updated_at = new Date().toISOString();
  }
};