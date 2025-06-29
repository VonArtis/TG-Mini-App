import React, { useState } from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { MobileLayout } from '../layout/MobileLayout';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../hooks/useLanguage';

export const CryptoDepositScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [amount, setAmount] = useState('');
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