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
import { motion, AnimatePresence } from 'framer-motion';

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
  const [success, setSuccess] = useState(false);
  const [shakeField, setShakeField] = useState<string | null>(null);
  const { signup } = useAuth();
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

  // Caps Lock Detection
  const handleKeyPress = (e: React.KeyboardEvent) => {
    const capsLock = e.getModifierState && e.getModifierState('CapsLock');
    setCapsLockWarning(capsLock);
  };

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

    // Name fields (1 step)
    if (form.firstName.trim() && form.lastName.trim() && !errors.firstName && !errors.lastName) {
      completedSteps++;
    }
    
    // Email validation (1 step)
    if (form.email && /\S+@\S+\.\S+/.test(form.email) && !errors.email && emailAvailable === true) {
      completedSteps++;
    }
    
    // Phone validation (1 step)  
    if (form.phone && validatePhoneNumber(form.phone, form.countryCode).isValid && !errors.phone) {
      completedSteps++;
    }
    
    // Password validation (1 step)
    if (form.password && form.password.length >= 8 && !errors.password) {
      completedSteps++;
    }
    
    // Confirm password validation (1 step)
    if (form.confirmPassword && form.password === form.confirmPassword && !errors.confirmPassword) {
      completedSteps++;
    }
    
    // All validations passed (1 step)
    if (completedSteps === 5) {
      completedSteps++;
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
      setShakeField('firstName');
    }
    
    if (!form.lastName.trim()) {
      newErrors.lastName = t('validation.required', 'Last name is required');
      setShakeField('lastName');
    }
    
    if (!form.email.trim()) {
      newErrors.email = t('validation.required', 'Email is required');
      setShakeField('email');
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = t('validation.invalidEmail', 'Please enter a valid email address');
      setShakeField('email');
    } else if (emailAvailable === false) {
      newErrors.email = t('validation.emailTaken', 'This email is already taken');
      setShakeField('email');
    }
    
    if (!form.phone.trim()) {
      newErrors.phone = t('validation.required', 'Phone number is required');
      setShakeField('phone');
    } else {
      const phoneValidation = validatePhoneNumber(form.phone, form.countryCode);
      if (!phoneValidation.isValid) {
        newErrors.phone = phoneValidation.message || t('validation.invalidPhone', 'Please enter a valid phone number');
        setShakeField('phone');
      }
    }
    
    if (!form.password.trim()) {
      newErrors.password = t('validation.required', 'Password is required');
      setShakeField('password');
    } else if (form.password.length < 8) {
      newErrors.password = t('validation.passwordLength', 'Password must be at least 8 characters');
      setShakeField('password');
    }
    
    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = t('validation.required', 'Please confirm your password');
      setShakeField('confirmPassword');
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = t('validation.passwordMismatch', 'Passwords do not match');
      setShakeField('confirmPassword');
    }
    
    setErrors(newErrors);
    
    // Clear shake animation after 500ms
    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => setShakeField(null), 500);
    }
    
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
      const userData = await signup({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        password: form.password,
        country_code: form.countryCode
      });
      
      if (userData) {
        // Success animation trigger
        setSuccess(true);
        setTimeout(() => {
          onSignUp(userData);
        }, 1500); // Delay to show success animation
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
        
        {/* Security Progress Indicator */}
        {showProgress && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-2"
          >
            <div className="flex justify-between text-xs text-gray-400">
              <span>{t('security.setupProgress', 'Security Setup Progress')}</span>
              <span>{Math.round(calculateCompletion())}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${calculateCompletion()}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="text-xs text-gray-400 text-center">
              {calculateCompletion() === 100 
                ? t('security.complete', '🔒 Account security setup complete!')
                : t('security.inProgress', '🛡️ Securing your account...')
              }
            </div>
          </motion.div>
        )}
      </div>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm text-center">{errors.general}</p>
        </div>
      )}

      <div className="w-full space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            animate={shakeField === 'firstName' ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
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
          </motion.div>
          
          <motion.div
            animate={shakeField === 'lastName' ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
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
          </motion.div>
        </div>

        <motion.div
          animate={shakeField === 'email' ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Input
            label={t('auth.email', 'Email Address')}
            type="email"
            value={form.email}
            onChange={(e) => {
              const value = e.target.value;
              setForm({ ...form, email: value });
              handleFieldComplete('email', value);
              setEmailAvailable(null); // Reset availability while typing
            }}
            error={errors.email}
            placeholder={t('auth.emailPlaceholder', 'Enter your email address')}
            inputMode="email"
            autoComplete="email"
          />
          
          {/* Email Availability Indicator */}
          <div className="absolute right-3 top-9 flex items-center">
            {emailChecking && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"
              />
            )}
            {!emailChecking && emailAvailable === true && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-400"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
            {!emailChecking && emailAvailable === false && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-red-400"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Email Availability Message */}
        {emailAvailable === true && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-400 text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t('email.available', 'Email is available!')}
          </motion.div>
        )}
        {emailAvailable === false && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {t('email.taken', 'Email is already taken')}
          </motion.div>
        )}

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

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-8"
            >
              <motion.svg
                className="w-16 h-16 text-white"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute mt-32 text-center"
            >
              <h2 className="text-2xl font-bold text-white mb-2">
                {t('success.accountCreated', 'Account Created!')}
              </h2>
              <p className="text-gray-300">
                {t('success.redirecting', 'Setting up your secure account...')}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MobileLayout>
  );
};