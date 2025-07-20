import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Smartphone, Shield, Send, CreditCard, MapPin } from 'lucide-react-native';
import { ScrollContainer } from '@/components/ui/ScrollContainer';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { Button } from '@/components/ui/Button';
import { BentoGrid, BentoItem } from '@/components/ui/BentoGrid';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

export default function WelcomeScreen() {
  const { theme, isDark } = useTheme();
  const { isMobile, isTablet } = useResponsive();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [logoScale] = useState(new Animated.Value(0.8));

  useEffect(() => {
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  }, [isDark]);

  const features = [
    {
      icon: Send,
      title: 'Kohereza Amafaranga',
      titleEn: 'Send Money',
      description: 'Ohereza amafaranga byihuse hamwe na MTN Mobile Money Rwanda',
      descriptionEn: 'Transfer money instantly with MTN Mobile Money Rwanda',
      color: theme.colors.primary,
      span: 1,
    },
    {
      icon: CreditCard,
      title: 'Kwishyura Fagitire',
      titleEn: 'Pay Bills',
      description: 'Ishyura fagitire zawe zose ukurikije telefoni yawe - EUCL, WASAC, na MTN Rwanda',
      descriptionEn: 'Pay all your bills directly from your phone - EUCL, WASAC, and MTN Rwanda',
      color: theme.colors.secondary,
      span: 1,
    },
    {
      icon: Shield,
      title: 'Umutekano wa Banki',
      titleEn: 'Bank-Level Security',
      description: 'Umutekano mukomeye hamwe na PIN, biometric, na encryption ya banki',
      descriptionEn: 'Advanced security with PIN, biometric, and bank-grade encryption',
      color: theme.colors.accent,
      span: 2,
    },
    {
      icon: Smartphone,
      title: 'Byoroshye Cyane',
      titleEn: 'Super Easy',
      description: 'Porogaramu yoroshye kandi yumvikana kuri bose mu Rwanda',
      descriptionEn: 'Simple and intuitive interface for everyone in Rwanda',
      color: theme.colors.info,
      span: 1,
    },
  ];

  const styles = createStyles(theme, isMobile, isTablet);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.background} 
      />
      
      <ScrollContainer
        contentContainerStyle={styles.scrollContent}
        enableBounce={true}>
        
        <ResponsiveContainer style={styles.content} maxWidth={800}>
          {/* Theme Toggle */}
          <View style={styles.themeToggleContainer}>
            <ThemeToggle />
          </View>

          {/* Header */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}>
            <Animated.View 
              style={[
                styles.logoContainer,
                { transform: [{ scale: logoScale }] }
              ]}>
              <View style={[styles.logo, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.logoText, { color: theme.colors.textInverse }]}>ST</Text>
              </View>
              <View style={styles.rwandaFlag}>
                <View style={[styles.flagStripe, { backgroundColor: '#00A1DE' }]} />
                <View style={[styles.flagStripe, { backgroundColor: '#FAD201' }]} />
                <View style={[styles.flagStripe, { backgroundColor: '#00A651' }]} />
              </View>
            </Animated.View>
            
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              SimTuma
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Inzira yoroshye yo kohereza amafaranga, kwishyura fagitire no gucunga amafaranga yawe mu Rwanda
            </Text>
            <Text style={[styles.subtitleEn, { color: theme.colors.textTertiary }]}>
              The easiest way to send money, pay bills, and manage your finances in Rwanda
            </Text>
            
            <View style={[styles.locationBadge, { 
              backgroundColor: `${theme.colors.primary}15`,
              borderColor: `${theme.colors.primary}30`,
            }]}>
              <MapPin size={16} color={theme.colors.primary} />
              <Text style={[styles.locationText, { color: theme.colors.primary }]}>
                Rwanda
              </Text>
            </View>
          </Animated.View>

          {/* Features Bento Grid */}
          <Animated.View 
            style={[
              styles.featuresContainer,
              { opacity: fadeAnim },
            ]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Ibikoresha (Features)
            </Text>
            
            <BentoGrid spacing={theme.spacing.md}>
              {features.map((feature, index) => (
                <BentoItem key={index} span={feature.span as 1 | 2}>
                  <Animated.View
                    style={{
                      opacity: fadeAnim,
                      transform: [
                        {
                          translateY: slideAnim.interpolate({
                            inputRange: [0, 50],
                            outputRange: [0, 50 + index * 10],
                          }),
                        },
                      ],
                    }}>
                    <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
                      <feature.icon size={isMobile ? 24 : 28} color={feature.color} />
                    </View>
                    <Text style={[styles.featureTitle, { color: theme.colors.textPrimary }]}>
                      {feature.title}
                    </Text>
                    <Text style={[styles.featureTitleEn, { color: theme.colors.textSecondary }]}>
                      {feature.titleEn}
                    </Text>
                    <Text style={[styles.featureDescription, { color: theme.colors.textTertiary }]}>
                      {feature.description}
                    </Text>
                  </Animated.View>
                </BentoItem>
              ))}
            </BentoGrid>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View 
            style={[
              styles.buttonContainer,
              { opacity: fadeAnim },
            ]}>
            <Button
              title="Tangira (Get Started)"
              onPress={() => router.push('/auth/phone-verification')}
              variant="primary"
              size={isMobile ? 'medium' : 'large'}
              fullWidth
              style={styles.primaryButton}
            />
            
            <Button
              title="Mfite Konti (I Have Account)"
              onPress={() => router.push('/(tabs)')}
              variant="outline"
              size={isMobile ? 'medium' : 'large'}
              fullWidth
              style={styles.secondaryButton}
            />
          </Animated.View>
        </ResponsiveContainer>
      </ScrollContainer>
    </SafeAreaView>
  );
}

const createStyles = (theme: any, isMobile: boolean, isTablet: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
  },
  content: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
  },
  themeToggleContainer: {
    alignItems: 'flex-end',
    marginBottom: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    position: 'relative',
  },
  logo: {
    width: isMobile ? 80 : 100,
    height: isMobile ? 80 : 100,
    borderRadius: isMobile ? 40 : 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: isMobile ? 28 : 36,
    fontWeight: theme.typography.fontWeights.bold,
  },
  rwandaFlag: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: isMobile ? 24 : 30,
    height: isMobile ? 18 : 22,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  flagStripe: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: isMobile ? theme.typography.fontSizes.xxxl : 40,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed * (isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg),
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  subtitleEn: {
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.normal * (isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base),
    fontStyle: 'italic',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.large,
    borderWidth: 1,
  },
  locationText: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  featuresContainer: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: isMobile ? theme.typography.fontSizes.xl : theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  featureIcon: {
    width: isMobile ? 56 : 64,
    height: isMobile ? 56 : 64,
    borderRadius: isMobile ? 28 : 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    alignSelf: 'center',
  },
  featureTitle: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  featureTitleEn: {
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  featureDescription: {
    fontSize: isMobile ? theme.typography.fontSizes.xs : theme.typography.fontSizes.sm,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.normal * (isMobile ? theme.typography.fontSizes.xs : theme.typography.fontSizes.sm),
  },
  buttonContainer: {
    marginTop: 'auto',
    gap: theme.spacing.md,
    paddingTop: theme.spacing.xl,
  },
  primaryButton: {
    marginBottom: theme.spacing.sm,
  },
  secondaryButton: {
    marginBottom: theme.spacing.lg,
  },
});