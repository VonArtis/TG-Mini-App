import React, { useState, useEffect } from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { MobileLayout } from '../layout/MobileLayout';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../hooks/useLanguage';

export const MembershipStatusScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [membership, setMembership] = useState({
    current_level: 'premium',
    level_name: 'Premium',
    total_invested: 15000,
    next_level: 'vip',
    next_level_name: 'VIP',
    amount_needed: 10000,
    progress_to_next: 60
  });
  const { t } = useLanguage();

  const levels = [
    { 
      id: 'club', 
      name: 'Club', 
      min_investment: 0, 
      color: 'text-orange-400',
      benefits: ['Basic portfolio tracking', 'Email support'] 
    },
    { 
      id: 'premium', 
      name: 'Premium', 
      min_investment: 5000, 
      color: 'text-gray-400',
      benefits: ['Advanced analytics', 'Priority support', 'Monthly reports'] 
    },
    { 
      id: 'vip', 
      name: 'VIP', 
      min_investment: 25000, 
      color: 'text-yellow-400',
      benefits: ['Personal advisor', '24/7 support', 'Exclusive investments'] 
    },
    { 
      id: 'elite', 
      name: 'Elite', 
      min_investment: 100000, 
      color: 'text-red-400',
      benefits: ['Dedicated manager', 'Custom strategies', 'Private events'] 
    }
  ];

  return (
    <MobileLayout centered maxWidth="xs">
      <div className="absolute top-4 right-4">
        <LanguageSelector variant="compact" />
      </div>

      <div className="absolute top-4 left-4">
        <button onClick={onBack} className="p-2 text-gray-400 hover:text-white">←</button>
      </div>
      
      <div className="mb-6">
        <div className="text-6xl mb-4 text-center">⭐</div>
        <h1 className="text-2xl font-bold text-center mb-2">
          {t('membership.title', 'Membership Status')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('membership.subtitle', 'Your VonVault membership level')}
        </p>
      </div>

      <div className="w-full space-y-6">
        {/* Current Status */}
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-purple-300 mb-2">
            {membership.level_name}
          </div>
          <div className="text-gray-400 text-sm mb-4">
            {t('membership.currentLevel', 'Current Level')}
          </div>
          <div className="text-lg font-semibold text-white">
            ${membership.total_invested.toLocaleString()} {t('membership.invested', 'invested')}
          </div>
        </div>

        {/* Progress to Next */}
        {membership.next_level && (
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>{t('membership.progressTo', 'Progress to')} {membership.next_level_name}</span>
              <span>{membership.progress_to_next}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
              <div
                className="bg-purple-500 h-3 rounded-full transition-all"
                style={{ width: `${membership.progress_to_next}%` }}
              />
            </div>
            <div className="text-center text-sm text-gray-400">
              ${membership.amount_needed.toLocaleString()} {t('membership.moreNeeded', 'more needed')}
            </div>
          </div>
        )}

        {/* All Levels */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-300">
            {t('membership.allLevels', 'Membership Levels')}
          </h2>
          
          {levels.map((level) => (
            <div
              key={level.id}
              className={`p-4 border rounded-lg ${
                level.id === membership.current_level
                  ? 'border-purple-500 bg-purple-900/20'
                  : 'border-gray-700 bg-gray-900/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`font-semibold ${level.color}`}>
                  {level.name}
                  {level.id === membership.current_level && (
                    <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-1 rounded">
                      {t('membership.current', 'Current')}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-400">
                  ${level.min_investment.toLocaleString()}+
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {level.benefits.join(' • ')}
              </div>
            </div>
          ))}
        </div>

        <Button 
          onClick={() => onNavigate?.('new-investment')}
          fullWidth
          className="bg-purple-600 hover:bg-purple-700"
        >
          {t('membership.upgrade', 'Upgrade Membership')}
        </Button>
      </div>
    </MobileLayout>
  );
};