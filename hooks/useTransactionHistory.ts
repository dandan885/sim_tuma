import { useState, useEffect } from 'react';
import { mtnAPI } from '@/services/mtnApi';

export interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'bill_payment';
  amount: number;
  currency: string;
  description: string;
  recipient?: string;
  sender?: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

export const useTransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const fetchTransactions = async () => {
    if (!isMounted) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      if (isMounted) {
        setTransactions(transactionData);
      }
      const response = await mtnAPI.getTransactionHistory();
      setTransactions(response);
    } catch (err) {
      if (isMounted) {
        setError('Failed to fetch transactions');
        // Fallback data
        setTransactions([
          {
            id: '1',
            type: 'received',
            amount: 15000,
            recipient: 'Jean Claude',
            date: new Date().toISOString(),
            status: 'completed'
          },
          {
            id: '2',
            type: 'sent',
            amount: 8500,
            recipient: 'Marie Uwimana',
            date: new Date(Date.now() - 86400000).toISOString(),
            status: 'completed'
          }
        ]);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setIsMounted(true);
    
    return () => {
      setIsMounted(false);
    };
  }, []);

  return {
    transactions,
    isLoading,
    error,
    fetchTransactions
  };
};