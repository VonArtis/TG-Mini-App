import React, { useState } from 'react';
import type { AuthScreenProps } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { MobileLayout } from '../layout/MobileLayout';
import { useLanguage } from '../../hooks/useLanguage';

interface EmailVerificationScreenProps extends AuthScreenProps {}

export const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({ 
  onBack, 
  onVerified 
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      setError(t('verification.invalidCode', 'Please enter a valid 6-digit code'));
      return;
    }

    setLoading(true);
    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      onVerified?.();
    } catch (error) {
      setError(t('verification.error', 'Verification failed. Please try again.'));
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
        <div className="text-6xl mb-4 text-center">📧</div>
        <h1 className="text-2xl font-bold text-center mb-2">
          {t('verification.emailTitle', 'Verify Email')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('verification.emailSubtitle', 'Enter the 6-digit code sent to your email')}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      <div className="w-full space-y-4">
        <Input
          label={t('verification.code', 'Verification Code')}
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
          {t('verification.verify', 'Verify Email')}
        </Button>
      </div>

      <p className="mt-6 text-xs text-center text-gray-500">
        {t('verification.noCode', "Didn't receive the code?")}{' '}
        <span className="text-purple-400 cursor-pointer hover:text-purple-300 underline">
          {t('verification.resend', 'Resend Code')}
        </span>
      </p>
    </MobileLayout>
  );
};