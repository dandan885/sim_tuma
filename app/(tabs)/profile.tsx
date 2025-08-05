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
} from 'lucide-react-native';
import { ScrollContainer } from '@/components/ui/ScrollContainer';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';

export default function ProfileScreen() {
  const { theme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const { isMobile, isTablet } = useResponsive();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const profileSections = [
    {
      title: 'Amakuru ya Konti (Account Information)',
      items: [
        { icon: User, label: 'Amakuru Bwite (Personal Details)', labelEn: 'Personal Details', value: userInfo.name },
        { icon: Phone, label: 'Nomero ya Telefoni (Phone Number)', labelEn: 'Phone Number', value: user?.phone },
        { icon: Mail, label: 'Aderesi ya Email (Email Address)', labelEn: 'Email Address', value: user?.email || 'Ntabwo yasobanuwe (Not provided)' },
        { icon: Shield, label: 'Uko Konti imeze (Account Status)', labelEn: 'Account Status', value: user?.isVerified ? 'Byemejwe (Verified)' : 'Bitaremezwa (Unverified)' },
      ],
    },
    {
      title: 'Igenamiterere rya Umutekano (Security Settings)',
      items: [
        { icon: Lock, label: 'Hindura PIN (Change PIN)', labelEn: 'Change PIN', hasChevron: true },
        { icon: Smartphone, label: 'Kwinjira na Biometric (Biometric Login)', labelEn: 'Biometric Login', hasSwitch: true, value: biometricsEnabled, onToggle: setBiometricsEnabled },
        { icon: Shield, label: 'Umutekano wa Kabiri (Two-Factor Auth)', labelEn: 'Two-Factor Auth', hasSwitch: true, value: twoFactorEnabled, onToggle: setTwoFactorEnabled },
        { icon: Eye, label: 'Igenamiterere rya Bwite (Privacy Settings)', labelEn: 'Privacy Settings', hasChevron: true },
      ],
    },
    {
      title: 'Ibyo Uhitamo (Preferences)',
      items: [
        { icon: Bell, label: 'Ubutumwa (Notifications)', labelEn: 'Notifications', hasSwitch: true, value: notificationsEnabled, onToggle: setNotificationsEnabled },
        { icon: isDark ? Moon : Sun, label: 'Imiterere (Theme)', labelEn: 'Theme', hasCustom: true },
        { icon: CreditCard, label: 'Uburyo bwo Kwishyura (Payment Methods)', labelEn: 'Payment Methods', hasChevron: true },
        { icon: Settings, label: 'Igenamiterere rya Porogaramu (App Settings)', labelEn: 'App Settings', hasChevron: true },
      ],
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Gusohoka (Logout)',
      'Urashaka gusohoka kuri konti yawe? (Are you sure you want to logout?)',
      [
        { text: 'Hagarika (Cancel)', style: 'cancel' },
        { text: 'Sohoka (Logout)', style: 'destructive', onPress: async () => {
          await logout();
          router.replace('/');
        }},
      ]
    );
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
          <Text style={[styles.itemLabelEn, { color: theme.colors.textSecondary }]}>
            {item.labelEn}
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
        {item.hasCustom && item.label.includes('Imiterere') && (
          <ThemeToggle size={20} />
        )}
        {item.hasChevron && (
          <ChevronRight size={20} color={theme.colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollContainer contentContainerStyle={styles.scrollContent}>
        <ResponsiveContainer maxWidth={600}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              Umwirondoro (Profile)
            </Text>
          </View>

          {/* Profile Card */}
          <View style={[styles.profileCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.avatarText, { color: theme.colors.textInverse }]}>AU</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: theme.colors.secondary, borderColor: theme.colors.surface }]}>
                <Shield size={12} color={theme.colors.textInverse} />
              </View>
            </View>
            <Text style={[styles.userName, { color: theme.colors.textPrimary }]}>
              {user?.name || 'Umukoresha (User)'}
            </Text>
            <Text style={[styles.userPhone, { color: theme.colors.textSecondary }]}>
              {user?.phone || '+250 XXX XXX XXX'}
            </Text>
            <Text style={[styles.memberSince, { color: theme.colors.textTertiary }]}>
              Umunyamuryango kuva {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('rw-RW', { year: 'numeric', month: 'long' }) : 'Mutarama 2024'}
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
            </View>
          ))}

          {/* Logout Button */}
          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.error }]} 
            onPress={handleLogout}>
            <LogOut size={20} color={theme.colors.error} />
            <Text style={[styles.logoutText, { color: theme.colors.error }]}>
              Sohoka (Logout)
            </Text>
          </TouchableOpacity>

          {/* App Version */}
          <View style={styles.appVersion}>
            <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
              SimTuma Rwanda v2.1.0
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
  itemLabelEn: {
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
    fontStyle: 'italic',
    marginBottom: theme.spacing.xs,
  },
  itemValue: {
    fontSize: isMobile ? theme.typography.fontSizes.sm : theme.typography.fontSizes.base,
  },
  itemRight: {
    alignItems: 'center',
    marginLeft: theme.spacing.md,
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