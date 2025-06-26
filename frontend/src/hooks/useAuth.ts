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
    const validateExistingSession = async () => {
      const token = secureStorage.getToken();
      const savedUser = localStorage.getItem('currentUser');
      
      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          
          // Validate token with backend
          const response = await apiService.getCurrentUser(token);
          
          if (response && response.user) {
            // Token is valid, update user data from backend
            const validatedUser: User = {
              ...userData,
              ...response.user,
              token: token
            };
            
            setUser(validatedUser);
            localStorage.setItem('currentUser', JSON.stringify(validatedUser));
            console.log('Session restored and validated:', validatedUser);
          } else {
            // Token invalid, clear session
            secureStorage.removeToken();
            localStorage.removeItem('currentUser');
            console.log('Invalid token, session cleared');
          }
        } catch (error) {
          console.error('Session validation failed:', error);
          // Token invalid, clear session
          secureStorage.removeToken();
          localStorage.removeItem('currentUser');
        }
      } else if (savedUser && !token) {
        // User data without token, clear it
        localStorage.removeItem('currentUser');
        console.log('User data without token cleared');
      }
    };

    validateExistingSession();
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

  // Real API authentication methods
  
  // Signup with user data - REAL API INTEGRATION
  const signup = async (userData: { name: string; email: string; password: string; phone: string; countryCode: string }): Promise<User | null> => {
    setLoading(true);
    try {
      const response = await apiService.signup({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        country_code: userData.countryCode
      });
      
      if (response && response.user && response.token) {
        const user: User = {
          id: response.user.id,
          user_id: response.user.user_id,
          name: response.user.name,
          first_name: response.user.first_name,
          last_name: response.user.last_name,
          email: response.user.email,
          phone: response.user.phone,
          token: response.token,
          email_verified: response.user.email_verified,
          phone_verified: response.user.phone_verified,
          crypto_connected: false,
          bank_connected: false,
          investment_tier: response.user.membership_level,
          total_investment: 0,
          created_at: response.user.created_at,
          type: 'email',
          is_admin: response.user.is_admin || false
        };
        
        // Save token to secure storage
        secureStorage.setToken(user.token);
        
        // Save user to both state and localStorage
        setUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('User created and authenticated via API:', user);
        
        return user;
      }
      
      throw new Error('Invalid response from signup API');
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with email/password - REAL API INTEGRATION
  const login = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    try {
      const response = await apiService.login({ email, password });
      
      if (response && response.user && response.token) {
        const user: User = {
          id: response.user.id,
          user_id: response.user.user_id,
          name: response.user.name,
          first_name: response.user.first_name,
          last_name: response.user.last_name,
          email: response.user.email,
          phone: response.user.phone,
          token: response.token,
          email_verified: response.user.email_verified,
          phone_verified: response.user.phone_verified,
          crypto_connected: false,
          bank_connected: false,
          investment_tier: response.user.membership_level,
          total_investment: 0,
          created_at: response.user.created_at,
          type: 'email',
          is_admin: response.user.is_admin || false
        };
        
        // Save token to secure storage
        secureStorage.setToken(user.token);
        
        // Save user to both state and localStorage
        setUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('User logged in via API:', user);
        
        return user;
      }
      
      throw new Error('Invalid response from login API');
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
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