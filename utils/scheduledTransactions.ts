// Scheduled transactions management utility

export interface ScheduledTransaction {
  id: string;
  type: 'transfer' | 'bill_payment';
  recipientPhone?: string;
  recipientName?: string;
  billType?: string;
  accountNumber?: string;
  amount: number;
  currency: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextExecutionDate: Date;
  isActive: boolean;
  description: string;
  createdAt: Date;
  lastExecuted?: Date;
  executionHistory: TransactionExecution[];
}

export interface TransactionExecution {
  id: string;
  scheduledTransactionId: string;
  executedAt: Date;
  status: 'success' | 'failed' | 'pending';
  errorMessage?: string;
  transactionId?: string;
}

class ScheduledTransactionManager {
  private scheduledTransactions: ScheduledTransaction[] = [];
  private executionInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.loadScheduledTransactions();
    this.startExecutionTimer();
  }

  // Load scheduled transactions from storage
  private loadScheduledTransactions(): void {
    // In real implementation, this would load from AsyncStorage or database
    const mockTransactions: ScheduledTransaction[] = [
      {
        id: 'sched_1',
        type: 'bill_payment',
        billType: 'electricity',
        accountNumber: '1234567890',
        amount: 85000,
        currency: 'UGX',
        frequency: 'monthly',
        nextExecutionDate: new Date('2024-01-25T09:00:00'),
        isActive: true,
        description: 'Monthly electricity bill payment',
        createdAt: new Date('2024-01-01T10:00:00'),
        executionHistory: [],
      },
      {
        id: 'sched_2',
        type: 'transfer',
        recipientPhone: '+256 702 345 678',
        recipientName: 'John Doe',
        amount: 50000,
        currency: 'UGX',
        frequency: 'weekly',
        nextExecutionDate: new Date('2024-01-22T08:00:00'),
        isActive: true,
        description: 'Weekly allowance for John',
        createdAt: new Date('2024-01-01T10:00:00'),
        executionHistory: [],
      },
    ];

    this.scheduledTransactions = mockTransactions;
  }

  // Save scheduled transactions to storage
  private async saveScheduledTransactions(): Promise<void> {
    // In real implementation, this would save to AsyncStorage or database
    console.log('Saving scheduled transactions:', this.scheduledTransactions);
  }

  // Create new scheduled transaction
  async createScheduledTransaction(
    transaction: Omit<ScheduledTransaction, 'id' | 'createdAt' | 'executionHistory'>
  ): Promise<ScheduledTransaction> {
    const newTransaction: ScheduledTransaction = {
      ...transaction,
      id: `sched_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      executionHistory: [],
    };

    this.scheduledTransactions.push(newTransaction);
    await this.saveScheduledTransactions();

    return newTransaction;
  }

  // Get all scheduled transactions
  getScheduledTransactions(): ScheduledTransaction[] {
    return this.scheduledTransactions;
  }

  // Get active scheduled transactions
  getActiveScheduledTransactions(): ScheduledTransaction[] {
    return this.scheduledTransactions.filter(t => t.isActive);
  }

  // Update scheduled transaction
  async updateScheduledTransaction(
    id: string,
    updates: Partial<ScheduledTransaction>
  ): Promise<ScheduledTransaction | null> {
    const index = this.scheduledTransactions.findIndex(t => t.id === id);
    if (index === -1) return null;

    this.scheduledTransactions[index] = {
      ...this.scheduledTransactions[index],
      ...updates,
    };

    await this.saveScheduledTransactions();
    return this.scheduledTransactions[index];
  }

  // Delete scheduled transaction
  async deleteScheduledTransaction(id: string): Promise<boolean> {
    const index = this.scheduledTransactions.findIndex(t => t.id === id);
    if (index === -1) return false;

    this.scheduledTransactions.splice(index, 1);
    await this.saveScheduledTransactions();
    return true;
  }

  // Calculate next execution date based on frequency
  private calculateNextExecutionDate(
    currentDate: Date,
    frequency: ScheduledTransaction['frequency']
  ): Date {
    const nextDate = new Date(currentDate);

    switch (frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }

    return nextDate;
  }

  // Execute scheduled transaction
  private async executeScheduledTransaction(
    transaction: ScheduledTransaction
  ): Promise<TransactionExecution> {
    const execution: TransactionExecution = {
      id: `exec_${Date.now()}`,
      scheduledTransactionId: transaction.id,
      executedAt: new Date(),
      status: 'pending',
    };

    try {
      // Simulate transaction execution
      if (transaction.type === 'transfer') {
        // Execute money transfer
        console.log(`Executing transfer: UGX ${transaction.amount} to ${transaction.recipientName}`);
        
        // In real implementation, this would call MTN API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        execution.status = 'success';
        execution.transactionId = `txn_${Date.now()}`;
        
      } else if (transaction.type === 'bill_payment') {
        // Execute bill payment
        console.log(`Executing bill payment: ${transaction.billType} - UGX ${transaction.amount}`);
        
        // In real implementation, this would call bill payment API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        execution.status = 'success';
        execution.transactionId = `bill_${Date.now()}`;
      }

      // Update transaction execution history
      transaction.executionHistory.push(execution);
      transaction.lastExecuted = execution.executedAt;
      transaction.nextExecutionDate = this.calculateNextExecutionDate(
        execution.executedAt,
        transaction.frequency
      );

      await this.saveScheduledTransactions();
      
    } catch (error) {
      execution.status = 'failed';
      execution.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      transaction.executionHistory.push(execution);
      await this.saveScheduledTransactions();
    }

    return execution;
  }

  // Start execution timer
  private startExecutionTimer(): void {
    // Check for scheduled transactions every minute
    this.executionInterval = setInterval(() => {
      this.checkAndExecuteScheduledTransactions();
    }, 60 * 1000);
  }

  // Stop execution timer
  stopExecutionTimer(): void {
    if (this.executionInterval) {
      clearInterval(this.executionInterval);
      this.executionInterval = null;
    }
  }

  // Check and execute due transactions
  private async checkAndExecuteScheduledTransactions(): Promise<void> {
    const now = new Date();
    const dueTransactions = this.scheduledTransactions.filter(
      transaction =>
        transaction.isActive &&
        transaction.nextExecutionDate <= now
    );

    for (const transaction of dueTransactions) {
      try {
        await this.executeScheduledTransaction(transaction);
        console.log(`Executed scheduled transaction: ${transaction.description}`);
      } catch (error) {
        console.error(`Failed to execute scheduled transaction ${transaction.id}:`, error);
      }
    }
  }

  // Get upcoming transactions (next 7 days)
  getUpcomingTransactions(): ScheduledTransaction[] {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    return this.scheduledTransactions.filter(
      transaction =>
        transaction.isActive &&
        transaction.nextExecutionDate <= sevenDaysFromNow
    );
  }

  // Get transaction execution history
  getExecutionHistory(transactionId?: string): TransactionExecution[] {
    if (transactionId) {
      const transaction = this.scheduledTransactions.find(t => t.id === transactionId);
      return transaction ? transaction.executionHistory : [];
    }

    // Return all execution history
    return this.scheduledTransactions.flatMap(t => t.executionHistory);
  }
}

export const scheduledTransactionManager = new ScheduledTransactionManager();