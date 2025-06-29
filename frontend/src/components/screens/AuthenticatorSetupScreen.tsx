import React, { useState } from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { MobileLayout } from '../layout/MobileLayout';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../hooks/useLanguage';

export const AuthenticatorSetupScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const qrCodeUrl = "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=otpauth://totp/VonVault:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=VonVault";

  const handleVerify = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onNavigate?.('verification-success');
    } catch (error) {
      console.error('Verification failed:', error);
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
        <div className="text-6xl mb-4 text-center">🔐</div>
        <h1 className="text-2xl font-bold text-center mb-2">
          {t('authenticator.title', 'Authenticator Setup')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('authenticator.subtitle', 'Scan QR code with your authenticator app')}
        </p>
      </div>

      <div className="w-full space-y-6">
        {/* QR Code */}
        <div className="text-center">
          <div className="bg-white p-4 rounded-lg inline-block">
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              className="w-48 h-48"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h3 className="font-semibold text-blue-300 mb-2">
            {t('authenticator.instructions', 'Instructions')}
          </h3>
          <ol className="text-sm text-gray-300 space-y-2">
            <li>1. {t('authenticator.step1', 'Open your authenticator app')}</li>
            <li>2. {t('authenticator.step2', 'Scan the QR code above')}</li>
            <li>3. {t('authenticator.step3', 'Enter the 6-digit code below')}</li>
          </ol>
        </div>

        <Input
          label={t('authenticator.code', 'Verification Code')}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="000000"
          maxLength={6}
          inputMode="numeric"
          className="text-center text-lg"
        />

        <Button 
          onClick={handleVerify}
          disabled={loading || code.length !== 6}
          loading={loading}
          fullWidth
        >
          {t('authenticator.verify', 'Verify & Complete')}
        </Button>
      </div>
    </MobileLayout>
  );
};