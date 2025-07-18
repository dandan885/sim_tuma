import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
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
} from 'lucide-react-native';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const userInfo = {
    name: 'Alex Uwimana',
    phone: '+250 788 123 456',
    email: 'alex.uwimana@email.com',
    accountStatus: 'Verified',
    memberSince: 'January 2023',
  };

  const profileSections = [
    {
      title: 'Account Information',
      items: [
        { icon: User, label: 'Personal Details', value: userInfo.name },
        { icon: Phone, label: 'Phone Number', value: userInfo.phone },
        { icon: Mail, label: 'Email Address', value: userInfo.email },
        { icon: Shield, label: 'Account Status', value: userInfo.accountStatus },
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
        { icon: Bell, label: 'Notifications', hasSwitch: true, value: notificationsEnabled, onToggle: setNotificationsEnabled },
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
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          Alert.alert('Success', 'You have been logged out successfully');
        }},
      ]
    );
  };

  const renderProfileItem = (item, index) => (
    <TouchableOpacity key={index} style={styles.profileItem}>
      <View style={styles.itemLeft}>
        <View style={styles.itemIcon}>
          <item.icon size={20} color="#6C63FF" />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemLabel}>{item.label}</Text>
          {item.value && !item.hasSwitch && (
            <Text style={styles.itemValue}>{item.value}</Text>
          )}
        </View>
      </View>
      <View style={styles.itemRight}>
        {item.hasSwitch && (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: '#e5e5e5', true: '#FFD166' }}
            thumbColor={item.value ? '#6C63FF' : '#FAFAFA'}
          />
        )}
        {item.hasChevron && (
          <ChevronRight size={20} color="#666" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AM</Text>
            </View>
            <View style={styles.statusBadge}>
              <Shield size={12} color="#fff" />
            </View>
          </View>
          <Text style={styles.userName}>{userInfo.name}</Text>
          <Text style={styles.userPhone}>{userInfo.phone}</Text>
          <Text style={styles.memberSince}>Member since {userInfo.memberSince}</Text>
        </View>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderProfileItem)}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.appVersion}>
          <Text style={styles.versionText}>MTN Mobile Money v2.1.0</Text>
          <Text style={styles.buildText}>Build 2024.01.15</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2F2F2F',
  },
  profileCard: {
    backgroundColor: '#FAFAFA',
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00C896',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FAFAFA',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F2F2F',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#FAFAFA',
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6C63FF20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2F2F2F',
    marginBottom: 2,
  },
  itemValue: {
    fontSize: 14,
    color: '#666',
  },
  itemRight: {
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  appVersion: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  versionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  buildText: {
    fontSize: 12,
    color: '#999',
  },
});