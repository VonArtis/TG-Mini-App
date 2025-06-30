import React, { useState } from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { MobileLayoutWithTabs } from '../layout/MobileLayoutWithTabs';
import { CleanHeader } from '../layout/CleanHeader';
import { useLanguage } from '../../hooks/useLanguage';

export const ConnectCryptoScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [selectedWallet, setSelectedWallet] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      description: t('crypto.metamaskDesc', 'Most popular Ethereum wallet'),
      icon: '🦊',
      recommended: true
    },
    {
      id: 'trustwallet',
      name: 'Trust Wallet',
      description: t('crypto.trustDesc', 'Mobile-first multi-chain wallet'),
      icon: '🛡️',
      recommended: false
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      description: t('crypto.walletConnectDesc', 'Connect any mobile wallet'),
      icon: '🔗',
      recommended: false
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      description: t('crypto.coinbaseDesc', 'Self-custody wallet by Coinbase'),
      icon: '🔵',
      recommended: false
    }
  ];

  const handleConnect = async () => {
    if (!selectedWallet) return;
    
    setLoading(true);
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      onNavigate?.('verification-success');
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayoutWithTabs showTabs={false}>
      <CleanHeader title="🔗 Connect Crypto Wallet" onBack={onBack} />
      
      <div className="w-full space-y-6">
        {/* Wallet Options */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-300">
            {t('crypto.selectWallet', 'Select Your Wallet')}
          </h2>
          
          {wallets.map((wallet) => (
            <Card
              key={wallet.id}
              onClick={() => setSelectedWallet(wallet.id)}
              className={`cursor-pointer transition-all ${
                selectedWallet === wallet.id
                  ? 'border-purple-500 bg-purple-900/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{wallet.icon}</span>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      {wallet.name}
                      {wallet.recommended && (
                        <span className="text-xs bg-green-600 px-2 py-1 rounded">
                          {t('crypto.recommended', 'Recommended')}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">{wallet.description}</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedWallet === wallet.id 
                    ? 'border-purple-500 bg-purple-500' 
                    : 'border-gray-500'
                }`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Security Notice */}
        <Card className="bg-blue-900/20 border-blue-500/30">
          <div className="flex items-start gap-3">
            <div className="text-blue-400 text-xl">🔒</div>
            <div>
              <h4 className="text-blue-400 font-semibold mb-2">
                {t('crypto.security', 'Security & Privacy')}
              </h4>
              <p className="text-sm text-blue-200">
                {t('crypto.securityDesc', 'VonVault never has access to your private keys. Your wallet remains fully under your control at all times.')}
              </p>
            </div>
          </div>
        </Card>

        {/* Benefits */}
        <Card className="bg-green-900/20 border-green-500/30">
          <h4 className="font-semibold mb-3 text-white flex items-center gap-2">
            <span>✨</span>
            {t('crypto.benefits', 'Crypto Connection Benefits')}
          </h4>
          <div className="text-sm text-green-200 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>{t('crypto.benefit1', 'Instant crypto deposits and withdrawals')}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>{t('crypto.benefit2', 'Lower fees compared to bank transfers')}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>{t('crypto.benefit3', 'Access to DeFi investment opportunities')}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>{t('crypto.benefit4', 'Real-time portfolio tracking')}</span>
            </div>
          </div>
        </Card>

        <Button 
          onClick={handleConnect}
          disabled={!selectedWallet || loading}
          loading={loading}
          fullWidth
        >
          {t('crypto.connect', 'Connect Wallet')}
        </Button>
      </div>
    </MobileLayoutWithTabs>
  );
};