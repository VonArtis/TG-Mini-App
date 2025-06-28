// Phone number formatting utilities for international numbers

export interface CountryPhoneFormat {
  code: string;
  flag: string;
  name: string;
  dialCode: string;
  format: string; // Pattern for formatting
  maxLength: number;
}

export const PHONE_FORMATS: Record<string, CountryPhoneFormat> = {
  '+1': {
    code: 'US',
    flag: '🇺🇸',
    name: 'United States',
    dialCode: '+1',
    format: '(###) ###-####',
    maxLength: 10
  },
  '+44': {
    code: 'GB',
    flag: '🇬🇧',
    name: 'United Kingdom',
    dialCode: '+44',
    format: '#### ### ####',
    maxLength: 10
  },
  '+33': {
    code: 'FR',
    flag: '🇫🇷',
    name: 'France',
    dialCode: '+33',
    format: '## ## ## ## ##',
    maxLength: 10
  },
  '+49': {
    code: 'DE',
    flag: '🇩🇪',
    name: 'Germany',
    dialCode: '+49',
    format: '### ### ####',
    maxLength: 11
  },
  '+34': {
    code: 'ES',
    flag: '🇪🇸',
    name: 'Spain',
    dialCode: '+34',
    format: '### ### ###',
    maxLength: 9
  },
  '+39': {
    code: 'IT',
    flag: '🇮🇹',
    name: 'Italy',
    dialCode: '+39',
    format: '### ### ####',
    maxLength: 10
  },
  '+91': {
    code: 'IN',
    flag: '🇮🇳',
    name: 'India',
    dialCode: '+91',
    format: '##### #####',
    maxLength: 10
  },
  '+86': {
    code: 'CN',
    flag: '🇨🇳',
    name: 'China',
    dialCode: '+86',
    format: '### #### ####',
    maxLength: 11
  },
  '+81': {
    code: 'JP',
    flag: '🇯🇵',
    name: 'Japan',
    dialCode: '+81',
    format: '## #### ####',
    maxLength: 10
  }
};

/**
 * Format phone number based on country code
 */
export const formatPhoneNumber = (number: string, countryCode: string): string => {
  // Remove all non-numeric characters
  const cleaned = number.replace(/\D/g, '');
  
  const format = PHONE_FORMATS[countryCode];
  if (!format) {
    // Default formatting: add spaces every 3-4 digits
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  
  // Apply country-specific formatting
  let formatted = '';
  let cleanedIndex = 0;
  
  for (let i = 0; i < format.format.length && cleanedIndex < cleaned.length; i++) {
    if (format.format[i] === '#') {
      formatted += cleaned[cleanedIndex];
      cleanedIndex++;
    } else {
      formatted += format.format[i];
    }
  }
  
  return formatted;
};

/**
 * Validate phone number for specific country
 */
export const validatePhoneNumber = (number: string, countryCode: string): { isValid: boolean; message?: string } => {
  const cleaned = number.replace(/\D/g, '');
  const format = PHONE_FORMATS[countryCode];
  
  if (!format) {
    // Generic validation
    if (cleaned.length < 7) {
      return { isValid: false, message: 'Phone number too short' };
    }
    if (cleaned.length > 15) {
      return { isValid: false, message: 'Phone number too long' };
    }
    return { isValid: true };
  }
  
  // Country-specific validation
  if (cleaned.length < format.maxLength) {
    return { 
      isValid: false, 
      message: `${format.name} phone numbers should be ${format.maxLength} digits` 
    };
  }
  
  if (cleaned.length > format.maxLength) {
    return { 
      isValid: false, 
      message: `${format.name} phone numbers should be ${format.maxLength} digits` 
    };
  }
  
  return { isValid: true };
};

/**
 * Clean phone number for API submission
 */
export const cleanPhoneNumber = (number: string): string => {
  return number.replace(/\D/g, '');
};

/**
 * Detect country code from phone number
 */
export const detectCountryCode = (number: string): string | null => {
  const cleaned = number.replace(/\D/g, '');
  
  // Check common country codes by length and prefix
  for (const [code, format] of Object.entries(PHONE_FORMATS)) {
    const dialCodeDigits = format.dialCode.replace('+', '');
    if (cleaned.startsWith(dialCodeDigits)) {
      return code;
    }
  }
  
  return null;
};

/**
 * Get user's likely country code based on timezone/locale
 */
export const getUserCountryCode = (): string => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Simple timezone to country mapping
    const timezoneMap: Record<string, string> = {
      'America/New_York': '+1',
      'America/Los_Angeles': '+1',
      'America/Chicago': '+1',
      'Europe/London': '+44',
      'Europe/Paris': '+33',
      'Europe/Berlin': '+49',
      'Europe/Madrid': '+34',
      'Europe/Rome': '+39',
      'Asia/Kolkata': '+91',
      'Asia/Shanghai': '+86',
      'Asia/Tokyo': '+81'
    };
    
    return timezoneMap[timezone] || '+1'; // Default to US
  } catch {
    return '+1'; // Fallback
  }
};