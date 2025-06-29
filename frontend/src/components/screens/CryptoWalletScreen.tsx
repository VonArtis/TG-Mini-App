import React, { useState, useEffect } from 'react';
import type { ScreenProps, ConnectedWallet } from '../../types';
import { CleanHeader } from '../layout/CleanHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { FullScreenLoader } from '../common/LoadingSpinner';
import { useApp } from '../../context/AppContext';
import { useMultiWallet } from '../../hooks/useMultiWallet';

export const CryptoWalletScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const { user, connected_wallets, primary_wallet } = useApp();
  const { balances, refreshBalances, loading: balancesLoading } = useMultiWallet();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeWallets = async () => {
      try {
        if (connected_wallets.length > 0) {
          await refreshBalances();
        }
      } catch (error) {
        console.error('Error initializing wallets:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeWallets();
  }, [connected_wallets, refreshBalances]);

  const getWalletTypeIcon = (type: string) => {
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

  const getTotalBalance = () => {
    if (!balances) return 0;
    
    let total = 0;
    Object.values(balances).forEach(walletBalances => {
      Object.values(walletBalances).forEach(networkBalances => {
        Object.values(networkBalances).forEach(tokenBalance => {
          if (typeof tokenBalance === 'object' && tokenBalance.usd_value) {
            total += tokenBalance.usd_value;
          }
        });
      });
    });
    
    return total;
  };

  const getWalletBalance = (walletAddress: string) => {
    if (!balances || !balances[walletAddress]) return 0;
    
    let total = 0;
    Object.values(balances[walletAddress]).forEach(networkBalances => {
      Object.values(networkBalances).forEach(tokenBalance => {
        if (typeof tokenBalance === 'object' && tokenBalance.usd_value) {
          total += tokenBalance.usd_value;
        }
      });
    });
    
    return total;
  };

  const getNetworkColor = (network: string) => {
    switch (network.toLowerCase()) {
      case 'ethereum': return 'text-blue-400';
      case 'polygon': return 'text-purple-400';
      case 'bsc': return 'text-yellow-400';
      case 'arbitrum': return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return <FullScreenLoader text="Loading crypto wallets..." />;
  }

  return (
    <div className="px-6 pb-8 pt-4 space-y-6">
      <CleanHeader 
        title="🔗 Crypto Wallets" 
        onBack={onBack}
        action={
          <Button 
            onClick={() => onNavigate?.('connect-crypto')} 
            size="sm" 
            className="bg-purple-400 hover:bg-purple-500 min-h-[44px]"
          >
            + Connect
          </Button>
        }
      />

      {/* Total Portfolio Value */}
      <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 border-orange-500/30">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-3 text-orange-200">Total Portfolio Value</h3>
          <div className="text-3xl font-bold text-white mb-2">
            {formatCurrency(getTotalBalance())}
          </div>
          <div className="text-sm text-orange-300">
            Across {connected_wallets.length} wallet{connected_wallets.length !== 1 ? 's' : ''}
          </div>
          {balancesLoading && (
            <div className="text-xs text-orange-400 mt-2">
              ↻ Refreshing balances...
            </div>
          )}
        </div>
      </Card>

      {/* Connected Wallets */}
      <div className="space-y-4">
        {connected_wallets.length > 0 ? (
          connected_wallets.map((wallet: ConnectedWallet) => {
            const walletBalance = getWalletBalance(wallet.address);
            
            return (
              <Card key={wallet.id} className="hover:bg-gray-800/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getWalletTypeIcon(wallet.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        {wallet.name || wallet.type}
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
                      {formatCurrency(walletBalance)}
                    </div>
                    <div className="text-sm text-gray-400">
                      Total Value
                    </div>
                  </div>
                </div>

                {/* Supported Networks */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Supported Networks:</h4>
                  <div className="flex flex-wrap gap-2">
                    {wallet.networks.map((network) => (
                      <span 
                        key={network}
                        className={`text-xs px-2 py-1 rounded-full bg-gray-800 ${getNetworkColor(network)}`}
                      >
                        {network.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Wallet Balances by Network/Token */}
                {balances && balances[wallet.address] && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Token Balances:</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {Object.entries(balances[wallet.address]).map(([network, networkBalances]) => (
                        <div key={network}>
                          {Object.entries(networkBalances).map(([token, balance]) => {
                            if (typeof balance === 'object' && balance.balance > 0) {
                              return (
                                <div key={`${network}-${token}`} className="flex justify-between text-sm bg-gray-800/50 p-2 rounded">
                                  <span className={getNetworkColor(network)}>
                                    {token.toUpperCase()} ({network})
                                  </span>
                                  <div className="text-right">
                                    <div className="text-white">{balance.balance.toFixed(4)}</div>
                                    <div className="text-gray-400 text-xs">
                                      {formatCurrency(balance.usd_value || 0)}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => onNavigate?.('crypto-deposit')}
                    variant="outline"
                    size="sm"
                    className="flex-1 min-h-[44px]"
                  >
                    Deposit
                  </Button>
                  <Button
                    onClick={() => onNavigate?.('wallet-manager')}
                    variant="outline"
                    size="sm"
                    className="flex-1 min-h-[44px]"
                  >
                    Manage
                  </Button>
                  {!wallet.is_primary && (
                    <Button
                      onClick={() => {/* Set as primary */}}
                      variant="outline"
                      size="sm"
                      className="min-h-[44px] border-green-500 text-green-400 hover:bg-green-500/10"
                    >
                      Set Primary
                    </Button>
                  )}
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold mb-2">No Crypto Wallets Connected</h3>
            <p className="text-gray-400 mb-6">
              Connect your crypto wallet to start managing your digital assets and earn rewards
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
      {connected_wallets.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => refreshBalances()}
            variant="secondary"
            disabled={balancesLoading}
            className="h-16 flex flex-col items-center justify-center space-y-1 min-h-[44px]"
          >
            <span className="text-lg">↻</span>
            <span className="text-sm">
              {balancesLoading ? 'Refreshing...' : 'Refresh Balances'}
            </span>
          </Button>
          
          <Button
            onClick={() => onNavigate?.('wallet-manager')}
            variant="secondary"
            className="h-16 flex flex-col items-center justify-center space-y-1 min-h-[44px]"
          >
            <span className="text-lg">⚙️</span>
            <span className="text-sm">Manage Wallets</span>
          </Button>
        </div>
      )}
    </div>
  );
};