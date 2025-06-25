// Reusable input component
import React from 'react';

interface InputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  prefix?: string;
  className?: string;
  step?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  prefix,
  className = '',
  step
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white">
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
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          step={step}
          className={`
            w-full p-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 
            focus:border-purple-400 focus:outline-none transition-colors
            ${prefix ? 'pl-8' : ''}
            ${error ? 'border-red-500' : 'border-purple-500'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
      </div>
      
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
};