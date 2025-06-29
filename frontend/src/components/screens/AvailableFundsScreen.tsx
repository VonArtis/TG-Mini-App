import React, { useState, useEffect } from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { MobileLayout } from '../layout/MobileLayout';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../hooks/useLanguage';

export const AvailableFundsScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [funds, setFunds] = useState({
    bankBalance: 5420.50,
    cryptoBalance: 2847.32,
    totalAvailable: 8267.82
  });
  const { t } = useLanguage();

  const fundSources = [
    {
      type: 'bank',
      icon: '🏦',
      name: t('funds.bankAccount', 'Bank Account'),
      balance: funds.bankBalance,
      status: 'connected'
    },
    {
      type: 'crypto',
      icon: '₿',
      name: t('funds.cryptoWallet', 'Crypto Wallet'),
      balance: funds.cryptoBalance,
      status: 'connected'
    }
  ];

  return (
    <MobileLayout centered maxWidth="xs">
      <div className="absolute top-4 right-4">
        <LanguageSelector variant="compact" />
      </div>

      <div className="absolute top-4 left-4">
        <button onClick={onBack} className="p-2 text-gray-400 hover:text-white">←</button>
      </div>
      
      <div className="mb-6">
        <div className="text-6xl mb-4 text-center">💰</div>
        <h1 className="text-2xl font-bold text-center mb-2">
          {t('funds.title', 'Available Funds')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('funds.subtitle', 'Manage your funding sources')}
        </p>
      </div>

      <div className="w-full space-y-6">
        {/* Total Available */}
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-300 mb-2">
            ${funds.totalAvailable.toLocaleString()}
          </div>
          <div className="text-gray-400 text-sm">
            {t('funds.totalAvailable', 'Total Available')}
          </div>
        </div>

        {/* Fund Sources */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-300">
            {t('funds.sources', 'Funding Sources')}
          </h2>
          
          {fundSources.map((source, index) => (
            <div
              key={index}
              className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{source.icon}</span>
                <div>
                  <div className="font-semibold text-white">{source.name}</div>
                  <div className="text-xs text-green-400">
                    {t('funds.connected', 'Connected')}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-purple-300">
                  ${source.balance.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => onNavigate?.('transfer-funds')}
            className="h-12 bg-blue-600 hover:bg-blue-700"
          >
            {t('funds.transfer', 'Transfer')}
          </Button>
          
          <Button
            onClick={() => onNavigate?.('new-investment')}
            className="h-12 bg-purple-600 hover:bg-purple-700"
          >
            {t('funds.invest', 'Invest')}
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};