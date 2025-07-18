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
  Dimensions,
} from 'react-native';
import { Send, Search, DollarSign, Circle, MoveVertical as MoreVertical } from 'lucide-react-native';
import { formatCurrency } from '@/constants/AppConstants';

const { width } = Dimensions.get('window');

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const slideAnim = new Animated.Value(0);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Muraho! Can you send me the money for lunch?',
      sender: 'Jean Claude',
      timestamp: new Date('2024-01-15T10:30:00'),
      isMe: false,
      avatar: 'JC',
    },
    {
      id: 2,
      text: 'Ego! How much was it?',
      sender: 'Me',
      timestamp: new Date('2024-01-15T10:32:00'),
      isMe: true,
      avatar: 'ME',
    },
    {
      id: 3,
      text: 'RWF 5,000. Murakoze!',
      sender: 'Jean Claude',
      timestamp: new Date('2024-01-15T10:33:00'),
      isMe: false,
      avatar: 'JC',
    },
    {
      id: 4,
      text: 'Money sent! 💰',
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
      lastMessage: 'Money sent! 💰', 
      online: true,
      lastSeen: new Date(),
      streak: 5,
      unread: 0,
    },
    { 
      id: 2, 
      name: 'Marie Uwimana', 
      avatar: 'MU', 
      lastMessage: 'Murakoze for the payment', 
      online: false,
      lastSeen: new Date(Date.now() - 30 * 60 * 1000),
      streak: 12,
      unread: 2,
    },
    { 
      id: 3, 
      name: 'Patrick Nkurunziza', 
      avatar: 'PN', 
      lastMessage: 'See you tomorrow', 
      online: true,
      lastSeen: new Date(),
      streak: 3,
      unread: 0,
    },
    { 
      id: 4, 
      name: 'Grace Mukamana', 
      avatar: 'GM', 
      lastMessage: 'Can you pay the bill?', 
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
      text: 'Payment request sent',
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
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const handleChatSelect = (contact: any) => {
    setSelectedChat(contact);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.isMe && styles.myMessage]}>
      {!item.isMe && (
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
      )}
      <View style={[styles.messageBubble, item.isMe && styles.myMessageBubble]}>
        {item.isPayment && (
          <View style={styles.paymentIndicator}>
            <DollarSign size={16} color="#10B981" />
            <Text style={styles.paymentAmount}>
              {formatCurrency(item.amount)}
            </Text>
          </View>
        )}
        <Text style={[styles.messageText, item.isMe && styles.myMessageText]}>
          {item.text}
        </Text>
        <Text style={[styles.messageTime, item.isMe && styles.myMessageTime]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    </View>
  );

  const renderContact = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.contactItem,
        selectedChat?.id === item.id && styles.activeContact,
      ]}
      onPress={() => handleChatSelect(item)}>
      <View style={styles.contactAvatarContainer}>
        <View style={styles.contactAvatar}>
        <Text style={styles.contactAvatarText}>{item.avatar}</Text>
        {item.online && <View style={styles.onlineIndicator} />}
        </View>
        {item.streak > 0 && (
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>{item.streak}</Text>
          </View>
        )}
      </View>
      <View style={styles.contactInfo}>
        <View style={styles.contactHeader}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.lastSeenTime}>
            {item.online ? 'Online' : formatLastSeen(item.lastSeen)}
          </Text>
        </View>
        <View style={styles.messagePreview}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (selectedChat) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View 
          style={[
            styles.chatContainer,
            {
              transform: [{
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [width, 0],
                }),
              }],
            },
          ]}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={handleBackToList} style={styles.backButton}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <View style={styles.chatHeaderInfo}>
              <View style={styles.chatAvatar}>
                <Text style={styles.chatAvatarText}>{selectedChat.avatar}</Text>
                {selectedChat.online && <View style={styles.chatOnlineIndicator} />}
              </View>
              <View>
                <Text style={styles.chatName}>{selectedChat.name}</Text>
                <Text style={styles.chatStatus}>
                  {selectedChat.online ? 'Online' : `Last seen ${formatLastSeen(selectedChat.lastSeen)}`}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.sendMoneyButton} onPress={sendMoney}>
              <DollarSign size={20} color="#FFD166" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            style={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message..."
              value={message}
              onChangeText={setMessage}
              placeholderTextColor="#999"
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Send size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        style={styles.contactsList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#2F2F2F',
  },
  contactsList: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activeContact: {
    backgroundColor: '#6C63FF20',
  },
  contactAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  streakBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFD166',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FAFAFA',
  },
  streakText: {
    color: '#2F2F2F',
    fontSize: 10,
    fontWeight: 'bold',
  },
  contactAvatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00C896',
    borderWidth: 2,
    borderColor: '#FAFAFA',
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F2F2F',
  },
  lastSeenTime: {
    fontSize: 12,
    color: '#666',
  },
  messagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#6C63FF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#FAFAFA',
    fontSize: 10,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backText: {
    fontSize: 24,
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  chatHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  chatAvatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  chatOnlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00C896',
    borderWidth: 2,
    borderColor: '#FAFAFA',
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F2F2F',
  },
  chatStatus: {
    fontSize: 12,
    color: '#666',
  },
  sendMoneyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FAFAFA',
    borderWidth: 2,
    borderColor: '#FFD166',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messageBubble: {
    maxWidth: '70%',
    backgroundColor: '#FFD166',
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  myMessageBubble: {
    backgroundColor: '#6C63FF',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
  },
  paymentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00C89620',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  paymentAmount: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#00C896',
  },
  messageText: {
    fontSize: 16,
    color: '#2F2F2F',
    marginBottom: 4,
  },
  myMessageText: {
    color: '#FAFAFA',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
  },
  myMessageTime: {
    color: '#FAFAFA80',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
    color: '#2F2F2F',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});