import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertCircle, RefreshCw } from 'lucide-react-native';
import { APP_CONSTANTS } from '@/constants/AppConstants';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Ikibazo cyabaye (Something went wrong)',
  message = 'Gerageza kongera (Please try again)',
  onRetry,
  retryText = 'Ongera ugerageze (Try Again)',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <AlertCircle size={48} color={APP_CONSTANTS.COLORS.ERROR} />
      </View>
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <RefreshCw size={20} color={APP_CONSTANTS.COLORS.PRIMARY} />
          <Text style={styles.retryText}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: APP_CONSTANTS.DESIGN.SPACING.XL,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${APP_CONSTANTS.COLORS.ERROR}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.LG,
  },
  title: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.XL,
    fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.BOLD,
    color: APP_CONSTANTS.COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.SM,
  },
  message: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.BASE,
    color: APP_CONSTANTS.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: APP_CONSTANTS.TYPOGRAPHY.LINE_HEIGHTS.NORMAL * APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.BASE,
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.LG,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${APP_CONSTANTS.COLORS.PRIMARY}15`,
    paddingHorizontal: APP_CONSTANTS.DESIGN.SPACING.LG,
    paddingVertical: APP_CONSTANTS.DESIGN.SPACING.MD,
    borderRadius: APP_CONSTANTS.DESIGN.BORDER_RADIUS.MEDIUM,
    borderWidth: 1,
    borderColor: APP_CONSTANTS.COLORS.PRIMARY,
  },
  retryText: {
    marginLeft: APP_CONSTANTS.DESIGN.SPACING.SM,
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.BASE,
    fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.SEMIBOLD,
    color: APP_CONSTANTS.COLORS.PRIMARY,
  },
});