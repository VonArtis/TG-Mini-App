import React, { useState } from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { MobileLayout } from '../layout/MobileLayout';
import { useLanguage } from '../../hooks/useLanguage';

export const TransferFundsScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [amount, setAmount] = useState('');
  const [fromSource, setFromSource] = useState('bank');
  const [toSource, setToSource] = useState('crypto');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const sources = [
    { id: 'bank', name: t('transfer.bank', 'Bank Account'), icon: '🏦', balance: 5420.50 },
    { id: 'crypto', name: t('transfer.crypto', 'Crypto Wallet'), icon: '₿', balance: 2847.32 }
  ];

  const handleTransfer = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onNavigate?.('funds');
    } catch (error) {
      console.error('Transfer failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout centered maxWidth="xs">
      <div className="absolute top-4 left-4">
        <button 
          onClick={onBack}
          className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Go back"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
        </button>
      </div>
      
      <div className="mb-6">
        <div className="text-6xl mb-4 text-center">💸</div>
        <h1 className="text-2xl font-bold text-center mb-2">
          {t('transfer.title', 'Transfer Funds')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('transfer.subtitle', 'Move funds between accounts')}
        </p>
      </div>

      <div className="w-full space-y-6">
        {/* From Section */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('transfer.from', 'From')}
          </label>
          <div className="space-y-2">
            {sources.map((source) => (
              <div
                key={source.id}
                onClick={() => setFromSource(source.id)}
                className={`p-3 border rounded-lg cursor-pointer ${
                  fromSource === source.id
                    ? 'border-purple-500 bg-purple-900/20'
                    : 'border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{source.icon}</span>
                    <span className="text-white">{source.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    ${source.balance.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* To Section */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('transfer.to', 'To')}
          </label>
          <div className="space-y-2">
            {sources.filter(s => s.id !== fromSource).map((source) => (
              <div
                key={source.id}
                onClick={() => setToSource(source.id)}
                className="p-3 border border-purple-500 bg-purple-900/20 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{source.icon}</span>
                    <span className="text-white">{source.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    ${source.balance.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amount */}
        <Input
          label={t('transfer.amount', 'Amount')}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          prefix="$"
        />

        <Button 
          onClick={handleTransfer}
          disabled={!amount || loading}
          loading={loading}
          fullWidth
        >
          {t('transfer.confirm', 'Transfer Funds')}
        </Button>
      </div>
    </MobileLayout>
  );
};