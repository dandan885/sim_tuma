import { useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'bill_payment';
  amount: number;
  sender?: string;
  recipient?: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  description?: string;
}

export function useTransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'received',
      amount: 15000,
      sender: 'John Smith',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      status: 'completed',
      description: 'Payment received'
    },
    {
      id: '2',
      type: 'bill_payment',
      amount: 8500,
      recipient: 'EUCL',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      status: 'completed',
      description: 'Electricity bill'
    },
    {
      id: '3',
      type: 'received',
      amount: 25000,
      sender: 'Sarah Johnson',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Financial support'
    },
    {
      id: '4',
      type: 'bill_payment',
      amount: 12000,
      recipient: 'WASAC',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Water bill'
    },
    {
      id: '5',
      type: 'received',
      amount: 50000,
      sender: 'Michael Brown',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Business payment'
    },
    {
      id: '6',
      type: 'sent',
      amount: 5000,
      recipient: 'David Wilson',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Money transfer'
    },
    {
      id: '7',
      type: 'received',
      amount: 30000,
      sender: 'Emma Davis',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Family support'
    },
    {
      id: '8',
      type: 'sent',
      amount: 18000,
      recipient: 'Local Store',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Shopping'
    }
  ];

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTransactions(mockTransactions);
    } catch (err) {
      setError('Unable to load transaction history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const refreshTransactions = () => fetchTransactions();

  return {
    transactions,
    isLoading,
    error,
    refreshTransactions
  };
}