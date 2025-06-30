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

        {/* Manual Wallet Input Form */}
        <AnimatePresence>
          {selectedWallet === 'other' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <Card className="bg-gray-800/50 border-gray-600">
                <h4 className="font-semibold mb-4 text-white">
                  {t('crypto.manualWallet', 'Enter Wallet Details')}
                </h4>
                
                <div className="space-y-4">
                  <Input
                    label={t('crypto.walletAddress', 'Wallet Address')}
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="0x..."
                    required
                    className="font-mono text-sm"
                  />
                  
                  <Input
                    label={t('crypto.walletName', 'Wallet Name (Optional)')}
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="My Hardware Wallet"
                  />
                </div>
                
                <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-400 text-sm">⚠️</span>
                    <p className="text-yellow-200 text-xs">
                      {t('crypto.manualWarning', 'Make sure you own this wallet address. VonVault will verify ownership before enabling transactions.')}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="bg-red-900/20 border-red-500/30">
                <div className="flex items-start gap-3">
                  <div className="text-red-400 text-xl">❌</div>
                  <div>
                    <h4 className="text-red-400 font-semibold mb-1">
                      {t('crypto.connectionFailed', 'Connection Failed')}
                    </h4>
                    <p className="text-sm text-red-200">{error}</p>
                    <Button
                      onClick={() => setError(null)}
                      size="sm"
                      variant="outline"
                      className="mt-3 border-red-500 text-red-400 hover:bg-red-500/10"
                    >
                      {t('crypto.tryAgain', 'Try Again')}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Animation */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="bg-green-900/20 border-green-500/30 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-green-400 text-6xl mb-4"
                >
                  ✅
                </motion.div>
                
                <h4 className="text-green-400 font-semibold text-lg mb-2">
                  {t('crypto.connectionSuccess', 'Wallet Connected!')}
                </h4>
                
                <div className="space-y-2 text-sm text-green-200">
                  <div>
                    <span className="text-gray-400">{t('crypto.wallet', 'Wallet')}: </span>
                    <span className="font-medium">{success.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">{t('crypto.address', 'Address')}: </span>
                    <span className="font-mono text-xs">
                      {success.address.slice(0, 6)}...{success.address.slice(-4)}
                    </span>
                  </div>
                  {success.balance && (
                    <div>
                      <span className="text-gray-400">{t('crypto.balance', 'Balance')}: </span>
                      <span className="font-medium">{success.balance} ETH</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-xs text-green-300">
                  {t('crypto.redirecting', 'Redirecting to dashboard...')}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

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
          disabled={!selectedWallet || loading || !!success}
          loading={loading}
          fullWidth
        >
          {success 
            ? t('crypto.connected', 'Connected!') 
            : t('crypto.connect', 'Connect Wallet')
          }
        </Button>
      </div>
    </MobileLayoutWithTabs>
  );
};