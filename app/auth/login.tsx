import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Phone, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { ScrollContainer } from '@/components/ui/ScrollContainer';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { validateMTNNumber, formatPhoneNumber } from '@/constants/AppConstants';

export default function LoginScreen() {
  const { theme } = useTheme();
  const { login, isLoading } = useAuth();
  const { isMobile, width, height } = useResponsive();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!phoneNumber) {
      newErrors.phone = 'Nomero ya telefoni ikenewe (Phone number is required)';
    } else if (!validateMTNNumber(phoneNumber)) {
      newErrors.phone = 'Nomero ya telefoni ntabwo ari yo (Invalid MTN Number)';
    }
    
    if (!pin) {
      newErrors.pin = 'PIN ikenewe (PIN is required)';
    } else if (pin.length < 4) {
      newErrors.pin = 'PIN igomba kuba ifite nibura imibare 4 (PIN must be at least 4 digits)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    const fullPhoneNumber = `+250${phoneNumber}`;
    const success = await login(fullPhoneNumber, pin);
    
    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert(
        'Ikibazo cyo Kwinjira (Login Error)',
        'Nomero ya telefoni cyangwa PIN ntabwo ari byo. Gerageza PIN: 1234 (Invalid phone number or PIN. Try PIN: 1234)',
        [{ text: 'Sawa (OK)' }]
      );
    }
  };

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 9);
    setPhoneNumber(cleaned);
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handlePinChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 6);
    setPin(cleaned);
    if (errors.pin) {
      setErrors(prev => ({ ...prev, pin: '' }));
    }
  };

  const styles = createStyles(theme, isMobile, width, height);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingState message="Kwinjira... (Logging in...)" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Kwinjira (Login)',
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.textPrimary,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}>
              <ArrowLeft size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollContainer contentContainerStyle={styles.scrollContent}>
        <ResponsiveContainer maxWidth={400}>
          <View style={styles.content}>
            <View style={[styles.logoContainer, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.logoText, { color: theme.colors.textInverse }]}>ST</Text>
            </View>

            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              Murakaza neza! (Welcome back!)
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Injira kuri konti yawe (Sign in to your account)
            </Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                  Nomero ya Telefoni (Phone Number)
                </Text>
                <View style={[
                  styles.inputContainer,
                  { 
                    backgroundColor: theme.colors.surfaceVariant,
                    borderColor: errors.phone ? theme.colors.error : theme.colors.border,
                  }
                ]}>
                  <Phone size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                  <Text style={[styles.countryCode, { color: theme.colors.textPrimary }]}>+250</Text>
                  <TextInput
                    style={[styles.input, { color: theme.colors.textPrimary }]}
                    placeholder="788 123 456"
                    value={formatPhoneNumber(phoneNumber)}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                    placeholderTextColor={theme.colors.textTertiary || '#9CA3AF'}
                    maxLength={11}
                  />
                </View>
                {errors.phone && (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {errors.phone}
                  </Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                  PIN
                </Text>
                <View style={[
                  styles.inputContainer,
                  { 
                    backgroundColor: theme.colors.surfaceVariant,
                    borderColor: errors.pin ? theme.colors.error : theme.colors.border,
                  }
                ]}>
                  <Lock size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: theme.colors.textPrimary }]}
                    placeholder="Andika PIN yawe (Enter your PIN)"
                    value={pin}
                    onChangeText={handlePinChange}
                    keyboardType="number-pad"
                    secureTextEntry={!showPin}
                    placeholderTextColor={theme.colors.textTertiary}
                    maxLength={6}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPin(!showPin)}
                    style={styles.eyeButton}>
                    {showPin ? (
                      <EyeOff size={20} color={theme.colors.textSecondary} />
                    ) : (
                      <Eye size={20} color={theme.colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.pin && (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {errors.pin}
                  </Text>
                )}
              </View>

              <Button
                title="Injira (Sign In)"
                onPress={handleLogin}
                variant="primary"
                size={isMobile ? 'medium' : 'large'}
                fullWidth
                disabled={!phoneNumber || !pin}
                style={styles.loginButton}
              />

              <View style={styles.helpSection}>
                <Text style={[styles.helpText, { color: theme.colors.textSecondary }]}>
                  Wibagiwe PIN? (Forgot PIN?)
                </Text>
                <TouchableOpacity>
                  <Text style={[styles.helpLink, { color: theme.colors.primary }]}>
                    Saba Ubufasha (Get Help)
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.demoSection}>
                <Text style={[styles.demoText, { color: theme.colors.textTertiary }]}>
                  Demo: Koresha PIN 1234 cyangwa 0000 (Use PIN 1234 or 0000)
                </Text>
              </View>
            </View>
          </View>
        </ResponsiveContainer>
      </ScrollContainer>
    </SafeAreaView>
  );
}

const createStyles = (theme: any, isMobile: boolean, width: number, height: number) => StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: height - 100, // Account for header
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
    minHeight: height * 0.8,
  },
  logoContainer: {
    width: isMobile ? 80 : 100,
    height: isMobile ? 80 : 100,
    borderRadius: isMobile ? 40 : 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing.xl,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: isMobile ? 28 : 36,
    fontWeight: theme.typography.fontWeights.bold,
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
  },
  form: {
    width: '100%',
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
    minHeight: isMobile ? 50 : 56,
  },
  inputIcon: {
    marginRight: theme.spacing.md,
  },
  countryCode: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    paddingVertical: theme.spacing.md,
  },
  eyeButton: {
    padding: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.sm,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  loginButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  helpSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  helpText: {
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
    marginBottom: theme.spacing.xs,
  },
  helpLink: {
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  demoSection: {
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: `${theme.colors.info}10`,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: `${theme.colors.info}30`,
  },
  demoText: {
    fontSize: theme.typography.fontSizes.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});