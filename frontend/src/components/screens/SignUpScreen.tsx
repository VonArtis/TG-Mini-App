import React, { useState, useEffect } from 'react';
import type { AuthScreenProps } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { PasswordInput } from '../common/PasswordInput';
import { CountryPhoneSelector } from '../common/CountryPhoneSelector';
import { MobileLayout } from '../layout/MobileLayout';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { validatePhoneNumber } from '../../utils/phoneFormatter';

interface SignUpScreenProps extends AuthScreenProps {
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
    countryCode: '+1', // Default country code
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showProgress, setShowProgress] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [capsLockWarning, setCapsLockWarning] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const { registerUser } = useAuth();
  const { t } = useLanguage();

  // Real-time Email Availability Checking
  const checkEmailAvailability = async (email: string) => {
    if (!email || !email.includes('@')) {
      setEmailAvailable(null);
      return;
    }

    setEmailChecking(true);
    try {
      // Simulate API call to check email availability
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock logic: admin emails are "taken", others are available
      const isAdminEmail = ['admin@vonartis.com', 'security@vonartis.com', 'test@test.com'].includes(email.toLowerCase());
      setEmailAvailable(!isAdminEmail);
    } catch (error) {
      console.error('Email availability check failed:', error);
      setEmailAvailable(null);
    } finally {
      setEmailChecking(false);
    }
  };

  // Debounced email checking
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (form.email && form.email.includes('@')) {
        checkEmailAvailability(form.email);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [form.email]);

  // Auto-focus logic for intelligent field progression
  const handleFieldComplete = (field: string, value: string) => {
    setTimeout(() => {
      switch (field) {
        case 'firstName':
          if (value.trim().length >= 2) {
            const lastNameInput = document.querySelector('input[name="lastName"]') as HTMLInputElement;
            if (lastNameInput) lastNameInput.focus();
          }
          break;
        case 'lastName':
          if (value.trim().length >= 2) {
            const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
            if (emailInput) emailInput.focus();
          }
          break;
        case 'email':
          if (/\S+@\S+\.\S+/.test(value)) {
            const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
            if (passwordInput) passwordInput.focus();
          }
          break;
        case 'password':
          if (value.length >= 8) {
            const confirmPasswordInput = document.querySelectorAll('input[type="password"]')[1] as HTMLInputElement;
            if (confirmPasswordInput) confirmPasswordInput.focus();
          }
          break;
        case 'confirmPassword':
          if (value === form.password && value.length >= 8) {
            const phoneInput = document.querySelector('input[type="tel"]') as HTMLInputElement;
            if (phoneInput) phoneInput.focus();
          }
          break;
      }
    }, 100);
  };

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
    const hasValidPhone = form.phone && validatePhoneNumber(form.phone, form.countryCode).isValid && !errors.phone;
    
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
    } else {
      const phoneValidation = validatePhoneNumber(form.phone, form.countryCode);
      if (!phoneValidation.isValid) {
        newErrors.phone = phoneValidation.message || t('validation.invalidPhone', 'Please enter a valid phone number');
      }
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

  const isFormValid = () => {
    return form.firstName.trim() && 
           form.lastName.trim() && 
           form.email.trim() && 
           form.phone.trim() && 
           form.password.trim() && 
           form.confirmPassword.trim() &&
           Object.keys(errors).length === 0;
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
          {t('auth.joinVonVault', 'Join VonVault')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('auth.signUpSubtitle', 'Create your account to start investing')}
        </p>
      </div>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm text-center">{errors.general}</p>
        </div>
      )}

      <div className="w-full space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t('auth.firstName', 'First Name')}
            name="firstName"
            value={form.firstName}
            onChange={(e) => {
              const value = e.target.value;
              setForm({ ...form, firstName: value });
              handleFieldComplete('firstName', value);
            }}
            error={errors.firstName}
            placeholder={t('auth.firstNamePlaceholder', 'First name')}
            inputMode="text"
            autoComplete="given-name"
          />
          
          <Input
            label={t('auth.lastName', 'Last Name')}
            name="lastName"
            value={form.lastName}
            onChange={(e) => {
              const value = e.target.value;
              setForm({ ...form, lastName: value });
              handleFieldComplete('lastName', value);
            }}
            error={errors.lastName}
            placeholder={t('auth.lastNamePlaceholder', 'Last name')}
            inputMode="text"
            autoComplete="family-name"
          />
        </div>

        <Input
          label={t('auth.email', 'Email Address')}
          type="email"
          value={form.email}
          onChange={(e) => {
            const value = e.target.value;
            setForm({ ...form, email: value });
            handleFieldComplete('email', value);
          }}
          error={errors.email}
          placeholder={t('auth.emailPlaceholder', 'Enter your email address')}
        />

        <CountryPhoneSelector
          label={t('auth.phone', 'Phone Number')}
          value={form.phone}
          onChange={(phone, countryCode) => setForm({ ...form, phone, countryCode })}
          error={errors.phone}
          placeholder={t('auth.phonePlaceholder', 'Enter your phone number')}
        />

        <PasswordInput
          label={t('auth.password', 'Password')}
          value={form.password}
          onChange={(e) => {
            const value = e.target.value;
            setForm({ ...form, password: value });
            handleFieldComplete('password', value);
          }}
          onKeyPress={handleKeyPress}
          error={errors.password}
          placeholder={t('auth.passwordPlaceholder', 'Create a secure password')}
          showPassword={showPassword}
          onToggleVisibility={() => setShowPassword(!showPassword)}
        />

        {/* Caps Lock Warning */}
        {capsLockWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-2 bg-yellow-900/30 border border-yellow-600/50 rounded-lg"
          >
            <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.168 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-yellow-400 text-sm">
              {t('warning.capsLock', 'Caps Lock is on')}
            </span>
          </motion.div>
        )}

        <PasswordInput
          label={t('auth.confirmPassword', 'Confirm Password')}
          value={form.confirmPassword}
          onChange={(e) => {
            const value = e.target.value;
            setForm({ ...form, confirmPassword: value });
            handleFieldComplete('confirmPassword', value);
          }}
          onKeyPress={handleKeyPress}
          error={errors.confirmPassword}
          placeholder={t('auth.confirmPasswordPlaceholder', 'Re-enter your password')}
          showPassword={showConfirmPassword}
          onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        <Button 
          onClick={handleSubmit} 
          disabled={loading || !isFormValid()}
          loading={loading}
          fullWidth
        >
          {t('auth.createAccount', 'Create Account')}
        </Button>
      </div>

      <p className="mt-6 text-xs text-center text-gray-500">
        {t('auth.haveAccount', 'Already have an account?')}{' '}
        <span 
          className="text-purple-400 cursor-pointer hover:text-purple-300 transition-colors underline"
          onClick={onGoToLogin}
        >
          {t('auth.signIn', 'Sign In')}
        </span>
      </p>

      <p className="mt-4 text-xs text-center text-gray-500">
        {t('auth.termsNotice', 'By creating an account, you agree to our')}{' '}
        <span className="text-purple-400 cursor-pointer hover:text-purple-300 transition-colors underline">
          {t('auth.termsOfService', 'Terms of Service')}
        </span>{' '}
        {t('auth.and', 'and')}{' '}
        <span className="text-purple-400 cursor-pointer hover:text-purple-300 transition-colors underline">
          {t('auth.privacyPolicy', 'Privacy Policy')}
        </span>
      </p>
    </MobileLayout>
  );
};