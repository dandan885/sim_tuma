import { Tabs } from 'expo-router';
import { Wallet, Send, MessageCircle, Receipt, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: APP_CONSTANTS.COLORS.PRIMARY,
        tabBarInactiveTintColor: APP_CONSTANTS.COLORS.TEXT_TERTIARY,
        tabBarStyle: {
          backgroundColor: APP_CONSTANTS.COLORS.SURFACE,
          borderTopWidth: 1,
          borderTopColor: APP_CONSTANTS.COLORS.BORDER,
          paddingBottom: APP_CONSTANTS.DESIGN.SPACING.SM,
          paddingTop: APP_CONSTANTS.DESIGN.SPACING.SM,
          height: 60,
          ...APP_CONSTANTS.DESIGN.SHADOWS.SMALL,
        },
        tabBarLabelStyle: {
          fontSize: APP_CONSTANTS.TYPOGRAPHY.FONT_SIZES.XS,
          fontWeight: APP_CONSTANTS.TYPOGRAPHY.FONT_WEIGHTS.MEDIUM,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Amafaranga',
          tabBarIcon: ({ size, color }) => (
            <Wallet size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transfer"
        options={{
          title: 'Kohereza',
          tabBarIcon: ({ size, color }) => (
            <Send size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Ubutumwa',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bills"
        options={{
          title: 'Fagitire',
          tabBarIcon: ({ size, color }) => (
            <Receipt size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Umwirondoro',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}