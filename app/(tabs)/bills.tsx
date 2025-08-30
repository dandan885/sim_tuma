import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Zap, Droplets, Wifi, Phone, CreditCard, Calendar, CircleCheck as CheckCircle } from 'lucide-react-native';
import { ScrollContainer } from '@/components/ui/ScrollContainer';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

export default function BillsScreen() {
  const { theme } = useTheme();
  const { isMobile, isTablet } = useResponsive();
  const [selectedBillType, setSelectedBillType] = useState('electricity');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);

  const billTypes = [
    {
      id: 'electricity',
      name: 'Amashanyarazi (Electricity)',
      nameEn: 'Electricity',
      icon: Zap,
      color: theme.colors.accent,
      provider: 'EUCL',
    },
    {
      id: 'water',
      name: 'Amazi (Water)',
      nameEn: 'Water',
      icon: Droplets,
      color: theme.colors.secondary,
      provider: 'WASAC',
    },
    {
      id: 'internet',
      name: 'Interineti (Internet)',
      nameEn: 'Internet',
      icon: Wifi,
      color: theme.colors.primary,
      provider: 'MTN Rwanda',
    },
    {
      id: 'mobile',
      name: 'Telefoni (Mobile)',
      nameEn: 'Mobile',
      icon: Phone,
      color: theme.colors.info,
      provider: 'Airtel Rwanda',
    },
  ];

  const recentBills = [
    {
      id: 1,
      type: 'electricity',
      provider: 'EUCL',
      account: '1234567890',
      amount: 85000,
      date: '2024-01-10',
      status: 'paid',
    },
    {
      id: 2,
      type: 'water',
      provider: 'WASAC',
      account: '9876543210',
      amount: 45000,
      date: '2024-01-08',
      status: 'paid',
    },
    {
      id: 3,
      type: 'internet',
      provider: 'MTN Rwanda',
      account: '5555666777',
      amount: 120000,
      date: '2024-01-05',
      status: 'pending',
    },
  ];

  const handlePayBill = () => {
    if (!accountNumber || !amount) {
      Alert.alert('Ikibazo (Error)', 'Uzuza amakuru yose akenewe (Please fill in all required fields)');
      return;
    }

    const selectedBill = billTypes.find((bill) => bill.id === selectedBillType);
    
    Alert.alert(
      'Emeza Kwishyura (Confirm Payment)',
      `Wishyura RWF ${parseInt(amount).toLocaleString()} kuri ${selectedBill?.provider} kuri konti ${accountNumber}?`,
      [
        { text: 'Hagarika (Cancel)', style: 'cancel' },
        {
          text: 'Ishyura (Pay)',
          onPress: () => {
            Alert.alert('Byarangiye (Success)', 'Fagitire yishyuwe neza! (Bill payment successful!)');
            setAccountNumber('');
            setAmount('');
          },
        },
      ]
    );
  };

  const styles = createStyles(theme, isMobile, isTablet);

  const renderBillType = (billType: any) => {
    const isSelected = selectedBillType === billType.id;
    return (
      <TouchableOpacity
        key={billType.id}
        style={[
          styles.billTypeCard,
          { 
            backgroundColor: isSelected ? `${billType.color}20` : theme.colors.surface,
            borderColor: isSelected ? billType.color : theme.colors.border,
          }
        ]}
        onPress={() => setSelectedBillType(billType.id)}>
        <billType.icon
          size={isMobile ? 32 : 40}
          color={isSelected ? billType.color : theme.colors.textSecondary}
        />
        <Text style={[
          styles.billTypeName, 
          { color: isSelected ? billType.color : theme.colors.textPrimary }
        ]}>
          {billType.name}
        </Text>
        <Text style={[styles.billTypeNameEn, { color: theme.colors.textSecondary }]}>
          {billType.nameEn}
        </Text>
        <Text style={[styles.billTypeProvider, { color: theme.colors.textTertiary }]}>
          {billType.provider}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRecentBill = (bill: any) => {
    const billType = billTypes.find((type) => type.id === bill.type);
    return (
      <View key={bill.id} style={[styles.recentBillItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={[styles.billIcon, { backgroundColor: `${billType?.color}20` }]}>
          <billType.icon size={24} color={billType?.color} />
        </View>
        <View style={styles.billDetails}>
          <Text style={[styles.billProvider, { color: theme.colors.textPrimary }]}>
            {bill.provider}
          </Text>
          <Text style={[styles.billAccount, { color: theme.colors.textSecondary }]}>
            Konti (Account): {bill.account}
          </Text>
          <Text style={[styles.billDate, { color: theme.colors.textTertiary }]}>
            {bill.date}
          </Text>
        </View>
        <View style={styles.billAmountContainer}>
          <Text style={[styles.billAmount, { color: theme.colors.textPrimary }]}>
            RWF {bill.amount.toLocaleString()}
          </Text>
          <View style={[
            styles.billStatus,
            { backgroundColor: bill.status === 'paid' ? theme.colors.secondary : theme.colors.warning }
          ]}>
            <CheckCircle size={12} color={theme.colors.textInverse} />
            <Text style={[styles.billStatusText, { color: theme.colors.textInverse }]}>
              {bill.status === 'paid' ? 'Yishyuwe (Paid)' : 'Bitegereje (Pending)'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollContainer contentContainerStyle={styles.scrollContent}>
        <ResponsiveContainer maxWidth={800}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              Kwishyura Fagitire (Pay Bills)
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Ishyura fagitire zawe byoroshye (Pay your utility bills easily)
            </Text>
          </View>

          {/* Bill Types */}
          <View style={styles.billTypesContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Hitamo Ubwoko bwa Fagitire (Select Bill Type)
            </Text>
            <View style={styles.billTypesGrid}>
              {billTypes.map(renderBillType)}
            </View>
          </View>

          {/* Payment Form */}
          <View style={[styles.paymentForm, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                Nomero ya Konti (Account Number)
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
                <CreditCard size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.textPrimary }]}
                  placeholder="Andika nomero ya konti (Enter account number)"
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  placeholderTextColor={theme.colors.textTertiary}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                Amafaranga (Amount) (RWF)
              </Text>
              <TextInput
                style={[
                  styles.amountInput,
                  { 
                    backgroundColor: theme.colors.surfaceVariant,
                    borderColor: theme.colors.border,
                    color: theme.colors.textPrimary,
                  }
                ]}
                placeholder="0"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholderTextColor={theme.colors.textTertiary || '#9CA3AF'}
              />
            </View>

            <TouchableOpacity
              style={[styles.scheduleOption, { borderTopColor: theme.colors.border }]}
              onPress={() => setIsScheduled(!isScheduled)}>
              <Calendar size={20} color={isScheduled ? theme.colors.accent : theme.colors.textSecondary} />
              <Text style={[
                styles.scheduleText, 
                { color: isScheduled ? theme.colors.accent : theme.colors.textPrimary }
              ]}>
                Gahunda yo kwishyura buri gihe (Schedule recurring payment)
              </Text>
              <View style={[
                styles.checkbox, 
                { 
                  borderColor: isScheduled ? theme.colors.accent : theme.colors.border,
                  backgroundColor: isScheduled ? theme.colors.surfaceVariant : 'transparent',
                }
              ]}>
                {isScheduled && <CheckCircle size={16} color={theme.colors.accent} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.payButton, { backgroundColor: theme.colors.primary }]} 
              onPress={handlePayBill}>
              <Text style={[styles.payButtonText, { color: theme.colors.textInverse }]}>
                {isScheduled ? 'Gahunda Kwishyura (Schedule Payment)' : 'Ishyura Fagitire (Pay Bill)'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Recent Bills */}
          <View style={styles.recentBillsSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Fagitire za Vuba (Recent Bills)
            </Text>
            {recentBills.map(renderRecentBill)}
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    paddingVertical: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  title: {
    fontSize: isMobile ? theme.typography.fontSizes.xxl : theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
  },
  billTypesContainer: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: isMobile ? theme.typography.fontSizes.xl : theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.md,
  },
  billTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  billTypeCard: {
    width: isMobile ? '48%' : '23%',
    minWidth: 140,
    padding: isMobile ? theme.spacing.lg : theme.spacing.xl,
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 120,
    justifyContent: 'center',
  },
  billTypeName: {
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  billTypeNameEn: {
    fontSize: isMobile ? theme.typography.fontSizes.xs : theme.typography.fontSizes.sm,
    fontStyle: 'italic',
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  billTypeProvider: {
    fontSize: isMobile ? theme.typography.fontSizes.xs : theme.typography.fontSizes.sm,
    textAlign: 'center',
  },
  paymentForm: {
    padding: isMobile ? theme.spacing.lg : theme.spacing.xl,
    borderRadius: theme.borderRadius.large,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.md,
    minHeight: 50,
  },
  inputIcon: {
    marginRight: theme.spacing.md,
  },
  input: {
    flex: 1,
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    paddingVertical: theme.spacing.md,
  },
  amountInput: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    fontSize: isMobile ? theme.typography.fontSizes.xxl : theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    textAlign: 'center',
    minHeight: 60,
  },
  scheduleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  scheduleText: {
    flex: 1,
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: theme.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButton: {
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 56,
    justifyContent: 'center',
  },
  payButtonText: {
    fontSize: isMobile ? theme.typography.fontSizes.lg : theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
  },
  recentBillsSection: {
    marginBottom: theme.spacing.xl,
  },
  recentBillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isMobile ? theme.spacing.md : theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    minHeight: 80,
  },
  billIcon: {
    width: isMobile ? 50 : 60,
    height: isMobile ? 50 : 60,
    borderRadius: isMobile ? 25 : 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  billDetails: {
    flex: 1,
  },
  billProvider: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing.xs,
  },
  billAccount: {
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
    marginBottom: theme.spacing.xs,
  },
  billDate: {
    fontSize: isMobile ? theme.typography.fontSizes.xs : theme.typography.fontSizes.sm,
  },
  billAmountContainer: {
    alignItems: 'flex-end',
  },
  billAmount: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.xs,
  },
  billStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.medium,
    gap: theme.spacing.xs,
  },
  billStatusText: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeights.semibold,
  },
});