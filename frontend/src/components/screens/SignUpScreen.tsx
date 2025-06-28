import React, { useState, useEffect } from 'react';
import type { AuthScreenProps } from '../../types';
import { ScreenHeader } from '../layout/ScreenHeader';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { LanguageSelector } from '../common/LanguageSelector';
import { PasswordStrength } from '../common/PasswordStrength';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { formatPhoneNumber, validatePhoneNumber, cleanPhoneNumber, getUserCountryCode } from '../../utils/phoneFormatter';
import { validateEmailSmart, EmailValidationResult } from '../../utils/emailValidator';

export const SignUpScreen: React.FC<AuthScreenProps> = ({ onContinue, onGoToLogin, onNavigate }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    countryCode: getUserCountryCode() // Auto-detect user's country
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailValidation, setEmailValidation] = useState<EmailValidationResult>({ isValid: true, type: 'valid' });
  const [phoneFormatted, setPhoneFormatted] = useState('');
  const { signup, loading } = useAuth();
  const { t } = useLanguage();

  // Auto-format phone number as user types
  useEffect(() => {
    const formatted = formatPhoneNumber(form.phone, form.countryCode);
    setPhoneFormatted(formatted);
  }, [form.phone, form.countryCode]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (field === 'phone') {
      // Only allow numeric input for phone
      const cleaned = value.replace(/\D/g, '');
      setForm({ ...form, [field]: cleaned });
    } else if (field === 'email') {
      setForm({ ...form, [field]: value });
      // Real-time email validation
      const validation = validateEmailSmart(value);
      setEmailValidation(validation);
    } else {
      setForm({ ...form, [field]: value });
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Name validation
    if (!form.name.trim()) {
      newErrors.name = t('auth:signup.validation.nameRequired');
    }
    
    // Enhanced email validation
    if (!form.email) {
      newErrors.email = t('auth:signup.validation.emailRequired');
    } else {
      const emailCheck = validateEmailSmart(form.email);
      if (!emailCheck.isValid) {
        newErrors.email = emailCheck.message || t('auth:signup.validation.emailInvalid');
      }
    }
    
    // Enhanced password validation (minimum 8 characters + complexity)
    if (!form.password) {
      newErrors.password = t('auth:signup.validation.passwordRequired');
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else {
      // Check password complexity
      const hasUpper = /[A-Z]/.test(form.password);
      const hasLower = /[a-z]/.test(form.password);
      const hasNumber = /\d/.test(form.password);
      const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(form.password);
      
      if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
        newErrors.password = 'Password must include uppercase, lowercase, number, and special character';
      }
    }
    
    // Confirm password validation
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Smart phone validation
    if (!form.phone) {
      newErrors.phone = t('auth:signup.validation.phoneRequired');
    } else {
      const phoneCheck = validatePhoneNumber(form.phone, form.countryCode);
      if (!phoneCheck.isValid) {
        newErrors.phone = phoneCheck.message || t('auth:signup.validation.phoneInvalid');
      }
    }
    
    // Terms agreement
    if (!agreed) {
      newErrors.terms = t('auth:signup.validation.termsRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    // Extract confirmPassword before sending to API
    const { confirmPassword, ...signupData } = form;
    
    const user = await signup({
      ...signupData,
      phone: cleanPhoneNumber(form.phone), // Clean phone number for API
      country_code: form.countryCode  // Convert camelCase to snake_case for API
    });
    
    if (user && onContinue) {
      onContinue(user);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-12 pb-8 flex flex-col">
      {/* Language Selector in Header */}
      <div className="absolute top-4 right-4">
        <LanguageSelector variant="compact" />
      </div>
      
      <ScreenHeader title={t('auth:signup.title')} onBack={onGoToLogin} />

      <div className="space-y-5">
        <Input
          label={t('auth:signup.nameLabel')}
          value={form.name}
          onChange={handleChange('name')}
          placeholder={t('auth:signup.namePlaceholder')}
          required
          error={errors.name}
        />
        
        {/* Enhanced Email Input with Smart Validation */}
        <div>
          <Input
            label={t('auth:signup.emailLabel')}
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder={t('auth:signup.emailPlaceholder')}
            required
            error={errors.email}
            className="flex-1"
          />
          
          {/* Email Suggestion */}
          {emailValidation.type === 'suggestion' && emailValidation.suggestion && (
            <div className="mt-2 bg-blue-900/20 rounded-lg p-2">
              <p className="text-sm text-blue-300">
                💡 {emailValidation.message}
              </p>
              <button
                type="button"
                onClick={() => {
                  setForm({ ...form, email: emailValidation.suggestion! });
                  setEmailValidation({ isValid: true, type: 'valid' });
                }}
                className="text-blue-400 hover:text-blue-300 text-sm underline mt-1"
              >
                Use {emailValidation.suggestion}
              </button>
            </div>
          )}
          
          {/* Email Warning */}
          {emailValidation.type === 'warning' && (
            <div className="mt-2 bg-yellow-900/20 rounded-lg p-2">
              <p className="text-sm text-yellow-300">
                ⚠️ {emailValidation.message}
              </p>
            </div>
          )}
        </div>
        
        {/* Enhanced Password Input with Strength Indicator */}
        <div>
          <Input
            label={t('auth:signup.passwordLabel')}
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            placeholder={t('auth:signup.passwordPlaceholder')}
            required
            error={errors.password}
          />
          
          {/* Password Strength Indicator */}
          <PasswordStrength password={form.password} />
        </div>
        
        {/* Confirm Password Input */}
        <div>
          <Input
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            placeholder="Re-enter your password"
            required
            error={errors.confirmPassword}
          />
        </div>
        
        {/* Enhanced Phone Input with Auto-formatting */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-white">
            {t('auth:signup.phoneLabel')} <span className="text-red-400 ml-1">*</span>
          </label>
          <div className="flex gap-2">
            <select
              value={form.countryCode}
              onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
              className="p-3 bg-gray-900 border border-purple-500 rounded-lg text-white focus:border-purple-400 focus:outline-none w-48"
            >
              <option value="+54">🇦🇷 Argentina (+54)</option>
              <option value="+43">🇦🇹 Austria (+43)</option>
              <option value="+61">🇦🇺 Australia (+61)</option>
              <option value="+32">🇧🇪 Belgium (+32)</option>
              <option value="+55">🇧🇷 Brazil (+55)</option>
              <option value="+1">🇨🇦 Canada (+1)</option>
              <option value="+56">🇨🇱 Chile (+56)</option>
              <option value="+86">🇨🇳 China (+86)</option>
              <option value="+57">🇨🇴 Colombia (+57)</option>
              <option value="+420">🇨🇿 Czech Republic (+420)</option>
              <option value="+45">🇩🇰 Denmark (+45)</option>
              <option value="+20">🇪🇬 Egypt (+20)</option>
              <option value="+358">🇫🇮 Finland (+358)</option>
              <option value="+33">🇫🇷 France (+33)</option>
              <option value="+49">🇩🇪 Germany (+49)</option>
              <option value="+30">🇬🇷 Greece (+30)</option>
              <option value="+852">🇭🇰 Hong Kong (+852)</option>
              <option value="+36">🇭🇺 Hungary (+36)</option>
              <option value="+91">🇮🇳 India (+91)</option>
              <option value="+62">🇮🇩 Indonesia (+62)</option>
              <option value="+353">🇮🇪 Ireland (+353)</option>
              <option value="+39">🇮🇹 Italy (+39)</option>
              <option value="+81">🇯🇵 Japan (+81)</option>
              <option value="+60">🇲🇾 Malaysia (+60)</option>
              <option value="+52">🇲🇽 Mexico (+52)</option>
              <option value="+31">🇳🇱 Netherlands (+31)</option>
              <option value="+64">🇳🇿 New Zealand (+64)</option>
              <option value="+234">🇳🇬 Nigeria (+234)</option>
              <option value="+47">🇳🇴 Norway (+47)</option>
              <option value="+51">🇵🇪 Peru (+51)</option>
              <option value="+63">🇵🇭 Philippines (+63)</option>
              <option value="+48">🇵🇱 Poland (+48)</option>
              <option value="+351">🇵🇹 Portugal (+351)</option>
              <option value="+40">🇷🇴 Romania (+40)</option>
              <option value="+7">🇷🇺 Russia (+7)</option>
              <option value="+966">🇸🇦 Saudi Arabia (+966)</option>
              <option value="+65">🇸🇬 Singapore (+65)</option>
              <option value="+27">🇿🇦 South Africa (+27)</option>
              <option value="+82">🇰🇷 South Korea (+82)</option>
              <option value="+34">🇪🇸 Spain (+34)</option>
              <option value="+46">🇸🇪 Sweden (+46)</option>
              <option value="+41">🇨🇭 Switzerland (+41)</option>
              <option value="+886">🇹🇼 Taiwan (+886)</option>
              <option value="+66">🇹🇭 Thailand (+66)</option>
              <option value="+90">🇹🇷 Turkey (+90)</option>
              <option value="+380">🇺🇦 Ukraine (+380)</option>
              <option value="+971">🇦🇪 UAE (+971)</option>
              <option value="+44">🇬🇧 United Kingdom (+44)</option>
              <option value="+1">🇺🇸 United States (+1)</option>
              <option value="+84">🇻🇳 Vietnam (+84)</option>
            </select>
            
            {/* Phone input with auto-formatting */}
            <div className="flex-1">
              <Input
                type="tel"
                value={phoneFormatted}
                onChange={handleChange('phone')}
                placeholder={t('auth:signup.phonePlaceholder')}
                required
                error={errors.phone}
                className="flex-1"
              />
              {/* Show cleaned number count */}
              {form.phone && (
                <p className="text-xs text-gray-400 mt-1">
                  {form.phone.length} digits entered
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 mr-2 accent-purple-600"
          />
          <p className="text-sm text-gray-400">
            {t('auth:signup.termsPrefix')}{' '}
            <span 
              className="text-purple-400 cursor-pointer hover:text-purple-300 transition-colors underline"
              onClick={() => onNavigate?.('terms-of-service')}
            >
              {t('auth:signup.termsOfService')}
            </span>{' '}
            {t('auth:signup.and')}{' '}
            <span 
              className="text-purple-400 cursor-pointer hover:text-purple-300 transition-colors underline"
              onClick={() => onNavigate?.('privacy-policy')}
            >
              {t('auth:signup.privacyPolicy')}
            </span>
          </p>
        </div>
        {errors.terms && <p className="text-red-400 text-sm">{errors.terms}</p>}
      </div>

      <div className="mt-8">
        <Button
          onClick={handleSignUp}
          loading={loading}
          fullWidth
          size="lg"
        >
          {t('auth:signup.createAccountButton')}
        </Button>
        
        <p className="text-center text-sm text-white mt-4">
          {t('auth:signup.haveAccountPrefix')}{' '}
          <span 
            className="text-purple-400 font-medium cursor-pointer hover:text-purple-300 transition-colors" 
            onClick={onGoToLogin}
          >
            {t('auth:signup.signInLink')}
          </span>
        </p>
      </div>
    </div>
  );
};