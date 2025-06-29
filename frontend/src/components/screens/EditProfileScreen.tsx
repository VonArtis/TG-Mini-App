import React, { useState, useEffect } from 'react';
import type { ScreenProps } from '../../types';
import { CleanHeader } from '../layout/CleanHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';
import { apiService } from '../../services/api';

export const EditProfileScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const { user, setUser } = useApp();
  const { t } = useLanguage();

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!validateProfileForm()) return;

    setSaving(true);
    try {
      if (!user?.token) {
        setErrors({ general: 'Please log in to update profile' });
        return;
      }

      const response = await apiService.updateProfile({
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone
      }, user.token);

      if (response.success) {
        setUser({ ...user, first_name: form.firstName, last_name: form.lastName, phone: form.phone });
        alert('Profile updated successfully!');
      } else {
        setErrors({ general: response.message || 'Failed to update profile' });
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    setSaving(true);
    try {
      if (!user?.token) {
        setErrors({ general: 'Please log in to change password' });
        return;
      }

      const response = await apiService.changePassword({
        current_password: form.currentPassword,
        new_password: form.newPassword
      }, user.token);

      if (response.success) {
        setForm({ ...form, currentPassword: '', newPassword: '', confirmPassword: '' });
        alert('Password changed successfully!');
      } else {
        setErrors({ general: response.message || 'Failed to change password' });
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to change password' });
    } finally {
      setSaving(false);
    }
  };

  const validateProfileForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!form.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!form.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!form.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!form.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (form.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderProfileTab = () => (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        
        {errors.general && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              error={errors.firstName}
              className="min-h-[44px]"
            />
            
            <Input
              label="Last Name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              error={errors.lastName}
              className="min-h-[44px]"
            />
          </div>

          <Input
            label="Email Address"
            value={form.email}
            disabled
            className="min-h-[44px] bg-gray-800 text-gray-400"
          />

          <Input
            label="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            error={errors.phone}
            className="min-h-[44px]"
          />

          <Button
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full min-h-[44px] h-14 bg-purple-400 hover:bg-purple-500"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        
        {errors.general && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            error={errors.currentPassword}
            className="min-h-[44px]"
          />

          <Input
            label="New Password"
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            error={errors.newPassword}
            className="min-h-[44px]"
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
            className="min-h-[44px]"
          />

          <Button
            onClick={handleChangePassword}
            disabled={saving}
            className="w-full min-h-[44px] h-14 bg-red-600 hover:bg-red-700"
          >
            {saving ? 'Changing...' : 'Change Password'}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Security Actions</h3>
        
        <div className="space-y-3">
          <Button
            onClick={() => onNavigate?.('two-factor-setup')}
            variant="outline"
            className="w-full min-h-[44px] flex items-center justify-between"
          >
            <span>🔐 Two-Factor Authentication</span>
            <span>→</span>
          </Button>
          
          <Button
            onClick={() => onNavigate?.('email-verification')}
            variant="outline"
            className="w-full min-h-[44px] flex items-center justify-between"
          >
            <span>📧 Verify Email</span>
            <span>→</span>
          </Button>
          
          <Button
            onClick={() => onNavigate?.('sms-verification')}
            variant="outline"
            className="w-full min-h-[44px] flex items-center justify-between"
          >
            <span>📱 Verify Phone</span>
            <span>→</span>
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="px-6 pb-8 pt-4 space-y-6">
      <CleanHeader 
        title="✏️ Edit Profile" 
        onBack={onBack}
      />

      {/* Tab Navigation */}
      <Card className="p-4">
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveTab('profile')}
            variant={activeTab === 'profile' ? 'primary' : 'outline'}
            className={`flex-1 min-h-[44px] ${activeTab === 'profile' ? 'bg-purple-400 hover:bg-purple-500' : ''}`}
          >
            👤 Profile
          </Button>
          <Button
            onClick={() => setActiveTab('security')}
            variant={activeTab === 'security' ? 'primary' : 'outline'}
            className={`flex-1 min-h-[44px] ${activeTab === 'security' ? 'bg-purple-400 hover:bg-purple-500' : ''}`}
          >
            🔒 Security
          </Button>
        </div>
      </Card>

      {activeTab === 'profile' && renderProfileTab()}
      {activeTab === 'security' && renderSecurityTab()}
    </div>
  );
};