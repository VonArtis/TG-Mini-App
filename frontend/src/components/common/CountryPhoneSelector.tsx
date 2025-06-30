import React, { useState, useEffect } from 'react';
import { detectCountryFromIP, formatPhoneNumber, validatePhoneNumber } from '../../utils/phoneFormatter';
import { useLanguage } from '../../hooks/useLanguage';

interface Country {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;
}

interface CountryPhoneSelectorProps {
  value: string;
  onChange: (phone: string, countryCode: string) => void;
  error?: string;
  placeholder?: string;
  label?: string;
  className?: string;
}

// Comprehensive list of 135+ countries with phone codes
const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', phoneCode: '+1' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', phoneCode: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', phoneCode: '+44' },
  { code: 'FR', name: 'France', flag: '🇫🇷', phoneCode: '+33' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', phoneCode: '+49' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', phoneCode: '+34' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', phoneCode: '+39' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', phoneCode: '+55' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', phoneCode: '+351' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', phoneCode: '+7' },
  { code: 'CN', name: 'China', flag: '🇨🇳', phoneCode: '+86' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', phoneCode: '+81' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', phoneCode: '+82' },
  { code: 'IN', name: 'India', flag: '🇮🇳', phoneCode: '+91' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', phoneCode: '+966' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', phoneCode: '+90' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', phoneCode: '+48' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', phoneCode: '+31' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', phoneCode: '+54' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', phoneCode: '+52' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', phoneCode: '+61' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', phoneCode: '+32' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', phoneCode: '+41' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', phoneCode: '+43' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', phoneCode: '+46' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', phoneCode: '+47' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', phoneCode: '+45' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', phoneCode: '+358' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', phoneCode: '+353' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', phoneCode: '+20' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', phoneCode: '+27' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', phoneCode: '+234' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', phoneCode: '+66' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', phoneCode: '+84' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', phoneCode: '+60' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', phoneCode: '+65' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', phoneCode: '+63' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', phoneCode: '+62' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', phoneCode: '+852' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', phoneCode: '+886' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', phoneCode: '+56' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', phoneCode: '+57' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', phoneCode: '+51' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', phoneCode: '+420' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', phoneCode: '+36' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', phoneCode: '+30' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', phoneCode: '+40' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', phoneCode: '+380' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', phoneCode: '+971' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', phoneCode: '+64' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', phoneCode: '+972' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', phoneCode: '+974' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', phoneCode: '+965' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', phoneCode: '+973' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', phoneCode: '+968' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', phoneCode: '+962' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧', phoneCode: '+961' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾', phoneCode: '+963' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶', phoneCode: '+964' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷', phoneCode: '+98' },
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫', phoneCode: '+93' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', phoneCode: '+92' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', phoneCode: '+880' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', phoneCode: '+94' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', phoneCode: '+977' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲', phoneCode: '+95' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭', phoneCode: '+855' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦', phoneCode: '+856' },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳', phoneCode: '+673' },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳', phoneCode: '+976' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', phoneCode: '+7' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', phoneCode: '+998' },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲', phoneCode: '+993' },
  { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬', phoneCode: '+996' },
  { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯', phoneCode: '+992' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪', phoneCode: '+995' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲', phoneCode: '+374' },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿', phoneCode: '+994' },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾', phoneCode: '+375' },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩', phoneCode: '+373' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹', phoneCode: '+370' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻', phoneCode: '+371' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪', phoneCode: '+372' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸', phoneCode: '+354' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹', phoneCode: '+356' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾', phoneCode: '+357' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', phoneCode: '+352' },
  { code: 'MC', name: 'Monaco', flag: '🇲🇨', phoneCode: '+377' },
  { code: 'SM', name: 'San Marino', flag: '🇸🇲', phoneCode: '+378' },
  { code: 'VA', name: 'Vatican City', flag: '🇻🇦', phoneCode: '+379' },
  { code: 'AD', name: 'Andorra', flag: '🇦🇩', phoneCode: '+376' },
  { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮', phoneCode: '+423' },
  { code: 'MK', name: 'North Macedonia', flag: '🇲🇰', phoneCode: '+389' },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪', phoneCode: '+382' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸', phoneCode: '+381' },
  { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦', phoneCode: '+387' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷', phoneCode: '+385' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮', phoneCode: '+386' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰', phoneCode: '+421' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', phoneCode: '+359' },
  { code: 'AL', name: 'Albania', flag: '🇦🇱', phoneCode: '+355' },
  { code: 'XK', name: 'Kosovo', flag: '🇽🇰', phoneCode: '+383' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', phoneCode: '+212' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', phoneCode: '+213' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', phoneCode: '+216' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾', phoneCode: '+218' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩', phoneCode: '+249' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', phoneCode: '+251' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', phoneCode: '+254' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', phoneCode: '+256' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', phoneCode: '+255' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', phoneCode: '+250' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', phoneCode: '+233' },
  { code: 'CI', name: 'Ivory Coast', flag: '🇨🇮', phoneCode: '+225' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', phoneCode: '+221' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', phoneCode: '+223' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', phoneCode: '+226' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', phoneCode: '+227' },
  { code: 'TD', name: 'Chad', flag: '🇹🇩', phoneCode: '+235' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', phoneCode: '+237' },
  { code: 'CF', name: 'Central African Republic', flag: '🇨🇫', phoneCode: '+236' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', phoneCode: '+241' },
  { code: 'CG', name: 'Republic of the Congo', flag: '🇨🇬', phoneCode: '+242' },
  { code: 'CD', name: 'Democratic Republic of the Congo', flag: '🇨🇩', phoneCode: '+243' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴', phoneCode: '+244' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', phoneCode: '+260' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', phoneCode: '+263' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼', phoneCode: '+267' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦', phoneCode: '+264' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿', phoneCode: '+268' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸', phoneCode: '+266' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', phoneCode: '+261' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', phoneCode: '+230' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨', phoneCode: '+248' },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻', phoneCode: '+960' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', phoneCode: '+506' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦', phoneCode: '+507' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', phoneCode: '+502' },
  { code: 'BZ', name: 'Belize', flag: '🇧🇿', phoneCode: '+501' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻', phoneCode: '+503' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳', phoneCode: '+504' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', phoneCode: '+505' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺', phoneCode: '+53' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲', phoneCode: '+1' },
  { code: 'HT', name: 'Haiti', flag: '🇭🇹', phoneCode: '+509' },
  { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴', phoneCode: '+1' },
  { code: 'PR', name: 'Puerto Rico', flag: '🇵🇷', phoneCode: '+1' },
  { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹', phoneCode: '+1' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧', phoneCode: '+1' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', phoneCode: '+598' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', phoneCode: '+595' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', phoneCode: '+591' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', phoneCode: '+593' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', phoneCode: '+58' },
  { code: 'GY', name: 'Guyana', flag: '🇬🇾', phoneCode: '+592' },
  { code: 'SR', name: 'Suriname', flag: '🇸🇷', phoneCode: '+597' },
  { code: 'FK', name: 'Falkland Islands', flag: '🇫🇰', phoneCode: '+500' }
];

export const CountryPhoneSelector: React.FC<CountryPhoneSelectorProps> = ({
  value,
  onChange,
  error,
  placeholder = "Enter phone number",
  label = "Phone Number",
  className = ""
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDetecting, setIsDetecting] = useState(true);
  const [detectionStatus, setDetectionStatus] = useState<string>('Detecting your country...');
  const { t } = useLanguage();

  // Auto-detect country on component mount
  useEffect(() => {
    const detectUserCountry = async () => {
      try {
        setIsDetecting(true);
        setDetectionStatus('🌍 Detecting your location...');
        
        const detection = await detectCountryFromIP();
        
        if (detection.detected) {
          const detectedCountry = COUNTRIES.find(c => c.phoneCode === detection.countryCode);
          if (detectedCountry) {
            setSelectedCountry(detectedCountry);
            setDetectionStatus(`✅ Auto-detected: ${detectedCountry.flag} ${detectedCountry.name}`);
            
            // Notify parent component of country change
            onChange(value, detectedCountry.phoneCode);
            
            setTimeout(() => {
              setIsDetecting(false);
            }, 1500); // Show success message for 1.5s
            return;
          }
        }
        
        // Fallback if detection failed
        setDetectionStatus('🌍 Select your country');
        setIsDetecting(false);
      } catch (error) {
        console.error('Country detection failed:', error);
        setDetectionStatus('🌍 Select your country');
        setIsDetecting(false);
      }
    };

    detectUserCountry();
  }, []);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchTerm('');
    onChange(value, country.phoneCode);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneValue = e.target.value;
    onChange(phoneValue, selectedCountry.phoneCode);
  };

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.phoneCode.includes(searchTerm)
  );

  const formatDisplayPhone = (phone: string) => {
    if (!phone) return '';
    return formatPhoneNumber(phone, selectedCountry.phoneCode);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>

      {/* Detection Status */}
      {isDetecting && (
        <div className="text-xs text-purple-400 animate-pulse">
          {detectionStatus}
        </div>
      )}

      {/* Phone Input with Country Selector */}
      <div className="flex gap-2">
        {/* Country Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-3 bg-gray-800 border border-gray-600 rounded-lg hover:border-purple-500 transition-colors min-w-[120px]"
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm text-gray-300">{selectedCountry.phoneCode}</span>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 max-h-60 overflow-hidden">
              {/* Search */}
              <div className="p-2 border-b border-gray-600">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
              
              {/* Country List */}
              <div className="overflow-y-auto max-h-44">
                {filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 transition-colors text-left"
                  >
                    <span className="text-lg">{country.flag}</span>
                    <div className="flex-1">
                      <div className="text-sm text-white">{country.name}</div>
                      <div className="text-xs text-gray-400">{country.phoneCode}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone Input */}
        <div className="flex-1">
          <input
            type="tel"
            value={value}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
              error 
                ? 'border-red-500 focus:border-red-400' 
                : 'border-gray-600 focus:border-purple-500'
            }`}
            inputMode="tel"
            autoComplete="tel"
          />
        </div>
      </div>

      {/* Formatted Phone Display */}
      {value && (
        <div className="text-xs text-gray-400">
          Formatted: {selectedCountry.phoneCode} {formatDisplayPhone(value)}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-red-400 text-sm animate-pulse">
          {error}
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500">
        {t('auth.phoneHelp', 'Your phone number will be used for security verification')}
      </div>
    </div>
  );
};