import React, { useState, useEffect } from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { FullScreenLoader } from '../common/LoadingSpinner';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';

export const CryptoWalletScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [cryptoData, setCryptoData] = useState({
    balance: 2.5847,
    usdValue: 4250.32,
    walletAddress: '0x1234...5678'
  });
  const { user } = useApp();
  const { t } = useLanguage();

  useEffect(() => {
    // Simulate loading crypto data
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const formatCrypto = (amount: number) => {
    return `${amount.toFixed(4)} ETH`;
  };

  const formatUsd = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  if (loading) {
    return <FullScreenLoader text="Loading crypto wallet..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">
          {t('crypto.title', 'Crypto Wallet')}
        </h1>
        <p className="text-gray-400 text-sm">
          {t('crypto.subtitle', 'Manage your crypto assets')}
        </p>
      </div>

      {/* Wallet Balance */}
      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 text-center">
        <div className="text-3xl font-bold text-purple-300 mb-2">
          {formatCrypto(cryptoData.balance)}
        </div>
        <div className="text-gray-400 text-sm mb-4">
          {formatUsd(cryptoData.usdValue)}
        </div>
        <div className="text-xs text-gray-500 font-mono">
          {cryptoData.walletAddress}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-300">
          {t('crypto.actions', 'Quick Actions')}
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => onNavigate?.('crypto-deposit')}
            className="h-16 bg-green-600 hover:bg-green-700 flex flex-col items-center justify-center"
          >
            <span className="text-2xl mb-1">📥</span>
            <span className="text-sm">{t('crypto.deposit', 'Deposit')}</span>
          </Button>
          
          <Button
            onClick={() => onNavigate?.('withdrawal')}
            variant="outline"
            className="h-16 border-orange-500 text-orange-400 hover:bg-orange-500/10 flex flex-col items-center justify-center"
          >
            <span className="text-2xl mb-1">📤</span>
            <span className="text-sm">{t('crypto.withdraw', 'Withdraw')}</span>
          </Button>
        </div>

        {!user?.crypto_connected && (
          <Button
            onClick={() => onNavigate?.('connect-crypto')}
            fullWidth
            className="h-12 border border-purple-500 text-purple-400 hover:bg-purple-500/10"
            variant="outline"
          >
            🔗 {t('crypto.connect', 'Connect Wallet')}
          </Button>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-300">
          {t('crypto.transactions', 'Recent Transactions')}
        </h2>
        
        <div className="text-center py-8">
          <div className="text-4xl mb-4">₿</div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            {t('crypto.noTransactions', 'No transactions yet')}
          </h3>
          <p className="text-gray-400 text-sm">
            {t('crypto.startTrading', 'Start trading to see your transaction history')}
          </p>
        </div>
      </div>
    </div>
  );
};