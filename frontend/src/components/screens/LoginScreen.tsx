import React, { useState } from 'react';
import type { AuthScreenProps } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { PasswordInput } from '../common/PasswordInput';
import { MobileLayout } from '../layout/MobileLayout';
import { LanguageSelector } from '../common/LanguageSelector';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';

interface LoginScreenProps extends AuthScreenProps {
  onLogin: (user: any) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ 
  onBack, 
  onLogin, 
  onCreateAccount 
}) => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();

  // Clear errors when form changes
  useEffect(() => {
    setErrors({});
  }, [form]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!form.email.trim()) {
      newErrors.email = t('validation.required', 'This field is required');
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = t('validation.invalidEmail', 'Please enter a valid email address');
    }
    
    if (!form.password.trim()) {
      newErrors.password = t('validation.required', 'This field is required');
    } else if (form.password.length < 8) {
      newErrors.password = t('validation.passwordLength', 'Password must be at least 8 characters');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const userData = await login(form.email, form.password);
      
      if (userData) {
        onLogin(userData);
      } else {
        setErrors({ general: t('auth.invalidCredentials', 'Invalid email or password') });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrors({ general: error.message || t('auth.loginError', 'Failed to sign in. Please try again.') });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="px-6 pb-8 pt-4 space-y-6">
      <CleanHeader 
        title="🔐 Sign In" 
        onBack={onBack}
      />

      <Card className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            {t('auth.welcomeBack', 'Welcome Back')}
          </h2>
          <p className="text-gray-400">
            {t('auth.signInSubtitle', 'Sign in to your VonVault account')}
          </p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        <div className="space-y-4">
          <Input
            label={t('auth.email', 'Email Address')}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onKeyPress={handleKeyPress}
            error={errors.email}
            placeholder={t('auth.emailPlaceholder', 'Enter your email address')}
            className="min-h-[44px]"
          />

          <PasswordInput
            label={t('auth.password', 'Password')}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyPress={handleKeyPress}
            error={errors.password}
            placeholder={t('auth.passwordPlaceholder', 'Enter your password')}
            showPassword={showPassword}
            onToggleVisibility={() => setShowPassword(!showPassword)}
            className="min-h-[44px]"
          />

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full min-h-[44px] h-14 bg-purple-400 hover:bg-purple-500 text-white font-semibold text-lg"
          >
            {loading ? t('buttons.signingIn', 'Signing In...') : t('buttons.signIn', 'Sign In')}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            {t('auth.noAccount', "Don't have an account?")}{' '}
            <button
              onClick={onCreateAccount}
              className="text-purple-400 hover:text-purple-300 font-medium min-h-[44px] px-2 py-1"
            >
              {t('buttons.createAccount', 'Create Account')}
            </button>
          </p>
        </div>
      </Card>

      {/* Security Notice */}
      <Card className="p-4 bg-blue-900/20 border-blue-500/30">
        <div className="flex items-start gap-3">
          <div className="text-blue-400 text-lg">🔐</div>
          <div>
            <h3 className="text-blue-300 font-medium mb-1">
              {t('auth.securityNotice', 'Security Notice')}
            </h3>
            <p className="text-blue-400 text-sm">
              {t('auth.securityMessage', 'Your account is protected with bank-grade encryption and multi-factor authentication.')}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};