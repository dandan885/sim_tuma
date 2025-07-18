import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Zap, Droplets, Wifi, Phone, CreditCard, Calendar, CircleCheck as CheckCircle } from 'lucide-react-native';

export default function BillsScreen() {
  const [selectedBillType, setSelectedBillType] = useState('electricity');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);

  const billTypes = [
    {
      id: 'electricity',
      name: 'Electricity',
      icon: Zap,
      color: '#FFD166',
      provider: 'UMEME',
    },
    {
      id: 'water',
      name: 'Water',
      icon: Droplets,
      color: '#00C896',
      provider: 'NWSC',
    },
    {
      id: 'internet',
      name: 'Internet',
      icon: Wifi,
      color: '#6C63FF',
      provider: 'MTN Uganda',
    },
    {
      id: 'mobile',
      name: 'Mobile',
      icon: Phone,
      color: '#00C896',
      provider: 'Airtel',
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
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const selectedBill = billTypes.find((bill) => bill.id === selectedBillType);
    
    Alert.alert(
      'Confirm Payment',
      `Pay UGX ${parseInt(amount).toLocaleString()} to ${selectedBill?.provider} for account ${accountNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay',
          onPress: () => {
            Alert.alert('Success', 'Bill payment successful!');
            setAccountNumber('');
            setAmount('');
          },
        },
      ]
    );
  };

  const renderBillType = (billType) => {
    const isSelected = selectedBillType === billType.id;
    return (
      <TouchableOpacity
        key={billType.id}
        style={[
          styles.billTypeCard,
          isSelected && { backgroundColor: billType.color + '20', borderColor: billType.color },
        ]}
        onPress={() => setSelectedBillType(billType.id)}>
        <billType.icon
          size={32}
          color={isSelected ? billType.color : '#666'}
        />
        <Text style={[styles.billTypeName, isSelected && { color: billType.color }]}>
          {billType.name}
        </Text>
        <Text style={styles.billTypeProvider}>{billType.provider}</Text>
      </TouchableOpacity>
    );
  };

  const renderRecentBill = (bill) => {
    const billType = billTypes.find((type) => type.id === bill.type);
    return (
      <View key={bill.id} style={styles.recentBillItem}>
        <View style={[styles.billIcon, { backgroundColor: billType?.color + '20' }]}>
          <billType.icon size={24} color={billType?.color} />
        </View>
        <View style={styles.billDetails}>
          <Text style={styles.billProvider}>{bill.provider}</Text>
          <Text style={styles.billAccount}>Account: {bill.account}</Text>
          <Text style={styles.billDate}>{bill.date}</Text>
        </View>
        <View style={styles.billAmountContainer}>
          <Text style={styles.billAmount}>
            UGX {bill.amount.toLocaleString()}
          </Text>
          <View style={[
            styles.billStatus,
            { backgroundColor: bill.status === 'paid' ? '#00C896' : '#FFD166' }
          ]}>
            <CheckCircle size={12} color="#fff" />
            <Text style={styles.billStatusText}>
              {bill.status === 'paid' ? 'Paid' : 'Pending'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Pay Bills</Text>
          <Text style={styles.subtitle}>Pay your utility bills easily</Text>
        </View>

        {/* Bill Types */}
        <View style={styles.billTypesContainer}>
          <Text style={styles.sectionTitle}>Select Bill Type</Text>
          <View style={styles.billTypesGrid}>
            {billTypes.map(renderBillType)}
          </View>
        </View>

        {/* Payment Form */}
        <View style={styles.paymentForm}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Account Number</Text>
            <View style={styles.inputContainer}>
              <CreditCard size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter account number"
                value={accountNumber}
                onChangeText={setAccountNumber}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount (UGX)</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            style={styles.scheduleOption}
            onPress={() => setIsScheduled(!isScheduled)}>
            <Calendar size={20} color={isScheduled ? '#FFCC00' : '#666'} />
            <Text style={[styles.scheduleText, isScheduled && { color: '#FFCC00' }]}>
              Schedule recurring payment
            </Text>
            <View style={[styles.checkbox, isScheduled && styles.checkboxActive]}>
              {isScheduled && <CheckCircle size={16} color="#FFCC00" />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.payButton} onPress={handlePayBill}>
            <Text style={styles.payButtonText}>
              {isScheduled ? 'Schedule Payment' : 'Pay Bill'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Bills */}
        <View style={styles.recentBillsSection}>
          <Text style={styles.sectionTitle}>Recent Bills</Text>
          {recentBills.map(renderRecentBill)}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  billTypesContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginBottom: 16,
  },
  billTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  billTypeCard: {
    width: '48%',
    backgroundColor: '#FAFAFA',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  billTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F2F2F',
    marginTop: 8,
    marginBottom: 4,
  },
  billTypeProvider: {
    fontSize: 12,
    color: '#666',
  },
  paymentForm: {
    backgroundColor: '#FAFAFA',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F2F2F',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#2F2F2F',
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2F2F2F',
    backgroundColor: '#f8f9fa',
  },
  scheduleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    marginBottom: 20,
  },
  scheduleText: {
    flex: 1,
    fontSize: 16,
    color: '#2F2F2F',
    marginLeft: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    borderColor: '#FFD166',
    backgroundColor: '#FAFAFA',
  },
  payButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  recentBillsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  recentBillItem: {
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
  billIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  billDetails: {
    flex: 1,
  },
  billProvider: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F2F2F',
    marginBottom: 2,
  },
  billAccount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  billDate: {
    fontSize: 12,
    color: '#999',
  },
  billAmountContainer: {
    alignItems: 'flex-end',
  },
  billAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginBottom: 4,
  },
  billStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  billStatusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
});