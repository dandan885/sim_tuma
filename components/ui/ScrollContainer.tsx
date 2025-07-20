import React from 'react';
import { ScrollView, ScrollViewProps, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ScrollContainerProps extends ScrollViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  enableBounce?: boolean;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
}

export const ScrollContainer: React.FC<ScrollContainerProps> = ({
  children,
  style,
  contentContainerStyle,
  enableBounce = true,
  keyboardShouldPersistTaps = 'handled',
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <ScrollView
      style={[{ backgroundColor: theme.colors.background }, style]}
      contentContainerStyle={[
        {
          flexGrow: 1,
          paddingBottom: theme.spacing.lg,
        },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      bounces={enableBounce}
      alwaysBounceVertical={enableBounce}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      {...props}>
      {children}
    </ScrollView>
  );
};