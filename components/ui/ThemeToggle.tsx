import React from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  size?: number;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 24 }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [rotateAnim] = React.useState(new Animated.Value(0));

  const handleToggle = () => {
    Animated.timing(rotateAnim, {
      toValue: isDark ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    toggleTheme();
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={handleToggle}
      activeOpacity={0.7}>
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        {isDark ? (
          <Moon size={size} color={theme.colors.textPrimary} />
        ) : (
          <Sun size={size} color={theme.colors.textPrimary} />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});