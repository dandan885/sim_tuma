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

export default function PhoneVerificationScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    
    // Simulate sending OTP
    Alert.alert('OTP Sent', `Verification code sent to ${phoneNumber}`);
    setStep('otp');
    setCountdown(60);
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit verification code');
      return;
    }
    
    // Simulate OTP verification
    Alert.alert('Success', 'Phone number verified successfully!', [
      { text: 'Continue', onPress: () => router.replace('/(tabs)') }
    ]);
  };

  const handleResendOTP = () => {
    if (countdown === 0) {
      setCountdown(60);
      Alert.alert('OTP Sent', 'New verification code sent!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: step === 'phone' ? 'Enter Phone Number' : 'Verify Phone Number',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => step === 'otp' ? setStep('phone') : router.back()}
              style={styles.backButton}>
              <ArrowLeft size={24} color="#6C63FF" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Phone size={64} color="#6C63FF" />
        </View>

        {step === 'phone' ? (
          <>
            <Text style={styles.title}>Enter Your Phone Number</Text>
            <Text style={styles.subtitle}>
              We'll send you a verification code to confirm your number
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.countryCode}>+250</Text>
              <TextInput
                style={styles.phoneInput}
                placeholder="788 123 456"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
                maxLength={15}
              />
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleSendOTP}>
              <Text style={styles.primaryButtonText}>Send Verification Code</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to {phoneNumber}
            </Text>

            <TextInput
              style={styles.otpInput}
              placeholder="000000"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              placeholderTextColor="#999"
              textAlign="center"
            />

            <TouchableOpacity style={styles.primaryButton} onPress={handleVerifyOTP}>
              <Text style={styles.primaryButtonText}>Verify Code</Text>
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code?</Text>
              <TouchableOpacity 
                onPress={handleResendOTP} 
                disabled={countdown > 0}
                style={styles.resendButton}>
                <Text style={[styles.resendButtonText, countdown > 0 && styles.disabledText]}>
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2F2F2F',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  countryCode: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2F2F2F',
    marginRight: 12,
    paddingVertical: 16,
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    color: '#2F2F2F',
    paddingVertical: 16,
  },
  otpInput: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    paddingVertical: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    letterSpacing: 8,
  },
  primaryButton: {
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
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  resendButton: {
    padding: 8,
  },
  resendButtonText: {
    fontSize: 16,
    color: '#6C63FF',
    fontWeight: '600',
  },
  disabledText: {
    color: '#999',
  },
});