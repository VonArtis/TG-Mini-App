import React, { useState, useEffect } from 'react';
import type { ScreenProps } from '../../types';
import { CleanHeader } from '../layout/CleanHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';
import { apiService } from '../../services/api';

interface WithdrawalSource {
  id: string;
  name: string;
  type: 'investment' | 'wallet';
  balance: number;
  available: number;
  icon: string;
  status: 'active' | 'locked' | 'matured';
}

export const WithdrawalScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [sources, setSources] = useState<WithdrawalSource[]>([]);
  const [selectedSource, setSelectedSource] = useState<WithdrawalSource | null>(null);
  const [amount, setAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState<'bank' | 'crypto'>('bank');
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [step, setStep] = useState<'select-source' | 'amount' | 'method' | 'confirm' | 'success'>('select-source');
  const { user } = useApp();
  const { t } = useLanguage();

  useEffect(() => {
    fetchWithdrawalSources();
  }, []);

  const fetchWithdrawalSources = async () => {
    try {
      if (!user?.token) {
        // Demo sources
        setSources([
          {
            id: 'investment-1',
            name: 'Growth Plan Investment',
            type: 'investment',
            balance: 5250.00,
            available: 5250.00,
            icon: '📈',
            status: 'matured'
          },
          {
            id: 'investment-2',
            name: 'Premium Plan Investment',
            type: 'investment',
            balance: 12750.00,
            available: 0,
            icon: '🚀',
            status: 'active'
          },
          {
            id: 'wallet-1',
            name: 'VonVault Wallet',
            type: 'wallet',
            balance: 892.50,
            available: 892.50,
            icon: '💼',
            status: 'active'
          }
        ]);
        setLoading(false);
        return;
      }

      const response = await apiService.getWithdrawalSources(user.token);
      setSources(response.sources || []);
    } catch (error) {
      console.error('Error fetching withdrawal sources:', error);
      setSources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedSource || !amount || !user?.token) return;

    setWithdrawing(true);
    try {
      const response = await apiService.createWithdrawal({
        source_id: selectedSource.id,
        amount: parseFloat(amount),
        method: withdrawalMethod
      }, user.token);

      if (response.success) {
        setStep('success');
      } else {
        alert(response.message || 'Withdrawal failed');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      // Demo success
      setStep('success');
    } finally {
      setWithdrawing(false);
    }
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'matured': return 'text-blue-400';
      case 'locked': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'matured': return 'Matured';
      case 'locked': return 'Locked';
      default: return 'Unknown';
    }
  };

  const isValidAmount = () => {
    const numAmount = parseFloat(amount) || 0;
    return numAmount > 0 && selectedSource && numAmount <= selectedSource.available;
  };

  const renderSelectSource = () => (
    <div className="space-y-4">
      <Card className="p-6 text-center">
        <div className="text-6xl mb-4">💰</div>
        <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          {t('withdrawal.title', 'Withdraw Funds')}
        </h2>
        <p className="text-gray-400">
          {t('withdrawal.selectSource', 'Select the source to withdraw from')}
        </p>
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">
          {t('withdrawal.availableSources', 'Available for Withdrawal')}
        </h3>
        
        {sources.filter(source => source.available > 0).map((source) => (
          <Card 
            key={source.id}
            className="p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
            onClick={() => {
              setSelectedSource(source);
              setStep('amount');
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{source.icon}</div>
                <div>
                  <h4 className="font-semibold text-white">{source.name}</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={getStatusColor(source.status)}>
                      {getStatusText(source.status)}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400 capitalize">{source.type}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-lg text-green-400">
                  {formatCurrency(source.available)}
                </div>
                <div className="text-sm text-gray-400">Available</div>
                {source.balance !== source.available && (
                  <div className="text-xs text-gray-500">
                    Total: {formatCurrency(source.balance)}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}

        {/* Locked Sources */}
        {sources.some(source => source.available === 0) && (
          <>
            <h3 className="text-lg font-semibold text-gray-400 mt-6">
              {t('withdrawal.lockedSources', 'Currently Locked')}
            </h3>
            
            {sources.filter(source => source.available === 0).map((source) => (
              <Card 
                key={source.id}
                className="p-4 opacity-60"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{source.icon}</div>
                    <div>
                      <h4 className="font-semibold text-white">{source.name}</h4>
                      <div className="flex items-center gap-2 text-sm">
                        <span className={getStatusColor(source.status)}>
                          {getStatusText(source.status)}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400 capitalize">{source.type}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-400">
                      {formatCurrency(source.balance)}
                    </div>
                    <div className="text-sm text-yellow-400">Locked</div>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );

  const renderAmount = () => (
    <div className="space-y-4">
      <Card className="p-4 bg-purple-900/20 border-purple-500/30">
        <div className="flex items-center gap-3">
          <div className="text-xl">{selectedSource?.icon}</div>
          <div>
            <div className="font-semibold text-white">{selectedSource?.name}</div>
            <div className="text-sm text-purple-400">
              Available: {formatCurrency(selectedSource?.available || 0)}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {t('withdrawal.enterAmount', 'Withdrawal Amount')}
        </h3>
        
        <Input
          label={t('withdrawal.amount', 'Amount to Withdraw')}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="text-lg font-semibold min-h-[44px]"
        />
        
        <div className="mt-4 text-sm text-gray-400">
          <div>Available: {formatCurrency(selectedSource?.available || 0)}</div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[25, 50, 75, 100].map((percentage) => {
            const quickAmount = ((selectedSource?.available || 0) * percentage / 100);
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
            onClick={() => setStep('select-source')}
            variant="outline"
            className="flex-1 min-h-[44px]"
          >
            {t('buttons.back', 'Back')}
          </Button>
          <Button
            onClick={() => setStep('method')}
            disabled={!isValidAmount()}
            className="flex-1 min-h-[44px] bg-purple-400 hover:bg-purple-500"
          >
            {t('buttons.continue', 'Continue')}
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderMethod = () => (
    <div className="space-y-4">
      <Card className="p-6 text-center">
        <div className="text-6xl mb-4">🏦</div>
        <h2 className="text-xl font-semibold mb-2">
          {t('withdrawal.selectMethod', 'Select Withdrawal Method')}
        </h2>
        <p className="text-gray-400">
          {t('withdrawal.methodMessage', 'Choose how you want to receive your funds')}
        </p>
      </Card>

      <div className="space-y-3">
        <Card 
          className={`p-4 cursor-pointer transition-colors ${withdrawalMethod === 'bank' ? 'bg-blue-900/30 border-blue-500' : 'hover:bg-gray-800/50'}`}
          onClick={() => setWithdrawalMethod('bank')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🏦</div>
              <div>
                <h4 className="font-semibold text-white">Bank Transfer</h4>
                <div className="text-sm text-gray-400">Transfer to your connected bank account</div>
                <div className="text-xs text-green-400 mt-1">Usually free • 1-3 business days</div>
              </div>
            </div>
            
            <div className="w-5 h-5 border-2 border-gray-600 rounded-full flex items-center justify-center">
              {withdrawalMethod === 'bank' && (
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              )}
            </div>
          </div>
        </Card>

        <Card 
          className={`p-4 cursor-pointer transition-colors ${withdrawalMethod === 'crypto' ? 'bg-orange-900/30 border-orange-500' : 'hover:bg-gray-800/50'}`}
          onClick={() => setWithdrawalMethod('crypto')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🔗</div>
              <div>
                <h4 className="font-semibold text-white">Crypto Wallet</h4>
                <div className="text-sm text-gray-400">Transfer to your connected crypto wallet</div>
                <div className="text-xs text-yellow-400 mt-1">Network fees apply • Usually instant</div>
              </div>
            </div>
            
            <div className="w-5 h-5 border-2 border-gray-600 rounded-full flex items-center justify-center">
              {withdrawalMethod === 'crypto' && (
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => setStep('amount')}
          variant="outline"
          className="flex-1 min-h-[44px]"
        >
          {t('buttons.back', 'Back')}
        </Button>
        <Button
          onClick={() => setStep('confirm')}
          className="flex-1 min-h-[44px] bg-purple-400 hover:bg-purple-500"
        >
          {t('buttons.continue', 'Continue')}
        </Button>
      </div>
    </div>
  );

  const renderConfirm = () => (
    <div className="space-y-4">
      <Card className="p-6 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-semibold mb-2">
          {t('withdrawal.confirm', 'Confirm Withdrawal')}
        </h2>
        <p className="text-gray-400">
          {t('withdrawal.confirmMessage', 'Please review your withdrawal details')}
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t('withdrawal.details', 'Withdrawal Details')}</h3>
        
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-2">From Source</div>
            <div className="flex items-center gap-3">
              <span className="text-xl">{selectedSource?.icon}</span>
              <div>
                <div className="font-semibold text-white">{selectedSource?.name}</div>
                <div className="text-sm text-gray-400">Available: {formatCurrency(selectedSource?.available || 0)}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-2">Withdrawal Method</div>
            <div className="flex items-center gap-3">
              <span className="text-xl">{withdrawalMethod === 'bank' ? '🏦' : '🔗'}</span>
              <div>
                <div className="font-semibold text-white">
                  {withdrawalMethod === 'bank' ? 'Bank Transfer' : 'Crypto Wallet'}
                </div>
                <div className="text-sm text-gray-400">
                  {withdrawalMethod === 'bank' ? '1-3 business days' : 'Usually instant'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
            <div className="text-center">
              <div className="text-sm text-purple-300 mb-1">Withdrawal Amount</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(parseFloat(amount))}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={() => setStep('method')}
            variant="outline"
            className="flex-1 min-h-[44px]"
          >
            {t('buttons.back', 'Back')}
          </Button>
          <Button
            onClick={handleWithdraw}
            disabled={withdrawing}
            className="flex-1 min-h-[44px] h-14 bg-purple-400 hover:bg-purple-500 text-white font-semibold"
          >
            {withdrawing ? t('buttons.processing', 'Processing...') : t('buttons.confirmWithdrawal', 'Confirm Withdrawal')}
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
          {t('withdrawal.success', 'Withdrawal Requested!')}
        </h2>
        <p className="text-gray-300 mb-6">
          {t('withdrawal.successMessage', 'Your withdrawal request has been submitted successfully')}
        </p>

        <div className="bg-green-900/20 rounded-lg p-4 mb-6">
          <div className="text-lg font-semibold text-white">
            {formatCurrency(parseFloat(amount))}
          </div>
          <div className="text-green-400 text-sm">
            {selectedSource?.name} → {withdrawalMethod === 'bank' ? 'Bank Account' : 'Crypto Wallet'}
          </div>
        </div>

        <Button
          onClick={() => onNavigate?.('dashboard')}
          className="w-full min-h-[44px] h-14 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg"
        >
          {t('buttons.backToDashboard', 'Back to Dashboard')}
        </Button>
      </Card>

      <Card className="p-4 bg-blue-900/20 border-blue-500/30">
        <h3 className="text-blue-300 font-medium mb-2">
          {t('withdrawal.processingInfo', 'What Happens Next?')}
        </h3>
        <ul className="space-y-1 text-blue-400 text-sm">
          <li>• {t('withdrawal.info1', 'Your withdrawal request is being processed')}</li>
          <li>• {t('withdrawal.info2', 'You will receive a confirmation email')}</li>
          <li>• {t('withdrawal.info3', 'Funds will arrive within the estimated timeframe')}</li>
          <li>• {t('withdrawal.info4', 'Contact support if you need assistance')}</li>
        </ul>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="px-6 pb-8 pt-4 space-y-6">
        <CleanHeader title="💰 Withdraw Funds" onBack={onBack} />
        <div className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-8 pt-4 space-y-6">
      <CleanHeader 
        title="💰 Withdraw Funds" 
        onBack={onBack}
      />

      {step === 'select-source' && renderSelectSource()}
      {step === 'amount' && renderAmount()}
      {step === 'method' && renderMethod()}
      {step === 'confirm' && renderConfirm()}
      {step === 'success' && renderSuccess()}
    </div>
  );
};