import React from 'react';
import type { ScreenProps } from '../../types';
import { MobileLayoutWithTabs } from '../layout/MobileLayoutWithTabs';
import { useLanguage } from '../../hooks/useLanguage';

export const PrivacyPolicyScreen: React.FC<ScreenProps> = ({ onBack }) => {
  const { t } = useLanguage();

  return (
    <MobileLayoutWithTabs showTabs={false}>
      <div className="absolute top-4 left-4">
        <button 
          onClick={onBack}
          className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Go back"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
        </button>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center mb-2">
          {t('legal.privacyTitle', 'Privacy Policy')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('legal.lastUpdated', 'Last updated: January 2025')}
        </p>
      </div>

      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 space-y-4 text-sm text-gray-300">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">1. {t('privacy.collection', 'Information We Collect')}</h2>
          <p>We collect information you provide directly, such as account details, transaction data, and communication preferences.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">2. {t('privacy.usage', 'How We Use Information')}</h2>
          <p>Your information is used to provide services, process transactions, ensure security, and improve our platform.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">3. {t('privacy.sharing', 'Information Sharing')}</h2>
          <p>We do not sell your personal information. We may share data with service providers, regulatory authorities, or in legal proceedings.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">4. {t('privacy.security', 'Data Security')}</h2>
          <p>We use encryption, multi-factor authentication, and other security measures to protect your information.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">5. {t('privacy.rights', 'Your Rights')}</h2>
          <p>You can access, update, or delete your personal information. Contact us for assistance with data requests.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">6. {t('privacy.contact', 'Contact Us')}</h2>
          <p>Questions about privacy? Email us at privacy@vonvault.com</p>
        </section>
      </div>
    </MobileLayoutWithTabs>
  );
};