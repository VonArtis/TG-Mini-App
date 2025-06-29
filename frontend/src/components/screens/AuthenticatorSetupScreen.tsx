import React, { useState, useEffect } from 'react';
import type { ScreenProps } from '../../types';
import { CleanHeader } from '../layout/CleanHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';
import { apiService } from '../../services/api';

export const AuthenticatorSetupScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [qrCode, setQrCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState<'instructions' | 'scan' | 'verify' | 'complete'>('instructions');
  const { user } = useApp();
  const { t } = useLanguage();

  useEffect(() => {
    if (step === 'scan') {
      generateQRCode();
    }
  }, [step]);

  const generateQRCode = async () => {
    setLoading(true);
    setError('');

    try {
      if (!user?.token) {
        setError('Please log in to set up authenticator');
        return;
      }

      const response = await apiService.generate2FASecret(user.token);
      
      if (response.success) {
        setQrCode(response.qr_code);
        setSecretKey(response.secret);
      } else {
        setError(response.message || 'Failed to generate QR code');
      }
    } catch (error: any) {
      console.error('QR generation error:', error);
      setError('Failed to generate QR code. Please try again.');
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
      if (!user?.token) {
        setError('Please log in to verify authenticator');
        return;
      }

      const response = await apiService.verify2FA(user.token, verificationCode, 'app');
      
      if (response.success) {
        setSuccess('Authenticator setup successfully!');
        setStep('complete');
      } else {
        setError(response.message || 'Invalid verification code');
      }
    } catch (error: any) {
      console.error('Authenticator verification error:', error);
      setError('Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderInstructions = () => (
    <div className="space-y-4">
      <Card className="p-6 text-center">
        <div className="text-6xl mb-4">📱</div>
        <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          {t('authenticator.setup', 'Setup Authenticator App')}
        </h2>
        <p className="text-gray-400 mb-6">
          {t('authenticator.description', 'Secure your account with time-based authentication codes')}
        </p>
      </Card>

      {/* Step-by-step instructions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-400">
          {t('authenticator.instructions', 'Before we begin:')}
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
            <div>
              <h4 className="font-medium text-white mb-1">
                {t('authenticator.step1Title', 'Download an Authenticator App')}
              </h4>
              <p className="text-gray-400 text-sm">
                {t('authenticator.step1Description', 'Install Google Authenticator, Authy, or Microsoft Authenticator from your app store')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
            <div>
              <h4 className="font-medium text-white mb-1">
                {t('authenticator.step2Title', 'Open the App')}
              </h4>
              <p className="text-gray-400 text-sm">
                {t('authenticator.step2Description', 'Launch your authenticator app and prepare to add a new account')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
            <div>
              <h4 className="font-medium text-white mb-1">
                {t('authenticator.step3Title', 'Scan QR Code')}
              </h4>
              <p className="text-gray-400 text-sm">
                {t('authenticator.step3Description', 'Use your app to scan the QR code we\'ll show you next')}
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setStep('scan')}
          className="w-full mt-6 min-h-[44px] h-14 bg-purple-400 hover:bg-purple-500"
        >
          {t('buttons.continue', 'Continue to Setup')}
        </Button>
      </Card>

      {/* Recommended Apps */}
      <Card className="p-4 bg-blue-900/20 border-blue-500/30">
        <h3 className="text-blue-300 font-medium mb-2">
          {t('authenticator.recommendedApps', 'Recommended Authenticator Apps')}
        </h3>
        <div className="space-y-1 text-blue-400 text-sm">
          <div>• Google Authenticator (Free)</div>
          <div>• Microsoft Authenticator (Free)</div>
          <div>• Authy (Free, with backup)</div>
          <div>• 1Password (Premium)</div>
        </div>
      </Card>
    </div>
  );

  const renderScan = () => (
    <div className="space-y-4">
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">
          {t('authenticator.scanQR', 'Scan QR Code')}
        </h2>
        
        {loading ? (
          <div className="py-12">
            <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">{t('authenticator.generating', 'Generating QR code...')}</p>
          </div>
        ) : qrCode ? (
          <>
            <div className="bg-white p-4 rounded-lg mb-4 inline-block">
              <img src={qrCode} alt="QR Code" className="w-48 h-48" />
            </div>
            <p className="text-gray-400 text-sm mb-4">
              {t('authenticator.scanInstructions', 'Open your authenticator app and scan this QR code')}
            </p>
          </>
        ) : error ? (
          <div className="py-12">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <p className="text-red-400">{error}</p>
            <Button
              onClick={generateQRCode}
              className="mt-4 min-h-[44px]"
              variant="outline"
            >
              {t('buttons.retry', 'Retry')}
            </Button>
          </div>
        ) : null}

        {secretKey && (
          <div className="bg-gray-800 p-3 rounded-lg mb-4">
            <p className="text-xs text-gray-400 mb-2">
              {t('authenticator.manualEntry', 'Can\'t scan? Enter this key manually:')}
            </p>
            <p className="font-mono text-sm text-white break-all">{secretKey}</p>
          </div>
        )}

        {qrCode && (
          <Button
            onClick={() => setStep('verify')}
            className="w-full min-h-[44px] bg-purple-400 hover:bg-purple-500"
          >
            {t('buttons.next', 'Next: Verify Setup')}
          </Button>
        )}
      </Card>
    </div>
  );

  const renderVerify = () => (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {t('authenticator.verify', 'Verify Your Setup')}
        </h2>
        
        <p className="text-gray-400 text-center mb-6">
          {t('authenticator.verifyInstructions', 'Enter the 6-digit code from your authenticator app')}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <Input
            label={t('authenticator.enterCode', 'Authentication Code')}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder={t('authenticator.codePlaceholder', 'Enter 6-digit code')}
            className="text-center text-lg tracking-widest min-h-[44px]"
            maxLength={6}
          />

          <Button
            onClick={handleVerifyCode}
            disabled={loading || !verificationCode.trim()}
            className="w-full min-h-[44px] h-14 bg-purple-400 hover:bg-purple-500"
          >
            {loading ? t('buttons.verifying', 'Verifying...') : t('buttons.verify', 'Verify & Enable')}
          </Button>

          <Button
            onClick={() => setStep('scan')}
            variant="outline"
            className="w-full min-h-[44px]"
          >
            {t('buttons.back', 'Back to QR Code')}
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
          {t('authenticator.success', 'Authenticator Setup Complete!')}
        </h2>
        <p className="text-gray-400 mb-6">
          {t('authenticator.successMessage', 'Your account is now secured with authenticator-based 2FA')}
        </p>

        <Button
          onClick={() => onNavigate?.('dashboard')}
          className="w-full min-h-[44px] h-14 bg-purple-400 hover:bg-purple-500"
        >
          {t('buttons.continue', 'Continue to Dashboard')}
        </Button>
      </Card>

      {/* Important Notes */}
      <Card className="p-4 bg-yellow-900/20 border-yellow-500/30">
        <h3 className="text-yellow-300 font-medium mb-2 flex items-center gap-2">
          <span>⚠️</span>
          {t('authenticator.importantNotes', 'Important Notes')}
        </h3>
        <ul className="space-y-1 text-yellow-400 text-sm">
          <li>• {t('authenticator.note1', 'Keep your authenticator app secure and backed up')}</li>
          <li>• {t('authenticator.note2', 'Save backup codes if your app supports them')}</li>
          <li>• {t('authenticator.note3', 'Contact support if you lose access to your authenticator')}</li>
        </ul>
      </Card>
    </div>
  );

  return (
    <div className="px-6 pb-8 pt-4 space-y-6">
      <CleanHeader 
        title="📱 Authenticator Setup" 
        onBack={onBack}
      />

      {step === 'instructions' && renderInstructions()}
      {step === 'scan' && renderScan()}
      {step === 'verify' && renderVerify()}
      {step === 'complete' && renderComplete()}
    </div>
  );
};