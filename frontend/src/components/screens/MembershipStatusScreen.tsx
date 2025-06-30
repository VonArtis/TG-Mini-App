import React, { useState, useEffect } from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { MobileLayout } from '../layout/MobileLayout';
import { FullScreenLoader } from '../common/LoadingSpinner';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';

export const MembershipStatusScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const { membershipStatus, fetchMembershipStatus } = useApp();
  const { t } = useLanguage();

  useEffect(() => {
    loadMembershipData();
  }, []);

  const loadMembershipData = async () => {
    try {
      setLoading(true);
      await fetchMembershipStatus();
    } catch (error) {
      console.error('Error loading membership data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMembershipIcon = (level: string) => {
    switch (level) {
      case 'basic': return '🌱';
      case 'club': return '🥉';
      case 'premium': return '🥈';
      case 'vip': return '🥇';
      case 'elite': return '💎';
      default: return '👤';
    }
  };

  const getNextTierRequirement = (currentTotal: number) => {
    const tiers = [
      { name: 'Basic', requirement: 1000, icon: '🌱' },
      { name: 'Club', requirement: 5000, icon: '🥉' },
      { name: 'Premium', requirement: 25000, icon: '🥈' },
      { name: 'VIP', requirement: 100000, icon: '🥇' },
      { name: 'Elite', requirement: 500000, icon: '💎' }
    ];

    for (const tier of tiers) {
      if (currentTotal < tier.requirement) {
        return {
          ...tier,
          remaining: tier.requirement - currentTotal
        };
      }
    }
    return null;
  };

  if (loading) {
    return <FullScreenLoader text="Loading membership status..." />;
  }

  const nextTier = getNextTierRequirement(membershipStatus?.total_invested || 0);

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
        <div className="text-6xl mb-4 text-center">
          {getMembershipIcon(membershipStatus?.level || 'none')}
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">
          {t('membership.title', 'Membership Status')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('membership.subtitle', 'Track your investment level and benefits')}
        </p>
      </div>

      <div className="w-full space-y-6">
        {/* Current Status */}
        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-500/30">
          <div className="text-center">
            <div className="text-3xl mb-2">
              {getMembershipIcon(membershipStatus?.level || 'none')}
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              {membershipStatus?.level_name || 'No Membership'}
            </h2>
            <p className="text-purple-300 text-sm">
              ${membershipStatus?.total_invested?.toLocaleString() || '0'} {t('membership.invested', 'Invested')}
            </p>
          </div>
        </Card>

        {/* Next Tier Progress */}
        {nextTier && (
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>🎯</span>
              {t('membership.nextTier', 'Next Tier Progress')}
            </h3>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">
                  {t('membership.progressTo', 'Progress to')} {nextTier.name} {nextTier.icon}
                </span>
                <span className="text-sm font-medium">
                  ${nextTier.remaining.toLocaleString()} {t('membership.remaining', 'remaining')}
                </span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${((membershipStatus?.total_invested || 0) / nextTier.requirement) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <Button 
              onClick={() => onNavigate?.('make-investment')}
              fullWidth
              className="bg-purple-600 hover:bg-purple-700"
            >
              {t('membership.investMore', 'Invest More')}
            </Button>
          </Card>
        )}

        {/* Benefits */}
        <Card className="bg-gray-900/50 border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>✨</span>
            {t('membership.benefits', 'Membership Benefits')}
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-green-400">✓</span>
              <span>{t('membership.benefit1', 'Priority customer support')}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-400">✓</span>
              <span>{t('membership.benefit2', 'Enhanced security features')}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-400">✓</span>
              <span>{t('membership.benefit3', 'Exclusive investment opportunities')}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-400">✓</span>
              <span>{t('membership.benefit4', 'Lower withdrawal fees')}</span>
            </div>
          </div>
        </Card>
      </div>
    </MobileLayout>
  );
};