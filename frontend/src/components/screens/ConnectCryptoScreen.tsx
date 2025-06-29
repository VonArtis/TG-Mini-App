import React, { useState } from 'react';
import type { ConnectionScreenProps } from '../../types';
import { Button } from '../common/Button';
import { MobileLayout } from '../layout/MobileLayout';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../hooks/useLanguage';

export const ConnectCryptoScreen: React.FC<ConnectionScreenProps> = ({ onBack, onNavigate, onConnect }) => {
  const [step, setStep] = useState<'select' | 'connecting' | 'success'>('select');
  const [selectedWallet, setSelectedWallet] = useState('');
  const { t } = useLanguage();

  const wallets = [
    { id: 'metamask', name: 'MetaMask', icon: '🦊' },
    { id: 'trustwallet', name: 'Trust Wallet', icon: '🛡️' },
    { id: 'walletconnect', name: 'WalletConnect', icon: '🔗' },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵' }
  ];

  const handleConnect = async (walletId: string) => {
    setSelectedWallet(walletId);
    setStep('connecting');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep('success');
      if (onConnect) {
        await onConnect();
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setStep('select');
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
        <div className="text-6xl mb-4 text-center">🔗</div>
        <h1 className="text-2xl font-bold text-center mb-2">
          {t('crypto.connectTitle', 'Connect Crypto Wallet')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('crypto.connectSubtitle', 'Connect your wallet to access DeFi features')}
        </p>
      </div>

      {step === 'select' && (
        <div className="w-full space-y-4">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">
            {t('crypto.selectWallet', 'Choose Your Wallet')}
          </h2>
          
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              onClick={() => handleConnect(wallet.id)}
              className="p-4 border border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-900/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{wallet.icon}</span>
                <span className="font-semibold text-white">{wallet.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 'connecting' && (
        <div className="text-center">
          <div className="text-6xl mb-6 animate-pulse">🔗</div>
          <h2 className="text-xl font-bold mb-4">
            {t('crypto.connecting', 'Connecting...')}
          </h2>
          <p className="text-gray-400 text-sm">
            {t('crypto.connectingMessage', 'Please approve the connection in your wallet')}
          </p>
        </div>
      )}

      {step === 'success' && (
        <div className="text-center">
          <div className="text-8xl mb-6">✅</div>
          <h2 className="text-xl font-bold mb-4 text-green-400">
            {t('crypto.success', 'Wallet Connected!')}
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            {t('crypto.successMessage', 'Your crypto wallet has been successfully connected')}
          </p>
          
          <Button 
            onClick={() => onNavigate?.('dashboard')}
            fullWidth
            className="bg-green-600 hover:bg-green-700"
          >
            {t('crypto.continue', 'Continue to Dashboard')}
          </Button>
        </div>
      )}
    </MobileLayout>
  );
};