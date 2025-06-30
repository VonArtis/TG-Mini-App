import React, { useState, useEffect } from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { MobileLayoutWithTabs } from '../layout/MobileLayoutWithTabs';
import { CleanHeader } from '../layout/CleanHeader';
import { FullScreenLoader } from '../common/LoadingSpinner';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';

export const WalletManagerScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const { connected_wallets, primary_wallet, fetchConnectedWallets } = useApp();
  const { t } = useLanguage();

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      setLoading(true);
      await fetchConnectedWallets();
    } catch (error) {
      console.error('Error loading wallets:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return <FullScreenLoader text="Loading wallets..." />;
  }

  return (
    <MobileLayoutWithTabs showTabs={false}>
      <CleanHeader title="👛 Wallet Manager" onBack={onBack} />
      
      <div className="w-full space-y-6">
        {/* Primary Wallet */}
        {primary_wallet && (
          <Card className="border-green-500/30 bg-green-900/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>⭐</span>
              {t('wallet.primary', 'Primary Wallet')}
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getWalletIcon(primary_wallet.type)}</span>
                <div>
                  <div className="font-semibold text-white">{primary_wallet.name}</div>
                  <div className="text-sm text-gray-400 font-mono">
                    {primary_wallet.address.slice(0, 8)}...{primary_wallet.address.slice(-6)}
                  </div>
                </div>
              </div>
              <div className="text-green-400 font-semibold">PRIMARY</div>
            </div>
          </Card>
        )}

        {/* Connected Wallets */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🔗</span>
            {t('wallet.connected', 'Connected Wallets')} ({connected_wallets?.length || 0})
          </h3>
          
          {connected_wallets && connected_wallets.length > 0 ? (
            <div className="space-y-3">
              {connected_wallets.map((wallet, index) => (
                <Card key={index} className={wallet.is_primary ? 'opacity-50' : ''}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getWalletIcon(wallet.type)}</span>
                      <div>
                        <div className="font-semibold text-white">{wallet.name}</div>
                        <div className="text-sm text-gray-400 font-mono">
                          {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {wallet.networks?.join(', ')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {wallet.is_primary && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded text-center">
                          PRIMARY
                        </span>
                      )}
                      {!wallet.is_primary && (
                        <Button size="sm" variant="outline" className="text-xs">
                          {t('wallet.setPrimary', 'Set Primary')}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center">
              <div className="text-gray-400 mb-4">💼</div>
              <h3 className="text-lg font-semibold mb-2">
                {t('wallet.noWallets', 'No Wallets Connected')}
              </h3>
              <p className="text-gray-400 mb-4">
                {t('wallet.connectFirst', 'Connect your first crypto wallet to get started')}
              </p>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            onClick={() => onNavigate?.('connect-crypto')}
            fullWidth
            className="bg-purple-600 hover:bg-purple-700"
          >
            + {t('wallet.connect', 'Connect New Wallet')}
          </Button>
          
          {connected_wallets && connected_wallets.length > 0 && (
            <Button 
              onClick={() => onNavigate?.('crypto-deposit')}
              variant="secondary"
              fullWidth
            >
              {t('wallet.deposit', 'Deposit Crypto')}
            </Button>
          )}
        </div>
      </div>
    </MobileLayoutWithTabs>
  );
};