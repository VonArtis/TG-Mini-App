import React, { useState } from 'react';
import type { ConnectionScreenProps } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { MobileLayoutWithTabs } from '../layout/MobileLayoutWithTabs';
import { CleanHeader } from '../layout/CleanHeader';
import { useLanguage } from '../../hooks/useLanguage';
import { reownAppKitService, type ReownAppKitConnection } from '../../services/ReownAppKitService';
import { cryptoWalletService } from '../../services/CryptoWalletService';
import { motion, AnimatePresence } from 'framer-motion';

export const ConnectCryptoScreen: React.FC<ConnectionScreenProps> = ({ onBack, onNavigate, onConnect }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<ReownAppKitConnection | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [manualName, setManualName] = useState('');
  const { t } = useLanguage();

  // Reown AppKit connection handler
  const handleReownAppKitConnect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const connection = await reownAppKitService.connectWallet();
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
      console.error('Reown AppKit connection failed:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  // Individual wallet connection handlers
  const handleMetaMaskConnect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const connection = await cryptoWalletService.connectMetaMask();
      // Convert to ReownAppKitConnection format for success display
      const reownConnection: ReownAppKitConnection = {
        address: connection.address,
        chainId: 1, // Default to Ethereum mainnet
        provider: connection.provider,
        isConnected: true,
        walletInfo: {
          name: connection.name,
          icon: '🦊'
        }
      };
      setSuccess(reownConnection);

      // Call parent onConnect if provided
      if (onConnect) {
        await onConnect();
      }

      // Delay then navigate to success
      setTimeout(() => {
        onNavigate?.('verification-success');
      }, 2000);

    } catch (error: any) {
      console.error('MetaMask connection failed:', error);
      setError(error.message || 'Failed to connect to MetaMask');
    } finally {
      setLoading(false);
    }
  };

  const handleTrustWalletConnect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const connection = await cryptoWalletService.connectTrustWallet();
      // Convert to ReownAppKitConnection format for success display
      const reownConnection: ReownAppKitConnection = {
        address: connection.address,
        chainId: 1, // Default to Ethereum mainnet
        provider: connection.provider,
        isConnected: true,
        walletInfo: {
          name: connection.name,
          icon: '🛡️'
        }
      };
      setSuccess(reownConnection);

      // Call parent onConnect if provided
      if (onConnect) {
        await onConnect();
      }

      // Delay then navigate to success
      setTimeout(() => {
        onNavigate?.('verification-success');
      }, 2000);

    } catch (error: any) {
      console.error('Trust Wallet connection failed:', error);
      setError(error.message || 'Failed to connect to Trust Wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleCoinbaseWalletConnect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const connection = await cryptoWalletService.connectCoinbaseWallet();
      // Convert to ReownAppKitConnection format for success display
      const reownConnection: ReownAppKitConnection = {
        address: connection.address,
        chainId: 1, // Default to Ethereum mainnet
        provider: connection.provider,
        isConnected: true,
        walletInfo: {
          name: connection.name,
          icon: '🔵'
        }
      };
      setSuccess(reownConnection);

      // Call parent onConnect if provided
      if (onConnect) {
        await onConnect();
      }

      // Delay then navigate to success
      setTimeout(() => {
        onNavigate?.('verification-success');
      }, 2000);

    } catch (error: any) {
      console.error('Coinbase Wallet connection failed:', error);
      setError(error.message || 'Failed to connect to Coinbase Wallet');
    } finally {
      setLoading(false);
    }
  };

  // Manual wallet connection handler
  const handleManualConnect = async () => {
    if (!manualAddress) {
      setError('Please enter a wallet address');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const connection = await reownAppKitService.addManualWallet(manualAddress, manualName || 'Manual Wallet');
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
      console.error('Manual wallet connection failed:', error);
      setError(error.message || 'Failed to add manual wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayoutWithTabs showTabs={false}>
      <CleanHeader title="🔗 Connect Crypto Wallet" onBack={onBack} />
      
      <div className="w-full space-y-6">
        {/* Individual Wallet Connections */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-300">
            {t('crypto.selectWallet', 'Choose Your Wallet')}
          </h2>
          
          {/* MetaMask Connection */}
          <Card className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 border-orange-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🦊</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">MetaMask</h3>
                  <p className="text-sm text-gray-300">
                    {t('crypto.metamaskDesc', 'Connect using MetaMask browser extension')}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleMetaMaskConnect}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
              >
                {t('crypto.connect', 'Connect')}
              </Button>
            </div>
          </Card>

          {/* Trust Wallet Connection */}
          <Card className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🛡️</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Trust Wallet</h3>
                  <p className="text-sm text-gray-300">
                    {t('crypto.trustDesc', 'Connect using Trust Wallet mobile or browser extension')}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleTrustWalletConnect}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              >
                {t('crypto.connect', 'Connect')}
              </Button>
            </div>
          </Card>

          {/* Coinbase Wallet Connection */}
          <Card className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-blue-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🔵</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Coinbase Wallet</h3>
                  <p className="text-sm text-gray-300">
                    {t('crypto.coinbaseDesc', 'Connect using Coinbase Wallet mobile or browser extension')}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleCoinbaseWalletConnect}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              >
                {t('crypto.connect', 'Connect')}
              </Button>
            </div>
          </Card>

          {/* Universal Connection (Reown AppKit fallback) */}
          <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🌐</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Other Wallets</h3>
                  <p className="text-sm text-gray-300">
                    {t('crypto.otherDesc', 'Connect to 300+ other wallets including hardware wallets')}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleReownAppKitConnect}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
              >
                {t('crypto.connect', 'Connect')}
              </Button>
            </div>
          </Card>
        </div>

        {/* Manual Wallet Option */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-semibold text-gray-300">
              {t('crypto.orManual', 'Or Add Manually')}
            </h3>
            <Button
              onClick={() => setShowManualInput(!showManualInput)}
              size="sm"
              variant="outline"
              className="border-gray-600 text-gray-400"
            >
              {showManualInput ? t('crypto.hide', 'Hide') : t('crypto.manual', 'Manual Entry')}
            </Button>
          </div>

          <AnimatePresence>
            {showManualInput && (
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
                        {t('crypto.manualWarning', 'Manual wallets are view-only. For transactions, use the universal connect above.')}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleManualConnect}
                    disabled={!manualAddress || loading}
                    loading={loading}
                    className="mt-4 w-full"
                  >
                    {t('crypto.addManual', 'Add Manual Wallet')}
                  </Button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
                    <span className="font-medium">{success.walletInfo?.name || 'Connected Wallet'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">{t('crypto.address', 'Address')}: </span>
                    <span className="font-mono text-xs">
                      {success.address.slice(0, 6)}...{success.address.slice(-4)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">{t('crypto.network', 'Network')}: </span>
                    <span className="font-medium">
                      {success.chainId === 1 ? 'Ethereum' : `Chain ${success.chainId}`}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-green-300">
                  {t('crypto.redirecting', 'Redirecting to dashboard...')}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

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
              <span>{t('crypto.benefit1', 'Connect to 300+ wallets including hardware wallets')}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>{t('crypto.benefit2', 'Cross-device support (desktop ↔ mobile)')}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>{t('crypto.benefit3', 'Instant deposits and withdrawals')}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>{t('crypto.benefit4', 'Multi-chain support (Ethereum, Polygon, Arbitrum)')}</span>
            </div>
          </div>
        </Card>

        {/* Main Connect Button */}
        <Button 
          onClick={handleReownAppKitConnect}
          disabled={loading || !!success}
          loading={loading}
          fullWidth
          className="h-12 text-lg"
        >
          {success 
            ? t('crypto.connected', 'Connected!') 
            : t('crypto.connectUniversal', 'Connect Your Wallet')
          }
        </Button>
      </div>
    </MobileLayoutWithTabs>
  );
};