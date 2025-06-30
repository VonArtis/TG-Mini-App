import React, { useState } from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { LanguageSelector } from '../common/LanguageSelector';
import { ThemeToggle, useTheme } from '../../hooks/useTheme';
import { useSettings } from '../../hooks/useSettings';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfileScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const { user, setUser } = useApp();
  const { t } = useLanguage();
  const { logout } = useAuth();
  const { theme } = useTheme();
  const { settings, loading, error, actions } = useSettings();
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  // Handle notification toggle
  const handleNotificationToggle = async () => {
    const success = await actions.toggleNotifications();
    if (!success && error) {
      alert(error); // In production, use proper toast/modal
    }
  };

  // Handle biometric toggle
  const handleBiometricToggle = async () => {
    if (!settings.biometric.setup) {
      setShowBiometricSetup(true);
      return;
    }
    
    const success = await actions.toggleBiometric();
    if (!success && error) {
      alert(error); // In production, use proper toast/modal
    }
  };

  // Handle biometric setup
  const handleBiometricSetup = async () => {
    if (!user?.email) {
      alert('User email not available');
      return;
    }

    const success = await actions.setupBiometric(user.id || 'user123', user.email);
    if (success) {
      setShowBiometricSetup(false);
      alert('Biometric authentication setup successful!');
    } else if (error) {
      alert(error);
    }
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
        { label: t('profile.theme', 'Dark/Light Mode'), icon: '🌙', component: 'theme' },
        { label: t('profile.notifications', 'Notifications'), icon: '🔔', component: 'notifications' },
        { label: t('profile.biometric', 'Biometric Auth'), icon: '👆', component: 'biometric' },
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
                ) : item.component === 'theme' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{theme === 'dark' ? 'Dark' : 'Light'}</span>
                    <ThemeToggle />
                  </div>
                ) : item.component === 'notifications' ? (
                  <div className="flex items-center gap-2">
                    {!settings.notifications.supported && (
                      <span className="text-xs text-gray-400">Not supported</span>
                    )}
                    <button
                      onClick={handleNotificationToggle}
                      disabled={!settings.notifications.supported || loading}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.enabled ? 'bg-purple-600' : 'bg-gray-600'
                      } ${!settings.notifications.supported ? 'opacity-50' : ''}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.notifications.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ) : item.component === 'biometric' ? (
                  <div className="flex items-center gap-2">
                    {!settings.biometric.supported && (
                      <span className="text-xs text-gray-400">Not supported</span>
                    )}
                    {!settings.biometric.available && settings.biometric.supported && (
                      <span className="text-xs text-gray-400">Not available</span>
                    )}
                    <button
                      onClick={handleBiometricToggle}
                      disabled={!settings.biometric.supported || !settings.biometric.available || loading}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.biometric.enabled ? 'bg-purple-600' : 'bg-gray-600'
                      } ${(!settings.biometric.supported || !settings.biometric.available) ? 'opacity-50' : ''}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.biometric.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
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

      {/* Biometric Setup Modal */}
      <AnimatePresence>
        {showBiometricSetup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 max-w-sm w-full"
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">👆</div>
                <h2 className="text-xl font-bold mb-2">Setup Biometric Auth</h2>
                <p className="text-sm text-gray-400">
                  Use your fingerprint or face to securely access your account and authorize transactions.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={handleBiometricSetup}
                  fullWidth
                  disabled={loading}
                  loading={loading}
                >
                  Setup Biometric Auth
                </Button>
                
                <Button
                  onClick={() => setShowBiometricSetup(false)}
                  variant="outline"
                  fullWidth
                >
                  Cancel
                </Button>
              </div>

              <div className="mt-4 text-xs text-gray-500 text-center">
                Your biometric data stays secure on your device and is never shared.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};