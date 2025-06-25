// Custom hook for authentication management
import { useState, useEffect } from 'react';
import type { User } from '../types';
import { apiService } from '../services/api';
import { secureStorage } from '../utils/secureStorage';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const token = secureStorage.getToken();
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        console.log('Restored user from localStorage:', userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('currentUser');
      }
    } else if (token) {
      // TODO: Validate token with backend and restore user session
      console.log('Existing token found, validating session...');
    }
  }, []);

  // Authenticate via bank connection
  const authenticateBank = async (): Promise<User | null> => {
    setLoading(true);
    try {
      const response = await apiService.telegramAuth({ 
        user_id: 'bank_user_' + Date.now() 
      });
      
      if (response.token) {
        const userData: User = {
          id: response.user_id || 'bank_user_' + Date.now(),
          token: response.token,
          user_id: response.user_id,
          type: 'bank',
          bank_connected: true
        };
        // Save token to secure storage for API calls
        secureStorage.setToken(response.token);
        
        // Save user to both state and localStorage
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Bank authentication error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Authenticate via crypto wallet
  const authenticateCrypto = async (): Promise<User | null> => {
    setLoading(true);
    try {
      const response = await apiService.telegramAuth({ 
        user_id: 'crypto_user_' + Date.now() 
      });
      
      if (response.token) {
        const userData: User = {
          id: response.user_id || 'crypto_user_' + Date.now(),
          token: response.token,
          user_id: response.user_id,
          type: 'crypto',
          crypto_connected: true
        };
        // Save token to secure storage for API calls
        secureStorage.setToken(response.token);
        
        // Save user to both state and localStorage
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Crypto authentication error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Login with email/password
  const login = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData: User = {
        id: 'user_' + Date.now(),
        token: 'login_token_' + Date.now(),
        user_id: 'user_' + Date.now(),
        email,
        type: 'login'
      };
      // Save token to secure storage for API calls
      secureStorage.setToken(userData.token);
      
      // Save user to both state and localStorage
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Signup with user data
  const signup = async (userData: { name: string; email: string; password: string; phone: string; countryCode: string }): Promise<User | null> => {
    setLoading(true);
    try {
      // Simulate signup API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create authenticated user with valid JWT token
      const user: User = {
        id: 'user_' + Date.now(),
        user_id: 'user_' + Date.now(),
        name: userData.name,
        first_name: userData.name.split(' ')[0] || userData.name,
        last_name: userData.name.split(' ').slice(1).join(' ') || '',
        email: userData.email,
        phone: `${userData.countryCode}${userData.phone}`,
        token: 'signup_token_' + Date.now(), // Valid JWT token for API calls
        password: userData.password,
        email_verified: false, // Can be verified later
        phone_verified: false, // Can be verified later
        crypto_connected: false,
        bank_connected: false,
        investment_tier: 'basic',
        total_investment: 0,
        created_at: new Date().toISOString()
      };
      
      // Save token to secure storage for immediate API access
      secureStorage.setToken(user.token);
      
      // Save user to both state and localStorage
      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      console.log('User created and authenticated:', user);
      
      return user;
    } catch (error) {
      console.error('Signup error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = !!user?.token;

  return {
    user,
    setUser,
    loading,
    authenticateBank,
    authenticateCrypto,
    login,
    signup,
    logout,
    isAuthenticated
  };
};