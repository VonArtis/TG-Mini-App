import axios from 'axios';
import { secureStorage } from '../utils/secureStorage';
import type { 
  Investment, 
  InvestmentPlan,
  InvestmentPlansResponse,
  InvestmentsResponse,
  MembershipStatus,
  MembershipTiersResponse
} from '../types';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Input validation utilities
class InputValidator {
  static sanitizeString(input: string): string {
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/[<>]/g, '');
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) errors.push('Password must be at least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letter'); 
    if (!/[0-9]/.test(password)) errors.push('Password must contain a number');
    if (!/[!@#$%^&*]/.test(password)) errors.push('Password must contain special character');
    
    return { valid: errors.length === 0, errors };
  }
}

class ApiService {
  private getAuthHeaders(token?: string) {
    const authToken = token || secureStorage.getToken();
    return {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    };
  }

  // Enhanced error handling
  // Enhanced error handling
  private handleApiError(error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred');
  }

  // Generic API request method for admin endpoints
  async makeRequest(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, data?: any, token?: string) {
    try {
      const config = {
        method: method.toLowerCase(),
        url: `${API_BASE}${endpoint}`,
        headers: this.getAuthHeaders(token),
        ...(data && { data })
      };

      const response = await axios(config);
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  // Authentication
  async telegramAuth(userData: any) {
    const response = await axios.post(`${API_BASE}/auth/telegram`, userData);
    return response.data;
  }

  async telegramWebAppAuth(data: { initData: string }) {
    const response = await axios.post(`${API_BASE}/auth/telegram/webapp`, data);
    return response.data;
  }

  // Membership
  async getMembershipStatus(token: string): Promise<MembershipStatus> {
    const response = await axios.get(`${API_BASE}/membership/status`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async getMembershipTiers(): Promise<MembershipTiersResponse> {
    const response = await axios.get(`${API_BASE}/membership/tiers`);
    return response.data;
  }

  // Investment Plans
  async getInvestmentPlans(token: string): Promise<InvestmentPlansResponse> {
    const response = await axios.get(`${API_BASE}/investment-plans`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async getAllInvestmentPlans(): Promise<{ plans: InvestmentPlan[] }> {
    const response = await axios.get(`${API_BASE}/investment-plans/all`);
    return response.data;
  }

  async createInvestmentPlan(planData: any, token: string) {
    const response = await axios.post(`${API_BASE}/investment-plans`, planData, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async updateInvestmentPlan(planId: string, planData: any, token: string) {
    const response = await axios.put(`${API_BASE}/investment-plans/${planId}`, planData, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async deleteInvestmentPlan(planId: string, token: string) {
    const response = await axios.delete(`${API_BASE}/investment-plans/${planId}`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Investments
  async getInvestments(token: string): Promise<InvestmentsResponse> {
    const response = await axios.get(`${API_BASE}/investments`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async createInvestment(investment: Omit<Investment, 'id' | 'user_id' | 'created_at' | 'status'>, token: string) {
    const response = await axios.post(`${API_BASE}/investments`, investment, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Crypto & Wallet
  async verifyWalletSignature(payload: { message: string; signature: string; address: string }) {
    const response = await axios.post(`${API_BASE}/wallet/verify-signature`, payload);
    return response.data;
  }

  async getCryptoBalance(address: string) {
    const response = await axios.get(`${API_BASE}/wallet/balance/${address}`);
    return response.data;
  }

  // Enhanced Crypto Methods
  async getCryptoDepositAddresses(token: string) {
    const response = await axios.get(`${API_BASE}/crypto/deposit-addresses`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async getAllCryptoBalances(token: string) {
    const response = await axios.get(`${API_BASE}/crypto/balances`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async getCryptoTransactions(token: string) {
    const response = await axios.get(`${API_BASE}/crypto/transactions`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async monitorCryptoDeposits(token: string) {
    const response = await axios.post(`${API_BASE}/crypto/monitor-deposits`, {}, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async getUserCryptoBalance(userAddress: string, token: string) {
    const response = await axios.get(`${API_BASE}/crypto/user-balance/${userAddress}`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Bank
  async getBankAccounts(userId: string) {
    const response = await axios.get(`${API_BASE}/bank/accounts`, {
      headers: { 'X-User-ID': userId }
    });
    return response.data;
  }

  async getBankBalance(userId: string) {
    const response = await axios.get(`${API_BASE}/bank/balance`, {
      headers: { 'X-User-ID': userId }
    });
    return response.data;
  }

  // Portfolio
  async getPortfolio(token: string) {
    const response = await axios.get(`${API_BASE}/portfolio`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Crypto Prices
  async getCryptoPrices() {
    const response = await axios.get(`${API_BASE}/prices`);
    return response.data;
  }

  // Profile
  async saveProfile(preferences: any, token: string) {
    const response = await axios.post(`${API_BASE}/profile`, preferences, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  async getProfile(userId: string, token: string) {
    const response = await axios.get(`${API_BASE}/profile/${userId}`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // === PHASE 2: MULTI-WALLET API METHODS (EXACT SPECIFICATION) ===

  // Get all user wallets
  async getUserWallets(token: string) {
    const response = await axios.get(`${API_BASE}/wallets`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Connect new wallet
  async connectWallet(token: string, walletData: {
    type: string;
    address: string;
    name?: string;
    networks: string[];
  }) {
    const response = await axios.post(`${API_BASE}/wallets/connect`, null, {
      headers: this.getAuthHeaders(token),
      params: walletData
    });
    return response.data;
  }

  // Update wallet (rename)
  async updateWallet(token: string, walletId: string, updateData: { name?: string }) {
    const response = await axios.put(`${API_BASE}/wallets/${walletId}`, null, {
      headers: this.getAuthHeaders(token),
      params: updateData
    });
    return response.data;
  }

  // Remove wallet
  async removeWallet(token: string, walletId: string) {
    const response = await axios.delete(`${API_BASE}/wallets/${walletId}`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Set primary wallet
  async setPrimaryWallet(token: string, walletId: string) {
    const response = await axios.post(`${API_BASE}/wallets/${walletId}/primary`, null, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Get deposit addresses for specific wallet
  async getWalletDepositAddresses(token: string, walletId: string) {
    const response = await axios.get(`${API_BASE}/crypto/deposit-addresses/${walletId}`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Get balance for specific wallet
  async getWalletBalance(token: string, walletId: string) {
    const response = await axios.get(`${API_BASE}/crypto/balances/${walletId}`, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Create transaction from specific wallet
  async createWalletTransaction(token: string, walletId: string, transactionData: any) {
    const response = await axios.post(`${API_BASE}/crypto/transactions/${walletId}`, transactionData, {
      headers: this.getAuthHeaders(token)
    });
    return response.data;
  }

  // Profile Management
  async deleteProfile(password: string) {
    // Validate password input
    if (!password || password.trim().length === 0) {
      throw new Error('Password is required for profile deletion');
    }
    
    // Sanitize password input
    const sanitizedPassword = InputValidator.sanitizeString(password);
    
    try {
      // Use POST method with /api/account/delete path to avoid conflicts
      const response = await axios.post(`${API_BASE}/account/delete`, 
        { password: sanitizedPassword },
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      console.error('Profile deletion failed:', error);
      this.handleApiError(error);
      throw error;
    }
  }

  // === 2FA API Methods ===
  
  // SMS 2FA Methods
  async sendSMS2FA(phoneNumber: string) {
    const response = await axios.post(`${API_BASE}/auth/sms/send`, 
      { phone_number: phoneNumber },
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async verifySMS2FA(phoneNumber: string, code: string) {
    const response = await axios.post(`${API_BASE}/auth/sms/verify`,
      { phone_number: phoneNumber, code: code },
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async setupSMS2FA(phoneNumber: string) {
    const response = await axios.post(`${API_BASE}/auth/sms/setup`,
      { phone_number: phoneNumber },
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  // TOTP/Authenticator 2FA Methods
  async setupTOTP2FA() {
    const response = await axios.post(`${API_BASE}/auth/totp/setup`, {}, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async verifyTOTP2FA(code: string) {
    const response = await axios.post(`${API_BASE}/auth/totp/verify`,
      { code: code },
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  // Email 2FA Methods
  async sendEmail2FA(email: string) {
    const response = await axios.post(`${API_BASE}/auth/email/send`, 
      { email: email },
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async verifyEmail2FA(email: string, code: string) {
    const response = await axios.post(`${API_BASE}/auth/email/verify`,
      { email: email, code: code },
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async setupEmail2FA(email: string) {
    const response = await axios.post(`${API_BASE}/auth/email/setup`,
      { email: email },
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }
}

export const apiService = new ApiService();