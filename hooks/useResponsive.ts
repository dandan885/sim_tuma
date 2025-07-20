import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export interface ResponsiveBreakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
}

export const useResponsive = (): ResponsiveBreakpoints => {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;
  
  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    width,
    height,
    orientation: width > height ? 'landscape' : 'portrait',
  };
};

export const useResponsiveValue = <T>(
  mobile: T,
  tablet?: T,
  desktop?: T
): T => {
  const { isMobile, isTablet } = useResponsive();
  
  if (!isMobile && !isTablet && desktop !== undefined) {
    return desktop;
  }
  if (!isMobile && tablet !== undefined) {
    return tablet;
  }
  return mobile;
};