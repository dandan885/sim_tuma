import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScrollContainer } from '@/components/ui/ScrollContainer';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ArrowLeft, Shield, Smartphone } from 'lucide-react-native';

export default function PhoneVerificationScreen() {
  const { login } = useAuth();
  const { theme, colors } = useTheme();
  const { width, isTablet } = useResponsive();
  
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'name' | 'otp'>('name');

  const styles = createStyles(colors, width, isTablet);

  const handleNameSubmit = () => {
    if (!name.trim()) {
      setError('Injiza amazina yawe / Please enter your name');
      return;
    }
    setError(null);
    setStep('otp');
  };

  const handleOtpVerification = async () => {
    if (!otp.trim()) {
      setError('Injiza kode / Please enter verification code');
      return;
    }

    // Demo OTP codes for testing
    if (otp !== '123456' && otp !== '000000') {
      setError('Kode ntibaho / Invalid verification code. Gerageza: 123456 cyangwa 000000');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful verification
      await login({
        id: '1',
        name: name.trim(),
        phone: '+250788123456',
        balance: 125000,
        isVerified: true
      });

      router.replace('/(tabs)');
    } catch (err) {
      setError('Ikosa ryabaye / Verification failed. Please try again.');
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
      <LoadingState 
        message="Tugusuzuma... / Verifying your information..."
        subMessage="Tegereza gato / Please wait a moment"
      />
    );
  }

  return (
    <ScrollContainer style={styles.container}>
      <View style={styles.header}>
        <Button
          variant="ghost"
          onPress={handleBack}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.text} />
        </Button>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {step === 'name' ? (
            <Smartphone size={48} color={colors.primary} />
          ) : (
            <Shield size={48} color={colors.primary} />
          )}
        </View>

        <Text style={styles.title}>
          {step === 'name' 
            ? 'Injiza Amazina Yawe'
            : 'Emeza Telefoni Yawe'
          }
        </Text>
        
        <Text style={styles.subtitle}>
          {step === 'name'
            ? 'Enter your full name'
            : 'Confirm your phone number'
          }
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {step === 'name' ? (
          <View style={styles.formContainer}>
            <Text style={styles.label}>
              Amazina Yawe / Full Name
            </Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Jean Baptiste Uwimana"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="words"
              autoComplete="name"
              returnKeyType="next"
              onSubmitEditing={handleNameSubmit}
            />
            
            <Button
              onPress={handleNameSubmit}
              disabled={!name.trim()}
              style={styles.submitButton}
            >
              <Text style={styles.buttonText}>
                Komeza / Continue
              </Text>
            </Button>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.phoneDisplay}>
              +250 788 123 456
            </Text>
            
            <Text style={styles.otpInstructions}>
              Twoherereje kode kuri telefoni yawe
            </Text>
            <Text style={styles.otpInstructionsEn}>
              We sent a verification code to your phone
            </Text>

            <Text style={styles.label}>
              Kode y'Emeza / Verification Code
            </Text>
            <TextInput
              style={styles.otpInput}
              value={otp}
              onChangeText={setOtp}
              placeholder="123456"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              maxLength={6}
              returnKeyType="done"
              onSubmitEditing={handleOtpVerification}
            />

            <Text style={styles.demoHint}>
              Demo: Koresha 123456 cyangwa 000000
            </Text>
            
            <Button
              onPress={handleOtpVerification}
              disabled={!otp.trim() || otp.length < 6}
              style={styles.submitButton}
            >
              <Text style={styles.buttonText}>
                Emeza / Verify
              </Text>
            </Button>

            <Button
              variant="ghost"
              onPress={() => {
                // Simulate resend OTP
                Alert.alert(
                  'Kode Yongerewe / Code Resent',
                  'Twongeje kohereza kode / We sent a new verification code'
                );
              }}
              style={styles.resendButton}
            >
              <Text style={styles.resendText}>
                Ongera wohereze kode / Resend code
              </Text>
            </Button>
          </View>
        )}
      </View>
    </ScrollContainer>
  );
}

const createStyles = (colors: any, width: number, isTablet: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: isTablet ? 40 : 20,
    paddingBottom: 40,
    maxWidth: isTablet ? 400 : width - 40,
    alignSelf: 'center',
    width: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: isTablet ? 32 : 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: isTablet ? 40 : 36,
  },
  subtitle: {
    fontSize: isTablet ? 18 : 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: isTablet ? 26 : 24,
  },
  errorContainer: {
    backgroundColor: colors.error + '20',
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    gap: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    minHeight: 56,
  },
  phoneDisplay: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 2,
  },
  otpInstructions: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  otpInstructionsEn: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  otpInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 8,
    fontWeight: '600',
    minHeight: 56,
  },
  demoHint: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  submitButton: {
    marginTop: 20,
    minHeight: 56,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    marginTop: 16,
  },
  resendText: {
    fontSize: 14,
    color: colors.primary,
  },
});