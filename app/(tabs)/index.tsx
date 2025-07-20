import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
  Plus,
  TrendingUp,
  Settings,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { ScrollContainer } from '@/components/ui/ScrollContainer';
import { useBalance } from '@/hooks/useBalance';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { formatCurrency, hiddenBalance, formatTimeAgo } from '@/constants/AppConstants';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

export default function WalletScreen() {
  const { theme } = useTheme();
  const { isMobile, isTablet } = useResponsive();
  const [fadeAnim] = useState(new Animated.Value(0));
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
    { 
      icon: ArrowUpRight, 
      label: 'Kohereza', 
      labelEn: 'Send', 
      color: theme.colors.primary,
      route: '/transfer'
    },
    { 
      icon: ArrowDownLeft, 
      label: 'Saba', 
      labelEn: 'Request', 
      color: theme.colors.secondary,
      route: '/request'
    },
    { 
      icon: CreditCard, 
      label: 'Fagitire', 
      labelEn: 'Bills', 
      color: theme.colors.accent,
      route: '/bills'
    },
    { 
      icon: Clock, 
      label: 'Gahunda', 
      labelEn: 'Schedule', 
      color: theme.colors.info,
      route: '/schedule'
    },
  ];

  const displayBalance = isHidden ? hiddenBalance(balance) : formatCurrency(balance);
  const recentTransactions = transactions.slice(0, 5);

  const styles = createStyles(theme, isMobile, isTablet);

  const renderQuickAction = (action: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.actionButton,
        { backgroundColor: action.color },
      ]}
      onPress={() => router.push(action.route)}
      activeOpacity={0.8}>
      <action.icon size={isMobile ? 24 : 28} color={theme.colors.textInverse} />
      <Text style={styles.actionLabel}>
        {action.label}
      </Text>
      <Text style={styles.actionLabelEn}>
        {action.labelEn}
      </Text>
    </TouchableOpacity>
  );

  const renderTransaction = (transaction: any) => (
    <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
      <View
        style={[
          styles.transactionIcon,
          {
            backgroundColor: transaction.type === 'received' 
              ? `${theme.colors.secondary}20` 
              : transaction.type === 'sent' 
              ? `${theme.colors.primary}20` 
              : `${theme.colors.accent}20`,
          },
        ]}>
        {transaction.type === 'received' ? (
          <ArrowDownLeft size={20} color={theme.colors.secondary} />
        ) : transaction.type === 'sent' ? (
          <ArrowUpRight size={20} color={theme.colors.primary} />
        ) : (
          <CreditCard size={20} color={theme.colors.accent} />
        )}
      </View>
      
      <View style={styles.transactionDetails}>
        <Text style={[styles.transactionDescription, { color: theme.colors.textPrimary }]}>
          {transaction.description}
        </Text>
        <Text style={[styles.transactionPerson, { color: theme.colors.textSecondary }]}>
          {transaction.type === 'received' && transaction.sender
            ? `Kuva kuri ${transaction.sender} (From ${transaction.sender})`
            : transaction.type === 'sent' && transaction.recipient
            ? `Kuri ${transaction.recipient} (To ${transaction.recipient})`
            : 'Kwishyura Fagitire (Bill Payment)'}
        </Text>
        <Text style={[styles.transactionTime, { color: theme.colors.textTertiary }]}>
          {formatTimeAgo(transaction.timestamp)}
        </Text>
      </View>
      
      <View style={styles.transactionAmountContainer}>
        <Text
          style={[
            styles.transactionAmount,
            {
              color: transaction.type === 'received' 
                ? theme.colors.secondary 
                : transaction.type === 'sent' 
                ? theme.colors.primary 
                : theme.colors.accent,
            },
          ]}>
          {transaction.type === 'received' ? '+' : '-'}{formatCurrency(transaction.amount)}
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: transaction.status === 'completed' ? theme.colors.secondary : theme.colors.warning }
        ]}>
          <Text style={[styles.statusText, { color: theme.colors.textInverse }]}>
            {transaction.status === 'completed' ? 'Byarangiye' : 'Bitegereje'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingState message="Gukuramo amakuru... (Loading data...)" />
      </SafeAreaView>
    );
  }

  if (error && !balance) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ErrorState 
          title="Ikibazo cyo gukuramo amakuru (Data Loading Error)"
          message={error}
          onRetry={refreshBalance}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollContainer
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }>
        
        <ResponsiveContainer maxWidth={800}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
                Mwaramutse! (Good morning!)
              </Text>
              <Text style={[styles.username, { color: theme.colors.textPrimary }]}>
                Murakaza neza, Alex
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => router.push('/(tabs)/profile')}>
              <View style={[styles.profileAvatar, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.profileAvatarText, { color: theme.colors.textInverse }]}>
                  AU
                </Text>
              </View>
              <Settings size={16} color={theme.colors.textSecondary} style={styles.settingsIcon} />
            </TouchableOpacity>
          </View>

          {/* Balance Card */}
          <Animated.View style={[
            styles.balanceCard, 
            { 
              backgroundColor: theme.colors.primary,
              opacity: fadeAnim,
            }
          ]}>
            <View style={styles.balanceHeader}>
              <View style={styles.balanceInfo}>
                <Text style={[styles.balanceLabel, { color: `${theme.colors.textInverse}90` }]}>
                  Amafaranga Yose (Total Balance)
                </Text>
                <Text style={[styles.balanceAmount, { color: theme.colors.textInverse }]}>
                  {displayBalance}
                </Text>
              </View>
              <TouchableOpacity
                onPress={toggleBalanceVisibility}
                style={styles.eyeButton}>
                {!isHidden ? (
                  <Eye size={24} color={theme.colors.textInverse} />
                ) : (
                  <EyeOff size={24} color={theme.colors.textInverse} />
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.cardFooter}>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardNumber, { color: `${theme.colors.textInverse}80` }]}>
                  **** **** **** 1234
                </Text>
                <Text style={[styles.cardType, { color: `${theme.colors.textInverse}60` }]}>
                  MTN MoMo Rwanda
                </Text>
              </View>
              <TouchableOpacity style={[styles.addMoneyButton, { backgroundColor: theme.colors.textInverse }]}>
                <Plus size={16} color={theme.colors.primary} />
                <Text style={[styles.addMoneyText, { color: theme.colors.primary }]}>
                  Kongeramo (Add)
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Ibikorwa Byihuse (Quick Actions)
            </Text>
            <View style={styles.quickActions}>
              {quickActions.map(renderQuickAction)}
            </View>
          </View>

          {/* Statistics */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <TrendingUp size={24} color={theme.colors.secondary} />
              <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>+12%</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Ukwezi gushize (This month)
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <CreditCard size={24} color={theme.colors.accent} />
              <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
                {transactions.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Ibikorwa (Transactions)
              </Text>
            </View>
          </View>

          {/* Recent Transactions */}
          <View style={styles.transactionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                Ibikorwa Bya Vuba (Recent Transactions)
              </Text>
              <TouchableOpacity>
                <Text style={[styles.viewAll, { color: theme.colors.primary }]}>
                  Byose (View All)
                </Text>
              </TouchableOpacity>
            </View>

            {transactionsLoading ? (
              <LoadingState size="small" message="Gukuramo ibikorwa... (Loading transactions...)" />
            ) : recentTransactions.length > 0 ? (
              <View style={[styles.transactionsList, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                {recentTransactions.map(renderTransaction)}
              </View>
            ) : (
              <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
                <CreditCard size={48} color={theme.colors.textTertiary} />
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                  Nta bikorwa (No transactions yet)
                </Text>
                <Text style={[styles.emptySubtext, { color: theme.colors.textTertiary }]}>
                  Tangira kohereza cyangwa kwakira amafaranga
                </Text>
              </View>
            )}
          </View>
        </ResponsiveContainer>
      </ScrollContainer>
    </SafeAreaView>
  );
}

const createStyles = (theme: any, isMobile: boolean, isTablet: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    marginBottom: theme.spacing.xs,
  },
  username: {
    fontSize: isMobile ? theme.typography.fontSizes.xxl : theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.xs,
  },
  profileAvatar: {
    width: isMobile ? 40 : 48,
    height: isMobile ? 40 : 48,
    borderRadius: isMobile ? 20 : 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  profileAvatarText: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
  },
  settingsIcon: {
    opacity: 0.7,
  },
  balanceCard: {
    padding: isMobile ? theme.spacing.xl : theme.spacing.xxl,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.xl,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    marginBottom: theme.spacing.sm,
  },
  balanceAmount: {
    fontSize: isMobile ? theme.typography.fontSizes.xxxl : 40,
    fontWeight: theme.typography.fontWeights.bold,
    flexWrap: 'wrap',
  },
  eyeButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  cardInfo: {
    flex: 1,
    minWidth: 120,
  },
  cardNumber: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    marginBottom: theme.spacing.xs,
  },
  cardType: {
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
  },
  addMoneyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
  },
  addMoneyText: {
    marginLeft: theme.spacing.xs,
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  quickActionsContainer: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: isMobile ? theme.typography.fontSizes.xl : theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  actionButton: {
    width: isMobile ? '48%' : '23%',
    minWidth: 100,
    aspectRatio: 1,
    borderRadius: theme.borderRadius.large,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    padding: theme.spacing.md,
  },
  actionLabel: {
    color: theme.colors.textInverse,
    fontSize: isMobile ? theme.typography.fontSizes.xs : theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  actionLabelEn: {
    color: `${theme.colors.textInverse}80`,
    fontSize: isMobile ? 10 : theme.typography.fontSizes.xs,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    padding: isMobile ? theme.spacing.lg : theme.spacing.xl,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    minHeight: 100,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: isMobile ? theme.typography.fontSizes.xl : theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    marginVertical: theme.spacing.sm,
  },
  statLabel: {
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
    textAlign: 'center',
  },
  transactionsSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  viewAll: {
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  transactionsList: {
    borderRadius: theme.borderRadius.medium,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isMobile ? theme.spacing.lg : theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    minHeight: 80,
  },
  transactionIcon: {
    width: isMobile ? 48 : 56,
    height: isMobile ? 48 : 56,
    borderRadius: isMobile ? 24 : 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    flexShrink: 0,
  },
  transactionDetails: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  transactionDescription: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing.xs,
  },
  transactionPerson: {
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
    marginBottom: theme.spacing.xs,
  },
  transactionTime: {
    fontSize: isMobile ? theme.typography.fontSizes.xs : theme.typography.fontSizes.sm,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  transactionAmount: {
    fontSize: isMobile ? theme.typography.fontSizes.lg : theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.small,
  },
  statusText: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  emptyState: {
    alignItems: 'center',
    padding: isMobile ? theme.spacing.xxl : theme.spacing.xxl * 1.5,
    borderRadius: theme.borderRadius.medium,
  },
  emptyText: {
    fontSize: isMobile ? theme.typography.fontSizes.lg : theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semibold,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
    textAlign: 'center',
  },
});