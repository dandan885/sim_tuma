import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Send, Search, DollarSign, Circle, ArrowLeft } from 'lucide-react-native';
import { formatCurrency } from '@/constants/AppConstants';
import { ScrollContainer } from '@/components/ui/ScrollContainer';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

export default function ChatScreen() {
  const { theme } = useTheme();
  const { isMobile, width } = useResponsive();
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const slideAnim = new Animated.Value(0);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Muraho! Urashobora kunkohereza amafaranga yo kurya? (Hello! Can you send me money for lunch?)',
      sender: 'Jean Claude',
      timestamp: new Date('2024-01-15T10:30:00'),
      isMe: false,
      avatar: 'JC',
    },
    {
      id: 2,
      text: 'Ego! Ni angahe? (Sure! How much?)',
      sender: 'Me',
      timestamp: new Date('2024-01-15T10:32:00'),
      isMe: true,
      avatar: 'ME',
    },
    {
      id: 3,
      text: 'RWF 5,000. Murakoze! (RWF 5,000. Thank you!)',
      sender: 'Jean Claude',
      timestamp: new Date('2024-01-15T10:33:00'),
      isMe: false,
      avatar: 'JC',
    },
    {
      id: 4,
      text: 'Amafaranga yoherejwe! 💰 (Money sent! 💰)',
      sender: 'Me',
      timestamp: new Date('2024-01-15T10:35:00'),
      isMe: true,
      avatar: 'ME',
      isPayment: true,
      amount: 5000,
    },
  ]);

  const [contacts] = useState([
    { 
      id: 1, 
      name: 'Jean Claude', 
      avatar: 'JC', 
      lastMessage: 'Amafaranga yoherejwe! 💰', 
      online: true,
      lastSeen: new Date(),
      streak: 5,
      unread: 0,
    },
    { 
      id: 2, 
      name: 'Marie Uwimana', 
      avatar: 'MU', 
      lastMessage: 'Murakoze kubw\'amafaranga (Thanks for the payment)', 
      online: false,
      lastSeen: new Date(Date.now() - 30 * 60 * 1000),
      streak: 12,
      unread: 2,
    },
    { 
      id: 3, 
      name: 'Patrick Nkurunziza', 
      avatar: 'PN', 
      lastMessage: 'Tubonane ejo (See you tomorrow)', 
      online: true,
      lastSeen: new Date(),
      streak: 3,
      unread: 0,
    },
    { 
      id: 4, 
      name: 'Grace Mukamana', 
      avatar: 'GM', 
      lastMessage: 'Urashobora kwishyura fagitire? (Can you pay the bill?)', 
      online: false,
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      streak: 8,
      unread: 1,
    },
  ]);

  useEffect(() => {
    if (selectedChat) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedChat]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'Me',
        timestamp: new Date(),
        isMe: true,
        avatar: 'ME',
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const sendMoney = () => {
    const paymentMessage = {
      id: messages.length + 1,
      text: 'Gusaba kwishyura byoherejwe (Payment request sent)',
      sender: 'Me',
      timestamp: new Date(),
      isMe: true,
      avatar: 'ME',
      isPayment: true,
      amount: 10000,
    };
    setMessages([...messages, paymentMessage]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 1) return 'Ubu (Just now)';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return date.toLocaleDateString();
  };

  const handleChatSelect = (contact: any) => {
    setSelectedChat(contact);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  const styles = createStyles(theme, isMobile, width);

  const renderMessage = ({ item }: { item: any }) => (
    <View style={[styles.messageContainer, item.isMe && styles.myMessage]}>
      {!item.isMe && (
        <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.avatarText, { color: theme.colors.textInverse }]}>{item.avatar}</Text>
        </View>
      )}
      <View style={[
        styles.messageBubble, 
        { backgroundColor: item.isMe ? theme.colors.primary : theme.colors.surface },
        { borderColor: theme.colors.border }
      ]}>
        {item.isPayment && (
          <View style={[styles.paymentIndicator, { backgroundColor: `${theme.colors.secondary}20` }]}>
            <DollarSign size={16} color={theme.colors.secondary} />
            <Text style={[styles.paymentAmount, { color: theme.colors.secondary }]}>
              {formatCurrency(item.amount)}
            </Text>
          </View>
        )}
        <Text style={[
          styles.messageText, 
          { color: item.isMe ? theme.colors.textInverse : theme.colors.textPrimary }
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.messageTime, 
          { color: item.isMe ? `${theme.colors.textInverse}80` : theme.colors.textTertiary }
        ]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    </View>
  );

  const renderContact = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.contactItem,
        { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.borderLight },
        selectedChat?.id === item.id && { backgroundColor: `${theme.colors.primary}20` },
      ]}
      onPress={() => handleChatSelect(item)}>
      <View style={styles.contactAvatarContainer}>
        <View style={[styles.contactAvatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.contactAvatarText, { color: theme.colors.textInverse }]}>{item.avatar}</Text>
          {item.online && <View style={[styles.onlineIndicator, { backgroundColor: theme.colors.secondary, borderColor: theme.colors.surface }]} />}
        </View>
        {item.streak > 0 && (
          <View style={[styles.streakBadge, { backgroundColor: theme.colors.accent, borderColor: theme.colors.surface }]}>
            <Text style={[styles.streakText, { color: theme.colors.textPrimary }]}>{item.streak}</Text>
          </View>
        )}
      </View>
      <View style={styles.contactInfo}>
        <View style={styles.contactHeader}>
          <Text style={[styles.contactName, { color: theme.colors.textPrimary }]}>{item.name}</Text>
          <Text style={[styles.lastSeenTime, { color: theme.colors.textTertiary }]}>
            {item.online ? 'Ari hano (Online)' : formatLastSeen(item.lastSeen)}
          </Text>
        </View>
        <View style={styles.messagePreview}>
          <Text style={[styles.lastMessage, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.unreadText, { color: theme.colors.textInverse }]}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (selectedChat) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Animated.View 
          style={[
            styles.chatContainer,
            { backgroundColor: theme.colors.background },
            {
              transform: [{
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [width, 0],
                }),
              }],
            },
          ]}>
          <View style={[styles.chatHeader, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity onPress={handleBackToList} style={styles.backButton}>
              <ArrowLeft size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            <View style={styles.chatHeaderInfo}>
              <View style={[styles.chatAvatar, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.chatAvatarText, { color: theme.colors.textInverse }]}>{selectedChat.avatar}</Text>
                {selectedChat.online && <View style={[styles.chatOnlineIndicator, { backgroundColor: theme.colors.secondary, borderColor: theme.colors.surface }]} />}
              </View>
              <View>
                <Text style={[styles.chatName, { color: theme.colors.textPrimary }]}>{selectedChat.name}</Text>
                <Text style={[styles.chatStatus, { color: theme.colors.textSecondary }]}>
                  {selectedChat.online ? 'Ari hano (Online)' : `Yabonetse ${formatLastSeen(selectedChat.lastSeen)}`}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.sendMoneyButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.accent }]} 
              onPress={sendMoney}>
              <DollarSign size={20} color={theme.colors.accent} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            style={[styles.messagesList, { backgroundColor: theme.colors.background }]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: theme.spacing.md }}
          />

          <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
            <TextInput
              style={[styles.messageInput, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
              placeholder="Andika ubutumwa... (Type a message...)"
              value={message}
              onChangeText={setMessage}
              placeholderTextColor={theme.colors.textTertiary}
              multiline
            />
            <TouchableOpacity style={[styles.sendButton, { backgroundColor: theme.colors.primary }]} onPress={sendMessage}>
              <Send size={20} color={theme.colors.textInverse} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollContainer>
        <ResponsiveContainer maxWidth={600}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              Ubutumwa (Messages)
            </Text>
            <View style={[styles.searchContainer, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
              <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, { color: theme.colors.textPrimary }]}
                placeholder="Shakisha abo mubana... (Search contacts...)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>
          </View>

          <FlatList
            data={contacts}
            renderItem={renderContact}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            style={styles.contactsList}
            scrollEnabled={false}
          />
        </ResponsiveContainer>
      </ScrollContainer>
    </SafeAreaView>
  );
}

const createStyles = (theme: any, isMobile: boolean, width: number) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: isMobile ? theme.typography.fontSizes.xxl : theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    minHeight: 44,
  },
  searchIcon: {
    marginRight: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    paddingVertical: theme.spacing.sm,
  },
  contactsList: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isMobile ? theme.spacing.md : theme.spacing.lg,
    borderBottomWidth: 1,
    minHeight: 80,
  },
  contactAvatarContainer: {
    position: 'relative',
    marginRight: theme.spacing.md,
  },
  contactAvatar: {
    width: isMobile ? 50 : 60,
    height: isMobile ? 50 : 60,
    borderRadius: isMobile ? 25 : 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  streakBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  streakText: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeights.bold,
  },
  contactAvatarText: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  contactName: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  lastSeenTime: {
    fontSize: isMobile ? theme.typography.fontSizes.xs : theme.typography.fontSizes.sm,
  },
  messagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
    marginRight: theme.spacing.sm,
  },
  unreadBadge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeights.bold,
  },
  chatContainer: {
    flex: 1,
  },
  backButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    minHeight: 70,
  },
  chatHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatAvatar: {
    width: isMobile ? 40 : 48,
    height: isMobile ? 40 : 48,
    borderRadius: isMobile ? 20 : 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    position: 'relative',
  },
  chatAvatarText: {
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.bold,
  },
  chatOnlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  chatName: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  chatStatus: {
    fontSize: isMobile ? theme.typography.fontSizes.xs : theme.typography.fontSizes.sm,
  },
  sendMoneyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    alignItems: 'flex-end',
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  avatarText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.bold,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    borderWidth: 1,
  },
  paymentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.small,
    marginBottom: theme.spacing.sm,
  },
  paymentAmount: {
    marginLeft: theme.spacing.xs,
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  messageText: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.lineHeights.normal * (isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg),
  },
  messageTime: {
    fontSize: isMobile ? theme.typography.fontSizes.xs : theme.typography.fontSizes.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: theme.spacing.md,
    borderTopWidth: 1,
    gap: theme.spacing.md,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: theme.borderRadius.large,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    maxHeight: 100,
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    minHeight: 44,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});