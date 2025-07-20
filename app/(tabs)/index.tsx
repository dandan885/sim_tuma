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
  Dimensions,
} from 'react-native';
import {
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CreditCard,
  RefreshCw,
  Plus,
  TrendingUp,
} from 'lucide-react-native';
import { useBalance } from '@/hooks/useBalance';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { formatCurrency, hiddenBalance, formatTimeAgo, APP_CONSTANTS } from '@/constants/AppConstants';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';

const { width } = Dimensions.get('window');

export default function WalletScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const { balance, isLoading, error, isHidden, toggleBalanceVisibility, refreshBalance } = useBalance();
  const { transactions, isLoading: transactionsLoading, refreshTransactions } = useTransactionHistory();
  const [refreshing, setRefreshing] = useState(false);

  const isTablet = width >= APP_CONSTANTS.BREAKPOINTS.TABLET;

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
      color: APP_CONSTANTS.COLORS.PRIMARY,
      route: '/transfer'
    },
    { 
      icon: ArrowDownLeft, 
      label: 'Saba', 
      labelEn: 'Request', 
      color: APP_CONSTANTS.COLORS.SECONDARY,
      route: '/request'
    },
    { 
      icon: CreditCard, 
      label: 'Fagitire', 
      labelEn: 'Bills', 
      color: APP_CONSTANTS.COLORS.ACCENT,
      route: '/bills'
    },
    { 
      icon: Clock, 
      label: 'Gahunda', 
      labelEn: 'Schedule', 
      color: APP_CONSTANTS.COLORS.INFO,
      route: '/schedule'
    },
  ];

  const displayBalance = isHidden ? hiddenBalance(balance) : formatCurrency(balance);
  const recentTransactions = transactions.slice(0, 5);

  const renderQuickAction = (action: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.actionButton,
        { backgroundColor: action.color },
        isTablet && styles.actionButtonTablet,
      ]}
      onPress={() => console.log(`Navigate to ${action.route}`)}>
      <action.icon size={isTablet ? 28 : 24} color={APP_CONSTANTS.COLORS.TEXT_INVERSE} />
      <Text style={[styles.actionLabel, isTablet && styles.actionLabelTablet]}>
        {action.label}
      </Text>
      <Text style={[styles.actionLabelEn, isTablet && styles.actionLabelEnTablet]}>
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
              ? `${APP_CONSTANTS.COLORS.SECONDARY}20` 
              : transaction.type === 'sent' 
              ? `${APP_CONSTANTS.COLORS.PRIMARY}20` 
              : `${APP_CONSTANTS.COLORS.ACCENT}20`,
          },
        ]}>
        {transaction.type === 'received' ? (
          <ArrowDownLeft size={20} color={APP_CONSTANTS.COLORS.SECONDARY} />
        ) : transaction.type === 'sent' ? (
          <ArrowUpRight size={20} color={APP_CONSTANTS.COLORS.PRIMARY} />
        ) : (
          <CreditCard size={20} color={APP_CONSTANTS.COLORS.ACCENT} />
        )}
      </View>
      
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription}>
          {transaction.description}
        </Text>
        <Text style={styles.transactionPerson}>
          {transaction.type === 'received' && transaction.sender
            ? `Kuva kuri ${transaction.sender} (From ${transaction.sender})`
            : transaction.type === 'sent' && transaction.recipient
            ? `Kuri ${transaction.recipient} (To ${transaction.recipient})`
            : 'Kwishyura Fagitire (Bill Payment)'}
        </Text>
        <Text style={styles.transactionTime}>
          {formatTimeAgo(transaction.timestamp)}
        </Text>
      </View>
      
      <View style={styles.transactionAmountContainer}>
        <Text
          style={[
            styles.transactionAmount,
            {
              color: transaction.type === 'received' 
                ? APP_CONSTANTS.COLORS.SECONDARY 
                : transaction.type === 'sent' 
                ? APP_CONSTANTS.COLORS.PRIMARY 
                : APP_CONSTANTS.COLORS.ACCENT,
            },
          ]}>
          {transaction.type === 'received' ? '+' : '-'}{formatCurrency(transaction.amount)}
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: transaction.status === 'completed' ? APP_CONSTANTS.COLORS.SECONDARY : APP_CONSTANTS.COLORS.WARNING }
        ]}>
          <Text style={styles.statusText}>
            {transaction.status === 'completed' ? 'Byarangiye' : 'Bitegereje'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingState message="Gukuramo amakuru... (Loading data...)" />
      </SafeAreaView>
    );
  }

  if (error && !balance) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState 
          title="Ikibazo cyo gukuramo amakuru (Data Loading Error)"
          message={error}
          onRetry={refreshBalance}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[APP_CONSTANTS.COLORS.PRIMARY]}
            tintColor={APP_CONSTANTS.COLORS.PRIMARY}
          />
        }>
        
        <ResponsiveContainer maxWidth={800}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Mwaramutse! (Good morning!)</Text>
              <Text style={styles.username}>Murakaza neza, Alex</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>AU</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Balance Card */}
          <Animated.View style={[styles.balanceCard, { opacity: fadeAnim }]}>
            <View style={styles.balanceHeader}>
              <View>
                <Text style={styles.balanceLabel}>Amafaranga Yose (Total Balance)</Text>
                <Text style={styles.balanceAmount}>
                  {displayBalance}
                </Text>
              </View>
              <TouchableOpacity
                onPress={toggleBalanceVisibility}
                style={styles.eyeButton}>
                {!isHidden ? (
                  <Eye size={24} color={APP_CONSTANTS.COLORS.TEXT_INVERSE} />
                ) : (
                  <EyeOff size={24} color={APP_CONSTANTS.COLORS.TEXT_INVERSE} />
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.cardFooter}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardNumber}>**** **** **** 1234</Text>
                <Text style={styles.cardType}>MTN MoMo</Text>
              </View>
              <View style={styles.balanceActions}>
                <TouchableOpacity style={styles.addMoneyButton}>
                  <Plus size={16} color={APP_CONSTANTS.COLORS.PRIMARY} />
                  <Text style={styles.addMoneyText}>Kongeramo (Add)</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Ibikorwa Byihuse (Quick Actions)</Text>
            <View style={[styles.quickActions, isTablet && styles.quickActionsTablet]}>
              {quickActions.map(renderQuickAction)}
            </View>
          </View>

          {/* Statistics */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <TrendingUp size={24} color={APP_CONSTANTS.COLORS.SECONDARY} />
              <Text style={styles.statValue}>+12%</Text>
              <Text style={styles.statLabel}>Ukwezi gushize (This month)</Text>
            </View>
            <View style={styles.statCard}>
              <CreditCard size={24} color={APP_CONSTANTS.COLORS.ACCENT} />
              <Text style={styles.statValue}>{transactions.length}</Text>
              <Text style={styles.statLabel}>Ibikorwa (Transactions)</Text>
            </View>
          </View>

          {/* Recent Transactions */}
          <View style={styles.transactionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ibikorwa Bya Vuba (Recent Transactions)</Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>Byose (View All)</Text>
              </TouchableOpacity>
            </View>

            {transactionsLoading ? (
              <LoadingState size="small" message="Gukuramo ibikorwa... (Loading transactions...)" />
            ) : recentTransactions.length > 0 ? (
              <View style={styles.transactionsList}>
                {recentTransactions.map(renderTransaction)}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <CreditCard size={48} color={APP_CONSTANTS.COLORS.TEXT_TERTIARY} />
                <Text style={styles.emptyText}>Nta bikorwa (No transactions yet)</Text>
                <Text style={styles.emptySubtext}>Tangira kohereza cyangwa kwakira amafaranga</Text>
              </View>
            )}
          </View>
        </ResponsiveContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_CONSTANTS.COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: APP_CONSTANTS.DESIGN.SPACING.LG,
  },
  greeting: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.BASE,
    color: APP_CONSTANTS.COLORS.TEXT_SECONDARY,
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.XS,
  },
  username: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.XXL,
    fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.BOLD,
    color: APP_CONSTANTS.COLORS.TEXT_PRIMARY,
  },
  profileButton: {
    padding: APP_CONSTANTS.DESIGN.SPACING.XS,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: APP_CONSTANTS.COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    color: APP_CONSTANTS.COLORS.TEXT_INVERSE,
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.BASE,
    fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.BOLD,
  },
  balanceCard: {
    backgroundColor: APP_CONSTANTS.COLORS.PRIMARY,
    padding: APP_CONSTANTS.DESIGN.SPACING.XL,
    borderRadius: APP_CONSTANTS.DESIGN.BORDER_RADIUS.LARGE,
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.XL,
    ...APP_CONSTANTS.DESIGN.SHADOWS.LARGE,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.LG,
  },
  balanceLabel: {
    color: `${APP_CONSTANTS.COLORS.TEXT_INVERSE}90`,
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.BASE,
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.SM,
  },
  balanceAmount: {
    color: APP_CONSTANTS.COLORS.TEXT_INVERSE,
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.XXXL,
    fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.BOLD,
  },
  eyeButton: {
    padding: APP_CONSTANTS.DESIGN.SPACING.SM,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardNumber: {
    color: `${APP_CONSTANTS.COLORS.TEXT_INVERSE}80`,
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.BASE,
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.XS,
  },
  cardType: {
    color: `${APP_CONSTANTS.COLORS.TEXT_INVERSE}60`,
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.SM,
  },
  balanceActions: {
    alignItems: 'flex-end',
  },
  addMoneyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_CONSTANTS.COLORS.TEXT_INVERSE,
    paddingHorizontal: APP_CONSTANTS.DESIGN.SPACING.MD,
    paddingVertical: APP_CONSTANTS.DESIGN.SPACING.SM,
    borderRadius: APP_CONSTANTS.DESIGN.BORDER_RADIUS.MEDIUM,
  },
  addMoneyText: {
    marginLeft: APP_CONSTANTS.DESIGN.SPACING.XS,
    color: APP_CONSTANTS.COLORS.PRIMARY,
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.SM,
    fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.SEMIBOLD,
  },
  quickActionsContainer: {
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.XL,
  },
  sectionTitle: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.XL,
    fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.BOLD,
    color: APP_CONSTANTS.COLORS.TEXT_PRIMARY,
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.MD,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionsTablet: {
    justifyContent: 'space-around',
  },
  actionButton: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: APP_CONSTANTS.DESIGN.BORDER_RADIUS.LARGE,
    justifyContent: 'center',
    alignItems: 'center',
    ...APP_CONSTANTS.DESIGN.SHADOWS.MEDIUM,
  },
  actionButtonTablet: {
    width: '20%',
    padding: APP_CONSTANTS.DESIGN.SPACING.LG,
  },
  actionLabel: {
    color: APP_CONSTANTS.COLORS.TEXT_INVERSE,
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.XS,
    fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.SEMIBOLD,
    marginTop: APP_CONSTANTS.DESIGN.SPACING.XS,
    textAlign: 'center',
  },
  actionLabelTablet: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.SM,
  },
  actionLabelEn: {
    color: `${APP_CONSTANTS.COLORS.TEXT_INVERSE}80`,
    fontSize: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionLabelEnTablet: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.XS,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.XL,
    gap: APP_CONSTANTS.DESIGN.SPACING.MD,
  },
  statCard: {
    flex: 1,
    backgroundColor: APP_CONSTANTS.COLORS.SURFACE,
    padding: APP_CONSTANTS.DESIGN.SPACING.LG,
    borderRadius: APP_CONSTANTS.DESIGN.BORDER_RADIUS.MEDIUM,
    alignItems: 'center',
    ...APP_CONSTANTS.DESIGN.SHADOWS.SMALL,
  },
  statValue: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.XL,
    fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.BOLD,
    color: APP_CONSTANTS.COLORS.TEXT_PRIMARY,
    marginVertical: APP_CONSTANTS.DESIGN.SPACING.SM,
  },
  statLabel: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.SM,
    color: APP_CONSTANTS.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  transactionsSection: {
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.XL,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.MD,
  },
  viewAll: {
    color: APP_CONSTANTS.COLORS.PRIMARY,
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.SM,
    fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.SEMIBOLD,
  },
  transactionsList: {
    backgroundColor: APP_CONSTANTS.COLORS.SURFACE,
    borderRadius: APP_CONSTANTS.DESIGN.BORDER_RADIUS.MEDIUM,
    ...APP_CONSTANTS.DESIGN.SHADOWS.SMALL,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: APP_CONSTANTS.DESIGN.SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: APP_CONSTANTS.COLORS.BORDER_LIGHT,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: APP_CONSTANTS.DESIGN.SPACING.MD,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.BASE,
    fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.SEMIBOLD,
    color: APP_CONSTANTS.COLORS.TEXT_PRIMARY,
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.XS,
  },
  transactionPerson: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.SM,
    color: APP_CONSTANTS.COLORS.TEXT_SECONDARY,
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.XS,
  },
  transactionTime: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.XS,
    color: APP_CONSTANTS.COLORS.TEXT_TERTIARY,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.LG,
    fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.BOLD,
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.XS,
  },
  statusBadge: {
    paddingHorizontal: APP_CONSTANTS.DESIGN.SPACING.SM,
    paddingVertical: APP_CONSTANTS.DESIGN.SPACING.XS,
    borderRadius: APP_CONSTANTS.DESIGN.BORDER_RADIUS.SMALL,
  },
  statusText: {
    color: APP_CONSTANTS.COLORS.TEXT_INVERSE,
    fontSize: 10,
    fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.SEMIBOLD,
  },
  emptyState: {
    alignItems: 'center',
    padding: APP_CONSTANTS.DESIGN.SPACING.XXL,
    backgroundColor: APP_CONSTANTS.COLORS.SURFACE,
    borderRadius: APP_CONSTANTS.DESIGN.BORDER_RADIUS.MEDIUM,
  },
  emptyText: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.LG,
    fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.SEMIBOLD,
    color: APP_CONSTANTS.COLORS.TEXT_SECONDARY,
    marginTop: APP_CONSTANTS.DESIGN.SPACING.MD,
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.SM,
  },
  emptySubtext: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.SM,
    color: APP_CONSTANTS.COLORS.TEXT_TERTIARY,
    textAlign: 'center',
  },
});