// MTN Mobile Money API Integration Service
// Rwanda MTN Mobile Money API Integration

export interface TransactionRequest {
  phoneNumber: string;
  amount: number;
  currency: string;
  externalId: string;
  payerMessage: string;
  payeeNote: string;
}

export interface TransactionResponse {
  financialTransactionId: string;
  externalId: string;
  amount: string;
  currency: string;
  payer: {
    partyIdType: string;
    partyId: string;
  };
  payerMessage: string;
  payeeNote: string;
  status: string;
}

export interface TransactionHistoryResponse {
  transactions: TransactionResponse[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

export interface BalanceResponse {
  availableBalance: string;
  currency: string;
}

export interface BillPaymentRequest {
  billType: string;
  accountNumber: string;
  amount: number;
  currency: string;
}

class MTNMobileMoneyAPI {
  private baseUrl = 'https://sandbox.momodeveloper.mtn.com'; // MTN Rwanda API
  private environment = 'sandbox'; // Change to 'live' for production
  private subscriptionKey = process.env.EXPO_PUBLIC_MTN_RW_SUBSCRIPTION_KEY || 'your_rwanda_subscription_key';
  private apiUserId = process.env.EXPO_PUBLIC_MTN_RW_API_USER_ID || 'your_rwanda_api_user_id';
  private apiKey = process.env.EXPO_PUBLIC_MTN_RW_API_KEY || 'your_rwanda_api_key';

  // Error handling wrapper
  private async handleApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
    try {
      return await apiCall();
    } catch (error) {
      console.error('MTN API Error:', error);
      if (error instanceof Error) {
        throw new Error(`API Error: ${error.message}`);
      }
      throw new Error('Unknown API error occurred');
    }
  }

  // Generate access token
  async generateAccessToken(): Promise<string> {
    return this.handleApiCall(async () => {
      const response = await fetch(`${this.baseUrl}/collection/token/`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.apiUserId}:${this.apiKey}`)}`,
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Token generation failed: ${response.status}`);
      }

      const data = await response.json();
      return data.access_token;
    });
  }

  // Request payment from customer
  async requestToPay(request: TransactionRequest): Promise<TransactionResponse> {
    return this.handleApiCall(async () => {
      const accessToken = await this.generateAccessToken();
      
      const response = await fetch(`${this.baseUrl}/collection/v1_0/requesttopay`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Reference-Id': request.externalId,
          'X-Target-Environment': this.environment,
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: request.amount.toString(),
          currency: request.currency,
          externalId: request.externalId,
          payer: {
            partyIdType: 'MSISDN',
            partyId: request.phoneNumber,
          },
          payerMessage: request.payerMessage,
          payeeNote: request.payeeNote,
        }),
      });

      if (response.status === 202) {
        // Transaction initiated successfully
        return {
          financialTransactionId: request.externalId,
          externalId: request.externalId,
          amount: request.amount.toString(),
          currency: request.currency,
          payer: {
            partyIdType: 'MSISDN',
            partyId: request.phoneNumber,
          },
          payerMessage: request.payerMessage,
          payeeNote: request.payeeNote,
          status: 'PENDING',
        };
      } else {
        const errorData = await response.text();
        throw new Error(`Transaction failed: ${response.status} - ${errorData}`);
      }
    });
  }

  // Check transaction status
  async getTransactionStatus(transactionId: string): Promise<TransactionResponse> {
    return this.handleApiCall(async () => {
      const accessToken = await this.generateAccessToken();
      
      const response = await fetch(`${this.baseUrl}/collection/v1_0/requesttopay/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Target-Environment': this.environment,
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get transaction status: ${response.status}`);
      }

      return await response.json();
    });
  }

  // Get account balance
  async getBalance(): Promise<BalanceResponse> {
    return this.handleApiCall(async () => {
      const accessToken = await this.generateAccessToken();
      
      const response = await fetch(`${this.baseUrl}/collection/v1_0/account/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Target-Environment': this.environment,
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
        },
      });

      if (!response.ok) {
        // For demo purposes, return mock balance if API fails
        console.warn('Balance API failed, returning mock data');
        return {
          availableBalance: '125450.75',
          currency: 'RWF',
        };
      }

      return await response.json();
    });
  }

  // Get transaction history
  async getTransactionHistory(page: number = 1, pageSize: number = 20): Promise<any[]> {
    return this.handleApiCall(async () => {
      // Mock transaction history for demo
      const mockTransactions = [
        {
          id: 'txn_001',
          type: 'received',
          amount: 50000,
          currency: 'RWF',
          description: 'Payment received',
          sender: 'Jean Claude',
          timestamp: new Date('2024-01-15T10:30:00'),
          status: 'completed',
          reference: 'REF001',
        },
        {
          id: 'txn_002',
          type: 'sent',
          amount: 25000,
          currency: 'RWF',
          description: 'Money transfer',
          recipient: 'Marie Uwimana',
          timestamp: new Date('2024-01-14T15:20:00'),
          status: 'completed',
          reference: 'REF002',
        },
        {
          id: 'txn_003',
          type: 'bill_payment',
          amount: 15000,
          currency: 'RWF',
          description: 'EUCL electricity bill',
          timestamp: new Date('2024-01-13T09:15:00'),
          status: 'completed',
          reference: 'REF003',
        },
      ];

      return mockTransactions;
    });
  }

  // Pay bills (utility payments)
  async payBill(request: BillPaymentRequest): Promise<TransactionResponse> {
    return this.handleApiCall(async () => {
      const transactionId = `bill_${Date.now()}`;
      
      // For bill payments, we use the disbursement API
      const accessToken = await this.generateAccessToken();
      
      const response = await fetch(`${this.baseUrl}/disbursement/v1_0/transfer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Reference-Id': transactionId,
          'X-Target-Environment': this.environment,
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: request.amount.toString(),
          currency: request.currency,
          externalId: transactionId,
          payee: {
            partyIdType: 'MSISDN',
            partyId: request.accountNumber,
          },
          payerMessage: `${request.billType} bill payment`,
          payeeNote: `Payment for ${request.billType} account ${request.accountNumber}`,
        }),
      });

      if (response.status === 202) {
        return {
          financialTransactionId: transactionId,
          externalId: transactionId,
          amount: request.amount.toString(),
          currency: request.currency,
          payer: {
            partyIdType: 'MSISDN',
            partyId: request.accountNumber,
          },
          payerMessage: `${request.billType} bill payment`,
          payeeNote: `Payment for ${request.billType}`,
          status: 'PENDING',
        };
      } else {
        const errorData = await response.text();
        throw new Error(`Bill payment failed: ${response.status} - ${errorData}`);
      }
    });
  }

  // Validate MTN number
  async validateMTNNumber(phoneNumber: string): Promise<boolean> {
    return this.handleApiCall(async () => {
      // In real implementation, this would call MTN's number validation API
      // For now, we'll use local validation
      const rwandaMTNPrefixes = ['788', '789', '780', '781', '782', '783'];
      const cleaned = phoneNumber.replace(/\D/g, '');
      
      if (cleaned.length !== 12 || !cleaned.startsWith('250')) {
        return false;
      }
      
      const localNumber = cleaned.slice(3); // Remove country code
      const prefix = localNumber.slice(0, 3);
      
      return rwandaMTNPrefixes.includes(prefix);
    });
  }
}

export const mtnAPI = new MTNMobileMoneyAPI();