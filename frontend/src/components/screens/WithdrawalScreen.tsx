import React, { useState } from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { MobileLayout } from '../layout/MobileLayout';
import { useLanguage } from '../../hooks/useLanguage';

export const WithdrawalScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const methods = [
    { id: 'bank', name: t('withdrawal.bank', 'Bank Transfer'), icon: '🏦', fee: '0%' },
    { id: 'crypto', name: t('withdrawal.crypto', 'Crypto Wallet'), icon: '₿', fee: '1%' }
  ];

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onNavigate?.('dashboard');
    } catch (error) {
      console.error('Withdrawal failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout centered maxWidth="xs">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <button 
          onClick={onBack} 
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      <div className="mb-6">
        <div className="text-6xl mb-4 text-center">📤</div>
        <h1 className="text-2xl font-bold text-center mb-2">
          {t('withdrawal.title', 'Withdraw Funds')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('withdrawal.subtitle', 'Transfer funds to your external account')}
        </p>
      </div>

      <div className="w-full space-y-6">
        {/* Available Balance */}
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-300 mb-1">
            $8,267.82
          </div>
          <div className="text-gray-400 text-sm">
            {t('withdrawal.available', 'Available to Withdraw')}
          </div>
        </div>

        {/* Withdrawal Method */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('withdrawal.method', 'Withdrawal Method')}
          </label>
          <div className="space-y-2">
            {methods.map((methodOption) => (
              <div
                key={methodOption.id}
                onClick={() => setMethod(methodOption.id)}
                className={`p-3 border rounded-lg cursor-pointer ${
                  method === methodOption.id
                    ? 'border-purple-500 bg-purple-900/20'
                    : 'border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{methodOption.icon}</span>
                    <span className="text-white">{methodOption.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {methodOption.fee} {t('withdrawal.fee', 'fee')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amount */}
        <Input
          label={t('withdrawal.amount', 'Withdrawal Amount')}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          prefix="$"
        />

        <Button 
          onClick={handleWithdraw}
          disabled={!amount || loading}
          loading={loading}
          fullWidth
        >
          {t('withdrawal.confirm', 'Confirm Withdrawal')}
        </Button>
      </div>
    </MobileLayout>
  );
};