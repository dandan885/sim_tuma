import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

interface BentoGridProps {
  children: React.ReactNode;
  style?: ViewStyle;
  spacing?: number;
}

interface BentoItemProps {
  children: React.ReactNode;
  span?: 1 | 2;
  style?: ViewStyle;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  children,
  style,
  spacing = 12,
}) => {
  const { theme } = useTheme();
  const { isMobile } = useResponsive();

  return (
    <View
      style={[
        styles.grid,
        {
          gap: spacing,
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: isMobile ? 'nowrap' : 'wrap',
        },
        style,
      ]}>
      {children}
    </View>
  );
};

export const BentoItem: React.FC<BentoItemProps> = ({
  children,
  span = 1,
  style,
}) => {
  const { theme } = useTheme();
  const { isMobile, width } = useResponsive();

  const getItemWidth = () => {
    if (isMobile) return '100%';
    
    const gridGap = 12;
    const containerPadding = theme.spacing.md * 2;
    const availableWidth = width - containerPadding;
    
    if (span === 2) {
      return availableWidth;
    }
    
    return (availableWidth - gridGap) / 2;
  };

  return (
    <View
      style={[
        styles.item,
        {
          width: getItemWidth(),
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.large,
          padding: theme.spacing.lg,
          shadowColor: theme.colors.shadow,
          borderColor: theme.colors.border,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    width: '100%',
  },
  item: {
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
});