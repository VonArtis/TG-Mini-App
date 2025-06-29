import React, { useState } from 'react';
import type { ConnectionScreenProps } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { MobileLayout } from '../layout/MobileLayout';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../hooks/useLanguage';

export const ConnectBankScreen: React.FC<ConnectionScreenProps> = ({ onBack, onNavigate, onConnect }) => {
  const [step, setStep] = useState<'select' | 'connect' | 'success'>('select');
  const [selectedBank, setSelectedBank] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const banks = [
    { id: 'chase', name: 'Chase', icon: '🏦' },
    { id: 'wellsfargo', name: 'Wells Fargo', icon: '🏛️' },
    { id: 'bankofamerica', name: 'Bank of America', icon: '🏪' },
    { id: 'citibank', name: 'Citibank', icon: '🏢' }
  ];

  const handleConnect = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep('success');
      if (onConnect) {
        await onConnect();
      }
    } catch (error) {
      console.error('Bank connection failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout centered maxWidth="xs">
      <div className="absolute top-4 right-4">
        <LanguageSelector variant="compact" />
      </div>

      <div className="absolute top-4 left-4">
        <button onClick={onBack} className="p-2 text-gray-400 hover:text-white">←</button>
      </div>
      
      <div className="mb-6">
        <div className="text-6xl mb-4 text-center">🏦</div>
        <h1 className="text-2xl font-bold text-center mb-2">
          {t('bank.title', 'Connect Bank Account')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('bank.subtitle', 'Link your bank for easy funding')}
        </p>
      </div>

      {step === 'select' && (
        <div className="w-full space-y-4">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">
            {t('bank.selectBank', 'Select Your Bank')}
          </h2>
          
          {banks.map((bank) => (
            <div
              key={bank.id}
              onClick={() => setSelectedBank(bank.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedBank === bank.id
                  ? 'border-purple-500 bg-purple-900/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{bank.icon}</span>
                <span className="font-semibold text-white">{bank.name}</span>
              </div>
            </div>
          ))}

          <Button 
            onClick={() => setStep('connect')}
            disabled={!selectedBank}
            fullWidth
            className="mt-6"
          >
            {t('bank.continue', 'Continue')}
          </Button>
        </div>
      )}

      {step === 'connect' && (
        <div className="w-full space-y-4">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🔐</div>
            <h2 className="text-lg font-semibold mb-2">
              {t('bank.secureConnect', 'Secure Connection')}
            </h2>
            <p className="text-sm text-gray-400">
              {t('bank.secureMessage', 'Your banking information is encrypted and secure')}
            </p>
          </div>

          <Button 
            onClick={handleConnect}
            loading={loading}
            fullWidth
          >
            {t('bank.connectNow', 'Connect Bank Account')}
          </Button>
        </div>
      )}

      {step === 'success' && (
        <div className="text-center">
          <div className="text-8xl mb-6">✅</div>
          <h2 className="text-xl font-bold mb-4 text-green-400">
            {t('bank.success', 'Bank Connected!')}
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            {t('bank.successMessage', 'Your bank account has been successfully connected')}
          </p>
          
          <Button 
            onClick={() => onNavigate?.('dashboard')}
            fullWidth
            className="bg-green-600 hover:bg-green-700"
          >
            {t('bank.continue', 'Continue')}
          </Button>
        </div>
      )}
    </MobileLayout>
  );
};