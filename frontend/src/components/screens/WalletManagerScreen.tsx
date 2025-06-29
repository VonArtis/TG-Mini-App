import React, { useState } from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { MobileLayout } from '../layout/MobileLayout';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../hooks/useLanguage';

export const WalletManagerScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [wallets] = useState([
    {
      id: '1',
      name: 'MetaMask Wallet',
      type: 'metamask',
      icon: '🦊',
      address: '0x1234...5678',
      balance: 2.5847,
      usdValue: 4250.32,
      isPrimary: true
    },
    {
      id: '2',
      name: 'Trust Wallet',
      type: 'trust',
      icon: '🛡️',
      address: '0x8765...4321',
      balance: 1.2456,
      usdValue: 2050.87,
      isPrimary: false
    }
  ]);
  const { t } = useLanguage();

  return (
    <MobileLayout centered maxWidth="xs">
      <div className="absolute top-4 right-4">
        <LanguageSelector variant="compact" />
      </div>

      <div className="absolute top-4 left-4">
        <button onClick={onBack} className="p-2 text-gray-400 hover:text-white">←</button>
      </div>
      
      <div className="mb-6">
        <div className="text-6xl mb-4 text-center">👛</div>
        <h1 className="text-2xl font-bold text-center mb-2">
          {t('wallet.title', 'Wallet Manager')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('wallet.subtitle', 'Manage your connected wallets')}
        </p>
      </div>

      <div className="w-full space-y-6">
        {/* Connected Wallets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-300">
              {t('wallet.connected', 'Connected Wallets')}
            </h2>
            <Button
              onClick={() => onNavigate?.('connect-crypto')}
              size="sm"
              variant="outline"
              className="border-purple-500 text-purple-400"
            >
              + {t('wallet.add', 'Add')}
            </Button>
          </div>
          
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className={`p-4 border rounded-lg ${
                wallet.isPrimary
                  ? 'border-purple-500 bg-purple-900/20'
                  : 'border-gray-700 bg-gray-900/30'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{wallet.icon}</span>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      {wallet.name}
                      {wallet.isPrimary && (
                        <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded">
                          {t('wallet.primary', 'Primary')}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      {wallet.address}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-purple-300">
                    {wallet.balance.toFixed(4)} ETH
                  </div>
                  <div className="text-xs text-gray-400">
                    ${wallet.usdValue.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {!wallet.isPrimary && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-blue-500 text-blue-400"
                  >
                    {t('wallet.setPrimary', 'Set Primary')}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-red-500 text-red-400"
                >
                  {t('wallet.disconnect', 'Disconnect')}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Total Balance */}
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-300 mb-1">
            ${(6301.19).toLocaleString()}
          </div>
          <div className="text-gray-400 text-sm">
            {t('wallet.totalValue', 'Total Wallet Value')}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};