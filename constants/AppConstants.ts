// App-wide constants for Rwanda MTN MoMo
export const APP_CONSTANTS = {
  COUNTRY_CODE: '+250',
  CURRENCY: 'RWF',
  CURRENCY_SYMBOL: 'RWF',
  PHONE_NUMBER_LENGTH: 9, // Without country code
  PHONE_NUMBER_REGEX: /^[0-9]{9}$/,
  
  // Rwanda MTN prefixes (without leading 0)
  MTN_PREFIXES: ['788', '789', '780', '781', '782', '783'],
  
  // Animation durations
  ANIMATION_DURATION: 300,
  FADE_DURATION: 200,
  
  // API endpoints
  MTN_API_BASE: 'https://sandbox.momodeveloper.mtn.com',
  
  // Error messages
  ERRORS: {
    INVALID_PHONE: 'Invalid MTN Number',
    NETWORK_ERROR: 'Network connection failed',
    API_ERROR: 'Service temporarily unavailable',
    INSUFFICIENT_BALANCE: 'Insufficient balance',
    INVALID_AMOUNT: 'Invalid amount entered',
  },
  
  // Success messages
  SUCCESS: {
    MONEY_SENT: 'Money sent successfully',
    BILL_PAID: 'Bill payment successful',
    BALANCE_UPDATED: 'Balance updated',
  }
};

// Utility functions
export const formatPhoneNumber = (phone: string): string => {
  // Remove any non-digits and ensure it's 9 digits
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
};

export const validateMTNNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  if (!APP_CONSTANTS.PHONE_NUMBER_REGEX.test(cleaned)) {
    return false;
  }
  
  // Check if it starts with valid MTN prefix
  const prefix = cleaned.slice(0, 3);
  return APP_CONSTANTS.MTN_PREFIXES.includes(prefix);
};

export const formatCurrency = (amount: number): string => {
  return `${APP_CONSTANTS.CURRENCY_SYMBOL} ${amount.toLocaleString('en-RW')}`;
};

export const hiddenBalance = (amount: number): string => {
  const formatted = formatCurrency(amount);
  return formatted.replace(/\d/g, '*');
};