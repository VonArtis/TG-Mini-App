import React, { useState, useEffect } from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { MobileLayout } from '../layout/MobileLayout';
import { FullScreenLoader } from '../common/LoadingSpinner';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';

export const AvailableFundsScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const { portfolio, fetchPortfolio } = useApp();
  const { t } = useLanguage();

  useEffect(() => {
    loadFundsData();
  }, []);

  const loadFundsData = async () => {
    try {
      setLoading(true);
      await fetchPortfolio();
    } catch (error) {
      console.error('Error loading funds data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <FullScreenLoader text="Loading available funds..." />;
  }

  return (
    <MobileLayout centered maxWidth="xs">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <button 
          onClick={onBack} 
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      <div className="mb-6">
        <div className="text-6xl mb-4 text-center">💰</div>
        <h1 className="text-2xl font-bold text-center mb-2">
          {t('funds.title', 'Available Funds')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('funds.subtitle', 'Manage your investment balance')}
        </p>
      </div>

      <div className="w-full space-y-6">
        {/* Total Balance */}
        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-500/30">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">
              ${portfolio?.available_balance?.toLocaleString() || '0.00'}
            </div>
            <div className="text-green-300 text-sm">
              {t('funds.available', 'Available for Investment')}
            </div>
          </div>
        </Card>

        {/* Balance Breakdown */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📊</span>
            {t('funds.breakdown', 'Balance Breakdown')}
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{t('funds.cash', 'Cash Balance')}</span>
              <span className="font-semibold text-blue-400">
                ${portfolio?.cash_balance?.toLocaleString() || '0.00'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{t('funds.crypto', 'Crypto Value')}</span>
              <span className="font-semibold text-orange-400">
                ${portfolio?.crypto_value?.toLocaleString() || '0.00'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{t('funds.pending', 'Pending Deposits')}</span>
              <span className="font-semibold text-yellow-400">
                ${portfolio?.pending_deposits?.toLocaleString() || '0.00'}
              </span>
            </div>
            
            <hr className="border-gray-700" />
            
            <div className="flex justify-between items-center font-semibold">
              <span className="text-white">{t('funds.total', 'Total Available')}</span>
              <span className="text-green-400">
                ${portfolio?.available_balance?.toLocaleString() || '0.00'}
              </span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => onNavigate?.('connect-bank')}
            variant="secondary"
            fullWidth
            className="flex flex-col items-center p-4 h-auto gap-2"
          >
            <span className="text-2xl">🏦</span>
            <span className="text-sm">{t('funds.addFunds', 'Add Funds')}</span>
          </Button>
          
          <Button 
            onClick={() => onNavigate?.('withdrawal')}
            variant="secondary"
            fullWidth
            className="flex flex-col items-center p-4 h-auto gap-2"
          >
            <span className="text-2xl">📤</span>
            <span className="text-sm">{t('funds.withdraw', 'Withdraw')}</span>
          </Button>
        </div>

        <Button 
          onClick={() => onNavigate?.('make-investment')}
          fullWidth
          disabled={!portfolio?.available_balance || portfolio.available_balance <= 0}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {t('funds.invest', 'Start New Investment')}
        </Button>
      </div>
    </MobileLayout>
  );
};