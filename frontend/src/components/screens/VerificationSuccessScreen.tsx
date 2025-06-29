import React from 'react';
import type { AuthScreenProps } from '../../types';
import { Button } from '../common/Button';
import { MobileLayout } from '../layout/MobileLayout';
import { useLanguage } from '../../hooks/useLanguage';

interface VerificationSuccessScreenProps extends AuthScreenProps {
  onContinue: () => void;
}

export const VerificationSuccessScreen: React.FC<VerificationSuccessScreenProps> = ({ 
  onContinue 
}) => {
  const { t } = useLanguage();

  return (
    <MobileLayout centered maxWidth="xs">
      <div className="text-center">
        <div className="text-8xl mb-6">✅</div>
        <h1 className="text-2xl font-bold mb-4 text-green-400">
          {t('verification.success', 'Verification Complete!')}
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          {t('verification.successSubtitle', 'Your account has been successfully verified')}
        </p>
        
        <Button 
          onClick={onContinue}
          fullWidth
          className="bg-green-600 hover:bg-green-700"
        >
          {t('verification.continue', 'Continue to Dashboard')}
        </Button>
      </div>
    </MobileLayout>
  );
};