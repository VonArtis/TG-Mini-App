// Email input component with real-time availability checking
import React, { forwardRef } from 'react';
import { useEmailAvailability } from '../../hooks/useEmailAvailability';

interface EmailInputProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  className = ''
}, ref) => {
  const { isChecking, isAvailable, reason } = useEmailAvailability(value);

  // Determine the status icon and message
  const getStatusIndicator = () => {
    if (!value || value.length < 3) return null;
    
    if (isChecking) {
      return (
        <div className="mt-2 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
          <span className="text-blue-400 text-sm">Checking availability...</span>
        </div>
      );
    }

    if (isAvailable === true) {
      return (
        <div className="mt-2 flex items-center space-x-2">
          <span className="text-green-400 text-sm">✓</span>
          <span className="text-green-400 text-sm font-medium">Email is available</span>
        </div>
      );
    }

    if (isAvailable === false) {
      let message = 'Email is not available';
      if (reason === 'already_exists') {
        message = 'This email is already registered';
      } else if (reason === 'invalid_format') {
        message = 'Invalid email format';
      }
      
      return (
        <div className="mt-2 flex items-center space-x-2">
          <span className="text-red-400 text-sm">✗</span>
          <span className="text-red-400 text-sm">{message}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="email"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full px-4 py-3 pr-12
            bg-gray-800 border rounded-lg
            text-white placeholder-gray-400
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200
            ${error ? 'border-red-500' : 
              isAvailable === false ? 'border-red-500' : 
              isAvailable === true ? 'border-green-500' : 
              'border-gray-600'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          autoComplete="email"
          inputMode="email"
        />
        
        {/* Status icon in input */}
        {value && value.length > 3 && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isChecking ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
            ) : isAvailable === true ? (
              <span className="text-green-400">✓</span>
            ) : isAvailable === false ? (
              <span className="text-red-400">✗</span>
            ) : null}
          </div>
        )}
      </div>

      {/* Show error first, then availability status */}
      {error ? (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      ) : (
        getStatusIndicator()
      )}
    </div>
  );
};