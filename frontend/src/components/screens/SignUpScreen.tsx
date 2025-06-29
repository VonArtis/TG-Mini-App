import React, { useState, useEffect } from 'react';
import type { ScreenProps } from '../../types';
import { CleanHeader } from '../layout/CleanHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { PasswordInput } from '../common/PasswordInput';
import { EnhancedProgressBar } from '../common/EnhancedProgressBar';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { validatePhoneNumber } from '../../utils/phoneFormatter';

interface SignUpScreenProps extends ScreenProps {
  onSignUp: (user: any) => void;
  onGoToLogin: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ 
  onBack, 
  onSignUp, 
  onGoToLogin 
}) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showProgress, setShowProgress] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { registerUser } = useAuth();
  const { t } = useLanguage();

  // Calculate completion percentage
  const calculateCompletion = () => {
    let completedSteps = 0;
    const totalSteps = 6;

    // Name fields
    const hasValidName = form.firstName.trim() && form.lastName.trim() && !errors.firstName && !errors.lastName;
    
    // Email validation
    const hasValidEmail = form.email && /\S+@\S+\.\S+/.test(form.email) && !errors.email;
    
    // Password validation
    const hasValidPassword = form.password && form.password.length >= 8 && !errors.password;
    const hasValidConfirmPassword = form.confirmPassword && form.password === form.confirmPassword && !errors.confirmPassword;
    const hasValidPhone = form.phone && validatePhoneNumber(form.phone, 'US') && !errors.phone;
    
    if (hasValidName && hasValidEmail && hasValidPassword && hasValidConfirmPassword && hasValidPhone) {
      completedSteps++; // Form complete = 20%
    }

    return (completedSteps / totalSteps) * 100;
  };

  // Clear errors when form changes
  useEffect(() => {
    setErrors({});
    setShowProgress(Object.values(form).some(field => field.trim() !== ''));
  }, [form]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!form.firstName.trim()) {
      newErrors.firstName = t('validation.required', 'First name is required');
    }
    
    if (!form.lastName.trim()) {
      newErrors.lastName = t('validation.required', 'Last name is required');
    }
    
    if (!form.email.trim()) {
      newErrors.email = t('validation.required', 'Email is required');
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = t('validation.invalidEmail', 'Please enter a valid email address');
    }
    
    if (!form.phone.trim()) {
      newErrors.phone = t('validation.required', 'Phone number is required');
    } else if (!validatePhoneNumber(form.phone, 'US')) {
      newErrors.phone = t('validation.invalidPhone', 'Please enter a valid phone number');
    }
    
    if (!form.password.trim()) {
      newErrors.password = t('validation.required', 'Password is required');
    } else if (form.password.length < 8) {
      newErrors.password = t('validation.passwordLength', 'Password must be at least 8 characters');
    }
    
    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = t('validation.required', 'Please confirm your password');
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = t('validation.passwordMismatch', 'Passwords do not match');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const userData = await registerUser({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password
      });
      
      if (userData) {
        onSignUp(userData);
      } else {
        setErrors({ general: t('auth.registrationError', 'Failed to create account. Please try again.') });
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      setErrors({ 
        general: error.message || t('auth.registrationError', 'Failed to create account. Please try again.') 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 pb-8 pt-4 space-y-6">
      <CleanHeader 
        title="📝 Create Account" 
        onBack={onBack}
      />

      {/* Progress Indicator */}
      {showProgress && (
        <Card className="p-4 bg-purple-900/20 border-purple-500/30">
          <div className="mb-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-300">{t('auth.progress', 'Account Setup Progress')}</span>
              <span className="text-purple-400 font-medium">{Math.round(calculateCompletion())}%</span>
            </div>
          </div>
          <EnhancedProgressBar 
            progress={calculateCompletion()} 
            color="purple"
            height="h-2"
          />
        </Card>
      )}

      <Card className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            {t('auth.joinVonVault', 'Join VonVault')}
          </h2>
          <p className="text-gray-400">
            {t('auth.signUpSubtitle', 'Create your account to start investing')}
          </p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t('auth.firstName', 'First Name')}
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              error={errors.firstName}
              placeholder={t('auth.firstNamePlaceholder', 'John')}
              className="min-h-[44px]"
            />
            
            <Input
              label={t('auth.lastName', 'Last Name')}
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              error={errors.lastName}
              placeholder={t('auth.lastNamePlaceholder', 'Doe')}
              className="min-h-[44px]"
            />
          </div>

          <Input
            label={t('auth.email', 'Email Address')}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
            placeholder={t('auth.emailPlaceholder', 'john@example.com')}
            className="min-h-[44px]"
          />

          <Input
            label={t('auth.phone', 'Phone Number')}
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            error={errors.phone}
            placeholder={t('auth.phonePlaceholder', '+1 (555) 123-4567')}
            className="min-h-[44px]"
          />

          <PasswordInput
            label={t('auth.password', 'Password')}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            placeholder={t('auth.passwordPlaceholder', 'Create a secure password')}
            showPassword={showPassword}
            onToggleVisibility={() => setShowPassword(!showPassword)}
            className="min-h-[44px]"
          />

          <PasswordInput
            label={t('auth.confirmPassword', 'Confirm Password')}
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
            placeholder={t('auth.confirmPasswordPlaceholder', 'Re-enter your password')}
            showPassword={showConfirmPassword}
            onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
            className="min-h-[44px]"
          />

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full min-h-[44px] h-14 bg-purple-400 hover:bg-purple-500 text-white font-semibold text-lg"
          >
            {loading ? t('buttons.creating', 'Creating Account...') : t('buttons.createAccount', 'Create Account')}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            {t('auth.hasAccount', 'Already have an account?')}{' '}
            <button
              onClick={onGoToLogin}
              className="text-purple-400 hover:text-purple-300 font-medium min-h-[44px] px-2 py-1"
            >
              {t('buttons.signIn', 'Sign In')}
            </button>
          </p>
        </div>
      </Card>

      {/* Terms Notice */}
      <Card className="p-4 bg-blue-900/20 border-blue-500/30">
        <div className="text-center">
          <p className="text-blue-400 text-sm">
            {t('auth.termsNotice', 'By creating an account, you agree to our Terms of Service and Privacy Policy')}
          </p>
        </div>
      </Card>
    </div>
  );
};