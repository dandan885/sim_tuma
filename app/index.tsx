import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Smartphone, Shield, Send, CreditCard, MapPin } from 'lucide-react-native';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { Button } from '@/components/ui/Button';
import { APP_CONSTANTS } from '@/constants/AppConstants';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [logoScale] = useState(new Animated.Value(0.8));

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        ...APP_CONSTANTS.SPRING_CONFIG,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        useNativeDriver: true,
        ...APP_CONSTANTS.SPRING_CONFIG,
      }),
    ]).start();
  }, []);

  const features = [
    {
      icon: Send,
      title: 'Kohereza Amafaranga',
      titleEn: 'Send Money',
      description: 'Ohereza amafaranga byihuse hamwe na MTN Mobile Money',
      descriptionEn: 'Transfer money instantly with MTN Mobile Money',
      color: APP_CONSTANTS.COLORS.PRIMARY,
    },
    {
      icon: CreditCard,
      title: 'Kwishyura Fagitire',
      titleEn: 'Pay Bills',
      description: 'Ishyura fagitire zawe zose ukurikije telefoni yawe',
      descriptionEn: 'Pay all your bills directly from your phone',
      color: APP_CONSTANTS.COLORS.SECONDARY,
    },
    {
      icon: Shield,
      title: 'Umutekano',
      titleEn: 'Security',
      description: 'Umutekano wa banki hamwe na PIN na biometric',
      descriptionEn: 'Bank-level security with PIN and biometric protection',
      color: APP_CONSTANTS.COLORS.ACCENT,
    },
    {
      icon: Smartphone,
      title: 'Byoroshye',
      titleEn: 'Easy to Use',
      description: 'Porogaramu yoroshye kandi yumvikana kuri bose',
      descriptionEn: 'Simple and intuitive interface for everyone',
      color: APP_CONSTANTS.COLORS.INFO,
    },
  ];

  const isTablet = width >= APP_CONSTANTS.BREAKPOINTS.TABLET;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={APP_CONSTANTS.COLORS.BACKGROUND} />
      
      <ResponsiveContainer style={styles.content} maxWidth={600}>
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
            <View style={styles.logo}>
              <Text style={styles.logoText}>ST</Text>
            </View>
            <View style={styles.rwandaFlag}>
              <View style={[styles.flagStripe, { backgroundColor: '#00A1DE' }]} />
              <View style={[styles.flagStripe, { backgroundColor: '#FAD201' }]} />
              <View style={[styles.flagStripe, { backgroundColor: '#00A651' }]} />
            </View>
          </Animated.View>
          
          <Text style={styles.title}>{APP_CONSTANTS.APP_NAME}</Text>
          <Text style={styles.subtitle}>
            Inzira yoroshye yo kohereza amafaranga, kwishyura fagitire no gucunga amafaranga yawe mu Rwanda
          </Text>
          <Text style={styles.subtitleEn}>
            The easiest way to send money, pay bills, and manage your finances in Rwanda
          </Text>
          
          <View style={styles.locationBadge}>
            <MapPin size={16} color={APP_CONSTANTS.COLORS.PRIMARY} />
            <Text style={styles.locationText}>Rwanda</Text>
          </View>
        </Animated.View>

        {/* Features */}
        <Animated.View 
          style={[
            styles.featuresContainer,
            { opacity: fadeAnim },
          ]}>
          {features.map((feature, index) => (
            <Animated.View
              key={index}
              style={[
                styles.featureCard,
                isTablet && styles.featureCardTablet,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, 50 + index * 10],
                      }),
                    },
                  ],
                },
              ]}>
              <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
                <feature.icon size={isTablet ? 28 : 24} color={feature.color} />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureTitleEn}>{feature.titleEn}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </Animated.View>
          ))}
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
            size={isTablet ? 'large' : 'medium'}
            fullWidth
            style={styles.primaryButton}
          />
          
          <Button
            title="Mfite Konti (I Have Account)"
            onPress={() => router.push('/(tabs)')}
            variant="outline"
            size={isTablet ? 'large' : 'medium'}
            fullWidth
            style={styles.secondaryButton}
          />
        </Animated.View>
      </ResponsiveContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_CONSTANTS.COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    paddingVertical: APP_CONSTANTS.DESIGN.SPACING.LG,
  },
  header: {
    alignItems: 'center',
    marginTop: APP_CONSTANTS.DESIGN.SPACING.XL,
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.XL,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.LG,
    position: 'relative',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: APP_CONSTANTS.COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    ...APP_CONSTANTS.DESIGN.SHADOWS.LARGE,
  },
  logoText: {
    fontSize: 28,
    fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.BOLD,
    color: APP_CONSTANTS.COLORS.TEXT_INVERSE,
  },
  rwandaFlag: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 24,
    height: 18,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: APP_CONSTANTS.COLORS.BORDER,
  },
  flagStripe: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.XXXL,
    fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.BOLD,
    color: APP_CONSTANTS.COLORS.TEXT_PRIMARY,
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.MD,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.BASE,
    color: APP_CONSTANTS.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: APP_CONSTANTS.TYPOGRAPHY.LINE_HEIGHTS.RELAXED * APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.BASE,
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.SM,
  },
  subtitleEn: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.SM,
    color: APP_CONSTANTS.COLORS.TEXT_TERTIARY,
    textAlign: 'center',
    lineHeight: APP_CONSTANTS.TYPOGRAPHY.LINE_HEIGHTS.NORMAL * APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.SM,
    fontStyle: 'italic',
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.MD,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${APP_CONSTANTS.COLORS.PRIMARY}15`,
    paddingHorizontal: APP_CONSTANTS.DESIGN.SPACING.MD,
    paddingVertical: APP_CONSTANTS.DESIGN.SPACING.SM,
    borderRadius: APP_CONSTANTS.DESIGN.BORDER_RADIUS.LARGE,
    borderWidth: 1,
    borderColor: `${APP_CONSTANTS.COLORS.PRIMARY}30`,
  },
  locationText: {
    marginLeft: APP_CONSTANTS.DESIGN.SPACING.XS,
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.SM,
    fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.SEMIBOLD,
    color: APP_CONSTANTS.COLORS.PRIMARY,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.XL,
  },
  featureCard: {
    width: '48%',
    backgroundColor: APP_CONSTANTS.COLORS.SURFACE,
    padding: APP_CONSTANTS.DESIGN.SPACING.LG,
    borderRadius: APP_CONSTANTS.DESIGN.BORDER_RADIUS.LARGE,
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.MD,
    alignItems: 'center',
    ...APP_CONSTANTS.DESIGN.SHADOWS.SMALL,
    borderWidth: 1,
    borderColor: APP_CONSTANTS.COLORS.BORDER_LIGHT,
  },
  featureCardTablet: {
    width: '48%',
    padding: APP_CONSTANTS.DESIGN.SPACING.XL,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.MD,
  },
  featureTitle: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.BASE,
    fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.BOLD,
    color: APP_CONSTANTS.COLORS.TEXT_PRIMARY,
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.XS,
    textAlign: 'center',
  },
  featureTitleEn: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.SM,
    fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.MEDIUM,
    color: APP_CONSTANTS.COLORS.TEXT_SECONDARY,
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.SM,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  featureDescription: {
    fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.XS,
    color: APP_CONSTANTS.COLORS.TEXT_TERTIARY,
    textAlign: 'center',
    lineHeight: APP_CONSTANTS.TYPOGRAPHY.LINE_HEIGHTS.NORMAL * APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.XS,
  },
  buttonContainer: {
    marginTop: 'auto',
    gap: APP_CONSTANTS.DESIGN.SPACING.MD,
  },
  primaryButton: {
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.SM,
  },
  secondaryButton: {
    marginBottom: APP_CONSTANTS.DESIGN.SPACING.LG,
  },
});