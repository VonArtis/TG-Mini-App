import React, { useEffect, useState } from 'react';
import type { ScreenProps } from '../../types';
import { CleanHeader } from '../layout/CleanHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';

interface VerificationSuccessScreenProps extends ScreenProps {
  verificationType?: 'email' | 'sms' | '2fa' | 'all';
  onContinue?: () => void;
}

export const VerificationSuccessScreen: React.FC<VerificationSuccessScreenProps> = ({ 
  onBack, 
  onNavigate,
  verificationType = 'all',
  onContinue
}) => {
  const [countdown, setCountdown] = useState(5);
  const { user } = useApp();
  const { t } = useLanguage();

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      onNavigate?.('dashboard');
    }
  };

  const getVerificationInfo = () => {
    switch (verificationType) {
      case 'email':
        return {
          icon: '📧',
          title: t('verification.emailSuccess', 'Email Verified!'),
          description: t('verification.emailSuccessMessage', 'Your email address has been successfully verified'),
          benefits: [
            t('verification.emailBenefit1', 'Secure account recovery'),
            t('verification.emailBenefit2', 'Important notifications'),
            t('verification.emailBenefit3', 'Transaction confirmations')
          ]
        };
      case 'sms':
        return {
          icon: '📱',
          title: t('verification.smsSuccess', 'Phone Verified!'),
          description: t('verification.smsSuccessMessage', 'Your phone number has been successfully verified'),
          benefits: [
            t('verification.smsBenefit1', 'Two-factor authentication'),
            t('verification.smsBenefit2', 'Security alerts'),
            t('verification.smsBenefit3', 'Account recovery')
          ]
        };
      case '2fa':
        return {
          icon: '🔐',
          title: t('verification.2faSuccess', '2FA Enabled!'),
          description: t('verification.2faSuccessMessage', 'Two-factor authentication is now active on your account'),
          benefits: [
            t('verification.2faBenefit1', 'Enhanced account security'),
            t('verification.2faBenefit2', 'Protection against unauthorized access'),
            t('verification.2faBenefit3', 'Peace of mind')
          ]
        };
      default:
        return {
          icon: '✅',
          title: t('verification.allSuccess', 'Verification Complete!'),
          description: t('verification.allSuccessMessage', 'All verifications have been completed successfully'),
          benefits: [
            t('verification.allBenefit1', 'Full account access'),
            t('verification.allBenefit2', 'Maximum security'),
            t('verification.allBenefit3', 'All features unlocked')
          ]
        };
    }
  };

  const verificationInfo = getVerificationInfo();

  return (
    <div className="px-6 pb-8 pt-4 space-y-6">
      <CleanHeader 
        title="✅ Verification" 
        showBackButton={false}
      />

      {/* Success Card */}
      <Card className="p-8 text-center bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-500/30">
        <div className="text-8xl mb-4">{verificationInfo.icon}</div>
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
          {verificationInfo.title}
        </h2>
        <p className="text-gray-300 text-lg mb-6">
          {verificationInfo.description}
        </p>

        {/* Success Animation */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center animate-pulse">
            <div className="text-white text-2xl">✓</div>
          </div>
        </div>

        {/* Auto-redirect notice */}
        <div className="bg-green-900/20 rounded-lg p-4 mb-6">
          <p className="text-green-300 text-sm">
            {t('verification.autoRedirect', 'Redirecting to dashboard in')} <span className="font-bold">{countdown}</span> {t('verification.seconds', 'seconds')}
          </p>
        </div>

        <Button
          onClick={handleContinue}
          className="w-full min-h-[44px] h-14 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg"
        >
          {t('buttons.continueToDashboard', 'Continue to Dashboard')}
        </Button>
      </Card>

      {/* Benefits */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-green-400 flex items-center gap-2">
          <span>🎉</span>
          {t('verification.benefitsTitle', 'What you\'ve unlocked:')}
        </h3>
        
        <div className="space-y-3">
          {verificationInfo.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="text-white text-xs">✓</div>
              </div>
              <p className="text-gray-300">{benefit}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* User Status */}
      <Card className="p-6 bg-purple-900/20 border-purple-500/30">
        <h3 className="text-lg font-semibold mb-4 text-purple-400">
          {t('verification.accountStatus', 'Account Status')}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-1">👤</div>
            <div className="text-sm text-gray-400">{t('verification.accountHolder', 'Account Holder')}</div>
            <div className="text-white font-medium">{user?.name || user?.email}</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl mb-1">🔒</div>
            <div className="text-sm text-gray-400">{t('verification.securityLevel', 'Security Level')}</div>
            <div className="text-green-400 font-medium">{t('verification.verified', 'Verified')}</div>
          </div>
        </div>
      </Card>

      {/* Next Steps */}
      <Card className="p-4 bg-blue-900/20 border-blue-500/30">
        <h3 className="text-blue-300 font-medium mb-2">
          {t('verification.nextSteps', 'Next Steps')}
        </h3>
        <ul className="space-y-1 text-blue-400 text-sm">
          <li>• {t('verification.nextStep1', 'Explore investment opportunities')}</li>
          <li>• {t('verification.nextStep2', 'Connect your crypto wallet')}</li>
          <li>• {t('verification.nextStep3', 'Set up additional security features')}</li>
          <li>• {t('verification.nextStep4', 'Start your DeFi journey')}</li>
        </ul>
      </Card>
    </div>
  );
};