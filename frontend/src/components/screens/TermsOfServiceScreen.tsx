import React from 'react';
import type { ScreenProps } from '../../types';
import { MobileLayout } from '../layout/MobileLayout';
import { useLanguage } from '../../hooks/useLanguage';

export const TermsOfServiceScreen: React.FC<ScreenProps> = ({ onBack }) => {
  const { t } = useLanguage();

  return (
    <MobileLayout centered maxWidth="md">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <button 
          onClick={onBack} 
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center mb-2">
          {t('legal.termsTitle', 'Terms of Service')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('legal.lastUpdated', 'Last updated: January 2025')}
        </p>
      </div>

      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 space-y-4 text-sm text-gray-300">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">1. {t('legal.acceptance', 'Acceptance of Terms')}</h2>
          <p>By accessing and using VonVault, you accept and agree to be bound by the terms and provision of this agreement.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">2. {t('legal.services', 'Description of Services')}</h2>
          <p>VonVault provides DeFi investment management services, including portfolio tracking, investment opportunities, and crypto wallet integration.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">3. {t('legal.risks', 'Investment Risks')}</h2>
          <p>All investments carry risk of loss. Past performance does not guarantee future results. Cryptocurrency investments are particularly volatile.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">4. {t('legal.privacy', 'Privacy and Security')}</h2>
          <p>We implement bank-grade security measures to protect your data and funds. Your personal information is handled according to our Privacy Policy.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">5. {t('legal.liability', 'Limitation of Liability')}</h2>
          <p>VonVault shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">6. {t('legal.contact', 'Contact Information')}</h2>
          <p>For questions about these Terms, please contact us at legal@vonvault.com</p>
        </section>
      </div>
    </MobileLayout>
  );
};