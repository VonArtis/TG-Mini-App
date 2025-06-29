import React from 'react';
import type { ScreenProps } from '../../types';
import { MobileLayout } from '../layout/MobileLayout';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../hooks/useLanguage';

export const TermsOfServiceScreen: React.FC<ScreenProps> = ({ onBack }) => {
  const { t } = useLanguage();

  return (
    <MobileLayout centered maxWidth="md">
      <div className="absolute top-4 right-4">
        <LanguageSelector variant="compact" />
      </div>

      <div className="absolute top-4 left-4">
        <button onClick={onBack} className="p-2 text-gray-400 hover:text-white">←</button>
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