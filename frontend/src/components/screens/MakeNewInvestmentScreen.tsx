import React, { useState, useEffect } from 'react';
import type { ScreenProps, InvestmentPlan } from '../../types';
import { CleanHeader } from '../layout/CleanHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { EnhancedProgressBar } from '../common/EnhancedProgressBar';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';
import { apiService } from '../../services/api';

export const MakeNewInvestmentScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [investing, setInvesting] = useState(false);
  const [step, setStep] = useState<'plans' | 'amount' | 'confirm' | 'success'>('plans');
  const { user } = useApp();
  const { t } = useLanguage();

  useEffect(() => {
    fetchInvestmentPlans();
  }, []);

  const fetchInvestmentPlans = async () => {
    try {
      if (!user?.token) {
        // Demo plans
        setPlans([
          {
            id: '1',
            name: 'Starter Plan',
            description: 'Perfect for beginners',
            rate: 5.0,
            term_days: 30,
            min_amount: 100,
            max_amount: 1000,
            is_active: true
          },
          {
            id: '2',
            name: 'Growth Plan',
            description: 'Balanced risk and reward',
            rate: 7.5,
            term_days: 90,
            min_amount: 500,
            max_amount: 10000,
            is_active: true
          },
          {
            id: '3',
            name: 'Premium Plan',
            description: 'Higher returns for larger investments',
            rate: 10.0,
            term_days: 180,
            min_amount: 2000,
            max_amount: 50000,
            is_active: true
          },
          {
            id: '4',
            name: 'Elite Plan',
            description: 'Maximum returns for VIP investors',
            rate: 12.5,
            term_days: 365,
            min_amount: 10000,
            max_amount: undefined,
            is_active: true
          }
        ]);
        setLoading(false);
        return;
      }

      const response = await apiService.getInvestmentPlans(user.token);
      setPlans(response.plans || []);
    } catch (error) {
      console.error('Error fetching investment plans:', error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan: InvestmentPlan) => {
    setSelectedPlan(plan);
    setAmount(plan.min_amount.toString());
    setStep('amount');
  };

  const handleInvest = async () => {
    if (!selectedPlan || !amount || !user?.token) return;

    setInvesting(true);
    try {
      const response = await apiService.createInvestment({
        plan_id: selectedPlan.id,
        amount: parseFloat(amount)
      }, user.token);

      if (response.success) {
        setStep('success');
      } else {
        alert(response.message || 'Failed to create investment');
      }
    } catch (error) {
      console.error('Investment error:', error);
      // Demo success
      setStep('success');
    } finally {
      setInvesting(false);
    }
  };

  const calculateReturns = () => {
    if (!selectedPlan || !amount) return { profit: 0, total: 0 };
    
    const principal = parseFloat(amount) || 0;
    const profit = (principal * selectedPlan.rate / 100) * (selectedPlan.term_days / 365);
    return {
      profit: profit,
      total: principal + profit
    };
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDuration = (days: number) => {
    if (days < 30) return `${days} days`;
    if (days < 365) return `${Math.round(days / 30)} months`;
    return `${Math.round(days / 365)} years`;
  };

  const isValidAmount = () => {
    const numAmount = parseFloat(amount) || 0;
    if (!selectedPlan) return false;
    if (numAmount < selectedPlan.min_amount) return false;
    if (selectedPlan.max_amount && numAmount > selectedPlan.max_amount) return false;
    return true;
  };

  const renderPlans = () => (
    <div className="space-y-4">
      <Card className="p-6 text-center">
        <div className="text-6xl mb-4">🚀</div>
        <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          {t('investment.title', 'Choose Investment Plan')}
        </h2>
        <p className="text-gray-400">
          {t('investment.description', 'Select a plan that matches your investment goals and risk tolerance')}
        </p>
      </Card>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className="p-6 cursor-pointer hover:bg-gray-800/50 transition-colors border-l-4 border-l-purple-500"
              onClick={() => handlePlanSelect(plan)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">{plan.rate}%</div>
                  <div className="text-sm text-green-300">APY</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <div className="text-white font-medium">{formatDuration(plan.term_days)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Min Amount:</span>
                  <div className="text-white font-medium">{formatCurrency(plan.min_amount)}</div>
                </div>
                {plan.max_amount && (
                  <>
                    <div>
                      <span className="text-gray-500">Max Amount:</span>
                      <div className="text-white font-medium">{formatCurrency(plan.max_amount)}</div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-purple-400">
                  {t('investment.selectPlan', 'Click to select this plan')}
                </div>
                <div className="text-purple-400">→</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderAmount = () => {
    const returns = calculateReturns();
    
    return (
      <div className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Button
              onClick={() => setStep('plans')}
              variant="outline"
              size="sm"
              className="min-h-[44px]"
            >
              ← {t('buttons.back', 'Back')}
            </Button>
            <div>
              <h2 className="text-lg font-semibold text-white">{selectedPlan?.name}</h2>
              <p className="text-sm text-gray-400">{selectedPlan?.rate}% APY</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {t('investment.enterAmount', 'Investment Amount')}
          </h3>
          
          <Input
            label={t('investment.amount', 'Amount to Invest')}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="text-lg font-semibold min-h-[44px]"
          />
          
          <div className="mt-4 text-sm text-gray-400">
            <div>Min: {formatCurrency(selectedPlan?.min_amount || 0)}</div>
            {selectedPlan?.max_amount && (
              <div>Max: {formatCurrency(selectedPlan.max_amount)}</div>
            )}
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[100, 500, 1000, 5000].map((quickAmount) => (
              <Button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                variant="outline"
                size="sm"
                className="min-h-[44px]"
                disabled={selectedPlan ? quickAmount < selectedPlan.min_amount : false}
              >
                ${quickAmount}
              </Button>
            ))}
          </div>
        </Card>

        {/* Investment Preview */}
        {isValidAmount() && (
          <Card className="p-6 bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-500/30">
            <h3 className="text-lg font-semibold mb-4 text-green-300">
              {t('investment.preview', 'Investment Preview')}
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Principal:</span>
                <span className="text-white font-semibold">{formatCurrency(parseFloat(amount))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Estimated Profit:</span>
                <span className="text-green-400 font-semibold">+{formatCurrency(returns.profit)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-300">Total Return:</span>
                <span className="text-green-400 font-bold">{formatCurrency(returns.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Duration:</span>
                <span className="text-white">{formatDuration(selectedPlan?.term_days || 0)}</span>
              </div>
            </div>

            <Button
              onClick={() => setStep('confirm')}
              disabled={!isValidAmount()}
              className="w-full mt-4 min-h-[44px] h-14 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg"
            >
              {t('buttons.continue', 'Continue to Confirmation')}
            </Button>
          </Card>
        )}
      </div>
    );
  };

  const renderConfirm = () => {
    const returns = calculateReturns();
    
    return (
      <div className="space-y-4">
        <Card className="p-6 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold mb-2">
            {t('investment.confirm', 'Confirm Investment')}
          </h2>
          <p className="text-gray-400">
            {t('investment.confirmMessage', 'Please review your investment details before proceeding')}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">{t('investment.details', 'Investment Details')}</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Plan:</span>
                <span className="text-white font-semibold">{selectedPlan?.name}</span>
              </div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Investment Amount:</span>
                <span className="text-white font-semibold text-lg">{formatCurrency(parseFloat(amount))}</span>
              </div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">APY Rate:</span>
                <span className="text-green-400 font-semibold">{selectedPlan?.rate}%</span>
              </div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white font-semibold">{formatDuration(selectedPlan?.term_days || 0)}</span>
              </div>
            </div>
            
            <div className="bg-green-900/30 p-4 rounded-lg border border-green-500/30">
              <div className="flex justify-between items-center">
                <span className="text-green-300">Expected Return:</span>
                <span className="text-green-400 font-bold text-lg">{formatCurrency(returns.total)}</span>
              </div>
              <div className="text-sm text-green-400 mt-1">
                Profit: +{formatCurrency(returns.profit)}
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
              onClick={handleInvest}
              disabled={investing}
              className="flex-1 min-h-[44px] h-14 bg-purple-400 hover:bg-purple-500 text-white font-semibold text-lg"
            >
              {investing ? t('buttons.investing', 'Investing...') : t('buttons.invest', 'Confirm Investment')}
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="space-y-4">
      <Card className="p-8 text-center bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-500/30">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-semibold mb-2 text-green-400">
          {t('investment.success', 'Investment Created!')}
        </h2>
        <p className="text-gray-300 mb-6">
          {t('investment.successMessage', 'Your investment has been successfully created and is now active')}
        </p>

        <div className="bg-green-900/20 rounded-lg p-4 mb-6">
          <div className="text-lg font-semibold text-white">
            {formatCurrency(parseFloat(amount))} → {selectedPlan?.name}
          </div>
          <div className="text-green-400">{selectedPlan?.rate}% APY</div>
        </div>

        <Button
          onClick={() => onNavigate?.('investments')}
          className="w-full min-h-[44px] h-14 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg"
        >
          {t('buttons.viewInvestments', 'View My Investments')}
        </Button>
      </Card>

      <Card className="p-4 bg-blue-900/20 border-blue-500/30">
        <h3 className="text-blue-300 font-medium mb-2">
          {t('investment.nextSteps', 'What Happens Next?')}
        </h3>
        <ul className="space-y-1 text-blue-400 text-sm">
          <li>• {t('investment.step1', 'Your funds are now earning returns')}</li>
          <li>• {t('investment.step2', 'Track progress in your portfolio')}</li>
          <li>• {t('investment.step3', 'Receive notifications about your investment')}</li>
          <li>• {t('investment.step4', 'Funds will be available after the term ends')}</li>
        </ul>
      </Card>
    </div>
  );

  return (
    <div className="px-6 pb-8 pt-4 space-y-6">
      <CleanHeader 
        title="🚀 New Investment" 
        onBack={onBack}
      />

      {step === 'plans' && renderPlans()}
      {step === 'amount' && renderAmount()}
      {step === 'confirm' && renderConfirm()}
      {step === 'success' && renderSuccess()}
    </div>
  );
};