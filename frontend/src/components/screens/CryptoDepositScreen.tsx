import React, { useState } from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { MobileLayout } from '../layout/MobileLayout';
import { useLanguage } from '../../hooks/useLanguage';

export const CryptoDepositScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [amount, setAmount] = useState('');
  const { t } = useLanguage();

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
        <div className="text-6xl mb-4 text-center">📥</div>
        <h1 className="text-2xl font-bold text-center mb-2">
          {t('deposit.title', 'Crypto Deposit')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('deposit.subtitle', 'Add funds to your wallet')}
        </p>
      </div>

      <div className="w-full space-y-6">
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-400 mb-2">Deposit Address</div>
          <div className="font-mono text-xs text-purple-300 break-all">
            0x1234567890abcdef1234567890abcdef12345678
          </div>
        </div>

        <Input
          label={t('deposit.amount', 'Amount')}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          prefix="ETH"
        />

        <Button fullWidth disabled={!amount}>
          {t('deposit.confirm', 'Confirm Deposit')}
        </Button>
      </div>
    </MobileLayout>
  );
};