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

  // Mock transaction data with realistic Rwanda context
  const mockTransactions: Transaction[] = [
    {
      id: 'txn_001',
      type: 'received',
      amount: 50000,
      currency: 'RWF',
      description: 'Amafaranga yakiriye (Payment received)',
      sender: 'Jean Claude Uwimana',
      timestamp: new Date('2024-01-15T10:30:00'),
      status: 'completed',
      reference: 'REF001',
    },
    {
      id: 'txn_002',
      type: 'sent',
      amount: 25000,
      currency: 'RWF',
      description: 'Kohereza amafaranga (Money transfer)',
      recipient: 'Marie Mukamana',
      timestamp: new Date('2024-01-14T15:20:00'),
      status: 'completed',
      reference: 'REF002',
    },
    {
      id: 'txn_003',
      type: 'bill_payment',
      amount: 15000,
      currency: 'RWF',
      description: 'Fagitire ya EUCL (EUCL electricity bill)',
      timestamp: new Date('2024-01-13T09:15:00'),
      status: 'completed',
      reference: 'REF003',
    },
    {
      id: 'txn_004',
      type: 'received',
      amount: 75000,
      currency: 'RWF',
      description: 'Mushahara (Salary payment)',
      sender: 'Rwanda Development Bank',
      timestamp: new Date('2024-01-12T14:00:00'),
      status: 'completed',
      reference: 'REF004',
    },
    {
      id: 'txn_005',
      type: 'bill_payment',
      amount: 8500,
      currency: 'RWF',
      description: 'Fagitire ya WASAC (WASAC water bill)',
      timestamp: new Date('2024-01-11T11:30:00'),
      status: 'completed',
      reference: 'REF005',
    },
  ];

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTransactions(mockTransactions);
    } catch (err) {
      setError('Ikibazo cyo gukuramo ibikorwa (Failed to fetch transactions)');
      setTransactions(mockTransactions); // Fallback to mock data
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTransactions = async () => {
    await fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    isLoading,
    error,
    refreshTransactions,
  };
};