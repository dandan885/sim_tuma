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
  Keyboard,
} from 'react-native';
import { DollarSign, Send, Contact as Contacts, QrCode, Clock } from 'lucide-react-native';
import { PhoneInput } from '@/components/PhoneInput';
import { AnimatedButton } from '@/components/AnimatedButton';
import { validateMTNNumber, formatCurrency, APP_CONSTANTS } from '@/constants/AppConstants';
import { mtnAPI } from '@/services/mtnApi';

export default function TransferScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const quickAmounts = [5000, 10000, 25000, 50000];

  const recentContacts = [
    { name: 'Jean Claude', phone: '788123456', avatar: 'JC' },
    { name: 'Marie Uwimana', phone: '789234567', avatar: 'MU' },
    { name: 'Patrick Nkurunziza', phone: '780345678', avatar: 'PN' },
  ];

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!phoneNumber) {
      newErrors.phone = 'Phone number is required';
    } else if (!validateMTNNumber(phoneNumber)) {
      newErrors.phone = APP_CONSTANTS.ERRORS.INVALID_PHONE;
    }
    
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = APP_CONSTANTS.ERRORS.INVALID_AMOUNT;
    } else if (parseFloat(amount) < 100) {
      newErrors.amount = 'Minimum amount is RWF 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendMoney = () => {
    if (!validateForm()) {
      return;
    }
    
    const formattedAmount = parseFloat(amount);
    const fullPhoneNumber = `${APP_CONSTANTS.COUNTRY_CODE}${phoneNumber}`;
    
    Alert.alert(
      'Confirm Transfer',
      `Send ${formatCurrency(formattedAmount)} to ${fullPhoneNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            setIsLoading(true);
            try {
              const response = await mtnAPI.requestToPay({
                phoneNumber: fullPhoneNumber,
                amount: formattedAmount,
                currency: APP_CONSTANTS.CURRENCY,
                externalId: `transfer_${Date.now()}`,
                payerMessage: note || 'Money transfer',
                payeeNote: note || 'Money transfer',
              });
              
              Alert.alert('Success', APP_CONSTANTS.SUCCESS.MONEY_SENT);
              setPhoneNumber('');
              setAmount('');
              setNote('');
              setErrors({});
            } catch (error) {
              Alert.alert('Error', APP_CONSTANTS.ERRORS.API_ERROR);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleContactSelect = (contact: any) => {
    setPhoneNumber(contact.phone);
    setIsValidPhone(true);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container} pointerEvents={isLoading ? 'none' : 'auto'}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Send Money</Text>
          <Text style={styles.subtitle}>Transfer money with MTN MoMo Rwanda</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <Contacts size={24} color="#0066CC" />
            <Text style={styles.quickActionText}>Contacts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <QrCode size={24} color="#0066CC" />
            <Text style={styles.quickActionText}>Scan QR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => setIsScheduled(!isScheduled)}>
            <Clock size={24} color={isScheduled ? '#FFCC00' : '#0066CC'} />
            <Text style={[styles.quickActionText, isScheduled && { color: '#FFCC00' }]}>
              Schedule
            </Text>
          </TouchableOpacity>
        </View>

        {/* Transfer Form */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <PhoneInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              onValidation={setIsValidPhone}
              error={errors.phone}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount ({APP_CONSTANTS.CURRENCY})</Text>
            <View style={styles.inputContainer}>
              <DollarSign size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="5000"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
            {errors.amount && (
              <Text style={styles.errorText}>{errors.amount}</Text>
            )}
          </View>

          {/* Quick Amount Buttons */}
          <View style={styles.quickAmounts}>
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={styles.quickAmountButton}
                onPress={() => setAmount(quickAmount.toString())}>
                <Text style={styles.quickAmountText}>
                  {formatCurrency(quickAmount)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Note (Optional)</Text>
            <TextInput
              style={[styles.input, styles.noteInput]}
              placeholder="Add a note..."
              value={note}
              onChangeText={setNote}
              multiline
              placeholderTextColor="#999"
            />
          </View>

          <AnimatedButton
            title={isScheduled ? 'Schedule Transfer' : 'Send Money'}
            onPress={handleSendMoney}
            disabled={!isValidPhone || !amount || isLoading}
            loading={isLoading}
            style={styles.sendButton}
          />
        </View>

        {/* Recent Contacts */}
        <View style={styles.contactsSection}>
          <Text style={styles.sectionTitle}>Recent Contacts</Text>
          {recentContacts.map((contact, index) => (
            <TouchableOpacity
              key={index}
              style={styles.contactItem}
              onPress={() => handleContactSelect(contact)}>
              <View style={styles.contactAvatar}>
                <Text style={styles.contactAvatarText}>{contact.avatar}</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactPhone}>
                  {APP_CONSTANTS.COUNTRY_CODE} {contact.phone}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  quickAction: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 80,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#6C63FF',
  },
  formSection: {
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
  noteInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickAmountButton: {
    backgroundColor: '#6C63FF20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6C63FF',
    marginBottom: 8,
    width: '48%',
    alignItems: 'center',
  },
  quickAmountText: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  sendButton: {
    marginTop: 10,
  },
  contactsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginBottom: 16,
  },
  contactItem: {
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
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F2F2F',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
  },
});