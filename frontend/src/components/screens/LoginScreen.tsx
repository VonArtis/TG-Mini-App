import React, { useState } from 'react';
import type { AuthScreenProps } from '../../types';
import { ScreenHeader } from '../layout/ScreenHeader';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { LanguageSelector } from '../common/LanguageSelector';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';

export const LoginScreen: React.FC<AuthScreenProps> = ({ onLogin, onCreateAccount, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login, loading } = useAuth();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const user = await login(email, password);
    if (user && onLogin) {
      onLogin(user);
    } else {
      setErrors({ password: 'Invalid email or password' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-12 pb-8 flex flex-col">
      <ScreenHeader title="Welcome Back" onBack={onBack} />

      <div className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          error={errors.email}
        />
        
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          error={errors.password}
        />
      </div>

      <div className="mt-8">
        <Button 
          onClick={handleLogin}
          loading={loading}
          fullWidth
          size="lg"
        >
          Sign In
        </Button>
        
        <p className="text-center text-sm text-white mt-4">
          Don't have an account?{' '}
          <span 
            className="text-purple-400 font-medium cursor-pointer hover:text-purple-300 transition-colors" 
            onClick={onCreateAccount}
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
};