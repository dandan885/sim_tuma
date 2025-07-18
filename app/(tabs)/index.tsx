import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  RefreshControl,
} from 'react-native';
import {
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CreditCard,
  RefreshCw,
} from 'lucide-react-native';
import { useBalance } from '@/hooks/useBalance';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { formatCurrency, hiddenBalance } from '@/constants/AppConstants';
import { AnimatedButton } from '@/components/AnimatedButton';

export default function WalletScreen() {
  const fadeAnim = new Animated.Value(0);
  const { balance, isLoading, error, isHidden, toggleBalanceVisibility, refreshBalance } = useBalance();
  const { transactions, isLoading: transactionsLoading, refreshTransactions } = useTransactionHistory();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshBalance(), refreshTransactions()]);
    setRefreshing(false);
  };

  const quickActions = [
    { icon: RefreshCw, label: 'Refresh', color: '#00C896', onPress: refreshBalance },
    { icon: ArrowUpRight, label: 'Send', color: '#6C63FF' },
    { icon: ArrowDownLeft, label: 'Request', color: '#00C896' },
    { icon: Clock, label: 'Schedule', color: '#FFD166' },
  ];

  const displayBalance = isHidden ? hiddenBalance(balance) : formatCurrency(balance);
  const recentTransactions = transactions.slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.username}>Welcome back, Alex</Text>
        </View>

        {/* Balance Card */}
        <Animated.View style={[styles.balanceCard, { opacity: fadeAnim }]}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <TouchableOpacity
              onPress={toggleBalanceVisibility}
              style={styles.eyeButton}>
              {!isHidden ? (
                <Eye size={20} color="#fff" />
              ) : (
                <EyeOff size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>
            {isLoading ? 'Loading...' : displayBalance}
          </Text>
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          <View style={styles.cardInfo}>
            <Text style={styles.cardNumber}>**** **** **** 1234</Text>
            <CreditCard size={24} color="#fff" />
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionButton, { backgroundColor: action.color }]}
              onPress={action.onPress}>
              <action.icon size={24} color="#fff" />
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {transactionsLoading ? (
            <Text style={styles.loadingText}>Loading transactions...</Text>
          ) : recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View
                style={[
                  styles.transactionIcon,
                  {
                    backgroundColor:
                      transaction.type === 'received' ? '#00C896' : 
                      transaction.type === 'sent' ? '#6C63FF' : '#FFD166',
                  },
                ]}>
                {transaction.type === 'received' ? (
                  <ArrowDownLeft size={20} color="#fff" />
                ) : transaction.type === 'sent' ? (
                  <ArrowUpRight size={20} color="#fff" />
                ) : (
                  <CreditCard size={20} color="#fff" />
                )}
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionDescription}>
                  {transaction.description}
                </Text>
                <Text style={styles.transactionPerson}>
                  {transaction.type === 'received' && transaction.sender
                    ? `From ${transaction.sender}`
                    : transaction.type === 'sent' && transaction.recipient
                    ? `To ${transaction.recipient}`
                    : 'Bill Payment'}
                </Text>
                <Text style={styles.transactionTime}>
                  {transaction.timestamp.toLocaleDateString()}
                </Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  {
                    color:
                      transaction.type === 'received' ? '#00C896' : 
                      transaction.type === 'sent' ? '#6C63FF' : '#FFD166',
                  },
                ]}>
                {transaction.type === 'received' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </Text>
            </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No transactions yet</Text>
          )}
        </View>
      </ScrollView>
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
  },
  greeting: {
    fontSize: 16,
    color: '#2F2F2F',
    marginBottom: 4,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F2F2F',
  },
  balanceCard: {
    backgroundColor: '#6C63FF',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  eyeButton: {
    padding: 4,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNumber: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 8,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    padding: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  transactionsSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F2F2F',
  },
  viewAll: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F2F2F',
    marginBottom: 2,
  },
  transactionPerson: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 12,
    color: '#999',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});