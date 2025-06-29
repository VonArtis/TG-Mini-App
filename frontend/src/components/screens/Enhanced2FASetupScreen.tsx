import React, { useState } from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { MobileLayout } from '../layout/MobileLayout';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../hooks/useLanguage';

export const Enhanced2FASetupScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [step, setStep] = useState<'setup' | 'verify' | 'success'>('setup');
  const [code, setCode] = useState('');
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
        <div className="text-6xl mb-4 text-center">🔐</div>
        <h1 className="text-2xl font-bold text-center mb-2">
          {t('enhanced2fa.title', 'Enhanced 2FA Setup')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('enhanced2fa.subtitle', 'Ultimate security for high-value investments')}
        </p>
      </div>

      <div className="w-full space-y-6">
        {step === 'setup' && (
          <>
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <h3 className="font-semibold text-purple-300 mb-2">Enhanced Security Features</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Biometric authentication</li>
                <li>• Device fingerprinting</li>
                <li>• Advanced threat detection</li>
              </ul>
            </div>
            <Button onClick={() => setStep('verify')} fullWidth>
              {t('enhanced2fa.setup', 'Setup Enhanced 2FA')}
            </Button>
          </>
        )}

        {step === 'verify' && (
          <>
            <Input
              label={t('enhanced2fa.code', 'Verification Code')}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              maxLength={6}
              inputMode="numeric"
              className="text-center text-lg"
            />
            <Button 
              onClick={() => setStep('success')}
              disabled={code.length !== 6}
              fullWidth
            >
              {t('enhanced2fa.verify', 'Verify')}
            </Button>
          </>
        )}

        {step === 'success' && (
          <div className="text-center">
            <div className="text-8xl mb-6">✅</div>
            <h2 className="text-xl font-bold mb-4 text-green-400">
              {t('enhanced2fa.success', 'Enhanced 2FA Active!')}
            </h2>
            <Button onClick={() => onNavigate?.('dashboard')} fullWidth>
              {t('enhanced2fa.continue', 'Continue')}
            </Button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};