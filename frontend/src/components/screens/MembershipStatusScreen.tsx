import React, { useState, useEffect } from 'react';
import type { ScreenProps } from '../../types';
import { CleanHeader } from '../layout/CleanHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { EnhancedProgressBar } from '../common/EnhancedProgressBar';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';
import { apiService } from '../../services/api';

interface MembershipLevel {
  id: string;
  name: string;
  icon: string;
  min_investment: number;
  benefits: string[];
  color: string;
  description: string;
}

interface UserMembership {
  current_level: string;
  total_invested: number;
  next_level?: string;
  progress_to_next: number;
  amount_needed: number;
}

export const MembershipStatusScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [membership, setMembership] = useState<UserMembership | null>(null);
  const [levels, setLevels] = useState<MembershipLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useApp();
  const { t } = useLanguage();

  useEffect(() => {
    fetchMembershipData();
  }, []);

  const fetchMembershipData = async () => {
    try {
      if (!user?.token) {
        // Demo data
        setLevels([
          {
            id: 'basic',
            name: 'Basic',
            icon: '🌱',
            min_investment: 0,
            benefits: ['Basic investment plans', 'Email support', 'Monthly reports'],
            color: 'text-green-400',
            description: 'Start your investment journey'
          },
          {
            id: 'club',
            name: 'Club',
            icon: '🥉',
            min_investment: 1000,
            benefits: ['Enhanced plans', 'Priority support', 'Weekly reports', 'Lower fees'],
            color: 'text-amber-400',
            description: 'Enhanced benefits for committed investors'
          },
          {
            id: 'premium',
            name: 'Premium',
            icon: '🥈',
            min_investment: 5000,
            benefits: ['Premium plans', 'Phone support', 'Daily reports', 'Reduced fees', 'Advanced analytics'],
            color: 'text-gray-300',
            description: 'Premium experience with advanced features'
          },
          {
            id: 'vip',
            name: 'VIP',
            icon: '🥇',
            min_investment: 25000,
            benefits: ['VIP plans', '24/7 support', 'Real-time reports', 'Lowest fees', 'Personal advisor'],
            color: 'text-yellow-400',
            description: 'Elite status with personal attention'
          },
          {
            id: 'elite',
            name: 'Elite',
            icon: '💎',
            min_investment: 100000,
            benefits: ['Exclusive plans', 'Dedicated advisor', 'Custom reports', 'No fees', 'Priority access'],
            color: 'text-purple-400',
            description: 'Ultimate VIP experience'
          }
        ]);

        setMembership({
          current_level: 'club',
          total_invested: 2500,
          next_level: 'premium',
          progress_to_next: 50,
          amount_needed: 2500
        });
        
        setLoading(false);
        return;
      }

      const response = await apiService.getMembershipStatus(user.token);
      setMembership(response.membership);
      setLevels(response.levels);
    } catch (error) {
      console.error('Error fetching membership data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const getCurrentLevel = () => {
    return levels.find(level => level.id === membership?.current_level);
  };

  const getNextLevel = () => {
    return levels.find(level => level.id === membership?.next_level);
  };

  if (loading) {
    return (
      <div className="px-6 pb-8 pt-4 space-y-6">
        <CleanHeader title="🏆 Membership Status" onBack={onBack} />
        <div className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();

  return (
    <div className="px-6 pb-8 pt-4 space-y-6">
      <CleanHeader 
        title="🏆 Membership Status" 
        onBack={onBack}
      />

      {/* Current Status */}
      <Card className="p-6 text-center bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-500/30">
        <div className="text-6xl mb-4">{currentLevel?.icon}</div>
        <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          {currentLevel?.name} Member
        </h2>
        <p className="text-gray-300 mb-4">{currentLevel?.description}</p>
        
        <div className="bg-purple-900/30 rounded-lg p-4">
          <div className="text-sm text-purple-300 mb-1">Total Invested</div>
          <div className="text-2xl font-bold text-white">
            {formatCurrency(membership?.total_invested || 0)}
          </div>
        </div>
      </Card>

      {/* Progress to Next Level */}
      {nextLevel && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🎯</span>
            Progress to {nextLevel.name}
          </h3>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progress</span>
              <span className="text-purple-400 font-medium">{membership?.progress_to_next}%</span>
            </div>
            <EnhancedProgressBar 
              progress={membership?.progress_to_next || 0}
              color="purple"
              height="h-3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <div className="text-gray-400 mb-1">Amount Needed</div>
              <div className="text-white font-semibold">
                {formatCurrency(membership?.amount_needed || 0)}
              </div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <div className="text-gray-400 mb-1">Next Level</div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-lg">{nextLevel.icon}</span>
                <span className="text-white font-semibold">{nextLevel.name}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => onNavigate?.('new-investment')}
            className="w-full mt-4 min-h-[44px] h-14 bg-purple-400 hover:bg-purple-500"
          >
            Invest More to Upgrade
          </Button>
        </Card>
      )}

      {/* Current Benefits */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-green-400">
          Your Current Benefits
        </h3>
        
        <div className="space-y-3">
          {currentLevel?.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="text-white text-xs">✓</div>
              </div>
              <p className="text-gray-300">{benefit}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* All Membership Levels */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">All Membership Levels</h3>
        
        <div className="space-y-4">
          {levels.map((level) => {
            const isCurrentLevel = level.id === membership?.current_level;
            const isCompleted = levels.findIndex(l => l.id === level.id) < levels.findIndex(l => l.id === membership?.current_level || '');
            
            return (
              <div 
                key={level.id}
                className={`p-4 rounded-lg border ${
                  isCurrentLevel 
                    ? 'bg-purple-900/30 border-purple-500' 
                    : isCompleted
                      ? 'bg-green-900/20 border-green-500/30'
                      : 'bg-gray-800/50 border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{level.icon}</span>
                    <div>
                      <h4 className={`font-semibold ${level.color}`}>
                        {level.name}
                        {isCurrentLevel && (
                          <span className="ml-2 text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                            CURRENT
                          </span>
                        )}
                        {isCompleted && (
                          <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                            ACHIEVED
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-400">{level.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-white">
                      {formatCurrency(level.min_investment)}
                    </div>
                    <div className="text-sm text-gray-400">Minimum</div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-1 text-xs text-gray-400">
                  {level.benefits.slice(0, 3).map((benefit, index) => (
                    <div key={index}>• {benefit}</div>
                  ))}
                  {level.benefits.length > 3 && (
                    <div className="text-purple-400">+{level.benefits.length - 3} more...</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Upgrade Action */}
      <Card className="p-4 bg-blue-900/20 border-blue-500/30">
        <h3 className="text-blue-300 font-medium mb-2">Membership Benefits</h3>
        <ul className="space-y-1 text-blue-400 text-sm">
          <li>• Higher membership levels unlock better investment plans</li>
          <li>• Reduced fees and priority customer support</li>
          <li>• Advanced analytics and reporting features</li>
          <li>• Exclusive access to premium investment opportunities</li>
        </ul>
      </Card>
    </div>
  );
};