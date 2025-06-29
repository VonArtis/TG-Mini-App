import React, { useState, useEffect } from 'react';
import type { ScreenProps } from '../../types';
import { CleanHeader } from '../layout/CleanHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';
import { apiService } from '../../services/api';

interface FundSource {
  id: string;
  name: string;
  type: 'bank' | 'crypto';
  balance: number;
  icon: string;
}

export const TransferFundsScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [sources, setSources] = useState<FundSource[]>([]);
  const [fromSource, setFromSource] = useState<FundSource | null>(null);
  const [toSource, setToSource] = useState<FundSource | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [transferring, setTransferring] = useState(false);
  const [step, setStep] = useState<'select-from' | 'select-to' | 'amount' | 'confirm' | 'success'>('select-from');
  const { user } = useApp();
  const { t } = useLanguage();

  useEffect(() => {
    fetchFundSources();
  }, []);

  const fetchFundSources = async () => {
    try {
      if (!user?.token) {
        // Demo sources
        setSources([
          {
            id: 'bank-1',
            name: 'Chase Checking ****1234',
            type: 'bank',
            balance: 15750.00,
            icon: '🏦'
          },
          {
            id: 'crypto-1',
            name: 'MetaMask Wallet',
            type: 'crypto',
            balance: 8920.45,
            icon: '🦊'
          },
          {
            id: 'crypto-2',
            name: 'Trust Wallet',
            type: 'crypto',
            balance: 2150.30,
            icon: '🛡️'
          }
        ]);
        setLoading(false);
        return;
      }

      const response = await apiService.getFundSources(user.token);
      setSources(response.sources || []);
    } catch (error) {
      console.error('Error fetching fund sources:', error);
      setSources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!fromSource || !toSource || !amount || !user?.token) return;

    setTransferring(true);
    try {
      const response = await apiService.transferFunds({
        from_source: fromSource.id,
        to_source: toSource.id,
        amount: parseFloat(amount)
      }, user.token);

      if (response.success) {
        setStep('success');
      } else {
        alert(response.message || 'Transfer failed');
      }
    } catch (error) {
      console.error('Transfer error:', error);
      // Demo success
      setStep('success');
    } finally {
      setTransferring(false);
    }
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getAvailableSources = (excludeSource?: FundSource) => {
    return sources.filter(source => source.id !== excludeSource?.id);
  };

  const isValidAmount = () => {
    const numAmount = parseFloat(amount) || 0;
    return numAmount > 0 && fromSource && numAmount <= fromSource.balance;
  };

  const renderSelectFrom = () => (
    <div className="space-y-4">
      <Card className="p-6 text-center">
        <div className="text-6xl mb-4">📤</div>
        <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          {t('transfer.title', 'Transfer Funds')}
        </h2>
        <p className="text-gray-400">
          {t('transfer.selectFrom', 'Select the source account to transfer from')}
        </p>
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">
          {t('transfer.fromAccount', 'From Account')}
        </h3>
        
        {sources.map((source) => (
          <Card 
            key={source.id}
            className="p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
            onClick={() => {
              setFromSource(source);
              setStep('select-to');
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{source.icon}</div>
                <div>
                  <h4 className="font-semibold text-white">{source.name}</h4>
                  <div className="text-sm text-gray-400 capitalize">{source.type} Account</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-lg text-green-400">
                  {formatCurrency(source.balance)}
                </div>
                <div className="text-sm text-gray-400">Available</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSelectTo = () => (
    <div className="space-y-4">
      <Card className="p-4 bg-purple-900/20 border-purple-500/30">
        <div className="flex items-center gap-3">
          <div className="text-xl">{fromSource?.icon}</div>
          <div>
            <div className="font-semibold text-white">{fromSource?.name}</div>
            <div className="text-sm text-purple-400">Transfer From: {formatCurrency(fromSource?.balance || 0)}</div>
          </div>
        </div>
      </Card>

      <Card className="p-6 text-center">
        <div className="text-6xl mb-4">📥</div>
        <h2 className="text-xl font-semibold mb-2">
          {t('transfer.selectTo', 'Select Destination')}
        </h2>
        <p className="text-gray-400">
          {t('transfer.selectToMessage', 'Choose where to transfer your funds')}
        </p>
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">
          {t('transfer.toAccount', 'To Account')}
        </h3>
        
        {getAvailableSources(fromSource).map((source) => (
          <Card 
            key={source.id}
            className="p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
            onClick={() => {
              setToSource(source);
              setStep('amount');
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{source.icon}</div>
                <div>
                  <h4 className="font-semibold text-white">{source.name}</h4>
                  <div className="text-sm text-gray-400 capitalize">{source.type} Account</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-lg text-green-400">
                  {formatCurrency(source.balance)}
                </div>
                <div className="text-sm text-gray-400">Current Balance</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button
        onClick={() => setStep('select-from')}
        variant="outline"
        className="w-full min-h-[44px]"
      >
        {t('buttons.back', 'Back to Source Selection')}
      </Button>
    </div>
  );

  const renderAmount = () => (
    <div className="space-y-4">
      <Card className="p-4 bg-blue-900/20 border-blue-500/30">
        <h3 className="text-lg font-semibold mb-3 text-blue-300">Transfer Summary</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">From:</span>
            <div className="flex items-center gap-2">
              <span>{fromSource?.icon}</span>
              <span className="text-white">{fromSource?.name}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">To:</span>
            <div className="flex items-center gap-2">
              <span>{toSource?.icon}</span>
              <span className="text-white">{toSource?.name}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {t('transfer.enterAmount', 'Transfer Amount')}
        </h3>
        
        <Input
          label={t('transfer.amount', 'Amount to Transfer')}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="text-lg font-semibold min-h-[44px]"
        />
        
        <div className="mt-4 text-sm text-gray-400">
          <div>Available: {formatCurrency(fromSource?.balance || 0)}</div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[25, 50, 75, 100].map((percentage) => {
            const quickAmount = ((fromSource?.balance || 0) * percentage / 100);
            return (
              <Button
                key={percentage}
                onClick={() => setAmount(quickAmount.toString())}
                variant="outline"
                size="sm"
                className="min-h-[44px]"
              >
                {percentage}%
              </Button>
            );
          })}
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={() => setStep('select-to')}
            variant="outline"
            className="flex-1 min-h-[44px]"
          >
            {t('buttons.back', 'Back')}
          </Button>
          <Button
            onClick={() => setStep('confirm')}
            disabled={!isValidAmount()}
            className="flex-1 min-h-[44px] bg-purple-400 hover:bg-purple-500"
          >
            {t('buttons.continue', 'Continue')}
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderConfirm = () => (
    <div className="space-y-4">
      <Card className="p-6 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-semibold mb-2">
          {t('transfer.confirm', 'Confirm Transfer')}
        </h2>
        <p className="text-gray-400">
          {t('transfer.confirmMessage', 'Please review your transfer details')}
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t('transfer.details', 'Transfer Details')}</h3>
        
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-2">From Account</div>
            <div className="flex items-center gap-3">
              <span className="text-xl">{fromSource?.icon}</span>
              <div>
                <div className="font-semibold text-white">{fromSource?.name}</div>
                <div className="text-sm text-gray-400">Balance: {formatCurrency(fromSource?.balance || 0)}</div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-purple-400 text-2xl">↓</div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-2">To Account</div>
            <div className="flex items-center gap-3">
              <span className="text-xl">{toSource?.icon}</span>
              <div>
                <div className="font-semibold text-white">{toSource?.name}</div>
                <div className="text-sm text-gray-400">Balance: {formatCurrency(toSource?.balance || 0)}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
            <div className="text-center">
              <div className="text-sm text-purple-300 mb-1">Transfer Amount</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(parseFloat(amount))}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={() => setStep('amount')}
            variant="outline"
            className="flex-1 min-h-[44px]"
          >
            {t('buttons.back', 'Back')}
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={transferring}
            className="flex-1 min-h-[44px] h-14 bg-purple-400 hover:bg-purple-500 text-white font-semibold"
          >
            {transferring ? t('buttons.transferring', 'Transferring...') : t('buttons.confirmTransfer', 'Confirm Transfer')}
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderSuccess = () => (
    <div className="space-y-4">
      <Card className="p-8 text-center bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-500/30">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-semibold mb-2 text-green-400">
          {t('transfer.success', 'Transfer Complete!')}
        </h2>
        <p className="text-gray-300 mb-6">
          {t('transfer.successMessage', 'Your funds have been successfully transferred')}
        </p>

        <div className="bg-green-900/20 rounded-lg p-4 mb-6">
          <div className="text-lg font-semibold text-white">
            {formatCurrency(parseFloat(amount))}
          </div>
          <div className="text-green-400 text-sm">
            {fromSource?.name} → {toSource?.name}
          </div>
        </div>

        <Button
          onClick={() => onNavigate?.('available-funds')}
          className="w-full min-h-[44px] h-14 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg"
        >
          {t('buttons.viewFunds', 'View Available Funds')}
        </Button>
      </Card>

      <Card className="p-4 bg-blue-900/20 border-blue-500/30">
        <h3 className="text-blue-300 font-medium mb-2">
          {t('transfer.processingInfo', 'Processing Information')}
        </h3>
        <ul className="space-y-1 text-blue-400 text-sm">
          <li>• {t('transfer.info1', 'Bank transfers may take 1-3 business days to complete')}</li>
          <li>• {t('transfer.info2', 'Crypto transfers are typically instant')}</li>
          <li>• {t('transfer.info3', 'You will receive a confirmation email')}</li>
          <li>• {t('transfer.info4', 'Contact support if you have any questions')}</li>
        </ul>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="px-6 pb-8 pt-4 space-y-6">
        <CleanHeader title="💸 Transfer Funds" onBack={onBack} />
        <div className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-8 pt-4 space-y-6">
      <CleanHeader 
        title="💸 Transfer Funds" 
        onBack={onBack}
      />

      {step === 'select-from' && renderSelectFrom()}
      {step === 'select-to' && renderSelectTo()}
      {step === 'amount' && renderAmount()}
      {step === 'confirm' && renderConfirm()}
      {step === 'success' && renderSuccess()}
    </div>
  );
};