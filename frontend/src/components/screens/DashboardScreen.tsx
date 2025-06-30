import React, { useState, useEffect } from 'react';
import type { ScreenProps, Portfolio } from '../../types';
import { Button } from '../common/Button';
import { FullScreenLoader } from '../common/LoadingSpinner';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';

export const DashboardScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  
  const { 
    portfolio, 
    fetchPortfolio, 
    membershipStatus, 
    fetchMembershipStatus, 
    user,
    connected_wallets,
    primary_wallet
  } = useApp();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchPortfolio(),
        fetchMembershipStatus()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <FullScreenLoader text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">
          {t('dashboard.welcome', 'Welcome back')}{user?.firstName ? `, ${user.firstName}` : ''}
        </h1>
        <p className="text-gray-400 text-sm">
          {t('dashboard.subtitle', 'Manage your DeFi portfolio')}
        </p>
      </div>

      {/* Portfolio Value Card */}
      {portfolio && (
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-300 mb-2">
            ${portfolio.total_portfolio?.toLocaleString() || '0'}
          </div>
          <div className="text-gray-400 text-sm mb-4">
            {t('dashboard.portfolioValue', 'Total Portfolio Value')}
          </div>
          
          {portfolio.total_profit !== undefined && (
            <div className={`text-sm ${portfolio.total_profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {portfolio.total_profit >= 0 ? '+' : ''}${portfolio.total_profit.toLocaleString()} 
              ({portfolio.total_profit >= 0 ? '+' : ''}{((portfolio.total_profit / (portfolio.total_portfolio - portfolio.total_profit)) * 100).toFixed(1)}%)
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-300">
          {t('dashboard.quickActions', 'Quick Actions')}
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => onNavigate?.('new-investment')}
            className="h-16 bg-purple-600 hover:bg-purple-700 flex flex-col items-center justify-center"
          >
            <span className="text-2xl mb-1">💰</span>
            <span className="text-sm">{t('dashboard.invest', 'Invest')}</span>
          </Button>
          
          <Button
            onClick={() => onNavigate?.('investments')}
            variant="outline"
            className="h-16 border-gray-600 flex flex-col items-center justify-center"
          >
            <span className="text-2xl mb-1">📊</span>
            <span className="text-sm">{t('dashboard.portfolio', 'Portfolio')}</span>
          </Button>
        </div>

        {/* Dynamic Crypto Wallet Button */}
        <Button
          onClick={() => onNavigate?.(user?.crypto_connected ? 'crypto' : 'connect-crypto')}
          variant="outline"
          className={`w-full h-12 transition-all ${
            user?.crypto_connected 
              ? 'border-green-500 text-green-400 hover:bg-green-500/10' 
              : 'border-orange-500 text-orange-400 hover:bg-orange-500/10'
          }`}
        >
          {user?.crypto_connected ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span>💼</span>
                <span>{t('dashboard.myCryptoWallets', 'My Crypto Wallets')}</span>
                {user?.connected_wallets_count && (
                  <span className="text-xs bg-green-500/20 px-2 py-1 rounded-full">
                    {user.connected_wallets_count}
                  </span>
                )}
              </div>
              {user?.total_crypto_value && (
                <span className="text-sm font-medium">
                  ${user.total_crypto_value.toLocaleString()}
                </span>
              )}
            </div>
          ) : (
            <>
              🔗 {t('dashboard.connectWallet', 'Connect Crypto Wallet')}
            </>
          )}
        </Button>
      </div>

      {/* Membership Status */}
      {membershipStatus && (
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-purple-300">
                {membershipStatus.level_name || 'Club'} Member
              </div>
              <div className="text-sm text-gray-400">
                ${membershipStatus.total_invested?.toLocaleString() || '0'} invested
              </div>
            </div>
            <Button
              onClick={() => onNavigate?.('membership-status')}
              size="sm"
              variant="outline"
              className="border-purple-500 text-purple-400"
            >
              {t('dashboard.viewDetails', 'Details')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};