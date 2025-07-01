// Simplified Crypto Wallet Service - Immediate Fix for Production
import { ethers } from 'ethers';

// Interface for wallet connections
export interface Web3ModalConnection {
  address: string
  chainId: number
  provider: any
  isConnected: boolean
  walletInfo?: {
    name: string
    icon: string
  }
}

class SimpleWalletService {
  private connection: Web3ModalConnection | null = null
  private connectedWallets: Web3ModalConnection[] = []

  constructor() {
    this.loadStoredConnections()
  }

  // Simple MetaMask connection (primary wallet)
  async connectWallet(): Promise<Web3ModalConnection> {
    try {
      // Check if MetaMask is available
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or another Web3 wallet')
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please create an account in your wallet.')
      }

      const address = accounts[0]
      const provider = new ethers.BrowserProvider(window.ethereum)

      // Get network information
      const network = await provider.getNetwork()
      
      // Get balance
      const balance = await provider.getBalance(address)
      const formattedBalance = ethers.formatEther(balance)

      const connection: Web3ModalConnection = {
        address,
        chainId: Number(network.chainId),
        provider,
        isConnected: true,
        walletInfo: {
          name: 'Connected Wallet',
          icon: '🦊'
        }
      }

      this.connection = connection
      this.addWalletConnection(connection)
      this.updateUserCryptoStatus()

      return connection
    } catch (error: any) {
      console.error('Wallet connection failed:', error)
      throw new Error(error.message || 'Failed to connect wallet')
    }
  }

  // Manual wallet connection
  async addManualWallet(address: string, name: string = 'Manual Wallet'): Promise<Web3ModalConnection> {
    try {
      // Validate address format
      if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
        throw new Error('Invalid Ethereum address format')
      }

      // Check if wallet already exists
      const existing = this.connectedWallets.find(
        w => w.address.toLowerCase() === address.toLowerCase()
      )
      if (existing) {
        throw new Error('This wallet address is already connected')
      }

      const manualConnection: Web3ModalConnection = {
        address,
        chainId: 1, // Default to mainnet
        provider: null,
        isConnected: true,
        walletInfo: {
          name,
          icon: '📝'
        }
      }

      this.addWalletConnection(manualConnection)
      return manualConnection

    } catch (error: any) {
      console.error('Manual wallet connection failed:', error)
      throw new Error(error.message || 'Failed to add manual wallet')
    }
  }

  // Disconnect current wallet
  async disconnectWallet(): Promise<void> {
    this.connection = null
    this.updateUserCryptoStatus()
  }

  // Get current connection status
  getConnection(): Web3ModalConnection | null {
    return this.connection
  }

  // Get all connected wallets
  getConnectedWallets(): Web3ModalConnection[] {
    return [...this.connectedWallets]
  }

  // Check if wallet is connected
  isConnected(): boolean {
    return !!this.connection?.isConnected
  }

  // Private helper methods
  private addWalletConnection(connection: Web3ModalConnection) {
    // Remove existing connection with same address
    this.connectedWallets = this.connectedWallets.filter(
      w => w.address.toLowerCase() !== connection.address.toLowerCase()
    )

    // Add new connection
    this.connectedWallets.push(connection)

    // Save to localStorage
    this.saveConnections()
  }

  private saveConnections() {
    const storableConnections = this.connectedWallets.map(conn => ({
      address: conn.address,
      chainId: conn.chainId,
      isConnected: conn.isConnected,
      walletInfo: conn.walletInfo
    }))

    localStorage.setItem('simple_wallet_connections', JSON.stringify(storableConnections))
  }

  private loadStoredConnections() {
    try {
      const stored = localStorage.getItem('simple_wallet_connections')
      if (stored) {
        const connections = JSON.parse(stored)
        this.connectedWallets = connections.map((conn: any) => ({
          ...conn,
          provider: null // Will need to reconnect for transactions
        }))
      }
    } catch (error) {
      console.error('Error loading stored connections:', error)
    }
  }

  // Update user crypto connection status (VonVault integration)
  private updateUserCryptoStatus() {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser)
        userData.crypto_connected = this.connectedWallets.length > 0
        userData.connected_wallets_count = this.connectedWallets.length
        userData.total_crypto_value = this.calculateTotalValue()
        
        localStorage.setItem('currentUser', JSON.stringify(userData))
      } catch (error) {
        console.error('Error updating user crypto status:', error)
      }
    }
  }

  // Calculate total crypto value (rough estimation)
  private calculateTotalValue(): number {
    // In production, you'd fetch real-time token prices
    const ethPrice = 3000 // Rough ETH price
    
    return this.connectedWallets.reduce((total, wallet) => {
      // This is a simplified calculation
      return total + 1000 // Placeholder value
    }, 0)
  }
}

// Export singleton instance
export const web3ModalService = new SimpleWalletService()
export type { Web3ModalConnection }