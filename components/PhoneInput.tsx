import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { Phone } from 'lucide-react-native';
import { APP_CONSTANTS, validateMTNNumber, formatPhoneNumber } from '@/constants/AppConstants';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  onValidation?: (isValid: boolean) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeText,
  placeholder = '788 123 456',
  error,
  onValidation,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const handleTextChange = (text: string) => {
    // Remove any non-digits and limit to 9 digits
    const cleaned = text.replace(/\D/g, '').slice(0, APP_CONSTANTS.PHONE_NUMBER_LENGTH);
    
    // Format the number for display
    const formatted = formatPhoneNumber(cleaned);
    onChangeText(cleaned);

    // Validate MTN number
    const isValid = validateMTNNumber(cleaned);
    onValidation?.(isValid);

    // Show error animation if invalid and has enough digits
    if (cleaned.length === APP_CONSTANTS.PHONE_NUMBER_LENGTH && !isValid) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: APP_CONSTANTS.FADE_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: APP_CONSTANTS.FADE_DURATION,
        useNativeDriver: true,
      }).start();
    }
  };

  const displayValue = formatPhoneNumber(value);
  const isInvalid = value.length === APP_CONSTANTS.PHONE_NUMBER_LENGTH && !validateMTNNumber(value);

  return (
    <View style={styles.container}>
      <View style={[
        styles.inputContainer,
        isFocused && styles.focusedContainer,
        isInvalid && styles.errorContainer,
      ]}>
        <Phone size={20} color="#666" style={styles.icon} />
        <Text style={styles.countryCode}>{APP_CONSTANTS.COUNTRY_CODE}</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={displayValue}
          onChangeText={handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
          maxLength={11} // Formatted length with spaces
        />
      </View>
      
      <Animated.View style={[styles.errorContainer, { opacity: fadeAnim }]}>
        <Text style={styles.errorText}>
          {isInvalid ? APP_CONSTANTS.ERRORS.INVALID_PHONE : error}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  focusedContainer: {
    borderColor: '#6C63FF',
    shadowColor: '#6C63FF',
    shadowOpacity: 0.2,
  },
  errorContainer: {
    borderColor: '#EF4444',
  },
  icon: {
    marginRight: 12,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F2F2F',
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#2F2F2F',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
});