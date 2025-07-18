// Firebase configuration and real-time chat service
// This is a mock implementation - replace with actual Firebase config

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  chatId: string;
  type: 'text' | 'payment' | 'image';
  paymentData?: {
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
  };
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: ChatMessage;
  updatedAt: Date;
}

export interface User {
  id: string;
  phoneNumber: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
}

class FirebaseChatService {
  private currentUserId: string | null = null;
  private listeners: Map<string, any> = new Map();

  // Initialize Firebase (mock implementation)
  async initialize(userId: string): Promise<void> {
    this.currentUserId = userId;
    console.log('Firebase initialized for user:', userId);
  }

  // Send message
  async sendMessage(chatId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      chatId,
    };

    // In real implementation, this would save to Firebase Firestore
    console.log('Message sent:', newMessage);
    
    // Simulate real-time update
    setTimeout(() => {
      this.notifyMessageListeners(chatId, newMessage);
    }, 100);

    return newMessage;
  }

  // Listen to messages in a chat
  onMessagesUpdate(chatId: string, callback: (messages: ChatMessage[]) => void): () => void {
    // Mock implementation - in real Firebase, this would be:
    // return onSnapshot(collection(db, 'chats', chatId, 'messages'), ...)
    
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        text: 'Hey! Can you send me the money for lunch?',
        senderId: 'user2',
        senderName: 'John Doe',
        timestamp: new Date('2024-01-15T10:30:00'),
        chatId,
        type: 'text',
      },
      {
        id: '2',
        text: 'Sure! How much was it?',
        senderId: this.currentUserId || 'user1',
        senderName: 'Me',
        timestamp: new Date('2024-01-15T10:32:00'),
        chatId,
        type: 'text',
      },
    ];

    // Simulate real-time updates
    callback(mockMessages);

    const listenerId = `messages_${chatId}`;
    this.listeners.set(listenerId, callback);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listenerId);
    };
  }

  // Listen to user's chats
  onChatsUpdate(callback: (chats: Chat[]) => void): () => void {
    const mockChats: Chat[] = [
      {
        id: 'chat1',
        participants: ['user1', 'user2'],
        lastMessage: {
          id: '2',
          text: 'Money sent! 💰',
          senderId: 'user1',
          senderName: 'Me',
          timestamp: new Date('2024-01-15T10:35:00'),
          chatId: 'chat1',
          type: 'payment',
          paymentData: {
            amount: 15000,
            currency: 'UGX',
            status: 'completed',
          },
        },
        updatedAt: new Date('2024-01-15T10:35:00'),
      },
    ];

    callback(mockChats);

    const listenerId = 'chats';
    this.listeners.set(listenerId, callback);

    return () => {
      this.listeners.delete(listenerId);
    };
  }

  // Update user online status
  async updateUserStatus(isOnline: boolean): Promise<void> {
    if (!this.currentUserId) return;

    // In real implementation, this would update Firebase
    console.log(`User ${this.currentUserId} is ${isOnline ? 'online' : 'offline'}`);
  }

  // Send payment message
  async sendPaymentMessage(
    chatId: string,
    amount: number,
    currency: string,
    recipientId: string
  ): Promise<ChatMessage> {
    const paymentMessage: ChatMessage = {
      id: `payment_${Date.now()}`,
      text: `Payment of ${currency} ${amount.toLocaleString()} sent`,
      senderId: this.currentUserId || 'user1',
      senderName: 'Me',
      timestamp: new Date(),
      chatId,
      type: 'payment',
      paymentData: {
        amount,
        currency,
        status: 'pending',
      },
    };

    // Simulate sending payment and updating message status
    setTimeout(() => {
      paymentMessage.paymentData!.status = 'completed';
      this.notifyMessageListeners(chatId, paymentMessage);
    }, 2000);

    return paymentMessage;
  }

  // Private method to notify message listeners
  private notifyMessageListeners(chatId: string, message: ChatMessage): void {
    const listenerId = `messages_${chatId}`;
    const callback = this.listeners.get(listenerId);
    if (callback) {
      // In real implementation, this would fetch all messages
      callback([message]); // Simplified for mock
    }
  }

  // Get user information
  async getUser(userId: string): Promise<User | null> {
    // Mock user data
    const mockUsers: Record<string, User> = {
      user1: {
        id: 'user1',
        phoneNumber: '+250 788 123 456',
        name: 'Alex Uwimana',
        isOnline: true,
        lastSeen: new Date(),
      },
      user2: {
        id: 'user2',
        phoneNumber: '+250 789 234 567',
        name: 'Jean Claude',
        isOnline: false,
        lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
    };

    return mockUsers[userId] || null;
  }

  // Create new chat
  async createChat(participantIds: string[]): Promise<Chat> {
    const newChat: Chat = {
      id: `chat_${Date.now()}`,
      participants: participantIds,
      lastMessage: {
        id: 'welcome',
        text: 'Chat created',
        senderId: 'system',
        senderName: 'System',
        timestamp: new Date(),
        chatId: '',
        type: 'text',
      },
      updatedAt: new Date(),
    };

    newChat.lastMessage.chatId = newChat.id;
    
    console.log('Chat created:', newChat);
    return newChat;
  }
}

export const firebaseChatService = new FirebaseChatService();