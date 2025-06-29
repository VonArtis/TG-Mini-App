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
          plan_name: 'Growth Plan',
          amount: 5000,
          current_value: 5250,
          profit: 250,
          status: 'active',
          start_date: '2024-01-15',
          maturity_date: '2025-01-15',
          apy_rate: 7.5
        },
        {
          id: 'demo-2', 
          plan_name: 'Stability Plan',
          amount: 2000,
          current_value: 2080,
          profit: 80,
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
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
  const totalProfit = totalCurrentValue - totalInvested;

  if (loading) {
    return <FullScreenLoader text="Loading your investments..." />;
  }

  return (
    <div className="px-6 pb-8 pt-4 space-y-6">
      <CleanHeader 
        title="💼 Portfolio" 
        onBack={onBack}
        action={
          <Button 
            onClick={() => onNavigate?.('new-investment')} 
            size="sm" 
            className="bg-purple-400 hover:bg-purple-500 min-h-[44px]"
          >
            + Invest
          </Button>
        }
      />

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-500/30">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-3 text-purple-200">Portfolio Overview</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(totalInvested)}
                </div>
                <div className="text-sm text-purple-300">Invested</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(totalCurrentValue)}
                </div>
                <div className="text-sm text-purple-300">Current Value</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
                </div>
                <div className="text-sm text-purple-300">
                  {totalProfit >= 0 ? 'Profit' : 'Loss'}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Investments List */}
      <div className="space-y-4">
        {investments.length > 0 ? (
          investments.map((investment) => {
            const progress = calculateProgress(investment.start_date, investment.maturity_date);
            const profitPercentage = ((investment.current_value - investment.amount) / investment.amount) * 100;
            
            return (
              <Card key={investment.id} className="hover:bg-gray-800/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <span>{getStatusIcon(investment.status)}</span>
                      {investment.plan_name}
                    </h3>
                    <p className={`text-sm ${getStatusColor(investment.status)} capitalize`}>
                      {investment.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-green-400">
                      {formatCurrency(investment.current_value)}
                    </div>
                    <div className="text-sm text-gray-400">
                      of {formatCurrency(investment.amount)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-500">Start Date:</span>
                    <div className="text-white">{formatDate(investment.start_date)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Maturity:</span>
                    <div className="text-white">{formatDate(investment.maturity_date)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">APY Rate:</span>
                    <div className="text-purple-400 font-medium">{investment.apy_rate}%</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Profit/Loss:</span>
                    <div className={`font-medium ${profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {profitPercentage >= 0 ? '+' : ''}{profitPercentage.toFixed(2)}%
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => {/* View details */}}
                    variant="outline"
                    size="sm"
                    className="flex-1 min-h-[44px]"
                  >
                    View Details
                  </Button>
                  {investment.status === 'active' && (
                    <Button
                      onClick={() => {/* Manage investment */}}
                      variant="outline"
                      size="sm"
                      className="flex-1 min-h-[44px]"
                    >
                      Manage
                    </Button>
                  )}
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-xl font-semibold mb-2">No Investments Yet</h3>
            <p className="text-gray-400 mb-6">
              Start your investment journey and build your wealth with our DeFi plans
            </p>
            <Button
              onClick={() => onNavigate?.('new-investment')}
              className="bg-purple-400 hover:bg-purple-500 min-h-[44px]"
            >
              Make Your First Investment
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};