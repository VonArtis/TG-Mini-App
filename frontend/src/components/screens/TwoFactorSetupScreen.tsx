import React, { useState } from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { MobileLayout } from '../layout/MobileLayout';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../hooks/useLanguage';

export const TwoFactorSetupScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [step, setStep] = useState<'choose' | 'setup' | 'verify'>('choose');
  const [method, setMethod] = useState<'sms' | 'authenticator'>('sms');
  const [code, setCode] = useState('');
  const { t } = useLanguage();

  const methods = [
    {
      id: 'sms' as const,
      icon: '📱',
      title: t('2fa.sms', 'SMS Authentication'),
      description: t('2fa.smsDesc', 'Receive codes via text message')
    },
    {
      id: 'authenticator' as const,
      icon: '🔐',
      title: t('2fa.authenticator', 'Authenticator App'),
      description: t('2fa.authenticatorDesc', 'Use Google Authenticator or similar')
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
        <div className="text-6xl mb-4 text-center">🔒</div>
        <h1 className="text-2xl font-bold text-center mb-2">
          {t('2fa.title', 'Two-Factor Authentication')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('2fa.subtitle', 'Add an extra layer of security')}
        </p>
      </div>

      {step === 'choose' && (
        <div className="w-full space-y-4">
          {methods.map((methodOption) => (
            <div
              key={methodOption.id}
              onClick={() => {
                setMethod(methodOption.id);
                setStep('setup');
              }}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                method === methodOption.id
                  ? 'border-purple-500 bg-purple-900/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{methodOption.icon}</span>
                <div>
                  <div className="font-semibold text-white">{methodOption.title}</div>
                  <div className="text-sm text-gray-400">{methodOption.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 'setup' && (
        <div className="w-full space-y-4">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">{method === 'sms' ? '📱' : '🔐'}</div>
            <h2 className="text-lg font-semibold mb-2">
              {method === 'sms' ? t('2fa.setupSms', 'SMS Setup') : t('2fa.setupAuth', 'Authenticator Setup')}
            </h2>
            <p className="text-sm text-gray-400">
              {method === 'sms' 
                ? t('2fa.smsInstructions', 'We will send verification codes to your phone')
                : t('2fa.authInstructions', 'Scan the QR code with your authenticator app')
              }
            </p>
          </div>

          <Button 
            onClick={() => setStep('verify')}
            fullWidth
          >
            {t('2fa.continue', 'Continue')}
          </Button>
        </div>
      )}

      {step === 'verify' && (
        <div className="w-full space-y-4">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🔢</div>
            <h2 className="text-lg font-semibold mb-2">
              {t('2fa.verify', 'Verify Setup')}
            </h2>
            <p className="text-sm text-gray-400">
              {t('2fa.verifyInstructions', 'Enter the verification code to complete setup')}
            </p>
          </div>

          <Input
            label={t('2fa.code', 'Verification Code')}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="000000"
            maxLength={6}
            inputMode="numeric"
            className="text-center text-lg"
          />

          <Button 
            onClick={() => onNavigate?.('verification-success')}
            disabled={code.length !== 6}
            fullWidth
          >
            {t('2fa.complete', 'Complete Setup')}
          </Button>
        </div>
      )}
    </MobileLayout>
  );
};