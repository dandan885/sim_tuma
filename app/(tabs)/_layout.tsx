import { Tabs } from 'expo-router';
import { Wallet, Send, MessageCircle, Receipt, User } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textTertiary,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            paddingBottom: theme.spacing.sm,
            paddingTop: theme.spacing.sm,
            height: 60,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          },
          tabBarLabelStyle: {
            fontSize: theme.typography.fontSizes.xs,
            fontWeight: theme.typography.fontWeights.medium,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Amafaranga (Wallet)',
            tabBarIcon: ({ size, color }) => (
              <Wallet size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="transfer"
          options={{
            title: 'Kohereza (Send)',
            tabBarIcon: ({ size, color }) => (
              <Send size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Ubutumwa (Chat)',
            tabBarIcon: ({ size, color }) => (
              <MessageCircle size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="bills"
          options={{
            title: 'Fagitire (Bills)',
            tabBarIcon: ({ size, color }) => (
              <Receipt size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Umwirondoro (Profile)',
            tabBarIcon: ({ size, color }) => (
              <User size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}