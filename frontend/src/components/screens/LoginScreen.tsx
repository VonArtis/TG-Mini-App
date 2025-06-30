import React, { useState } from 'react';
import type { AuthScreenProps } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { PasswordInput } from '../common/PasswordInput';
import { MobileLayout } from '../layout/MobileLayout';
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

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!form.email) {
      newErrors.email = t('auth.emailRequired', 'Email is required');
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = t('auth.emailInvalid', 'Please enter a valid email address');
    }
    
    if (!form.password) {
      newErrors.password = t('auth.passwordRequired', 'Password is required');
    } else if (form.password.length < 8) {
      newErrors.password = t('auth.passwordTooShort', 'Password must be at least 8 characters');
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
        setErrors({ general: t('auth.loginError', 'Invalid email or password') });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrors({ 
        general: error.message || t('auth.loginError', 'Invalid email or password') 
      });
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
        <svg className="h-10 w-10 text-purple-500 mx-auto mb-4" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <polygon points="10,80 40,20 50,35 60,20 90,80 70,80 50,45 30,80" fill="#9333ea" />
          <circle cx="50" cy="50" r="15" fill="none" stroke="#9333ea" strokeWidth="4" />
        </svg>
        <h1 className="text-2xl font-bold text-center mb-2">
          {t('auth.welcomeBack', 'Welcome Back')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('auth.signInSubtitle', 'Sign in to your VonVault account')}
        </p>
      </div>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm text-center">{errors.general}</p>
        </div>
      )}

      <div className="w-full space-y-4">
        <Input
          label={t('auth.email', 'Email Address')}
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          onKeyPress={handleKeyPress}
          error={errors.email}
          placeholder={t('auth.emailPlaceholder', 'Enter your email address')}
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
        />

        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          loading={loading}
          fullWidth
        >
          {t('auth.signIn', 'Sign In')}
        </Button>
      </div>

      <p className="mt-6 text-xs text-center text-gray-500">
        {t('auth.noAccount', "Don't have an account?")}{' '}
        <span 
          className="text-purple-400 cursor-pointer hover:text-purple-300 transition-colors underline"
          onClick={onCreateAccount}
        >
          {t('auth.createAccount', 'Create Account')}
        </span>
      </p>
    </MobileLayout>
  );
};