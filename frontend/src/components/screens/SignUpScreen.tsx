import React, { useState } from 'react';
import type { AuthScreenProps } from '../../types';
import { ScreenHeader } from '../layout/ScreenHeader';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

export const SignUpScreen: React.FC<AuthScreenProps> = ({ onContinue, onGoToLogin, onNavigate }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    countryCode: '+1'
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signup, loading } = useAuth();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!form.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(form.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!agreed) newErrors.terms = 'You must agree to Terms of Service';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    const user = await signup({
      ...form,
      countryCode: form.countryCode
    });
    if (user && onContinue) {
      onContinue(user);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-12 pb-8 flex flex-col">
      <ScreenHeader title="Create Account" onBack={onGoToLogin} />

      <div className="space-y-5">
        <Input
          label="Full Name"
          value={form.name}
          onChange={handleChange('name')}
          placeholder="Enter your full name"
          required
          error={errors.name}
        />
        
        <Input
          label="Email Address"
          type="email"
          value={form.email}
          onChange={handleChange('email')}
          placeholder="Enter your email"
          required
          error={errors.email}
        />
        
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange('password')}
          placeholder="Enter your password"
          required
          error={errors.password}
        />
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-white">
            Phone Number <span className="text-red-400 ml-1">*</span>
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
            <Input
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              placeholder="123 456 7890"
              required
              error={errors.phone}
              className="flex-1"
            />
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
            I agree to VonVault's{' '}
            <span 
              className="text-purple-400 cursor-pointer hover:text-purple-300 transition-colors underline"
              onClick={() => onNavigate?.('terms-of-service')}
            >
              Terms of Service
            </span>{' '}
            and{' '}
            <span 
              className="text-purple-400 cursor-pointer hover:text-purple-300 transition-colors underline"
              onClick={() => onNavigate?.('privacy-policy')}
            >
              Privacy Policy
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
          Create Account
        </Button>
        
        <p className="text-center text-sm text-white mt-4">
          Already have an account?{' '}
          <span 
            className="text-purple-400 font-medium cursor-pointer hover:text-purple-300 transition-colors" 
            onClick={onGoToLogin}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};