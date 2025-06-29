import React from 'react';
import type { ScreenProps } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useLanguage } from '../../hooks/useLanguage';

interface WelcomeScreenProps extends ScreenProps {
  onSignIn: () => void;
  onCreateAccount: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onSignIn, 
  onCreateAccount 
}) => {
  const { t } = useLanguage();

  return (
    <div className="px-6 pb-8 pt-4 space-y-6 min-h-screen bg-black text-white flex flex-col justify-center">
      {/* Logo/Branding */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">💎</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
          VonVault
        </h1>
        <p className="text-lg text-gray-300">
          {t('welcome:subtitle', 'Your DeFi Investment Platform')}
        </p>
      </div>

      {/* Welcome Card */}
      <Card className="text-center p-8 bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-500/30">
        <h2 className="text-2xl font-semibold mb-4 text-white">
          {t('welcome:title', 'Welcome to VonVault')}
        </h2>
        <p className="text-gray-300 mb-6 leading-relaxed">
          {t('welcome:description', 'Start your DeFi journey with secure investments, crypto wallet integration, and guaranteed returns on your digital assets.')}
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={onSignIn}
            className="w-full min-h-[44px] h-14 bg-purple-400 hover:bg-purple-500 text-white font-semibold text-lg"
          >
            {t('buttons.signIn', 'Sign In')}
          </Button>
          
          <Button
            onClick={onCreateAccount}
            variant="outline"
            className="w-full min-h-[44px] h-14 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white font-semibold text-lg"
          >
            {t('buttons.createAccount', 'Create Account')}
          </Button>
        </div>
      </Card>

      {/* Features Preview */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <Card className="text-center p-4 bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-500/30">
          <div className="text-2xl mb-2">🔐</div>
          <h3 className="font-semibold text-blue-200 mb-1">Secure</h3>
          <p className="text-xs text-blue-300">Bank-grade security</p>
        </Card>
        
        <Card className="text-center p-4 bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-500/30">
          <div className="text-2xl mb-2">📈</div>
          <h3 className="font-semibold text-green-200 mb-1">Profitable</h3>
          <p className="text-xs text-green-300">Guaranteed returns</p>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-400 mt-auto pt-8">
        <p>{t('welcome:footer', 'Powered by blockchain technology')}</p>
      </div>
    </div>
  );
};