import React, { useState } from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { MobileLayout } from '../layout/MobileLayout';
import { useLanguage } from '../../hooks/useLanguage';

export const MakeNewInvestmentScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [amount, setAmount] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const { t } = useLanguage();

  const plans = [
    { id: 'basic', name: 'Basic Plan', apy: '5%', min: 1000 },
    { id: 'premium', name: 'Premium Plan', apy: '8%', min: 5000 },
    { id: 'elite', name: 'Elite Plan', apy: '12%', min: 25000 }
  ];

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
        <div className="text-6xl mb-4 text-center">💰</div>
        <h1 className="text-2xl font-bold text-center mb-2">
          {t('investment.title', 'New Investment')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('investment.subtitle', 'Start earning guaranteed returns')}
        </p>
      </div>

      <div className="w-full space-y-6">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-300">Investment Plans</h2>
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedPlan === plan.id
                  ? 'border-purple-500 bg-purple-900/20'
                  : 'border-gray-600'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-white">{plan.name}</div>
                  <div className="text-sm text-gray-400">Min: ${plan.min.toLocaleString()}</div>
                </div>
                <div className="text-lg font-bold text-green-400">{plan.apy} APY</div>
              </div>
            </div>
          ))}
        </div>

        <Input
          label={t('investment.amount', 'Investment Amount')}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="5000"
          prefix="$"
        />

        <Button fullWidth disabled={!amount}>
          {t('investment.invest', 'Start Investment')}
        </Button>
      </div>
    </MobileLayout>
  );
};