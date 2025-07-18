import React, { useState, useEffect } from 'react';
import type { ScreenProps, Investment } from '../../types';
import { Button } from '../common/Button';
import { FullScreenLoader } from '../common/LoadingSpinner';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';
import { apiService } from '../../services/api';

export const InvestmentsScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useApp();
  const { t } = useLanguage();

  useEffect(() => {
    fetchInvestments();
    
    // Failsafe: Ensure loading stops after 10 seconds
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 10000);

    return () => clearTimeout(timeout);
  }, []);

  const fetchInvestments = async () => {
    try {
      if (!user?.token) {
        console.log('No user token available for investments');
        setLoading(false);
        return;
      }
      
      const data = await apiService.getInvestments(user.token);
      setInvestments(data.investments || []);
    } catch (error) {
      console.error('Error fetching investments:', error);
      // For demo, show sample investments
      setInvestments([
        {
          id: 'demo-1',
          user_id: 'demo-user',
          name: 'Demo Investment 1',
          plan_name: 'Growth Plan',
          amount: 5000,
          current_value: 5250,
          profit: 250,
          rate: 7.5,
          term: 12,
          status: 'active',
          start_date: '2024-01-15',
          maturity_date: '2025-01-15',
          apy_rate: 7.5
        },
        {
          id: 'demo-2', 
          user_id: 'demo-user',
          name: 'Demo Investment 2',
          plan_name: 'Stability Plan',
          amount: 2000,
          current_value: 2080,
          profit: 80,
          rate: 5.0,
          term: 6,
          status: 'active',
          start_date: '2024-02-01',
          maturity_date: '2024-08-01',
          apy_rate: 5.0
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateProgress = (startDate: string, maturityDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(maturityDate).getTime();
    const now = new Date().getTime();
    
    if (now <= start) return 0;
    if (now >= end) return 100;
    
    return ((now - start) / (end - start)) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'completed': return 'text-blue-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🔄';
      case 'completed': return '✅';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + (inv.current_value || inv.amount), 0);
  const totalProfit = totalCurrentValue - totalInvested;

  if (loading) {
    return <FullScreenLoader text="Loading your investments..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">
          {t('investments.title', 'Investment Portfolio')}
        </h1>
        <p className="text-gray-400 text-sm">
          {t('investments.subtitle', 'Track your DeFi investments')}
        </p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-purple-300">
            {formatCurrency(totalInvested)}
          </div>
          <div className="text-xs text-gray-400">
            {t('investments.invested', 'Invested')}
          </div>
        </div>
        
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-green-300">
            {formatCurrency(totalCurrentValue)}
          </div>
          <div className="text-xs text-gray-400">
            {t('investments.current', 'Current')}
          </div>
        </div>
        
        <div className={`border rounded-lg p-4 text-center ${
          totalProfit >= 0 
            ? 'bg-blue-900/20 border-blue-500/30' 
            : 'bg-red-900/20 border-red-500/30'
        }`}>
          <div className={`text-lg font-bold ${
            totalProfit >= 0 ? 'text-blue-300' : 'text-red-300'
          }`}>
            {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
          </div>
          <div className="text-xs text-gray-400">
            {t('investments.profit', 'Profit')}
          </div>
        </div>
      </div>

      {/* New Investment Button */}
      <Button
        onClick={() => onNavigate?.('new-investment')}
        fullWidth
        className="h-12 bg-purple-600 hover:bg-purple-700"
      >
        + {t('investments.newInvestment', 'New Investment')}
      </Button>

      {/* Investments List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-300">
          {t('investments.active', 'Active Investments')}
        </h2>
        
        {investments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              {t('investments.noInvestments', 'No investments yet')}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {t('investments.startInvesting', 'Start your DeFi journey today')}
            </p>
            <Button
              onClick={() => onNavigate?.('new-investment')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {t('investments.makeFirst', 'Make Your First Investment')}
            </Button>
          </div>
        ) : (
          investments.map((investment) => (
            <div
              key={investment.id}
              className="bg-gray-900/50 border border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getStatusIcon(investment.status)}</span>
                  <div>
                    <div className="font-semibold text-white">
                      {investment.plan_name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDate(investment.start_date || '')} - {formatDate(investment.maturity_date || '')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-purple-300">
                    {formatCurrency(investment.current_value || investment.amount)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {investment.apy_rate}% APY
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{t('investments.progress', 'Progress')}</span>
                  <span>{Math.round(calculateProgress(investment.start_date || '', investment.maturity_date || ''))}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${calculateProgress(investment.start_date || '', investment.maturity_date || '')}%`
                    }}
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(investment.status)} bg-gray-800`}>
                  {investment.status.toUpperCase()}
                </span>
                <div className="text-xs text-gray-400">
                  +{formatCurrency((investment.current_value || investment.amount) - investment.amount)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};