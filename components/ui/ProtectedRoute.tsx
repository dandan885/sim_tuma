import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { LoadingState } from './LoadingState';
import { Button } from './Button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();
  const { isMobile } = useResponsive();

  if (isLoading) {
    return <LoadingState message="Gukuramo amakuru... (Loading data...)" />;
  }

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.content, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Kwinjira Bikenewe (Authentication Required)
          </Text>
          <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
            Ugomba kwinjira kugira ngo ubone ibi bikurikira (You need to sign in to access this content)
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Injira (Sign In)"
              onPress={() => router.push('/auth/login')}
              variant="primary"
              size={isMobile ? 'medium' : 'large'}
              fullWidth
              style={styles.signInButton}
            />
            
            <Button
              title="Iyandikishe (Sign Up)"
              onPress={() => router.push('/auth/phone-verification')}
              variant="outline"
              size={isMobile ? 'medium' : 'large'}
              fullWidth
            />
          </View>
        </View>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  signInButton: {
    marginBottom: 8,
  },
});