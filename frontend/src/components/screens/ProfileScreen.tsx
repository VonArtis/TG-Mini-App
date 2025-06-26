import React, { useEffect, useState } from 'react';
import type { ScreenProps } from '../../types';
import { ScreenHeader } from '../layout/ScreenHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { MembershipBadge } from '../common/MembershipBadge';
import { useApp } from '../../context/AppContext';
import { useMembership } from '../../hooks/useMembership';
import { apiService } from '../../services/api';
import { secureStorage } from '../../utils/secureStorage';

export const ProfileScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const { user, setUser, connected_wallets } = useApp();
  const { membershipStatus, fetchMembershipStatus } = useMembership(user);
  
  // Profile deletion state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteErrors, setDeleteErrors] = useState<string>('');
  
  useEffect(() => {
    fetchMembershipStatus();
  }, [fetchMembershipStatus]);

  const handleLogout = () => {
    // Clear token from secure storage
    secureStorage.removeToken();
    setUser(null);
    alert('Logged out successfully');
    onBack?.();
  };

  const handleEditProfile = () => {
    onNavigate?.('edit-profile');
  };

  const handleDeleteProfile = async () => {
    if (!deletePassword.trim()) {
      setDeleteErrors('Password is required to confirm deletion');
      return;
    }

    setDeleteLoading(true);
    setDeleteErrors('');

    try {
      const response = await apiService.deleteProfile(deletePassword);
      
      if (response.success) {
        alert('Profile deleted successfully. You will now be logged out.');
        // Clear token from secure storage
        secureStorage.removeToken();
        setUser(null);
        onBack?.();
      } else {
        setDeleteErrors(response.message || 'Failed to delete profile');
      }
    } catch (error: any) {
      console.error('Profile deletion error:', error);
      setDeleteErrors(error.response?.data?.detail || 'Failed to delete profile. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const canDeleteProfile = () => {
    // For demo purposes, let's simulate some users having connections
    const hasWallets = connected_wallets && connected_wallets.length > 0;
    const hasBankConnection = user?.bank_connected;
    const hasCryptoConnection = user?.crypto_connected;
    
    // If user has legacy wallet_address, consider it as connected wallet for safety
    const hasLegacyWallet = user?.wallet_address && user?.wallet_address.trim().length > 0;
    
    return !hasWallets && !hasBankConnection && !hasCryptoConnection && !hasLegacyWallet;
  };

  const getDeleteBlockedReason = () => {
    const reasons = [];
    if (connected_wallets && connected_wallets.length > 0) {
      reasons.push(`${connected_wallets.length} connected wallet(s)`);
    }
    if (user?.crypto_connected || (user?.wallet_address && user?.wallet_address.trim().length > 0)) {
      reasons.push('connected crypto wallet');
    }
    if (user?.bank_connected) {
      reasons.push('connected bank account');
    }
    // Note: Would also check active investments in real implementation
    
    return reasons.length > 0 ? `Please disconnect: ${reasons.join(', ')}` : '';
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-12 pb-8">
      <ScreenHeader title="Profile & Settings" onBack={onBack} />

      <div className="space-y-4">
        {/* User Information */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Personal Information</h3>
            <Button onClick={handleEditProfile} size="sm" variant="secondary">
              Edit
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400">Name</p>
              <p className="text-white font-medium">{user?.name || 'Not provided'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-white font-medium">{user?.email || 'Not provided'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400">User ID</p>
              <p className="text-white font-medium text-sm">{user?.id || user?.user_id || 'Not available'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400">Phone</p>
              <p className="text-white font-medium">{user?.phone || 'Not provided'}</p>
            </div>
          </div>
        </Card>

        {/* Membership Status */}
        <Card className="border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Membership Status</h3>
            <Button 
              onClick={() => onNavigate?.('membership-status')} 
              size="sm" 
              variant="secondary"
            >
              View Details
            </Button>
          </div>
          
          {membershipStatus ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MembershipBadge level={membershipStatus.level} size="lg" />
                <div>
                  <p className="text-white font-semibold text-lg">
                    {membershipStatus.emoji} {membershipStatus.level_name}
                  </p>
                  <p className="text-gray-400 text-sm">Current membership tier</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Total Invested</p>
                  <p className="text-white font-semibold">{formatAmount(membershipStatus.total_invested)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Available Plans</p>
                  <p className="text-white font-semibold">{membershipStatus.available_plans?.length || 0}</p>
                </div>
              </div>
              
              {membershipStatus.next_level && (
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-400">Progress to {membershipStatus.next_level_name}</p>
                    <p className="text-sm text-purple-400 font-medium">
                      {membershipStatus.amount_to_next ? formatAmount(membershipStatus.amount_to_next) + ' to go' : 'Achieved!'}
                    </p>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, (membershipStatus.total_invested / (membershipStatus.total_invested + (membershipStatus.amount_to_next || 0))) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MembershipBadge level="club" size="lg" />
                <div>
                  <p className="text-white font-semibold text-lg">
                    🥉 Club Member
                  </p>
                  <p className="text-gray-400 text-sm">Starting membership tier</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Total Invested</p>
                  <p className="text-white font-semibold">$0</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Available Plans</p>
                  <p className="text-white font-semibold">3</p>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-sm text-gray-400 mb-2">Ready to start investing</p>
                <p className="text-sm text-purple-400">Connect a bank account or crypto wallet to begin</p>
              </div>
            </div>
          )}
        </Card>

        {/* Account Status */}
        <Card>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400">Account Type</p>
              <p className="text-white font-semibold">
                {user?.type === 'bank' ? 'Bank Connected' : 
                 user?.type === 'crypto' ? 'Crypto Connected' : 
                 'Standard Account'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400">Authentication Method</p>
              <p className="text-white font-medium">{user?.auth_type || 'Email'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400">Member Since</p>
              <p className="text-white font-medium">June 2025</p>
            </div>
          </div>
        </Card>

        {/* Language Preferences */}
        <Card className="border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Language & Region</h3>
              <p className="text-sm text-gray-400">Choose your preferred language</p>
            </div>
            <span className="text-2xl">🌍</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Display Language
              </label>
              <select 
                className="w-full p-3 bg-gray-900 border border-blue-500/50 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                defaultValue="en"
                onChange={(e) => {
                  // TODO: Implement language change logic
                  console.log('Language changed to:', e.target.value);
                  alert(`Language changed to: ${e.target.options[e.target.selectedIndex].text}`);
                }}
              >
                <option value="en">🇺🇸 English</option>
                <option value="es">🇪🇸 Español (Spanish)</option>
                <option value="fr">🇫🇷 Français (French)</option>
                <option value="de">🇩🇪 Deutsch (German)</option>
                <option value="it">🇮🇹 Italiano (Italian)</option>
                <option value="pt">🇵🇹 Português (Portuguese)</option>
                <option value="ru">🇷🇺 Русский (Russian)</option>
                <option value="zh">🇨🇳 中文 (Chinese)</option>
                <option value="ja">🇯🇵 日本語 (Japanese)</option>
                <option value="ko">🇰🇷 한국어 (Korean)</option>
                <option value="ar">🇸🇦 العربية (Arabic)</option>
                <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
                <option value="tr">🇹🇷 Türkçe (Turkish)</option>
                <option value="pl">🇵🇱 Polski (Polish)</option>
                <option value="nl">🇳🇱 Nederlands (Dutch)</option>
              </select>
            </div>
            
            <div className="bg-blue-900/20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">ℹ️</span>
                <div>
                  <p className="text-sm text-blue-300 font-medium">Coming Soon</p>
                  <p className="text-xs text-blue-400">Full multi-language support is in development. Interface will be translated in the next update.</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Connection Status */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-3">Connection Status</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Bank Account</span>
              <span className={`text-sm px-2 py-1 rounded ${user?.bank_connected ? 'bg-green-900 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                {user?.bank_connected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Crypto Wallet</span>
              <span className={`text-sm px-2 py-1 rounded ${user?.crypto_connected ? 'bg-green-900 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                {user?.crypto_connected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          </div>
        </Card>

        {/* Admin Section - Only show for admin users */}
        {(user?.email === 'admin@vonvault.com' || 
          user?.email === 'harry@vonvault.com' || 
          user?.email?.includes('admin')) && (
          <Card className="border-purple-500/50 bg-gradient-to-r from-purple-900/30 to-purple-800/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold flex items-center gap-2">
                  <span>🛠️</span>
                  Admin Dashboard
                </p>
                <p className="text-sm text-gray-400">Full system administration</p>
              </div>
              <Button
                onClick={() => onNavigate?.('admin-dashboard')}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Open Dashboard
              </Button>
            </div>
          </Card>
        )}

        {/* Profile Deletion Section */}
        <Card className="border-red-500/50">
          <div className="space-y-4">
            <div>
              <p className="text-white font-semibold text-red-400">⚠️ Danger Zone</p>
              <p className="text-sm text-gray-400">Permanently delete your VonVault account</p>
            </div>
            
            {!canDeleteProfile() && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">
                  <strong>Cannot delete profile:</strong> {getDeleteBlockedReason()}
                </p>
              </div>
            )}
            
            {!showDeleteConfirm ? (
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="danger"
                size="sm"
                disabled={!canDeleteProfile()}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600"
              >
                Delete Profile
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <h4 className="text-red-400 font-semibold mb-2">⚠️ Confirm Profile Deletion</h4>
                  <p className="text-sm text-gray-300 mb-3">
                    This action cannot be undone. All your personal data will be permanently removed.
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    Investment records will be preserved for legal/tax purposes but anonymized.
                  </p>
                  
                  <Input
                    label="Enter your password to confirm"
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Password"
                    error={deleteErrors}
                    className="mb-3"
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleDeleteProfile}
                      variant="danger"
                      size="sm"
                      loading={deleteLoading}
                      disabled={deleteLoading || !deletePassword.trim()}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Confirm Delete
                    </Button>
                    <Button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeletePassword('');
                        setDeleteErrors('');
                      }}
                      variant="secondary"
                      size="sm"
                      disabled={deleteLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Button
          onClick={handleLogout}
          variant="danger"
          fullWidth
          size="lg"
        >
          Log Out
        </Button>
      </div>
    </div>
  );
};