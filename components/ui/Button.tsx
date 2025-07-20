import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { APP_CONSTANTS } from '@/constants/AppConstants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = false,
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    if (!disabled && !loading) {
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        ...APP_CONSTANTS.SPRING_CONFIG,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        ...APP_CONSTANTS.SPRING_CONFIG,
      }).start();
    }
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };

  const getButtonStyles = (): ViewStyle[] => {
    const baseStyles = [styles.button, styles[`${size}Button`]];
    
    if (fullWidth) {
      baseStyles.push(styles.fullWidth);
    }
    
    switch (variant) {
      case 'secondary':
        baseStyles.push(styles.secondaryButton);
        break;
      case 'outline':
        baseStyles.push(styles.outlineButton);
        break;
      case 'ghost':
        baseStyles.push(styles.ghostButton);
        break;
      case 'danger':
        baseStyles.push(styles.dangerButton);
        break;
      default:
        baseStyles.push(styles.primaryButton);
    }
    
    if (disabled) {
      baseStyles.push(styles.disabledButton);
    }
    
    if (style) {
      baseStyles.push(style);
    }
    
    return baseStyles;
  };

  const getTextStyles = (): TextStyle[] => {
    const baseStyles = [styles.buttonText, styles[`${size}Text`]];
    
    switch (variant) {
      case 'secondary':
        baseStyles.push(styles.secondaryText);
        break;
      case 'outline':
        baseStyles.push(styles.outlineText);
        break;
      case 'ghost':
        baseStyles.push(styles.ghostText);
        break;
      case 'danger':
        baseStyles.push(styles.dangerText);
        break;
      default:
        baseStyles.push(styles.primaryText);
    }
    
    if (disabled) {
      baseStyles.push(styles.disabledText);
    }
    
    if (textStyle) {
      baseStyles.push(textStyle);
    }
    
    return baseStyles;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="small" 
            color={variant === 'outline' || variant === 'ghost' ? APP_CONSTANTS.COLORS.PRIMARY : APP_CONSTANTS.COLORS.TEXT_INVERSE} 
          />
          <Text style={[...getTextStyles(), styles.loadingText]}>
            Gutegereza... (Loading...)
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        {icon && iconPosition === 'left' && (
          <View style={styles.iconLeft}>{icon}</View>
        )}
        <Text style={getTextStyles()}>{title}</Text>
        {icon && iconPosition === 'right' && (
          <View style={styles.iconRight}>{icon}</View>
        )}
      </View>
    );
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={getButtonStyles()}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}>
        {renderContent()}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: APP_CONSTANTS.DESIGN.BORDER_RADIUS.MEDIUM,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  
  // Size variants
  smallButton: {
    paddingHorizontal: APP_CONSTANTS.DESIGN.SPACING.MD,
    paddingVertical: APP_CONSTANTS.DESIGN.SPACING.SM,
    minHeight: 36,
  },
  mediumButton: {
    paddingHorizontal: APP_CONSTANTS.DESIGN.SPACING.LG,
    paddingVertical: APP_CONSTANTS.DESIGN.SPACING.MD,
    minHeight: 48,
  },
  largeButton: {
    paddingHorizontal: APP_CONSTANTS.DESIGN.SPACING.XL,
    paddingVertical: APP_CONSTANTS.DESIGN.SPACING.LG,
    minHeight: 56,
  },
  
  // Variant styles
  primaryButton: {
    backgroundColor: APP_CONSTANTS.COLORS.PRIMARY,
    ...APP_CONSTANTS.DESIGN.SHADOWS.MEDIUM,
  },
  secondaryButton: {
    backgroundColor: APP_CONSTANTS.COLORS.SECONDARY,
    ...APP_CONSTANTS.DESIGN.SHADOWS.MEDIUM,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: APP_CONSTANTS.COLORS.PRIMARY,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  dangerButton: {
    backgroundColor: APP_CONSTANTS.COLORS.ERROR,
    ...APP_CONSTANTS.DESIGN.SHADOWS.MEDIUM,
  },
  disabledButton: {
    backgroundColor: APP_CONSTANTS.COLORS.BORDER,
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Text styles
  buttonText: {
    fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.SEMIBOLD,
    textAlign: 'center',
  },
  smallText: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.SM,
  },
  mediumText: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.BASE,
  },
  largeText: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.LG,
  },
  
  // Text color variants
  primaryText: {
    color: APP_CONSTANTS.COLORS.TEXT_INVERSE,
  },
  secondaryText: {
    color: APP_CONSTANTS.COLORS.TEXT_INVERSE,
  },
  outlineText: {
    color: APP_CONSTANTS.COLORS.PRIMARY,
  },
  ghostText: {
    color: APP_CONSTANTS.COLORS.PRIMARY,
  },
  dangerText: {
    color: APP_CONSTANTS.COLORS.TEXT_INVERSE,
  },
  disabledText: {
    color: APP_CONSTANTS.COLORS.TEXT_TERTIARY,
  },
  
  // Content layout
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: APP_CONSTANTS.DESIGN.SPACING.SM,
  },
  iconLeft: {
    marginRight: APP_CONSTANTS.DESIGN.SPACING.SM,
  },
  iconRight: {
    marginLeft: APP_CONSTANTS.DESIGN.SPACING.SM,
  },
});