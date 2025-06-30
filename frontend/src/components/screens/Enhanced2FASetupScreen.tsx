import React from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { MobileLayout } from '../layout/MobileLayout';
import { useLanguage } from '../../hooks/useLanguage';

export const Enhanced2FASetupScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const { t } = useLanguage();
  
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
        <div className="text-6xl mb-4 text-center">🔐</div>
        <h1 className="text-2xl font-bold text-center mb-2">
          {t('2fa.enhanced.title', 'Enhanced 2FA Setup')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('2fa.enhanced.subtitle', 'Choose your preferred 2FA method')}
        </p>
      </div>

      <div className="w-full space-y-4">
        <Button 
          onClick={() => onNavigate?.('authenticator-setup')}
          fullWidth
          className="flex items-center justify-between p-6 h-auto"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">📱</span>
            <div className="text-left">
              <div className="font-semibold">{t('2fa.authenticator.title', 'Authenticator App')}</div>
              <div className="text-sm opacity-80">{t('2fa.authenticator.subtitle', 'Most secure option')}</div>
            </div>
          </div>
          <span>→</span>
        </Button>

        <Button 
          onClick={() => onNavigate?.('sms-2fa-setup')}
          variant="secondary"
          fullWidth
          className="flex items-center justify-between p-6 h-auto"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">💬</span>
            <div className="text-left">
              <div className="font-semibold">{t('2fa.sms.title', 'SMS Text Messages')}</div>
              <div className="text-sm opacity-80">{t('2fa.sms.subtitle', 'Simple and convenient')}</div>
            </div>
          </div>
          <span>→</span>
        </Button>
      </div>
    </MobileLayout>
  );
};