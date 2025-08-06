import { useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  sender?: string;
  recipient?: string;
  timestamp: string;
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
      sender: 'Jean Baptiste Uwimana',
      timestamp: '2 min ago',
      status: 'completed',
      description: 'Kwishyura / Payment received'
    },
    {
      id: '2',
      type: 'sent',
      amount: 8500,
      recipient: 'EUCL',
      timestamp: '1 hour ago',
      status: 'completed',
      description: 'Amashanyarazi / Electricity bill'
    },
    {
      id: '3',
      type: 'received',
      amount: 25000,
      sender: 'Marie Claire Mukamana',
      timestamp: '3 hours ago',
      status: 'completed',
      description: 'Ubufasha / Financial support'
    },
    {
      id: '4',
      type: 'sent',
      amount: 12000,
      recipient: 'WASAC',
      timestamp: '1 day ago',
      status: 'completed',
      description: 'Amazi / Water bill'
    },
    {
      id: '5',
      type: 'received',
      amount: 50000,
      sender: 'Emmanuel Nkurunziza',
      timestamp: '2 days ago',
      status: 'completed',
      description: 'Ubucuruzi / Business payment'
    },
    {
      id: '6',
      type: 'sent',
      amount: 5000,
      recipient: 'Airtel Rwanda',
      timestamp: '3 days ago',
      status: 'completed',
      description: 'Airtime / Phone credit'
    },
    {
      id: '7',
      type: 'received',
      amount: 30000,
      sender: 'Grace Uwimana',
      timestamp: '1 week ago',
      status: 'completed',
      description: 'Umuryango / Family support'
    },
    {
      id: '8',
      type: 'sent',
      amount: 18000,
      recipient: 'Inyama n\'Amaru Store',
      timestamp: '1 week ago',
      status: 'completed',
      description: 'Kugura / Shopping'
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
      setError('Ntitwashoboye gushakisha amateka / Unable to load transaction history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const refetch = () => fetchTransactions();

  return {
    transactions,
    isLoading,
    error,
    refetch
  };
}