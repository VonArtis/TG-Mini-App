import React, { useState } from 'react';
import type { ConnectionScreenProps } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { MobileLayout } from '../layout/MobileLayout';
import { useLanguage } from '../../hooks/useLanguage';

export const ConnectBankScreen: React.FC<ConnectionScreenProps> = ({ onBack, onNavigate, onConnect }) => {
  const [selectedMethod, setSelectedMethod] = useState('plaid');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const methods = [
    {
      id: 'plaid',
      name: t('bank.plaid', 'Instant Bank Connection'),
      description: t('bank.plaidDesc', 'Connect securely through Plaid'),
      icon: '🏦',
      recommended: true
    },
    {
      id: 'wire',
      name: t('bank.wire', 'Wire Transfer'),
      description: t('bank.wireDesc', '1-3 business days'),
      icon: '💸',
      recommended: false
    },
    {
      id: 'ach',
      name: t('bank.ach', 'ACH Transfer'),
      description: t('bank.achDesc', '3-5 business days'),
      icon: '🔄',
      recommended: false
    }
  ];

  const handleConnect = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onNavigate?.('verification-success');
    } catch (error) {
      console.error('Connection failed:', error);
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
        <div className="text-6xl mb-4 text-center">🏦</div>
        <h1 className="text-2xl font-bold text-center mb-2">
          {t('bank.title', 'Connect Bank Account')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('bank.subtitle', 'Fund your investments securely')}
        </p>
      </div>

      <div className="w-full space-y-6">
        {/* Connection Methods */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-300">
            {t('bank.methods', 'Connection Methods')}
          </h2>
          
          {methods.map((method) => (
            <Card
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? 'border-purple-500 bg-purple-900/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      {method.name}
                      {method.recommended && (
                        <span className="text-xs bg-green-600 px-2 py-1 rounded">
                          {t('bank.recommended', 'Recommended')}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">{method.description}</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedMethod === method.id 
                    ? 'border-purple-500 bg-purple-500' 
                    : 'border-gray-500'
                }`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Security Notice */}
        <Card className="bg-blue-900/20 border-blue-500/30">
          <div className="flex items-start gap-3">
            <div className="text-blue-400 text-xl">🔒</div>
            <div>
              <h4 className="text-blue-400 font-semibold mb-2">
                {t('bank.security', 'Bank-Grade Security')}
              </h4>
              <p className="text-sm text-blue-200">
                {t('bank.securityDesc', 'Your banking information is encrypted and never stored on our servers. We use industry-leading security protocols.')}
              </p>
            </div>
          </div>
        </Card>

        <Button 
          onClick={handleConnect}
          disabled={loading}
          loading={loading}
          fullWidth
        >
          {t('bank.connect', 'Connect Bank Account')}
        </Button>
      </div>
    </MobileLayout>
  );
};