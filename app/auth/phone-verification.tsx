import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScrollContainer } from '@/components/ui/ScrollContainer';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { ArrowLeft, Shield, Smartphone } from 'lucide-react-native';

export default function PhoneVerificationScreen() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { isMobile, width } = useResponsive();
  
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'name' | 'otp'>('name');

  const styles = createStyles(theme, isMobile, width);

  const handleNameSubmit = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    setError(null);
    setStep('otp');
  };

  const handleOtpVerification = async () => {
    if (!otp.trim()) {
      setError('Please enter verification code');
      return;
    }

    // Demo OTP codes for testing
    if (otp !== '123456' && otp !== '000000') {
      setError('Invalid verification code. Try: 123456 or 000000');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful verification - login expects phone and pin
      const success = await login('+250788123456', '1234');
      
      if (!success) {
        setError('Verification failed. Please try again.');
        return;
      }

      router.replace('/(tabs)');
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('name');
      setOtp('');
      setError(null);
    } else {
      router.back();
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingState message={t.loading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollContainer>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ArrowLeft size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.iconContainer}>
            {step === 'name' ? (
              <Smartphone size={48} color={theme.colors.primary} />
            ) : (
              <Shield size={48} color={theme.colors.primary} />
            )}
          </View>

          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            {step === 'name' ? 'Enter Your Name' : 'Verify Phone Number'}
          </Text>
          
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {step === 'name'
              ? 'Please enter your full name'
              : 'Enter the verification code sent to your phone'
            }
          </Text>

          {error && (
            <View style={[styles.errorContainer, { backgroundColor: `${theme.colors.error}20`, borderColor: theme.colors.error }]}>
              <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
            </View>
          )}

          {step === 'name' ? (
            <View style={styles.formContainer}>
              <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
                Full Name
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.textPrimary 
                }]}
                value={name}
                onChangeText={setName}
                placeholder="John Doe"
                placeholderTextColor={theme.colors.textTertiary}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={handleNameSubmit}
              />
              
              <Button
                title={t.continue}
                onPress={handleNameSubmit}
                disabled={!name.trim()}
                variant="primary"
                size={isMobile ? 'medium' : 'large'}
                fullWidth
                style={styles.submitButton}
              />
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Text style={[styles.phoneDisplay, { color: theme.colors.primary }]}>
                +250 788 123 456
              </Text>
              
              <Text style={[styles.otpInstructions, { color: theme.colors.textPrimary }]}>
                We sent a verification code to your phone
              </Text>

              <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
                Verification Code
              </Text>
              <TextInput
                style={[styles.otpInput, {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.textPrimary
                }]}
                value={otp}
                onChangeText={setOtp}
                placeholder="123456"
                placeholderTextColor={theme.colors.textTertiary}
                keyboardType="number-pad"
                maxLength={6}
                returnKeyType="done"
                onSubmitEditing={handleOtpVerification}
              />

              <Text style={[styles.demoHint, { color: theme.colors.textTertiary }]}>
                Demo: Use 123456 or 000000
              </Text>
              
              <Button
                title="Verify"
                onPress={handleOtpVerification}
                disabled={!otp.trim() || otp.length < 6}
                variant="primary"
                size={isMobile ? 'medium' : 'large'}
                fullWidth
                style={styles.submitButton}
              />

              <Button
                title="Resend Code"
                onPress={() => {
                  Alert.alert('Code Resent', 'We sent a new verification code');
                }}
                variant="ghost"
                size={isMobile ? 'medium' : 'large'}
                fullWidth
                style={styles.resendButton}
              />
            </View>
          )}
        </View>
      </ScrollContainer>
    </SafeAreaView>
  );
}

const createStyles = (theme: any, isMobile: boolean, width: number) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    maxWidth: isMobile ? width - 40 : 400,
    alignSelf: 'center',
    width: '100%',
  },
  iconContainer: {
    alignItems: 'center',
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
  },
  errorContainer: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.sm,
    textAlign: 'center',
  },
  formContainer: {
    gap: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.base,
    minHeight: isMobile ? 50 : 56,
  },
  phoneDisplay: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    letterSpacing: 2,
  },
  otpInstructions: {
    fontSize: theme.typography.fontSizes.base,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  otpInput: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.xl,
    textAlign: 'center',
    letterSpacing: 8,
    fontWeight: theme.typography.fontWeights.bold,
    minHeight: isMobile ? 50 : 56,
  },
  demoHint: {
    fontSize: theme.typography.fontSizes.xs,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  resendButton: {
    marginTop: theme.spacing.md,
  },
});