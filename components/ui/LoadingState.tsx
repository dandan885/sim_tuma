import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Loader2 } from 'lucide-react-native';
import { APP_CONSTANTS } from '@/constants/AppConstants';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Gutegereza... (Loading...)',
  size = 'medium',
  color = APP_CONSTANTS.COLORS.PRIMARY,
}) => {
  const spinValue = new Animated.Value(0);

  React.useEffect(() => {
    const spin = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => spin());
    };
    spin();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSize = () => {
    switch (size) {
      case 'small': return 20;
      case 'large': return 40;
      default: return 28;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Loader2 size={getSize()} color={color} />
      </Animated.View>
      {message && (
        <Text style={[styles.message, { color }]}>{message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: APP_CONSTANTS.DESIGN.SPACING.LG,
  },
  message: {
    marginTop: APP_CONSTANTS.DESIGN.SPACING.SM,
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.SM,
    fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.MEDIUM,
  },
});