// Reusable input component
import React, { forwardRef } from 'react';

interface InputProps {
  label?: string;
  type?: string;
  name?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  prefix?: string;
  className?: string;
  step?: string;
  maxLength?: number;
  inputMode?: 'text' | 'email' | 'tel' | 'url' | 'numeric' | 'decimal' | 'search';
  autoComplete?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onKeyPress,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  error,
  prefix,
  className = '',
  step,
  maxLength,
  inputMode,
  autoComplete
}, ref) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white dark:text-white light:text-black">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {prefix}
          </span>
        )}
        
        <input
          ref={ref}
          type={type}
          name={name}
          value={value}
          onChange={onChange || (() => {})}
          onKeyPress={onKeyPress}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          step={step}
          maxLength={maxLength}
          inputMode={inputMode}
          autoComplete={autoComplete}
          className={`
            w-full px-4 py-3
            ${prefix ? 'pl-12' : ''}
            bg-gray-800 dark:bg-gray-800 light:bg-white
            border rounded-lg
            text-white dark:text-white light:text-black
            placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200
            ${error ? 'border-red-500' : 'border-gray-600 dark:border-gray-600 light:border-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
      </div>
      
      {error && (
        <p className="text-red-400 dark:text-red-400 light:text-red-600 text-sm">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';