import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import {
  User,
  Phone,
  Mail,
  Shield,
  Bell,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  Smartphone,
  Lock,
  Eye,
  Moon,
  Sun,
  Globe,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { ScrollContainer } from '@/components/ui/ScrollContainer';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';

export default function ProfileScreen() {
  const { theme, isDark } = useTheme();
  const { t, language, setLanguage, availableLanguages } = useLanguage();
  const { user, logout } = useAuth();
  const { isMobile, isTablet } = useResponsive();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const profileSections = [
    {
      title: 'Account Information',
      items: [
        { icon: User, label: t.personalDetails, value: user?.name },
        { icon: Phone, label: t.phoneNumber, value: user?.phone },
        { icon: Mail, label: 'Email Address', value: user?.email || 'Not provided' },
        { icon: Shield, label: 'Account Status', value: user?.isVerified ? 'Verified' : 'Unverified' },
      ],
    },
    {
      title: 'Security Settings',
      items: [
        { icon: Lock, label: 'Change PIN', hasChevron: true },
        { icon: Smartphone, label: 'Biometric Login', hasSwitch: true, value: biometricsEnabled, onToggle: setBiometricsEnabled },
        { icon: Shield, label: 'Two-Factor Auth', hasSwitch: true, value: twoFactorEnabled, onToggle: setTwoFactorEnabled },
        { icon: Eye, label: 'Privacy Settings', hasChevron: true },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: t.notifications, hasSwitch: true, value: notificationsEnabled, onToggle: setNotificationsEnabled },
        { icon: Globe, label: t.language, hasCustom: true, customType: 'language' },
        { icon: isDark ? Moon : Sun, label: t.theme, hasCustom: true, customType: 'theme' },
        { icon: CreditCard, label: 'Payment Methods', hasChevron: true },
        { icon: Settings, label: 'App Settings', hasChevron: true },
      ],
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: t.cancel, style: 'cancel' },
        { text: t.logout, style: 'destructive', onPress: async () => {
          await logout();
          router.replace('/');
        }},
      ]
    );
  };

  const handleLanguageSelect = (langCode: any) => {
    setLanguage(langCode);
    setShowLanguageSelector(false);
  };
  const styles = createStyles(theme, isMobile, isTablet);

  const renderProfileItem = (item: any, index: number) => (
    <TouchableOpacity key={index} style={[styles.profileItem, { borderBottomColor: theme.colors.borderLight }]}>
      <View style={styles.itemLeft}>
        <View style={[styles.itemIcon, { backgroundColor: `${theme.colors.primary}20` }]}>
          <item.icon size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.itemContent}>
          <Text style={[styles.itemLabel, { color: theme.colors.textPrimary }]}>
            {item.label}
          </Text>
          {item.value && !item.hasSwitch && !item.hasCustom && (
            <Text style={[styles.itemValue, { color: theme.colors.textSecondary }]}>
              {item.value}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.itemRight}>
        {item.hasSwitch && (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: theme.colors.border, true: `${theme.colors.primary}60` }}
            thumbColor={item.value ? theme.colors.primary : theme.colors.surface}
          />
        )}
        {item.hasCustom && item.customType === 'theme' && (
          <ThemeToggle size={20} />
        )}
        {item.hasCustom && item.customType === 'language' && (
          <TouchableOpacity 
            onPress={() => setShowLanguageSelector(!showLanguageSelector)}
            style={styles.languageSelector}>
            <Text style={[styles.languageText, { color: theme.colors.textSecondary }]}>
              {availableLanguages.find(l => l.code === language)?.flag} {availableLanguages.find(l => l.code === language)?.name}
            </Text>
            <ChevronRight size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
        {item.hasChevron && (
          <ChevronRight size={20} color={theme.colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderLanguageOptions = () => {
    if (!showLanguageSelector) return null;
    
    return (
      <View style={[styles.languageOptions, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {availableLanguages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageOption,
              { borderBottomColor: theme.colors.borderLight },
              language === lang.code && { backgroundColor: `${theme.colors.primary}10` }
            ]}
            onPress={() => handleLanguageSelect(lang.code)}>
            <Text style={styles.languageFlag}>{lang.flag}</Text>
            <Text style={[
              styles.languageName, 
              { color: language === lang.code ? theme.colors.primary : theme.colors.textPrimary }
            ]}>
              {lang.name}
            </Text>
            {language === lang.code && (
              <View style={[styles.selectedIndicator, { backgroundColor: theme.colors.primary }]} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollContainer contentContainerStyle={styles.scrollContent}>
        <ResponsiveContainer maxWidth={600}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              {t.profile}
            </Text>
          </View>

          {/* Profile Card */}
          <View style={[styles.profileCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.avatarText, { color: theme.colors.textInverse }]}>
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: theme.colors.secondary, borderColor: theme.colors.surface }]}>
                <Shield size={12} color={theme.colors.textInverse} />
              </View>
            </View>
            <Text style={[styles.userName, { color: theme.colors.textPrimary }]}>
              {user?.name || 'User'}
            </Text>
            <Text style={[styles.userPhone, { color: theme.colors.textSecondary }]}>
              {user?.phone || '+250 XXX XXX XXX'}
            </Text>
            <Text style={[styles.memberSince, { color: theme.colors.textTertiary }]}>
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'January 2024'}
            </Text>
          </View>

          {/* Profile Sections */}
          {profileSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                {section.title}
              </Text>
              <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                {section.items.map(renderProfileItem)}
              </View>
              {sectionIndex === 2 && renderLanguageOptions()}
            </View>
          ))}

          {/* Logout Button */}
          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.error }]} 
            onPress={handleLogout}>
            <LogOut size={20} color={theme.colors.error} />
            <Text style={[styles.logoutText, { color: theme.colors.error }]}>
              {t.logout}
            </Text>
          </TouchableOpacity>

          {/* App Version */}
          <View style={styles.appVersion}>
            <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
              SimTuma v2.1.0
            </Text>
            <Text style={[styles.buildText, { color: theme.colors.textTertiary }]}>
              Build 2024.01.15
            </Text>
          </View>
        </ResponsiveContainer>
      </ScrollContainer>
    </SafeAreaView>
  );
}

const createStyles = (theme: any, isMobile: boolean, isTablet: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    paddingVertical: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  title: {
    fontSize: isMobile ? theme.typography.fontSizes.xxl : theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
  },
  profileCard: {
    padding: isMobile ? theme.spacing.xl : theme.spacing.xxl,
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: isMobile ? 80 : 100,
    height: isMobile ? 80 : 100,
    borderRadius: isMobile ? 40 : 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: isMobile ? theme.typography.fontSizes.xxxl : 40,
    fontWeight: theme.typography.fontWeights.bold,
  },
  statusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  userName: {
    fontSize: isMobile ? theme.typography.fontSizes.xxl : theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.xs,
  },
  userPhone: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    marginBottom: theme.spacing.sm,
  },
  memberSince: {
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: isMobile ? theme.typography.fontSizes.lg : theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.md,
  },
  sectionContent: {
    borderRadius: theme.borderRadius.large,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    overflow: 'hidden',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isMobile ? theme.spacing.md : theme.spacing.lg,
    borderBottomWidth: 1,
    minHeight: 70,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: isMobile ? 40 : 48,
    height: isMobile ? 40 : 48,
    borderRadius: isMobile ? 20 : 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: theme.spacing.xs,
  },
  itemValue: {
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
  },
  itemRight: {
    alignItems: 'center',
    marginLeft: theme.spacing.md,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  languageText: {
    fontSize: theme.typography.fontSizes.sm,
  },
  languageOptions: {
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    overflow: 'hidden',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    position: 'relative',
  },
  languageFlag: {
    fontSize: 20,
    marginRight: theme.spacing.md,
  },
  languageName: {
    fontSize: theme.typography.fontSizes.base,
    flex: 1,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? theme.spacing.md : theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    gap: theme.spacing.sm,
    minHeight: 56,
  },
  logoutText: {
    fontSize: isMobile ? theme.typography.fontSizes.base : theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  appVersion: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  versionText: {
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
    marginBottom: theme.spacing.xs,
  },
  buildText: {
    fontSize: isMobile ? theme.typography.fontSizes.xs : theme.typography.fontSizes.sm,
  },
});