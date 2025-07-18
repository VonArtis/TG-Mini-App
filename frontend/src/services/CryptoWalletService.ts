// Real Crypto Wallet Integration Service
import { ethers } from 'ethers';

interface WalletConnection {
  type: 'metamask' | 'walletconnect' | 'trust' | 'coinbase' | 'manual';
  address: string;
  provider?: any;
  balance?: string;
  network?: string;
  name?: string;
}

interface WalletService {
  connectMetaMask(): Promise<WalletConnection>;
  // connectWalletConnect(): Promise<WalletConnection>; // Removed - handled by Reown AppKit
  connectTrustWallet(): Promise<WalletConnection>;
  connectCoinbaseWallet(): Promise<WalletConnection>;
  connectManualWallet(address: string, name?: string): Promise<WalletConnection>;
  validateAddress(address: string): boolean;
  getBalance(address: string): Promise<string>;
  signMessage(message: string, address: string): Promise<string>;
  disconnectWallet(address: string): Promise<void>;
  getConnectedWallets(): WalletConnection[];
}

class CryptoWalletService implements WalletService {
  private connectedWallets: WalletConnection[] = [];

  constructor() {
    // Load connected wallets from localStorage
    const stored = localStorage.getItem('connected_wallets');
    if (stored) {
      try {
        this.connectedWallets = JSON.parse(stored);
      } catch (error) {
        console.error('Error loading stored wallets:', error);
      }
    }
  }

  // MetaMask Integration
  async connectMetaMask(): Promise<WalletConnection> {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        throw new Error('MetaMask is not installed. Please install MetaMask extension.');
      }

      // Request account access
      const accounts = await (window.ethereum as any).request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please create an account in MetaMask.');
      }

      const address = accounts[0];
      const provider = new ethers.BrowserProvider(window.ethereum as any);

      // Get network information
      const network = await provider.getNetwork();
      
      // Get balance
      const balance = await provider.getBalance(address);
      const formattedBalance = ethers.formatEther(balance);

      const connection: WalletConnection = {
        type: 'metamask',
        address,
        provider,
        balance: formattedBalance,
        network: network.name,
        name: 'MetaMask'
      };

      // Verify ownership with signature
      await this.verifyWalletOwnership(connection);

      // Store connection
      this.addWalletConnection(connection);

      return connection;
    } catch (error: any) {
      console.error('MetaMask connection failed:', error);
      throw new Error(error.message || 'Failed to connect to MetaMask');
    }
  }

  // NOTE: WalletConnect integration now handled by Reown AppKit
  // Legacy WalletConnect method removed - use ReownAppKitService instead

  // Trust Wallet Integration (uses same interface as MetaMask on web)
  async connectTrustWallet(): Promise<WalletConnection> {
    try {
      // Trust Wallet uses the same ethereum provider interface
      if (!window.ethereum) {
        throw new Error('Trust Wallet is not detected. Please use Trust Wallet browser or install the extension.');
      }

      // Request account access
      const accounts = await (window.ethereum as any).request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in Trust Wallet.');
      }

      const address = accounts[0];
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(address);
      const formattedBalance = ethers.formatEther(balance);

      const connection: WalletConnection = {
        type: 'trust',
        address,
        provider,
        balance: formattedBalance,
        network: network.name,
        name: 'Trust Wallet'
      };

      await this.verifyWalletOwnership(connection);
      this.addWalletConnection(connection);

      return connection;
    } catch (error: any) {
      console.error('Trust Wallet connection failed:', error);
      throw new Error(error.message || 'Failed to connect to Trust Wallet');
    }
  }

  // Coinbase Wallet Integration
  async connectCoinbaseWallet(): Promise<WalletConnection> {
    try {
      // Check for Coinbase Wallet
      if (!window.ethereum || !window.ethereum.isCoinbaseWallet) {
        throw new Error('Coinbase Wallet is not detected. Please install Coinbase Wallet extension.');
      }

      const accounts = await (window.ethereum as any).request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in Coinbase Wallet.');
      }

      const address = accounts[0];
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(address);
      const formattedBalance = ethers.formatEther(balance);

      const connection: WalletConnection = {
        type: 'coinbase',
        address,
        provider,
        balance: formattedBalance,
        network: network.name,
        name: 'Coinbase Wallet'
      };

      await this.verifyWalletOwnership(connection);
      this.addWalletConnection(connection);

      return connection;
    } catch (error: any) {
      console.error('Coinbase Wallet connection failed:', error);
      throw new Error(error.message || 'Failed to connect to Coinbase Wallet');
    }
  }

  // Manual Wallet Address Input
  async connectManualWallet(address: string, name: string = 'Manual Wallet'): Promise<WalletConnection> {
    try {
      // Validate address format
      if (!this.validateAddress(address)) {
        throw new Error('Invalid Ethereum address format');
      }

      // Check if wallet already connected
      const existing = this.connectedWallets.find(w => w.address.toLowerCase() === address.toLowerCase());
      if (existing) {
        throw new Error('This wallet address is already connected');
      }

      // Get balance using a public provider (no signature verification for manual)
      let balance = '0';
      try {
        const publicProvider = new ethers.JsonRpcProvider(
          process.env.REACT_APP_RPC_URL || 'https://mainnet.infura.io/v3/demo'
        );
        const balanceWei = await publicProvider.getBalance(address);
        balance = ethers.formatEther(balanceWei);
      } catch (error) {
        console.warn('Could not fetch balance for manual wallet:', error);
      }

      const connection: WalletConnection = {
        type: 'manual',
        address,
        balance,
        network: 'mainnet',
        name: name || 'Manual Wallet'
      };

      this.addWalletConnection(connection);
      return connection;
    } catch (error: any) {
      console.error('Manual wallet connection failed:', error);
      throw new Error(error.message || 'Failed to add manual wallet');
    }
  }

  // Verify wallet ownership with signature
  private async verifyWalletOwnership(connection: WalletConnection): Promise<void> {
    if (connection.type === 'manual' || !connection.provider) {
      return; // Skip verification for manual wallets
    }

    try {
      const message = `Verify wallet ownership for VonVault - ${Date.now()}`;
      const signature = await this.signMessage(message, connection.address);
      
      // Verify signature
      const recoveredAddress = ethers.verifyMessage(message, signature);
      if (recoveredAddress.toLowerCase() !== connection.address.toLowerCase()) {
        throw new Error('Wallet verification failed - signature mismatch');
      }

      console.log('Wallet ownership verified successfully');
    } catch (error) {
      console.error('Wallet verification failed:', error);
      throw new Error('Failed to verify wallet ownership');
    }
  }

  // Validate Ethereum address
  validateAddress(address: string): boolean {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  }

  // Get wallet balance
  async getBalance(address: string): Promise<string> {
    try {
      const provider = new ethers.JsonRpcProvider(
        process.env.REACT_APP_RPC_URL || 'https://mainnet.infura.io/v3/demo'
      );
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }

  // Sign message with wallet
  async signMessage(message: string, address: string): Promise<string> {
    const connection = this.connectedWallets.find(w => w.address.toLowerCase() === address.toLowerCase());
    if (!connection || !connection.provider) {
      throw new Error('Wallet not connected or provider not available');
    }

    const signer = await connection.provider.getSigner();
    return await signer.signMessage(message);
  }

  // Add wallet connection to storage
  private addWalletConnection(connection: WalletConnection): void {
    // Remove provider before storing (not serializable)
    const storableConnection = {
      ...connection,
      provider: undefined
    };

    // Check for duplicates
    const existingIndex = this.connectedWallets.findIndex(
      w => w.address.toLowerCase() === connection.address.toLowerCase()
    );

    if (existingIndex >= 0) {
      this.connectedWallets[existingIndex] = storableConnection;
    } else {
      this.connectedWallets.push(storableConnection);
    }

    // Save to localStorage
    localStorage.setItem('connected_wallets', JSON.stringify(this.connectedWallets));
    
    // Update user status
    this.updateUserCryptoStatus();
  }

  // Update user crypto connection status
  private updateUserCryptoStatus(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        userData.crypto_connected = this.connectedWallets.length > 0;
        userData.connected_wallets_count = this.connectedWallets.length;
        userData.total_crypto_value = this.calculateTotalValue();
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
      } catch (error) {
        console.error('Error updating user crypto status:', error);
      }
    }
  }

  // Calculate total crypto value
  private calculateTotalValue(): number {
    return this.connectedWallets.reduce((total, wallet) => {
      const balance = parseFloat(wallet.balance || '0');
      // Using rough ETH price estimation - in production, fetch real prices
      return total + (balance * 3000); // Rough ETH price
    }, 0);
  }

  // Disconnect wallet
  async disconnectWallet(address: string): Promise<void> {
    this.connectedWallets = this.connectedWallets.filter(
      w => w.address.toLowerCase() !== address.toLowerCase()
    );
    
    localStorage.setItem('connected_wallets', JSON.stringify(this.connectedWallets));
    this.updateUserCryptoStatus();
  }

  // Get all connected wallets
  getConnectedWallets(): WalletConnection[] {
    return [...this.connectedWallets];
  }

  // Check if specific wallet type is available
  isWalletAvailable(type: WalletConnection['type']): boolean {
    switch (type) {
      case 'metamask':
        return !!(window.ethereum && window.ethereum.isMetaMask);
      case 'trust':
        return !!(window.ethereum && window.ethereum.isTrust);
      case 'coinbase':
        return !!(window.ethereum && window.ethereum.isCoinbaseWallet);
      case 'walletconnect':
        return true; // WalletConnect works everywhere
      case 'manual':
        return true; // Manual input always available
      default:
        return false;
    }
  }
}

// Global wallet service instance
export const cryptoWalletService = new CryptoWalletService();
export type { WalletConnection, WalletService };