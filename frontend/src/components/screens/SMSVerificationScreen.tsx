import React, { useState, useEffect } from 'react';
import type { ScreenProps } from '../../types';
import { CleanHeader } from '../layout/CleanHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';
import { apiService } from '../../services/api';

interface SMSVerificationScreenProps extends ScreenProps {
  onVerificationComplete?: () => void;
  onSkip?: () => void;
}

export const SMSVerificationScreen: React.FC<SMSVerificationScreenProps> = ({ 
  onBack, 
  onVerificationComplete,
  onSkip 
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const { user } = useApp();
  const { t } = useLanguage();

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-send verification code on component mount
  useEffect(() => {
    sendVerificationCode();
  }, []);

  const sendVerificationCode = async () => {
    if (!user?.token) {
      setError(t('verification.noUser', 'Please log in to verify your phone'));
      return;
    }

    setSendingCode(true);
    setError('');
    
    try {
      const response = await apiService.sendSMSVerification(user.token);
      
      if (response.success) {
        setSuccess(t('verification.smsSent', 'SMS verification code sent'));
        setCountdown(60); // 60 second cooldown
      } else {
        setError(response.message || t('verification.smsError', 'Failed to send SMS code'));
      }
    } catch (error: any) {
      console.error('SMS verification send error:', error);
      setError(t('verification.smsError', 'Failed to send SMS code'));
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError(t('verification.enterCode', 'Please enter the verification code'));
      return;
    }

    if (!user?.token) {
      setError(t('verification.noUser', 'Please log in to verify your phone'));
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await apiService.verifySMS(user.token, verificationCode);
      
      if (response.success) {
        setSuccess(t('verification.phoneVerified', 'Phone verified successfully!'));
        setTimeout(() => {
          onVerificationComplete?.();
        }, 1500);
      } else {
        setError(response.message || t('verification.invalidCode', 'Invalid verification code'));
      }
    } catch (error: any) {
      console.error('SMS verification error:', error);
      setError(t('verification.verifyError', 'Failed to verify code. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return `(${cleaned.slice(-10, -7)}) ${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
    }
    return phone;
  };

  return (
    <div className="px-6 pb-8 pt-4 space-y-6">
      <CleanHeader 
        title="📱 SMS Verification" 
        onBack={onBack}
      />

      <Card className="p-6 text-center">
        <div className="text-6xl mb-4">📱</div>
        <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          {t('verification.verifyPhone', 'Verify Your Phone')}
        </h2>
        <p className="text-gray-400 mb-6">
          {t('verification.smsSentTo', 'We sent a verification code to')}
          <br />
          <span className="text-purple-400 font-medium">{formatPhoneNumber(user?.phone || '')}</span>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-900/30 border border-green-500/50 rounded-lg">
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}

        <div className="space-y-4">
          <Input
            label={t('verification.enterCode', 'Enter Verification Code')}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder={t('verification.smsCodePlaceholder', 'Enter 6-digit SMS code')}
            className="text-center text-lg tracking-widest min-h-[44px]"
            maxLength={6}
          />

          <Button
            onClick={handleVerifyCode}
            disabled={loading || !verificationCode.trim()}
            className="w-full min-h-[44px] h-14 bg-purple-400 hover:bg-purple-500 text-white font-semibold text-lg"
          >
            {loading ? t('buttons.verifying', 'Verifying...') : t('buttons.verify', 'Verify Phone')}
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={sendVerificationCode}
              disabled={sendingCode || countdown > 0}
              variant="outline"
              className="flex-1 min-h-[44px]"
            >
              {sendingCode 
                ? t('buttons.sending', 'Sending...') 
                : countdown > 0 
                  ? `${t('buttons.resendIn', 'Resend in')} ${countdown}s`
                  : t('buttons.resendSMS', 'Resend SMS')
              }
            </Button>

            <Button
              onClick={onSkip}
              variant="outline"
              className="flex-1 min-h-[44px] border-gray-600 text-gray-400 hover:bg-gray-800"
            >
              {t('buttons.skip', 'Skip')}
            </Button>
          </div>
        </div>
      </Card>

      {/* SMS Verification Benefits */}
      <Card className="p-4 bg-green-900/20 border-green-500/30">
        <h3 className="text-green-300 font-medium mb-2 flex items-center gap-2">
          <span>🔒</span>
          {t('verification.smsSecurityTitle', 'SMS Security Benefits')}
        </h3>
        <ul className="space-y-1 text-green-400 text-sm">
          <li>• {t('verification.smsBenefit1', 'Two-factor authentication')}</li>
          <li>• {t('verification.smsBenefit2', 'Transaction alerts')}</li>
          <li>• {t('verification.smsBenefit3', 'Account security notifications')}</li>
          <li>• {t('verification.smsBenefit4', 'Quick account recovery')}</li>
        </ul>
      </Card>

      {/* Privacy Notice */}
      <Card className="p-4 bg-blue-900/20 border-blue-500/30">
        <div className="flex items-start gap-3">
          <div className="text-blue-400 text-lg">🔐</div>
          <div>
            <h3 className="text-blue-300 font-medium mb-1">
              {t('verification.privacyTitle', 'Privacy Protection')}
            </h3>
            <p className="text-blue-400 text-sm">
              {t('verification.privacyMessage', 'Your phone number is encrypted and never shared with third parties. We only use it for security verification.')}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};