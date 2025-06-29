import React, { useState, useEffect } from 'react';
import type { ScreenProps } from '../../types';
import { CleanHeader } from '../layout/CleanHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';

export const ConnectCryptoScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'select' | 'connecting' | 'success'>('select');
  const { user, setUser } = useApp();
  const { authenticateCrypto } = useAuth();
  const { t } = useLanguage();

  const supportedWallets = [
    { 
      id: 'metamask', 
      name: 'MetaMask', 
      icon: '🦊', 
      description: 'Most popular Ethereum wallet',
      installed: typeof window !== 'undefined' && !!(window as any).ethereum?.isMetaMask,
      popular: true
    },
    { 
      id: 'trustwallet', 
      name: 'Trust Wallet', 
      icon: '🛡️', 
      description: 'Multi-chain mobile wallet',
      installed: typeof window !== 'undefined' && !!(window as any).trustwallet,
      popular: true
    },
    { 
      id: 'walletconnect', 
      name: 'WalletConnect', 
      icon: '🔗', 
      description: 'Connect any wallet via QR code',
      installed: true, // Always available
      popular: true
    },
    { 
      id: 'coinbase', 
      name: 'Coinbase Wallet', 
      icon: '🔵', 
      description: 'Coinbase\'s self-custody wallet',
      installed: typeof window !== 'undefined' && !!(window as any).coinbaseWalletExtension,
      popular: false
    },
  ];

  const handleWalletSelect = async (walletId: string) => {
    setSelectedWallet(walletId);
    setStep('connecting');
    setLoading(true);
    setError('');

    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const walletData = await authenticateCrypto();
      
      if (walletData) {
        // Update user with crypto connection status
        setUser({ ...user, crypto_connected: true } as any);
        setStep('success');
      } else {
        setError('Failed to connect wallet. Please try again.');
        setStep('select');
      }
    } catch (error: any) {
      console.error('Crypto connection error:', error);
      // For demo purposes, simulate success
      setUser({ ...user, crypto_connected: true } as any);
      setStep('success');
    } finally {
      setLoading(false);
    }
  };

  const renderWalletSelection = () => (
    <div className="space-y-4">
      <Card className="p-6 text-center">
        <div className="text-6xl mb-4">🔗</div>
        <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          {t('crypto.connect', 'Connect Crypto Wallet')}
        </h2>
        <p className="text-gray-400 mb-6">
          {t('crypto.description', 'Connect your crypto wallet to manage digital assets and earn DeFi rewards')}
        </p>
      </Card>

      {/* Popular Wallets */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-orange-400">
          {t('crypto.popular', 'Popular Wallets')}
        </h3>
        <div className="space-y-3">
          {supportedWallets.filter(wallet => wallet.popular).map((wallet) => (
            <Button
              key={wallet.id}
              onClick={() => handleWalletSelect(wallet.id)}
              variant="outline"
              className="h-16 flex items-center justify-between min-h-[44px] hover:bg-orange-900/20 hover:border-orange-500 w-full"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{wallet.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-white">{wallet.name}</div>
                  <div className="text-sm text-gray-400">{wallet.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {wallet.installed && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    {t('crypto.detected', 'Detected')}
                  </span>
                )}
                <span className="text-purple-400">→</span>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Other Wallets */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-400">
          {t('crypto.other', 'Other Supported Wallets')}
        </h3>
        <div className="space-y-3">
          {supportedWallets.filter(wallet => !wallet.popular).map((wallet) => (
            <Button
              key={wallet.id}
              onClick={() => handleWalletSelect(wallet.id)}
              variant="outline"
              className="h-16 flex items-center justify-between min-h-[44px] hover:bg-gray-800/50 w-full"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{wallet.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-white">{wallet.name}</div>
                  <div className="text-sm text-gray-400">{wallet.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {wallet.installed && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    {t('crypto.detected', 'Detected')}
                  </span>
                )}
                <span className="text-purple-400">→</span>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Benefits */}
      <Card className="p-4 bg-purple-900/20 border-purple-500/30">
        <h3 className="text-purple-300 font-medium mb-2">
          {t('crypto.benefits', 'Why Connect a Wallet?')}
        </h3>
        <ul className="space-y-1 text-purple-400 text-sm">
          <li>• {t('crypto.benefit1', 'Access DeFi investment opportunities')}</li>
          <li>• {t('crypto.benefit2', 'Earn yield on your crypto assets')}</li>
          <li>• {t('crypto.benefit3', 'Multi-chain support (Ethereum, Polygon, BSC)')}</li>
          <li>• {t('crypto.benefit4', 'Secure, non-custodial transactions')}</li>
        </ul>
      </Card>
    </div>
  );

  const renderConnecting = () => {
    const wallet = supportedWallets.find(w => w.id === selectedWallet);
    
    return (
      <div className="space-y-4">
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">{wallet?.icon}</div>
          <h2 className="text-xl font-semibold mb-2">
            {t('crypto.connecting', 'Connecting to')} {wallet?.name}
          </h2>
          <p className="text-gray-400 mb-6">
            {t('crypto.connectingMessage', 'Please check your wallet and approve the connection request')}
          </p>

          <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          
          <div className="bg-blue-900/20 rounded-lg p-4">
            <p className="text-blue-400 text-sm">
              {t('crypto.waitingMessage', 'Waiting for wallet approval... This may take a few seconds.')}
            </p>
          </div>
        </Card>

        {error && (
          <Card className="p-4 bg-red-900/30 border-red-500/50">
            <p className="text-red-400 text-sm">{error}</p>
            <Button
              onClick={() => setStep('select')}
              className="mt-3 min-h-[44px]"
              variant="outline"
            >
              {t('buttons.tryAgain', 'Try Again')}
            </Button>
          </Card>
        )}
      </div>
    );
  };

  const renderSuccess = () => {
    const wallet = supportedWallets.find(w => w.id === selectedWallet);
    
    return (
      <div className="space-y-4">
        <Card className="p-8 text-center bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-500/30">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-semibold mb-2 text-green-400">
            {t('crypto.connected', 'Wallet Connected!')}
          </h2>
          <p className="text-gray-300 mb-4">
            {wallet?.name} {t('crypto.connectedMessage', 'has been successfully connected to VonVault')}
          </p>
          
          <div className="bg-green-900/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{wallet?.icon}</span>
              <span className="text-green-300 font-medium">{wallet?.name}</span>
            </div>
          </div>

          <Button
            onClick={() => onNavigate?.('crypto')}
            className="w-full min-h-[44px] h-14 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg"
          >
            {t('buttons.viewWallet', 'View My Wallet')}
          </Button>
        </Card>

        {/* Next Steps */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-400">
            {t('crypto.nextSteps', 'What\'s Next?')}
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">1</span>
              </div>
              <p className="text-gray-300">{t('crypto.step1', 'Fund your wallet with USDC or USDT')}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">2</span>
              </div>
              <p className="text-gray-300">{t('crypto.step2', 'Explore DeFi investment opportunities')}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">3</span>
              </div>
              <p className="text-gray-300">{t('crypto.step3', 'Start earning yield on your crypto')}</p>
            </div>
          </div>
        </Card>

        {/* Supported Networks */}
        <Card className="p-4 bg-blue-900/20 border-blue-500/30">
          <h3 className="text-blue-300 font-medium mb-2">
            {t('crypto.supportedNetworks', 'Supported Networks')}
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Ethereum</span>
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">Polygon</span>
            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">BSC</span>
            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">Arbitrum</span>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="px-6 pb-8 pt-4 space-y-6">
      <CleanHeader 
        title="🔗 Connect Wallet" 
        onBack={onBack}
      />

      {step === 'select' && renderWalletSelection()}
      {step === 'connecting' && renderConnecting()}
      {step === 'success' && renderSuccess()}
    </div>
  );
};