import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Keyboard,
} from 'react-native';
import { DollarSign, Send, Contact as Contacts, QrCode, Clock } from 'lucide-react-native';
import { router } from 'expo-router';
import { ScrollContainer } from '@/components/ui/ScrollContainer';
import { PhoneInput } from '@/components/PhoneInput';
import { AnimatedButton } from '@/components/AnimatedButton';
import { validateMTNNumber, formatCurrency } from '@/constants/AppConstants';
import { mtnAPI } from '@/services/mtnApi';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';

export default function TransferScreen() {
  const { theme } = useTheme();
  const { isMobile, isTablet } = useResponsive();
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
      newErrors.phone = 'Nomero ya telefoni ikenewe (Phone number is required)';
    } else if (!validateMTNNumber(phoneNumber)) {
      newErrors.phone = 'Nomero ya telefoni ntabwo ari yo (Invalid MTN Number)';
    }
    
    if (!amount) {
      newErrors.amount = 'Amafaranga akenewe (Amount is required)';
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = 'Amafaranga yanditswe ntabwo ari yo (Invalid amount entered)';
    } else if (parseFloat(amount) < 100) {
      newErrors.amount = 'Amafaranga make ni RWF 100 (Minimum amount is RWF 100)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendMoney = () => {
    if (!validateForm()) {
      return;
    }
    
    const formattedAmount = parseFloat(amount);
    const fullPhoneNumber = `+250${phoneNumber}`;
    
    Alert.alert(
      'Emeza Kohereza (Confirm Transfer)',
      `Ohereza ${formatCurrency(formattedAmount)} kuri ${fullPhoneNumber}?`,
      [
        { text: 'Hagarika (Cancel)', style: 'cancel' },
        {
          text: 'Ohereza (Send)',
          onPress: async () => {
            setIsLoading(true);
            try {
              const response = await mtnAPI.requestToPay({
                phoneNumber: fullPhoneNumber,
                amount: formattedAmount,
                currency: 'RWF',
                externalId: `transfer_${Date.now()}`,
                payerMessage: note || 'Kohereza amafaranga (Money transfer)',
                payeeNote: note || 'Kohereza amafaranga (Money transfer)',
              });
              
              Alert.alert('Byarangiye (Success)', 'Amafaranga yoherejwe neza (Money sent successfully)');
              setPhoneNumber('');
              setAmount('');
              setNote('');
              setErrors({});
            } catch (error) {
              Alert.alert('Ikibazo (Error)', 'Serivisi ntabwo irakora neza (Service temporarily unavailable)');
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

  const styles = createStyles(theme, isMobile, isTablet);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollContainer
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}>
        
        <ResponsiveContainer maxWidth={600}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              Kohereza Amafaranga (Send Money)
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Ohereza amafaranga hamwe na MTN MoMo Rwanda
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Contacts size={24} color={theme.colors.primary} />
              <Text style={[styles.quickActionText, { color: theme.colors.primary }]}>
                Abo mubana (Contacts)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <QrCode size={24} color={theme.colors.primary} />
              <Text style={[styles.quickActionText, { color: theme.colors.primary }]}>
                Scan QR
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.quickAction, 
                { 
                  backgroundColor: isScheduled ? `${theme.colors.accent}20` : theme.colors.surface,
                  borderColor: isScheduled ? theme.colors.accent : theme.colors.border,
                }
              ]}
              onPress={() => setIsScheduled(!isScheduled)}>
              <Clock size={24} color={isScheduled ? theme.colors.accent : theme.colors.primary} />
              <Text style={[
                styles.quickActionText, 
                { color: isScheduled ? theme.colors.accent : theme.colors.primary }
              ]}>
                Gahunda (Schedule)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Transfer Form */}
          <View style={[styles.formSection, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                Nomero ya Telefoni (Phone Number)
              </Text>
              <PhoneInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                onValidation={setIsValidPhone}
                error={errors.phone}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                Amafaranga (Amount) (RWF)
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
                <DollarSign size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.textPrimary }]}
                  placeholder="5000"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.textTertiary}
                />
              </View>
              {errors.amount && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.amount}</Text>
              )}
            </View>

            {/* Quick Amount Buttons */}
            <View style={styles.quickAmounts}>
              {quickAmounts.map((quickAmount) => (
                <TouchableOpacity
                  key={quickAmount}
                  style={[
                    styles.quickAmountButton,
                    { 
                      backgroundColor: `${theme.colors.primary}20`,
                      borderColor: theme.colors.primary,
                    }
                  ]}
                  onPress={() => setAmount(quickAmount.toString())}>
                  <Text style={[styles.quickAmountText, { color: theme.colors.primary }]}>
                    {formatCurrency(quickAmount)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                Ubutumwa (Note) (Optional)
              </Text>
              <TextInput
                style={[
                  styles.input, 
                  styles.noteInput,
                  { 
                    backgroundColor: theme.colors.surfaceVariant,
                    borderColor: theme.colors.border,
                    color: theme.colors.textPrimary,
                  }
                ]}
                placeholder="Andika ubutumwa... (Add a note...)"
                value={note}
                onChangeText={setNote}
                multiline
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>

            <AnimatedButton
              title={isScheduled ? 'Gahunda Kohereza (Schedule Transfer)' : 'Ohereza Amafaranga (Send Money)'}
              onPress={handleSendMoney}
              disabled={!isValidPhone || !amount || isLoading}
              loading={isLoading}
              style={styles.sendButton}
            />
          </View>

          {/* Recent Contacts */}
          <View style={styles.contactsSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Abo Mubana Bya Vuba (Recent Contacts)
            </Text>
            {recentContacts.map((contact, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.contactItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                onPress={() => handleContactSelect(contact)}>
                <View style={[styles.contactAvatar, { backgroundColor: theme.colors.primary }]}>
                  <Text style={[styles.contactAvatarText, { color: theme.colors.textInverse }]}>
                    {contact.avatar}
                  </Text>
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactName, { color: theme.colors.textPrimary }]}>
                    {contact.name}
                  </Text>
                  <Text style={[styles.contactPhone, { color: theme.colors.textSecondary }]}>
                    +250 {contact.phone}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    padding: isMobile ? theme.spacing.md : theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 80,
    justifyContent: 'center',
  },
  quickActionText: {
    marginTop: theme.spacing.sm,
    fontSize: isMobile ? theme.typography.fontSizes.xs : theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    textAlign: 'center',
  },
  formSection: {
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
  noteInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: theme.spacing.md,
    borderWidth: 1,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.md,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  quickAmountButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.large,
    borderWidth: 1,
    width: isMobile ? '48%' : '23%',
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  quickAmountText: {
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.sm,
    marginTop: theme.spacing.xs,
  },
  sendButton: {
    marginTop: theme.spacing.md,
  },
  contactsSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: isMobile ? theme.typography.fontSizes.xl : theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.md,
  },
  contactItem: {
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
    minHeight: 70,
  },
  contactAvatar: {
    width: isMobile ? 50 : 60,
    height: isMobile ? 50 : 60,
    borderRadius: isMobile ? 25 : 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  contactAvatarText: {
    fontSize: isMobile ? theme.typography.fontSizes.lg : theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing.xs,
  },
  contactPhone: {
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
  },
});