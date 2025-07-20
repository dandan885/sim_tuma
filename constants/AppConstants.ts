// App-wide constants for Rwanda SimTuma
export const APP_CONSTANTS = {
  APP_NAME: 'SimTuma',
  COUNTRY: 'Rwanda',
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
  SPRING_CONFIG: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  
  // Responsive breakpoints
  BREAKPOINTS: {
    MOBILE: 480,
    TABLET: 768,
    DESKTOP: 1024,
  },
  
  // Design tokens
  DESIGN: {
    BORDER_RADIUS: {
      SMALL: 8,
      MEDIUM: 12,
      LARGE: 16,
      XLARGE: 20,
    },
    SPACING: {
      XS: 4,
      SM: 8,
      MD: 16,
      LG: 24,
      XL: 32,
      XXL: 40,
    },
    SHADOWS: {
      SMALL: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      },
      MEDIUM: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
      LARGE: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
      },
    },
  },
  
  // Color palette
  COLORS: {
    PRIMARY: '#1E40AF', // Rwanda blue
    PRIMARY_LIGHT: '#3B82F6',
    PRIMARY_DARK: '#1E3A8A',
    SECONDARY: '#059669', // Rwanda green
    SECONDARY_LIGHT: '#10B981',
    SECONDARY_DARK: '#047857',
    ACCENT: '#F59E0B', // Golden yellow
    ACCENT_LIGHT: '#FCD34D',
    ACCENT_DARK: '#D97706',
    
    SUCCESS: '#059669',
    WARNING: '#F59E0B',
    ERROR: '#DC2626',
    INFO: '#0EA5E9',
    
    BACKGROUND: '#FAFBFC',
    SURFACE: '#FFFFFF',
    SURFACE_VARIANT: '#F8FAFC',
    
    TEXT_PRIMARY: '#1F2937',
    TEXT_SECONDARY: '#6B7280',
    TEXT_TERTIARY: '#9CA3AF',
    TEXT_INVERSE: '#FFFFFF',
    
    BORDER: '#E5E7EB',
    BORDER_LIGHT: '#F3F4F6',
    DIVIDER: '#E5E7EB',
  },
  
  // Typography
  TYPOGRAPHY: {
    FONT_SIZES: {
      XS: 12,
      SM: 14,
      BASE: 16,
      LG: 18,
      XL: 20,
      XXL: 24,
      XXXL: 32,
    },
    FONT_WEIGHTS: {
      NORMAL: '400',
      MEDIUM: '500',
      SEMIBOLD: '600',
      BOLD: '700',
    },
    LINE_HEIGHTS: {
      TIGHT: 1.2,
      NORMAL: 1.5,
      RELAXED: 1.75,
    },
  },
  
  // API endpoints
  MTN_API_BASE: 'https://sandbox.momodeveloper.mtn.com',
  
  // Error messages
  ERRORS: {
    INVALID_PHONE: 'Nomero ya telefoni ntabwo ari yo (Invalid MTN Number)',
    NETWORK_ERROR: 'Ikibazo cyo kwinjira kuri interineti (Network connection failed)',
    API_ERROR: 'Serivisi ntabwo irakora neza (Service temporarily unavailable)',
    INSUFFICIENT_BALANCE: 'Amafaranga ntabwo ahagije (Insufficient balance)',
    INVALID_AMOUNT: 'Amafaranga yanditswe ntabwo ari yo (Invalid amount entered)',
    REQUIRED_FIELD: 'Iyi nkuru ikenewe (This field is required)',
    MIN_AMOUNT: 'Amafaranga make ni RWF 100 (Minimum amount is RWF 100)',
  },
  
  // Success messages
  SUCCESS: {
    MONEY_SENT: 'Amafaranga yoherejwe neza (Money sent successfully)',
    BILL_PAID: 'Fagitire yishyuwe neza (Bill payment successful)',
    BALANCE_UPDATED: 'Amafaranga yavuguruwe (Balance updated)',
    PROFILE_UPDATED: 'Amakuru yawe yavuguruwe (Profile updated successfully)',
  },
  
  // Rwanda-specific data
  RWANDA_DATA: {
    PROVINCES: [
      'Kigali City',
      'Eastern Province',
      'Northern Province',
      'Southern Province',
      'Western Province',
    ],
    DISTRICTS: [
      'Gasabo', 'Kicukiro', 'Nyarugenge', // Kigali
      'Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana', // Eastern
      'Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo', // Northern
      'Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango', // Southern
      'Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro', // Western
    ],
    UTILITY_PROVIDERS: {
      ELECTRICITY: 'EUCL (Energy Utility Corporation Limited)',
      WATER: 'WASAC (Water and Sanitation Corporation)',
      INTERNET: ['MTN Rwanda', 'Airtel Rwanda', 'Liquid Telecom'],
      MOBILE: ['MTN Rwanda', 'Airtel Rwanda'],
    },
  },
};

// Utility functions
export const formatPhoneNumber = (phone: string): string => {
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
  
  const prefix = cleaned.slice(0, 3);
  return APP_CONSTANTS.MTN_PREFIXES.includes(prefix);
};

export const formatCurrency = (amount: number): string => {
  return `${APP_CONSTANTS.CURRENCY_SYMBOL} ${amount.toLocaleString('rw-RW')}`;
};

export const hiddenBalance = (amount: number): string => {
  const formatted = formatCurrency(amount);
  return formatted.replace(/\d/g, '*');
};

export const getResponsiveValue = (mobile: any, tablet?: any, desktop?: any) => {
  // This would be used with a responsive hook in real implementation
  return { mobile, tablet: tablet || mobile, desktop: desktop || tablet || mobile };
};

export const validateAmount = (amount: string): { isValid: boolean; error?: string } => {
  const numAmount = parseFloat(amount);
  
  if (!amount || isNaN(numAmount)) {
    return { isValid: false, error: APP_CONSTANTS.ERRORS.INVALID_AMOUNT };
  }
  
  if (numAmount < 100) {
    return { isValid: false, error: APP_CONSTANTS.ERRORS.MIN_AMOUNT };
  }
  
  return { isValid: true };
};

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return 'Ubu (Now)';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString('rw-RW');
};