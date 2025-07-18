import { useState, useEffect } from 'react';
import { mtnAPI } from '@/services/mtnApi';
import { APP_CONSTANTS } from '@/constants/AppConstants';

export interface BalanceState {
  balance: number;
  isLoading: boolean;
  error: string | null;
  isHidden: boolean;
}

export const useBalance = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [balanceState, setBalanceState] = useState<BalanceState>({
    balance: 0,
    isLoading: true,
    error: null,
    isHidden: false,
  });

  const fetchBalance = async () => {
    if (!isMounted) return;
    
    try {
      setBalanceState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await mtnAPI.getBalance();
      setBalanceState(prev => ({
        ...prev,
        balance: parseFloat(response.availableBalance),
        isLoading: false,
      }));
    } catch (error) {
      setBalanceState(prev => ({
        ...prev,
        error: 'Failed to fetch balance',
        balance: 50000,
        isLoading: false,
      }));
    }
  };

  const toggleBalanceVisibility = () => {
    setBalanceState(prev => ({
      ...prev,
      isHidden: !prev.isHidden,
    }));
  };

  const refreshBalance = () => {
    fetchBalance();
  };

  useEffect(() => {
    setIsMounted(true);
    fetchBalance();
    
    return () => {
      setIsMounted(false);
    };
  }, []);

  return {
    ...balanceState,
    toggleBalanceVisibility,
    refreshBalance,
  };
};