import React from 'react';
import { View, ViewStyle, Dimensions } from 'react-native';
import { APP_CONSTANTS } from '@/constants/AppConstants';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  mobileStyle?: ViewStyle;
  tabletStyle?: ViewStyle;
  desktopStyle?: ViewStyle;
  padding?: boolean;
  maxWidth?: number;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  style,
  mobileStyle,
  tabletStyle,
  desktopStyle,
  padding = true,
  maxWidth,
}) => {
  const { width } = Dimensions.get('window');
  
  const getResponsiveStyle = (): ViewStyle => {
    let responsiveStyle: ViewStyle = {};
    
    if (width >= APP_CONSTANTS.BREAKPOINTS.DESKTOP && desktopStyle) {
      responsiveStyle = { ...responsiveStyle, ...desktopStyle };
    } else if (width >= APP_CONSTANTS.BREAKPOINTS.TABLET && tabletStyle) {
      responsiveStyle = { ...responsiveStyle, ...tabletStyle };
    } else if (mobileStyle) {
      responsiveStyle = { ...responsiveStyle, ...mobileStyle };
    }
    
    if (padding) {
      const horizontalPadding = width >= APP_CONSTANTS.BREAKPOINTS.TABLET 
        ? APP_CONSTANTS.DESIGN.SPACING.XL 
        : APP_CONSTANTS.DESIGN.SPACING.MD;
      
      responsiveStyle.paddingHorizontal = horizontalPadding;
    }
    
    if (maxWidth && width > maxWidth) {
      responsiveStyle.maxWidth = maxWidth;
      responsiveStyle.alignSelf = 'center';
      responsiveStyle.width = '100%';
    }
    
    return responsiveStyle;
  };

  return (
    <View style={[style, getResponsiveStyle()]}>
      {children}
    </View>
  );
};