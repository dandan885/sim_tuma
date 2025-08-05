import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Phone, ArrowLeft } from 'lucide-react-native';
import { ScrollContainer } from '@/components/ui/ScrollContainer';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { validateMTNNumber, formatPhoneNumber } from '@/constants/AppConstants';

export default function PhoneVerificationScreen() {
  const { theme } = useTheme();
  const { register, verifyPhone, isLoading } = useAuth();
  const { isMobile, width, height } = useResponsive();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [countdown, setCountdown] = useState(0);
  const [name, setName] = useState('');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = () => {
    if (!phoneNumber || !validateMTNNumber(phoneNumber)) {
      Alert.alert('Ikibazo (Error)', 'Andika nomero ya telefoni nziza (Please enter a valid phone number)');
      return;
    }
    
    if (!name.trim()) {
      Alert.alert('Ikibazo (Error)', 'Andika amazina yawe (Please enter your name)');
      return;
    }
    
    // Simulate sending OTP
    Alert.alert('Kode Yoherejwe (OTP Sent)', `Kode yoherejwe kuri +250${phoneNumber}`);
    setStep('otp');
    setCountdown(60);
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      Alert.alert('Ikibazo (Error)', 'Andika kode y\'imibare 6 (Please enter the 6-digit verification code)');
      return;
    }
    
    verifyPhone(`+250${phoneNumber}`, otp).then(success => {
      if (success) {
        Alert.alert('Byarangiye (Success)', 'Nomero ya telefoni yemejwe neza! (Phone number verified successfully!)', [
          { text: 'Komeza (Continue)', onPress: () => router.replace('/(tabs)') }
        ]);
      } else {
        Alert.alert('Ikibazo (Error)', 'Kode ntabwo ari yo. Gerageza: 123456 (Invalid code. Try: 123456)');
      }
    });
  };

  const handleResendOTP = () => {
    if (countdown === 0) {
      setCountdown(60);
      Alert.alert('Kode Yoherejwe (OTP Sent)', 'Kode nshya yoherejwe! (New verification code sent!)');
    }
  };

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 9);
    setPhoneNumber(cleaned);
  };

  const styles = createStyles(theme, isMobile, width, height);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: step === 'phone' ? 'Andika Nomero ya Telefoni (Enter Phone)' : 'Emeza Nomero (Verify Phone)',
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.textPrimary,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => step === 'otp' ? setStep('phone') : router.back()}
              style={styles.backButton}>
              <ArrowLeft size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollContainer contentContainerStyle={styles.scrollContent}>
        <ResponsiveContainer maxWidth={400}>
          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
              <Phone size={64} color={theme.colors.primary} />
            </View>

            {step === 'phone' ? (
              <>
                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                  Andika Nomero ya Telefoni (Enter Phone Number)
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                  Tuzagukohereza kode yo kwemeza nomero yawe (We'll send you a verification code)
                </Text>

                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                      Amazina (Full Name)
                    </Text>
                    <TextInput
                      style={[
                        styles.nameInput,
                        { 
                          backgroundColor: theme.colors.surfaceVariant,
                          borderColor: theme.colors.border,
                          color: theme.colors.textPrimary,
                        }
                      ]}
                      placeholder="Alex Uwimana"
                      value={name}
                      onChangeText={setName}
                      placeholderTextColor={theme.colors.textTertiary}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                      Nomero ya Telefoni (Phone Number)
                    </Text>
                    <View style={[
                      styles.phoneContainer,
                      { 
                        backgroundColor: theme.colors.surfaceVariant,
                        borderColor: theme.colors.border,
                      }
                    ]}>
                      <Text style={[styles.countryCode, { color: theme.colors.textPrimary }]}>+250</Text>
                      <TextInput
                        style={[styles.phoneInput, { color: theme.colors.textPrimary }]}
                        placeholder="788 123 456"
                        value={formatPhoneNumber(phoneNumber)}
                        onChangeText={handlePhoneChange}
                        keyboardType="phone-pad"
                        placeholderTextColor={theme.colors.textTertiary}
                        maxLength={11}
                      />
                    </View>
                  </View>
                </View>

                <Button
                  title="Ohereza Kode (Send Code)"
                  onPress={handleSendOTP}
                  variant="primary"
                  size={isMobile ? 'medium' : 'large'}
                  fullWidth
                  disabled={!phoneNumber || !name.trim()}
                  loading={isLoading}
                />
              </>
            ) : (
              <>
                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                  Andika Kode (Enter Code)
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                  Andika kode y'imibare 6 yoherejwe kuri +250{phoneNumber}
                </Text>

                <TextInput
                  style={[
                    styles.otpInput,
                    { 
                      backgroundColor: theme.colors.surfaceVariant,
                      borderColor: theme.colors.border,
                      color: theme.colors.textPrimary,
                    }
                  ]}
                  placeholder="000000"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholderTextColor={theme.colors.textTertiary}
                  textAlign="center"
                />

                <Button
                  title="Emeza Kode (Verify Code)"
                  onPress={handleVerifyOTP}
                  variant="primary"
                  size={isMobile ? 'medium' : 'large'}
                  fullWidth
                  disabled={otp.length !== 6}
                  loading={isLoading}
                  style={styles.verifyButton}
                />
  );
}

                <View style={styles.resendContainer}>
                  <Text style={[styles.resendText, { color: theme.colors.textSecondary }]}>
                    Ntiwakira kode? (Didn't receive code?)
                  </Text>
                  <TouchableOpacity 
                    onPress={handleResendOTP} 
                    disabled={countdown > 0}
                    style={styles.resendButton}>
                    <Text style={[
                      styles.resendButtonText, 
                      { color: countdown > 0 ? theme.colors.textTertiary : theme.colors.primary }
                    ]}>
                      {countdown > 0 ? `Tegereza ${countdown}s` : 'Ongera Wohereze (Resend)'}
                <View style={[styles.demoSection, { backgroundColor: `${theme.colors.info}10`, borderColor: `${theme.colors.info}30` }]}>
                  <Text style={[styles.demoText, { color: theme.colors.textTertiary }]}>
                    Demo: Koresha kode 123456 cyangwa 000000 (Use code 123456 or 000000)
                  </Text>
                </View>
              </>
            )}
          </View>
        </ResponsiveContainer>
      </ScrollContainer>
    </SafeAreaView>
                    </Text>
                  </TouchableOpacity>
                </View>
const createStyles = (theme: any, isMobile: boolean, width: number, height: number) => StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: height - 100,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
    minHeight: height * 0.8,
  },
  iconContainer: {
    width: isMobile ? 120 : 140,
    height: isMobile ? 120 : 140,
    borderRadius: isMobile ? 60 : 70,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: isMobile ? theme.typography.fontSizes.xxl : theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: theme.typography.lineHeights.normal * (isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg),
    paddingHorizontal: theme.spacing.md,
  },
  form: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing.sm,
  },
  nameInput: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    minHeight: isMobile ? 50 : 56,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.md,
    minHeight: isMobile ? 50 : 56,
  },
  countryCode: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    marginRight: theme.spacing.sm,
  },
  phoneInput: {
    flex: 1,
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    paddingVertical: theme.spacing.md,
  },
  otpInput: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.lg,
    fontSize: isMobile ? 24 : 28,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.xl,
    letterSpacing: 8,
    minHeight: isMobile ? 60 : 70,
  },
  verifyButton: {
    marginBottom: theme.spacing.xl,
  },
  resendContainer: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  resendText: {
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
    marginBottom: theme.spacing.xs,
  },
  resendButton: {
    padding: theme.spacing.sm,
  },
  resendButtonText: {
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  demoSection: {
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
  },
  demoText: {
    fontSize: theme.typography.fontSizes.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});