// Comprehensive Notification Service for VonVault
class NotificationService {
  private static instance: NotificationService;
  private isEnabled: boolean = false;
  private permission: NotificationPermission = 'default';

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Initialize notification service
  async init(): Promise<boolean> {
    try {
      // Check if notifications are supported
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return false;
      }

      // Get current permission status
      this.permission = Notification.permission;
      
      // Load user preference from localStorage
      const userPreference = localStorage.getItem('notifications_enabled');
      this.isEnabled = userPreference === 'true';

      return true;
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
      return false;
    }
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    try {
      if (this.permission === 'granted') {
        return true;
      }

      const permission = await Notification.requestPermission();
      this.permission = permission;
      
      if (permission === 'granted') {
        this.isEnabled = true;
        localStorage.setItem('notifications_enabled', 'true');
        return true;
      } else {
        this.isEnabled = false;
        localStorage.setItem('notifications_enabled', 'false');
        return false;
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  // Enable/disable notifications
  async setEnabled(enabled: boolean): Promise<boolean> {
    if (enabled && this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return false;
    }

    this.isEnabled = enabled;
    localStorage.setItem('notifications_enabled', enabled.toString());
    return true;
  }

  // Get current enabled status
  isNotificationsEnabled(): boolean {
    return this.isEnabled && this.permission === 'granted';
  }

  // Send notification
  private async sendNotification(title: string, options: NotificationOptions = {}): Promise<void> {
    if (!this.isNotificationsEnabled()) {
      console.log('Notifications disabled or no permission');
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'vonvault',
        renotify: true,
        requireInteraction: false,
        ...options
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
        if (options.data?.action) {
          this.handleNotificationClick(options.data.action);
        }
      };
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  // Handle notification click actions
  private handleNotificationClick(action: string): void {
    switch (action) {
      case 'view_dashboard':
        // Navigate to dashboard
        window.location.hash = '#dashboard';
        break;
      case 'view_profile':
        // Navigate to profile
        window.location.hash = '#profile';
        break;
      case 'view_security':
        // Navigate to security settings
        window.location.hash = '#profile';
        break;
      default:
        console.log('Unknown notification action:', action);
    }
  }

  // Security Notifications
  async notifyLoginAttempt(location: string, device: string): Promise<void> {
    await this.sendNotification('🔐 New Login Detected', {
      body: `Login from ${device} in ${location}`,
      icon: '🔐',
      data: { action: 'view_security', type: 'security' }
    });
  }

  async notifyPasswordChanged(): Promise<void> {
    await this.sendNotification('🔑 Password Changed', {
      body: 'Your account password has been updated successfully',
      icon: '🔑',
      data: { action: 'view_security', type: 'security' }
    });
  }

  async notifyTwoFactorSetup(): Promise<void> {
    await this.sendNotification('🛡️ 2FA Enabled', {
      body: 'Two-factor authentication has been enabled for your account',
      icon: '🛡️',
      data: { action: 'view_security', type: 'security' }
    });
  }

  async notifySuspiciousActivity(activity: string): Promise<void> {
    await this.sendNotification('⚠️ Security Alert', {
      body: `Suspicious activity detected: ${activity}`,
      icon: '⚠️',
      data: { action: 'view_security', type: 'security' },
      requireInteraction: true
    });
  }

  // Financial Notifications
  async notifyTransaction(type: 'deposit' | 'withdrawal' | 'trade', amount: number, currency: string): Promise<void> {
    const icons = { deposit: '💰', withdrawal: '💸', trade: '📈' };
    const verbs = { deposit: 'Deposited', withdrawal: 'Withdrawn', trade: 'Traded' };
    
    await this.sendNotification(`${icons[type]} Transaction Complete`, {
      body: `${verbs[type]} ${amount} ${currency}`,
      icon: icons[type],
      data: { action: 'view_dashboard', type: 'financial' }
    });
  }

  async notifyInvestmentPerformance(gain: boolean, percentage: number): Promise<void> {
    const icon = gain ? '📈' : '📉';
    const action = gain ? 'gained' : 'lost';
    
    await this.sendNotification(`${icon} Portfolio Update`, {
      body: `Your portfolio ${action} ${percentage}% in the last 24h`,
      icon: icon,
      data: { action: 'view_dashboard', type: 'financial' }
    });
  }

  async notifyPortfolioMilestone(milestone: string): Promise<void> {
    await this.sendNotification('🎉 Milestone Reached!', {
      body: milestone,
      icon: '🎉',
      data: { action: 'view_dashboard', type: 'financial' }
    });
  }

  async notifyPaymentFailure(reason: string): Promise<void> {
    await this.sendNotification('❌ Payment Failed', {
      body: `Payment failed: ${reason}`,
      icon: '❌',
      data: { action: 'view_profile', type: 'financial' },
      requireInteraction: true
    });
  }

  // App Notifications
  async notifyAccountVerification(status: 'pending' | 'approved' | 'rejected'): Promise<void> {
    const icons = { pending: '⏳', approved: '✅', rejected: '❌' };
    const messages = {
      pending: 'Account verification is being processed',
      approved: 'Account verification approved!',
      rejected: 'Account verification was rejected'
    };

    await this.sendNotification(`${icons[status]} Verification Update`, {
      body: messages[status],
      icon: icons[status],
      data: { action: 'view_profile', type: 'app' }
    });
  }

  async notifyNewFeatures(feature: string): Promise<void> {
    await this.sendNotification('🆕 New Feature Available', {
      body: `Check out our new feature: ${feature}`,
      icon: '🆕',
      data: { action: 'view_dashboard', type: 'app' }
    });
  }

  async notifyMaintenance(message: string): Promise<void> {
    await this.sendNotification('🔧 Maintenance Notice', {
      body: message,
      icon: '🔧',
      data: { action: 'view_dashboard', type: 'app' }
    });
  }

  // Test notification
  async sendTestNotification(): Promise<void> {
    await this.sendNotification('🧪 Test Notification', {
      body: 'VonVault notifications are working perfectly!',
      icon: '🧪',
      data: { action: 'view_dashboard', type: 'test' }
    });
  }
}

export const notificationService = NotificationService.getInstance();