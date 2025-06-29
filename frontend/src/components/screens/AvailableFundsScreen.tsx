import React, { useState, useEffect } from 'react';
import type { ScreenProps } from '../../types';
import { CleanHeader } from '../layout/CleanHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';
import { apiService } from '../../services/api';

interface FundSource {
  type: 'bank' | 'crypto';
  name: string;
  balance: number;
  available: number;
  icon: string;
  status: 'connected' | 'pending' | 'error';
}

export const AvailableFundsScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [funds, setFunds] = useState<FundSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useApp();
  const { t } = useLanguage();

  useEffect(() => {
    fetchAvailableFunds();
  }, []);

  const fetchAvailableFunds = async () => {
    setLoading(true);
    try {
      if (!user?.token) {
        // Show demo data if no token
        setFunds([
          {
            type: 'bank',
            name: 'Chase Checking ****1234',
            balance: 15750.00,
            available: 15750.00,
            icon: '🏦',
            status: 'connected'
          },
          {
            type: 'crypto',
            name: 'MetaMask Wallet',
            balance: 8920.45,
            available: 8920.45,
            icon: '🦊',
            status: 'connected'
          },
          {
            type: 'crypto',
            name: 'Trust Wallet',
            balance: 2150.30,
            available: 2150.30,
            icon: '🛡️',
            status: 'connected'
          }
        ]);
        setLoading(false);
        return;
      }

      const response = await apiService.getAvailableFunds(user.token);
      setFunds(response.funds || []);
    } catch (error) {
      console.error('Error fetching available funds:', error);
      // Fallback to demo data
      setFunds([
        {
          type: 'bank',
          name: 'Bank Account',
          balance: 5000.00,
          available: 5000.00,
          icon: '🏦',
          status: 'connected'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAvailableFunds();
    setRefreshing(false);
  };

  const getTotalBalance = () => {
    return funds.reduce((total, fund) => total + fund.available, 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return '✅';
      case 'pending': return '⏳';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <div className="px-6 pb-8 pt-4 space-y-6">
        <CleanHeader title="💰 Available Funds" onBack={onBack} />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-8 pt-4 space-y-6">
      <CleanHeader 
        title="💰 Available Funds" 
        onBack={onBack}
        action={
          <Button 
            onClick={handleRefresh} 
            size="sm" 
            variant="outline"
            disabled={refreshing}
            className="min-h-[44px]"
          >
            {refreshing ? '↻' : '⟲'}
          </Button>
        }
      />

      {/* Total Available */}
      <Card className="p-6 text-center bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-500/30">
        <h2 className="text-lg font-semibold mb-2 text-green-200">
          {t('funds.totalAvailable', 'Total Available Funds')}
        </h2>
        <div className="text-4xl font-bold text-white mb-2">
          {formatCurrency(getTotalBalance())}
        </div>
        <p className="text-green-300 text-sm">
          {t('funds.readyToInvest', 'Ready to invest across')} {funds.length} {t('funds.sources', 'sources')}
        </p>
      </Card>

      {/* Fund Sources */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">
          {t('funds.fundSources', 'Fund Sources')}
        </h3>

        {funds.length > 0 ? (
          funds.map((fund, index) => (
            <Card key={index} className="p-4 hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{fund.icon}</div>
                  <div>
                    <h4 className="font-semibold text-white">{fund.name}</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={getStatusColor(fund.status)}>
                        {getStatusIcon(fund.status)} {fund.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-lg text-green-400">
                    {formatCurrency(fund.available)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {t('funds.available', 'Available')}
                  </div>
                  {fund.balance !== fund.available && (
                    <div className="text-xs text-gray-500">
                      {t('funds.total', 'Total')}: {formatCurrency(fund.balance)}
                    </div>
                  )}
                </div>
              </div>

              {/* Fund Actions */}
              <div className="flex gap-2 mt-4">
                {fund.type === 'bank' ? (
                  <>
                    <Button
                      onClick={() => onNavigate?.('transfer-funds', { sourceType: 'bank', sourceName: fund.name })}
                      variant="outline"
                      size="sm"
                      className="flex-1 min-h-[44px]"
                    >
                      {t('buttons.transfer', 'Transfer')}
                    </Button>
                    <Button
                      onClick={() => onNavigate?.('withdrawal', { sourceType: 'bank', sourceName: fund.name })}
                      variant="outline"
                      size="sm"
                      className="flex-1 min-h-[44px]"
                    >
                      {t('buttons.withdraw', 'Withdraw')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => onNavigate?.('crypto-deposit', { walletName: fund.name })}
                      variant="outline"
                      size="sm"
                      className="flex-1 min-h-[44px]"
                    >
                      {t('buttons.deposit', 'Deposit')}
                    </Button>
                    <Button
                      onClick={() => onNavigate?.('crypto', { walletName: fund.name })}
                      variant="outline"
                      size="sm"
                      className="flex-1 min-h-[44px]"
                    >
                      {t('buttons.manage', 'Manage')}
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-2">{t('funds.noFunds', 'No Funding Sources')}</h3>
            <p className="text-gray-400 mb-6">
              {t('funds.noFundsMessage', 'Connect a bank account or crypto wallet to start investing')}
            </p>
            
            <div className="flex gap-3">
              <Button
                onClick={() => onNavigate?.('connect-bank')}
                className="flex-1 min-h-[44px] bg-blue-600 hover:bg-blue-700"
              >
                {t('buttons.connectBank', 'Connect Bank')}
              </Button>
              <Button
                onClick={() => onNavigate?.('connect-crypto')}
                className="flex-1 min-h-[44px] bg-orange-600 hover:bg-orange-700"
              >
                {t('buttons.connectWallet', 'Connect Wallet')}
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      {funds.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-400">
            {t('funds.quickActions', 'Quick Actions')}
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => onNavigate?.('new-investment')}
              className="h-16 flex flex-col items-center justify-center space-y-1 min-h-[44px] bg-purple-400 hover:bg-purple-500"
            >
              <span className="text-lg">🚀</span>
              <span className="text-sm">{t('buttons.invest', 'Start Investing')}</span>
            </Button>
            
            <Button
              onClick={() => onNavigate?.('transfer-funds')}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center space-y-1 min-h-[44px]"
            >
              <span className="text-lg">💸</span>
              <span className="text-sm">{t('buttons.transfer', 'Transfer Funds')}</span>
            </Button>
          </div>
        </Card>
      )}

      {/* Funding Tips */}
      <Card className="p-4 bg-blue-900/20 border-blue-500/30">
        <h3 className="text-blue-300 font-medium mb-2">
          {t('funds.tips', 'Funding Tips')}
        </h3>
        <ul className="space-y-1 text-blue-400 text-sm">
          <li>• {t('funds.tip1', 'Bank transfers are free but take 1-3 business days')}</li>
          <li>• {t('funds.tip2', 'Crypto deposits are instant but may have network fees')}</li>
          <li>• {t('funds.tip3', 'Keep some funds liquid for quick investment opportunities')}</li>
          <li>• {t('funds.tip4', 'Higher balances unlock premium investment plans')}</li>
        </ul>
      </Card>
    </div>
  );
};