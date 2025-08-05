import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, pin: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (phone: string, name: string) => Promise<boolean>;
  verifyPhone: (phone: string, otp: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user_data');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser({
          ...userData,
          createdAt: new Date(userData.createdAt),
        });
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = async (userData: User) => {
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const login = async (phone: string, pin: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication - in real app, this would call your API
      if (pin === '1234' || pin === '0000') {
        const userData: User = {
          id: 'user_' + Date.now(),
          name: 'Alex Uwimana',
          phone: phone,
          email: 'alex.uwimana@email.com',
          avatar: 'AU',
          isVerified: true,
          createdAt: new Date(),
        };
        
        setUser(userData);
        await saveUserData(userData);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (phone: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const userData: User = {
        id: 'user_' + Date.now(),
        name: name,
        phone: phone,
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase(),
        isVerified: false,
        createdAt: new Date(),
      };
      
      setUser(userData);
      await saveUserData(userData);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPhone = async (phone: string, otp: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock OTP verification
      if (otp === '123456' || otp === '000000') {
        if (user) {
          const updatedUser = { ...user, isVerified: true };
          setUser(updatedUser);
          await saveUserData(updatedUser);
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Phone verification error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem('user_data');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        verifyPhone,
      }}>
      {children}
    </AuthContext.Provider>
  );
};