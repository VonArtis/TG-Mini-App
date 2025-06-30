import { useState, useEffect } from 'react';
import { notificationService } from '../services/NotificationService';
import { biometricAuthService } from '../services/BiometricAuthService';

interface SettingsState {
  notifications: {
    enabled: boolean;
    permission: NotificationPermission;
    supported: boolean;
  };
  biometric: {
    enabled: boolean;
    supported: boolean;
    available: boolean;
    setup: boolean;
    credentialCount: number;
  };
}

export const useSettings = () => {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      enabled: false,
      permission: 'default',
      supported: false,
    },
    biometric: {
      enabled: false,
      supported: false,
      available: false,
      setup: false,
      credentialCount: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize services and load settings
  useEffect(() => {
    const initializeServices = async () => {
      try {
        setLoading(true);
        setError(null);

        // Initialize notification service
        const notificationInit = await notificationService.init();
        
        // Initialize biometric service
        const biometricInit = await biometricAuthService.init();
        const biometricAvailable = await biometricAuthService.isBiometricAvailable();
        const biometricStatus = biometricAuthService.getStatus();

        // Update settings state
        setSettings({
          notifications: {
            enabled: notificationService.isNotificationsEnabled(),
            permission: Notification.permission,
            supported: notificationInit,
          },
          biometric: {
            enabled: biometricStatus.isEnabled,
            supported: biometricStatus.isSupported,
            available: biometricAvailable,
            setup: biometricStatus.isSetup,
            credentialCount: biometricStatus.credentialCount,
          },
        });

      } catch (error) {
        console.error('Failed to initialize settings services:', error);
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    initializeServices();
  }, []);

  // Toggle notifications
  const toggleNotifications = async (): Promise<boolean> => {
    try {
      setError(null);
      const newEnabled = !settings.notifications.enabled;
      const success = await notificationService.setEnabled(newEnabled);

      if (success) {
        setSettings(prev => ({
          ...prev,
          notifications: {
            ...prev.notifications,
            enabled: newEnabled,
            permission: Notification.permission,
          },
        }));

        // Send test notification if enabled
        if (newEnabled) {
          await notificationService.sendTestNotification();
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to toggle notifications:', error);
      setError('Failed to change notification settings');
      return false;
    }
  };

  // Setup biometric authentication
  const setupBiometric = async (userId: string, userEmail: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await biometricAuthService.setupBiometric(userId, userEmail);

      if (success) {
        const status = biometricAuthService.getStatus();
        setSettings(prev => ({
          ...prev,
          biometric: {
            ...prev.biometric,
            enabled: status.isEnabled,
            setup: status.isSetup,
            credentialCount: status.credentialCount,
          },
        }));
      }

      return success;
    } catch (error: any) {
      console.error('Failed to setup biometric:', error);
      setError(error.message || 'Failed to setup biometric authentication');
      return false;
    }
  };

  // Toggle biometric
  const toggleBiometric = async (): Promise<boolean> => {
    try {
      setError(null);
      
      if (!settings.biometric.setup) {
        setError('Biometric authentication must be set up first');
        return false;
      }

      const newEnabled = !settings.biometric.enabled;
      const success = await biometricAuthService.setEnabled(newEnabled);

      if (success) {
        setSettings(prev => ({
          ...prev,
          biometric: {
            ...prev.biometric,
            enabled: newEnabled,
          },
        }));
      }

      return success;
    } catch (error: any) {
      console.error('Failed to toggle biometric:', error);
      setError(error.message || 'Failed to change biometric settings');
      return false;
    }
  };

  // Remove biometric
  const removeBiometric = async (): Promise<boolean> => {
    try {
      setError(null);
      await biometricAuthService.removeBiometric();
      
      const status = biometricAuthService.getStatus();
      setSettings(prev => ({
        ...prev,
        biometric: {
          ...prev.biometric,
          enabled: status.isEnabled,
          setup: status.isSetup,
          credentialCount: status.credentialCount,
        },
      }));

      return true;
    } catch (error) {
      console.error('Failed to remove biometric:', error);
      setError('Failed to remove biometric authentication');
      return false;
    }
  };

  // Test biometric authentication
  const testBiometric = async (): Promise<boolean> => {
    try {
      setError(null);
      return await biometricAuthService.authenticateBiometric();
    } catch (error: any) {
      console.error('Biometric test failed:', error);
      setError(error.message || 'Biometric authentication failed');
      return false;
    }
  };

  return {
    settings,
    loading,
    error,
    actions: {
      toggleNotifications,
      setupBiometric,
      toggleBiometric,
      removeBiometric,
      testBiometric,
    },
    services: {
      notification: notificationService,
      biometric: biometricAuthService,
    },
  };
};