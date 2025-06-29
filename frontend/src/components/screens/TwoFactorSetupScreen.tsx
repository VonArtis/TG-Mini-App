import React, { useState } from 'react';
import type { ScreenProps } from '../../types';
import { CleanHeader } from '../layout/CleanHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';
import { apiService } from '../../services/api';

export const TwoFactorSetupScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [selectedMethod, setSelectedMethod] = useState<'sms' | 'app' | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState<'choose' | 'setup' | 'verify' | 'complete'>('choose');
  const { user } = useApp();
  const { t } = useLanguage();

  const handleMethodSelect = async (method: 'sms' | 'app') => {
    setSelectedMethod(method);
    setLoading(true);
    setError('');

    try {
      if (method === 'app') {
        // Generate QR code for authenticator app
        const response = await apiService.generate2FASecret(user?.token || '');
        if (response.success) {
          setQrCode(response.qr_code);
          setSecretKey(response.secret);
          setStep('setup');
        } else {
          setError(response.message || 'Failed to generate 2FA secret');
        }
      } else {
        // SMS setup
        setStep('verify');
      }
    } catch (error: any) {
      setError('Failed to set up 2FA. Please try again.');
      console.error('2FA setup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiService.verify2FA(
        user?.token || '', 
        verificationCode,
        selectedMethod || 'sms'
      );

      if (response.success) {
        setSuccess('2FA enabled successfully!');
        setStep('complete');
      } else {
        setError(response.message || 'Invalid verification code');
      }
    } catch (error: any) {
      setError('Failed to verify code. Please try again.');
      console.error('2FA verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderChooseMethod = () => (
    <div className="space-y-4">
      <Card className="p-6 text-center">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          {t('2fa.setup', 'Enable Two-Factor Authentication')}
        </h2>
        <p className="text-gray-400 mb-6">
          {t('2fa.description', 'Add an extra layer of security to your account')}
        </p>
      </Card>

      {/* SMS Option */}
      <Card className="p-6 hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={() => handleMethodSelect('sms')}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl">📱</div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {t('2fa.sms', 'SMS Authentication')}
              </h3>
              <p className="text-sm text-gray-400">
                {t('2fa.smsDescription', 'Receive codes via text message')}
              </p>
            </div>
          </div>
          <div className="text-purple-400">→</div>
        </div>
      </Card>

      {/* Authenticator App Option */}
      <Card className="p-6 hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={() => handleMethodSelect('app')}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl">📲</div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {t('2fa.app', 'Authenticator App')}
              </h3>
              <p className="text-sm text-gray-400">
                {t('2fa.appDescription', 'Use Google Authenticator or similar')}
              </p>
              <div className="text-xs text-green-400 mt-1">
                {t('2fa.recommended', 'Recommended')}
              </div>
            </div>
          </div>
          <div className="text-purple-400">→</div>
        </div>
      </Card>
    </div>
  );

  const renderSetupApp = () => (
    <div className="space-y-4">
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">
          {t('2fa.scanQR', 'Scan QR Code')}
        </h2>
        
        {qrCode && (
          <div className="bg-white p-4 rounded-lg mb-4 inline-block">
            <img src={qrCode} alt="QR Code" className="w-48 h-48" />
          </div>
        )}

        <p className="text-gray-400 text-sm mb-4">
          {t('2fa.scanInstructions', 'Scan this QR code with your authenticator app')}
        </p>

        {secretKey && (
          <div className="bg-gray-800 p-3 rounded-lg mb-4">
            <p className="text-xs text-gray-400 mb-1">
              {t('2fa.manualEntry', 'Or enter this key manually:')}
            </p>
            <p className="font-mono text-sm text-white break-all">{secretKey}</p>
          </div>
        )}

        <Button
          onClick={() => setStep('verify')}
          className="w-full min-h-[44px] bg-purple-400 hover:bg-purple-500"
        >
          {t('buttons.continue', 'Continue')}
        </Button>
      </Card>
    </div>
  );

  const renderVerify = () => (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {t('2fa.enterCode', 'Enter Verification Code')}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <Input
            label={selectedMethod === 'app' ? t('2fa.appCode', 'Code from Authenticator App') : t('2fa.smsCode', 'SMS Code')}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder={t('2fa.codePlaceholder', 'Enter 6-digit code')}
            className="text-center text-lg tracking-widest min-h-[44px]"
            maxLength={6}
          />

          <Button
            onClick={handleVerifyCode}
            disabled={loading || !verificationCode.trim()}
            className="w-full min-h-[44px] h-14 bg-purple-400 hover:bg-purple-500"
          >
            {loading ? t('buttons.verifying', 'Verifying...') : t('buttons.enable2FA', 'Enable 2FA')}
          </Button>

          <Button
            onClick={() => setStep('choose')}
            variant="outline"
            className="w-full min-h-[44px]"
          >
            {t('buttons.back', 'Back')}
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderComplete = () => (
    <div className="space-y-4">
      <Card className="p-6 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-semibold mb-2 text-green-400">
          {t('2fa.enabled', '2FA Enabled Successfully!')}
        </h2>
        <p className="text-gray-400 mb-6">
          {t('2fa.enabledDescription', 'Your account is now protected with two-factor authentication')}
        </p>

        <Button
          onClick={() => onNavigate?.('dashboard')}
          className="w-full min-h-[44px] h-14 bg-purple-400 hover:bg-purple-500"
        >
          {t('buttons.continue', 'Continue to Dashboard')}
        </Button>
      </Card>

      {/* Security Tips */}
      <Card className="p-4 bg-blue-900/20 border-blue-500/30">
        <h3 className="text-blue-300 font-medium mb-2">
          {t('2fa.securityTips', 'Security Tips')}
        </h3>
        <ul className="space-y-1 text-blue-400 text-sm">
          <li>• {t('2fa.tip1', 'Keep your authenticator app secure')}</li>
          <li>• {t('2fa.tip2', 'Save backup codes in a safe place')}</li>
          <li>• {t('2fa.tip3', 'Never share your 2FA codes')}</li>
        </ul>
      </Card>
    </div>
  );

  return (
    <div className="px-6 pb-8 pt-4 space-y-6">
      <CleanHeader 
        title="🔐 Two-Factor Authentication" 
        onBack={onBack}
      />

      {step === 'choose' && renderChooseMethod()}
      {step === 'setup' && renderSetupApp()}
      {step === 'verify' && renderVerify()}
      {step === 'complete' && renderComplete()}
    </div>
  );
};