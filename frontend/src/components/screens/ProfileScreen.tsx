import React, { useState } from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { LanguageSelector } from '../common/LanguageSelector';
import { ThemeToggle, useTheme } from '../../hooks/useTheme';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';

export const ProfileScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const { user, setUser } = useApp();
  const { t } = useLanguage();
  const { logout } = useAuth();
  const { theme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const profileSections = [
    {
      title: t('profile.account', 'Account'),
      items: [
        { label: t('profile.editProfile', 'Edit Profile'), icon: '👤', action: 'edit-profile' },
        { label: t('profile.membership', 'Membership Status'), icon: '⭐', action: 'membership-status' },
        { label: t('profile.security', '2FA Security'), icon: '🔐', action: '2fa-setup' }
      ]
    },
    {
      title: t('profile.financial', 'Financial'),
      items: [
        { label: t('profile.funds', 'Available Funds'), icon: '💰', action: 'funds' },
        { label: t('profile.walletManager', 'Wallet Manager'), icon: '👛', action: 'wallet-manager' },
        { label: t('profile.transfer', 'Transfer Funds'), icon: '💸', action: 'transfer-funds' }
      ]
    },
    {
      title: t('profile.settings', 'Settings'),
      items: [
        { label: t('profile.language', 'Language'), icon: '🌐', component: 'language' },
        { label: t('profile.terms', 'Terms of Service'), icon: '📄', action: 'terms-of-service' },
        { label: t('profile.privacy', 'Privacy Policy'), icon: '🔒', action: 'privacy-policy' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">👤</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">
          {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-gray-400 text-sm">
          {user?.email}
        </p>
      </div>

      {/* Profile Sections */}
      {profileSections.map((section, index) => (
        <div key={index} className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-300">
            {section.title}
          </h2>
          
          <div className="space-y-2">
            {section.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-white">{item.label}</span>
                </div>
                
                {item.component === 'language' ? (
                  <LanguageSelector variant="compact" />
                ) : (
                  <button
                    onClick={() => item.action && onNavigate?.(item.action as any)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Logout Button */}
      <div className="pt-6 border-t border-gray-700">
        <Button
          onClick={handleLogout}
          variant="outline"
          fullWidth
          className="border-red-500 text-red-400 hover:bg-red-500/10"
        >
          {t('profile.logout', 'Sign Out')}
        </Button>
      </div>
    </div>
  );
};