import React, { useState, useEffect } from 'react';
import type { ScreenProps } from '../../types';
import { CleanHeader } from '../layout/CleanHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';
import { apiService } from '../../services/api';

interface ConnectedWallet {
  id: string;
  name: string;
  type: string;
  address: string;
  networks: string[];
  is_primary: boolean;
  balance_usd: number;
  connected_at: string;
}

export const WalletManagerScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [wallets, setWallets] = useState<ConnectedWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useApp();
  const { t } = useLanguage();

  useEffect(() => {
    fetchConnectedWallets();
  }, []);

  const fetchConnectedWallets = async () => {
    try {
      if (!user?.token) {
        // Demo wallets
        setWallets([
          {
            id: '1',
            name: 'MetaMask Wallet',
            type: 'metamask',
            address: '0x742d35Cc6C5c3Aa3fcC3C6c6c6c6c6c6c6c6c6c6',
            networks: ['Ethereum', 'Polygon'],
            is_primary: true,
            balance_usd: 8920.45,
            connected_at: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            name: 'Trust Wallet',
            type: 'trustwallet',
            address: '0x856d35Cc6C5c3Aa3fcC3C6c6c6c6c6c6c6c6c6c6',
            networks: ['BSC', 'Ethereum'],
            is_primary: false,
            balance_usd: 2150.30,
            connected_at: '2024-02-01T14:20:00Z'
          }
        ]);
        setLoading(false);
        return;
      }

      const response = await apiService.getConnectedWallets(user.token);
      setWallets(response.wallets || []);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      setWallets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPrimary = async (walletId: string) => {
    try {
      if (!user?.token) return;

      const response = await apiService.setPrimaryWallet(walletId, user.token);
      if (response.success) {
        setWallets(wallets.map(wallet => ({
          ...wallet,
          is_primary: wallet.id === walletId
        })));
        alert('Primary wallet updated successfully!');
      }
    } catch (error) {
      console.error('Error setting primary wallet:', error);
      alert('Failed to set primary wallet');
    }
  };

  const handleDisconnect = async (walletId: string) => {
    const confirmed = confirm('Are you sure you want to disconnect this wallet?');
    if (!confirmed) return;

    try {
      if (!user?.token) return;

      const response = await apiService.disconnectWallet(walletId, user.token);
      if (response.success) {
        setWallets(wallets.filter(wallet => wallet.id !== walletId));
        alert('Wallet disconnected successfully!');
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      alert('Failed to disconnect wallet');
    }
  };

  const getWalletIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'metamask': return '🦊';
      case 'trustwallet': return '🛡️';
      case 'walletconnect': return '🔗';
      case 'coinbase': return '🔵';
      default: return '💼';
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="px-6 pb-8 pt-4 space-y-6">
        <CleanHeader title="⚙️ Manage Wallets" onBack={onBack} />
        <div className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-8 pt-4 space-y-6">
      <CleanHeader 
        title="⚙️ Manage Wallets" 
        onBack={onBack}
        action={
          <Button 
            onClick={() => onNavigate?.('connect-crypto')} 
            size="sm" 
            className="bg-purple-400 hover:bg-purple-500 min-h-[44px]"
          >
            + Add
          </Button>
        }
      />

      {/* Overview */}
      <Card className="p-6 text-center bg-gradient-to-br from-orange-900/50 to-orange-800/50 border-orange-500/30">
        <h2 className="text-lg font-semibold mb-2 text-orange-200">Connected Wallets</h2>
        <div className="text-3xl font-bold text-white mb-2">{wallets.length}</div>
        <p className="text-orange-300 text-sm">
          Total Value: {formatCurrency(wallets.reduce((sum, w) => sum + w.balance_usd, 0))}
        </p>
      </Card>

      {/* Wallets List */}
      <div className="space-y-4">
        {wallets.length > 0 ? (
          wallets.map((wallet) => (
            <Card key={wallet.id} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getWalletIcon(wallet.type)}</div>
                  <div>
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      {wallet.name}
                      {wallet.is_primary && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                          PRIMARY
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-400 font-mono">
                      {formatAddress(wallet.address)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-lg text-green-400">
                    {formatCurrency(wallet.balance_usd)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {wallet.networks.length} networks
                  </div>
                </div>
              </div>

              {/* Networks */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Supported Networks:</h4>
                <div className="flex flex-wrap gap-2">
                  {wallet.networks.map((network) => (
                    <span 
                      key={network}
                      className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300"
                    >
                      {network}
                    </span>
                  ))}
                </div>
              </div>

              {/* Connection Info */}
              <div className="mb-4 text-sm text-gray-400">
                <div>Connected: {formatDate(wallet.connected_at)}</div>
                <div>Type: {wallet.type.charAt(0).toUpperCase() + wallet.type.slice(1)}</div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {!wallet.is_primary && (
                  <Button
                    onClick={() => handleSetPrimary(wallet.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1 min-h-[44px] border-green-500 text-green-400 hover:bg-green-500/10"
                  >
                    Set Primary
                  </Button>
                )}
                
                <Button
                  onClick={() => onNavigate?.('crypto-deposit', { walletId: wallet.id })}
                  variant="outline"
                  size="sm"
                  className="flex-1 min-h-[44px]"
                >
                  Deposit
                </Button>
                
                <Button
                  onClick={() => handleDisconnect(wallet.id)}
                  variant="outline"
                  size="sm"
                  className="min-h-[44px] border-red-500 text-red-400 hover:bg-red-500/10"
                >
                  Disconnect
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold mb-2">No Wallets Connected</h3>
            <p className="text-gray-400 mb-6">
              Connect a crypto wallet to start managing your digital assets
            </p>
            <Button
              onClick={() => onNavigate?.('connect-crypto')}
              className="bg-purple-400 hover:bg-purple-500 min-h-[44px]"
            >
              Connect Your First Wallet
            </Button>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      {wallets.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-400">Quick Actions</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => onNavigate?.('crypto-deposit')}
              className="h-16 flex flex-col items-center justify-center space-y-1 min-h-[44px] bg-green-600 hover:bg-green-700"
            >
              <span className="text-lg">💰</span>
              <span className="text-sm">Deposit</span>
            </Button>
            
            <Button
              onClick={() => onNavigate?.('crypto')}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center space-y-1 min-h-[44px]"
            >
              <span className="text-lg">👁️</span>
              <span className="text-sm">View Wallets</span>
            </Button>
          </div>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="p-4 bg-blue-900/20 border-blue-500/30">
        <h3 className="text-blue-300 font-medium mb-2">Security Information</h3>
        <ul className="space-y-1 text-blue-400 text-sm">
          <li>• Your private keys remain in your wallet - VonVault never stores them</li>
          <li>• You can disconnect wallets anytime without affecting your funds</li>
          <li>• Primary wallet is used for automatic transactions</li>
          <li>• Always verify wallet addresses before large transactions</li>
        </ul>
      </Card>
    </div>
  );
};