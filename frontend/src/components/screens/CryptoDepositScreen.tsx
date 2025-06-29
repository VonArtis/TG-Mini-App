import React, { useState, useEffect } from 'react';
import type { ScreenProps } from '../../types';
import { CleanHeader } from '../layout/CleanHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';
import { apiService } from '../../services/api';

interface DepositMethod {
  id: string;
  name: string;
  network: string;
  token: string;
  address: string;
  qrCode?: string;
  fees: string;
  time: string;
  icon: string;
}

export const CryptoDepositScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [methods, setMethods] = useState<DepositMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<DepositMethod | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'select-method' | 'deposit-info' | 'confirm'>('select-method');
  const { user } = useApp();
  const { t } = useLanguage();

  useEffect(() => {
    fetchDepositMethods();
  }, []);

  const fetchDepositMethods = async () => {
    try {
      if (!user?.token) {
        // Demo methods
        setMethods([
          {
            id: 'usdc-eth',
            name: 'USDC',
            network: 'Ethereum',
            token: 'USDC',
            address: '0x742d35Cc6C5c3Aa3fcC3C6c6c6c6c6c6c6c6c6c6',
            fees: 'Network fees apply',
            time: '~10 minutes',
            icon: '🔵'
          },
          {
            id: 'usdt-eth',
            name: 'USDT',
            network: 'Ethereum',
            token: 'USDT',
            address: '0x742d35Cc6C5c3Aa3fcC3C6c6c6c6c6c6c6c6c6c6',
            fees: 'Network fees apply',
            time: '~10 minutes',
            icon: '🟢'
          },
          {
            id: 'usdc-polygon',
            name: 'USDC',
            network: 'Polygon',
            token: 'USDC',
            address: '0x742d35Cc6C5c3Aa3fcC3C6c6c6c6c6c6c6c6c6c6',
            fees: 'Low fees',
            time: '~2 minutes',
            icon: '🟣'
          },
          {
            id: 'usdt-bsc',
            name: 'USDT',
            network: 'BSC',
            token: 'USDT',
            address: '0x742d35Cc6C5c3Aa3fcC3C6c6c6c6c6c6c6c6c6c6',
            fees: 'Very low fees',
            time: '~3 minutes',
            icon: '🟡'
          }
        ]);
        setLoading(false);
        return;
      }

      const response = await apiService.getDepositMethods(user.token);
      setMethods(response.methods || []);
    } catch (error) {
      console.error('Error fetching deposit methods:', error);
      setMethods([]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Address copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy address');
    });
  };

  const getNetworkColor = (network: string) => {
    switch (network.toLowerCase()) {
      case 'ethereum': return 'text-blue-400';
      case 'polygon': return 'text-purple-400';
      case 'bsc': return 'text-yellow-400';
      case 'arbitrum': return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  const renderSelectMethod = () => (
    <div className="space-y-4">
      <Card className="p-6 text-center">
        <div className="text-6xl mb-4">💰</div>
        <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          {t('deposit.title', 'Deposit Crypto')}
        </h2>
        <p className="text-gray-400">
          {t('deposit.description', 'Choose your preferred cryptocurrency and network')}
        </p>
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">
          {t('deposit.supportedTokens', 'Supported Tokens & Networks')}
        </h3>
        
        {methods.map((method) => (
          <Card 
            key={method.id}
            className="p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
            onClick={() => {
              setSelectedMethod(method);
              setStep('deposit-info');
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{method.icon}</div>
                <div>
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    {method.name}
                    <span className={`text-sm px-2 py-1 rounded ${getNetworkColor(method.network)} bg-current bg-opacity-20`}>
                      {method.network}
                    </span>
                  </h4>
                  <div className="text-sm text-gray-400">{method.fees} • {method.time}</div>
                </div>
              </div>
              
              <div className="text-purple-400">→</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Important Notes */}
      <Card className="p-4 bg-yellow-900/20 border-yellow-500/30">
        <h3 className="text-yellow-300 font-medium mb-2 flex items-center gap-2">
          <span>⚠️</span>
          {t('deposit.importantNotes', 'Important Notes')}
        </h3>
        <ul className="space-y-1 text-yellow-400 text-sm">
          <li>• {t('deposit.note1', 'Only send supported tokens to avoid loss of funds')}</li>
          <li>• {t('deposit.note2', 'Ensure you select the correct network')}</li>
          <li>• {t('deposit.note3', 'Minimum deposit amounts may apply')}</li>
          <li>• {t('deposit.note4', 'Deposits are processed automatically')}</li>
        </ul>
      </Card>
    </div>
  );

  const renderDepositInfo = () => (
    <div className="space-y-4">
      <Card className="p-4 bg-purple-900/20 border-purple-500/30">
        <div className="flex items-center gap-3">
          <div className="text-xl">{selectedMethod?.icon}</div>
          <div>
            <div className="font-semibold text-white flex items-center gap-2">
              {selectedMethod?.name}
              <span className={`text-sm px-2 py-1 rounded ${getNetworkColor(selectedMethod?.network || '')} bg-current bg-opacity-20`}>
                {selectedMethod?.network}
              </span>
            </div>
            <div className="text-sm text-purple-400">{selectedMethod?.fees} • {selectedMethod?.time}</div>
          </div>
        </div>
      </Card>

      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">
          {t('deposit.depositAddress', 'Deposit Address')}
        </h2>
        
        {/* QR Code placeholder */}
        <div className="bg-white p-4 rounded-lg mb-4 inline-block">
          <div className="w-48 h-48 bg-gray-300 rounded flex items-center justify-center">
            <div className="text-gray-600 text-center">
              <div className="text-2xl mb-2">📱</div>
              <div className="text-sm">QR Code</div>
            </div>
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mb-4">
          {t('deposit.scanQR', 'Scan QR code or copy address below')}
        </p>

        {/* Address */}
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
          <div className="text-xs text-gray-400 mb-2">
            {selectedMethod?.network} {selectedMethod?.name} {t('deposit.address', 'Address')}
          </div>
          <div className="font-mono text-sm text-white break-all mb-3">
            {selectedMethod?.address}
          </div>
          <Button
            onClick={() => copyToClipboard(selectedMethod?.address || '')}
            variant="outline"
            size="sm"
            className="w-full min-h-[44px]"
          >
            📋 {t('buttons.copyAddress', 'Copy Address')}
          </Button>
        </div>

        {/* Amount Input */}
        <div className="text-left mb-4">
          <Input
            label={t('deposit.amount', 'Amount (Optional)')}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Enter ${selectedMethod?.name} amount`}
            className="min-h-[44px]"
          />
          <p className="text-xs text-gray-400 mt-2">
            {t('deposit.amountNote', 'Enter the amount you plan to deposit for tracking purposes')}
          </p>
        </div>

        <Button
          onClick={() => setStep('confirm')}
          className="w-full min-h-[44px] h-14 bg-purple-400 hover:bg-purple-500 text-white font-semibold text-lg"
        >
          {t('buttons.confirmDeposit', 'I Have Sent the Deposit')}
        </Button>
      </Card>

      {/* Security Notice */}
      <Card className="p-4 bg-red-900/20 border-red-500/30">
        <h3 className="text-red-300 font-medium mb-2 flex items-center gap-2">
          <span>🚨</span>
          {t('deposit.securityWarning', 'Security Warning')}
        </h3>
        <ul className="space-y-1 text-red-400 text-sm">
          <li>• {t('deposit.warning1', 'Only send')} {selectedMethod?.name} {t('deposit.warning1b', 'on')} {selectedMethod?.network} {t('deposit.warning1c', 'network')}</li>
          <li>• {t('deposit.warning2', 'Sending other tokens or wrong network will result in permanent loss')}</li>
          <li>• {t('deposit.warning3', 'Double-check the address before sending')}</li>
          <li>• {t('deposit.warning4', 'VonVault is not responsible for incorrect deposits')}</li>
        </ul>
      </Card>
    </div>
  );

  const renderConfirm = () => (
    <div className="space-y-4">
      <Card className="p-8 text-center bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-500/30">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-semibold mb-2 text-green-400">
          {t('deposit.confirmed', 'Deposit Confirmed!')}
        </h2>
        <p className="text-gray-300 mb-6">
          {t('deposit.confirmMessage', 'Your deposit is being processed and will appear in your account shortly')}
        </p>

        {amount && (
          <div className="bg-green-900/20 rounded-lg p-4 mb-6">
            <div className="text-lg font-semibold text-white">
              {amount} {selectedMethod?.name}
            </div>
            <div className="text-green-400 text-sm">
              {selectedMethod?.network} Network
            </div>
          </div>
        )}

        <Button
          onClick={() => onNavigate?.('crypto')}
          className="w-full min-h-[44px] h-14 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg"
        >
          {t('buttons.viewWallet', 'View My Wallet')}
        </Button>
      </Card>

      {/* Processing Info */}
      <Card className="p-4 bg-blue-900/20 border-blue-500/30">
        <h3 className="text-blue-300 font-medium mb-2">
          {t('deposit.processingInfo', 'Processing Information')}
        </h3>
        <ul className="space-y-1 text-blue-400 text-sm">
          <li>• {t('deposit.processing1', 'Deposits are processed automatically upon network confirmation')}</li>
          <li>• {t('deposit.processing2', 'Processing time:')} {selectedMethod?.time}</li>
          <li>• {t('deposit.processing3', 'You will receive an email confirmation when processed')}</li>
          <li>• {t('deposit.processing4', 'Contact support if your deposit doesn\'t appear within the expected time')}</li>
        </ul>
      </Card>

      {/* Next Steps */}
      <Card className="p-4 bg-purple-900/20 border-purple-500/30">
        <h3 className="text-purple-300 font-medium mb-2">
          {t('deposit.nextSteps', 'What\'s Next?')}
        </h3>
        <ul className="space-y-1 text-purple-400 text-sm">
          <li>• {t('deposit.step1', 'Your funds will appear in your crypto wallet')}</li>
          <li>• {t('deposit.step2', 'Use them for DeFi investments and earning yield')}</li>
          <li>• {t('deposit.step3', 'Monitor your portfolio performance')}</li>
          <li>• {t('deposit.step4', 'Withdraw anytime to your connected wallets')}</li>
        </ul>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="px-6 pb-8 pt-4 space-y-6">
        <CleanHeader title="💰 Crypto Deposit" onBack={onBack} />
        <div className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-8 pt-4 space-y-6">
      <CleanHeader 
        title="💰 Crypto Deposit" 
        onBack={onBack}
      />

      {step === 'select-method' && renderSelectMethod()}
      {step === 'deposit-info' && renderDepositInfo()}
      {step === 'confirm' && renderConfirm()}
    </div>
  );
};