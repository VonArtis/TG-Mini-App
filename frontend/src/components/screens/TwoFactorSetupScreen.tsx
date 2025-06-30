import React from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { MobileLayout } from '../layout/MobileLayout';
import { useLanguage } from '../../hooks/useLanguage';

export const TwoFactorSetupScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const { t } = useLanguage();
  
  const options = [
    {
      id: 'enhanced',
      title: t('2fa.enhanced.title', 'Enhanced 2FA'),
      subtitle: t('2fa.enhanced.subtitle', 'Multiple security layers'),
      icon: '🛡️',
      action: 'enhanced-2fa-setup'
    },
    {
      id: 'authenticator',
      title: t('2fa.authenticator.title', 'Authenticator App'),
      subtitle: t('2fa.authenticator.subtitle', 'Google/Microsoft Authenticator'),
      icon: '📱',
      action: 'authenticator-setup'
    },
    {
      id: 'sms',
      title: t('2fa.sms.title', 'SMS Verification'),
      subtitle: t('2fa.sms.subtitle', 'Text message codes'),
      icon: '💬',
      action: 'sms-2fa-setup'
    }
  ];
  
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
          {t('2fa.setup.title', '2FA Security Setup')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('2fa.setup.subtitle', 'Choose your preferred security method')}
        </p>
      </div>

      <div className="w-full space-y-4">
        {options.map((option) => (
          <Button 
            key={option.id}
            onClick={() => onNavigate?.(option.action as any)}
            variant="secondary"
            fullWidth
            className="flex items-center justify-between p-6 h-auto text-left"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{option.icon}</span>
              <div>
                <div className="font-semibold text-white">{option.title}</div>
                <div className="text-sm text-gray-400">{option.subtitle}</div>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </Button>
        ))}
      </div>
    </MobileLayout>
  );
};