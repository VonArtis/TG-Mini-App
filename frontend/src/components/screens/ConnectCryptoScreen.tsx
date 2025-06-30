import React, { useState } from 'react';
import type { ConnectionScreenProps } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { MobileLayoutWithTabs } from '../layout/MobileLayoutWithTabs';
import { CleanHeader } from '../layout/CleanHeader';
import { useLanguage } from '../../hooks/useLanguage';
import { cryptoWalletService, type WalletConnection } from '../../services/CryptoWalletService';
import { motion, AnimatePresence } from 'framer-motion';

export const ConnectCryptoScreen: React.FC<ConnectionScreenProps> = ({ onBack, onNavigate, onConnect }) => {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<WalletConnection | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [manualName, setManualName] = useState('');
  const { t } = useLanguage();

  const wallets = [
    {
      id: 'metamask',
      name: t('crypto.metamask', 'MetaMask'),
      description: t('crypto.metamaskDesc', 'Most popular Ethereum wallet'),
      icon: '🦊',
      recommended: true,
      available: cryptoWalletService.isWalletAvailable('metamask')
    },
    {
      id: 'walletconnect',
      name: t('crypto.walletconnect', 'WalletConnect'),
      description: t('crypto.walletconnectDesc', 'Connect any mobile wallet'),
      icon: '🔗',
      recommended: false,
      available: cryptoWalletService.isWalletAvailable('walletconnect')
    },
    {
      id: 'trust',
      name: t('crypto.trust', 'Trust Wallet'),
      description: t('crypto.trustDesc', 'Secure multichain wallet'),
      icon: '🛡️',
      recommended: false,
      available: cryptoWalletService.isWalletAvailable('trust')
    },
    {
      id: 'coinbase',
      name: t('crypto.coinbase', 'Coinbase Wallet'),
      description: t('crypto.coinbaseDesc', 'Self-custody wallet by Coinbase'),
      icon: '🔵',
      recommended: false,
      available: cryptoWalletService.isWalletAvailable('coinbase')
    },
    {
      id: 'other',
      name: t('crypto.other', 'Other Wallet'),
      description: t('crypto.otherDesc', 'Enter wallet address manually'),
      icon: '➕',
      recommended: false,
      available: true
    }
  ];

  // Real wallet connection handler
  const handleConnect = async () => {
    if (!selectedWallet) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let connection: WalletConnection;
      
      switch (selectedWallet) {
        case 'metamask':
          connection = await cryptoWalletService.connectMetaMask();
          break;
        case 'walletconnect':
          connection = await cryptoWalletService.connectWalletConnect();
          break;
        case 'trust':
          connection = await cryptoWalletService.connectTrustWallet();
          break;
        case 'coinbase':
          connection = await cryptoWalletService.connectCoinbaseWallet();
          break;
        case 'other':
          if (!manualAddress) {
            setError('Please enter a wallet address');
            return;
          }
          connection = await cryptoWalletService.connectManualWallet(manualAddress, manualName || 'Manual Wallet');
          break;
        default:
          throw new Error('Invalid wallet selection');
      }
      
      setSuccess(connection);
      
      // Call parent onConnect if provided
      if (onConnect) {
        await onConnect();
      }
      
      // Delay then navigate to success
      setTimeout(() => {
        onNavigate?.('verification-success');
      }, 2000);
      
    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      setError(error.message || 'Failed to connect wallet');
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