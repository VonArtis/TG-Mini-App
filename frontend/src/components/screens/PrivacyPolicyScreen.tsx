import React from 'react';
import type { ScreenProps } from '../../types';
import { CleanHeader } from '../layout/CleanHeader';
import { Card } from '../common/Card';
import { useLanguage } from '../../hooks/useLanguage';

export const PrivacyPolicyScreen: React.FC<ScreenProps> = ({ onBack }) => {
  const { t } = useLanguage();

  return (
    <div className="px-6 pb-8 pt-4 space-y-6">
      <CleanHeader 
        title="🔒 Privacy Policy" 
        onBack={onBack}
      />

      <Card className="p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔒</div>
          <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            VonVault Privacy Policy
          </h2>
          <p className="text-gray-400 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6 text-gray-300">
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">1. Information We Collect</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Personal Information:</strong> Name, email address, phone number, and verification documents.</p>
              <p><strong>Financial Information:</strong> Bank account details, cryptocurrency wallet addresses, and transaction history.</p>
              <p><strong>Technical Information:</strong> IP address, device information, browser type, and usage analytics.</p>
              <p><strong>Communication:</strong> Support messages, feedback, and correspondence with VonVault.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">2. How We Use Your Information</h3>
            <div className="space-y-2 text-sm">
              <p>• <strong>Service Provision:</strong> Process investments, manage accounts, and facilitate transactions.</p>
              <p>• <strong>Security:</strong> Verify identity, prevent fraud, and protect user accounts.</p>
              <p>• <strong>Communication:</strong> Send important updates, notifications, and customer support.</p>
              <p>• <strong>Compliance:</strong> Meet regulatory requirements and legal obligations.</p>
              <p>• <strong>Improvement:</strong> Analyze usage patterns to enhance our services.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">3. Information Sharing</h3>
            <div className="space-y-2 text-sm">
              <p><strong>We DO NOT sell your personal information.</strong></p>
              <p>We may share information with:</p>
              <p>• <strong>Service Providers:</strong> Third-party companies that help us operate our platform.</p>
              <p>• <strong>Regulatory Authorities:</strong> When required by law or regulation.</p>
              <p>• <strong>Business Partners:</strong> Trusted partners for specific services (with your consent).</p>
              <p>• <strong>Legal Requirements:</strong> When necessary to comply with legal processes.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">4. Data Security</h3>
            <div className="space-y-2 text-sm">
              <p>• <strong>Encryption:</strong> All data is encrypted in transit and at rest using industry-standard protocols.</p>
              <p>• <strong>Access Controls:</strong> Strict access controls limit who can view your information.</p>
              <p>• <strong>Monitoring:</strong> 24/7 security monitoring and threat detection systems.</p>
              <p>• <strong>Audits:</strong> Regular security audits and penetration testing.</p>
              <p>• <strong>Compliance:</strong> SOC 2 Type II and other security certifications.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">5. Your Rights</h3>
            <div className="space-y-2 text-sm">
              <p>• <strong>Access:</strong> Request a copy of your personal information.</p>
              <p>• <strong>Correction:</strong> Update or correct inaccurate information.</p>
              <p>• <strong>Deletion:</strong> Request deletion of your account and data.</p>
              <p>• <strong>Portability:</strong> Receive your data in a portable format.</p>
              <p>• <strong>Objection:</strong> Object to certain types of data processing.</p>
              <p>• <strong>Withdrawal:</strong> Withdraw consent for data processing where applicable.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">6. Cookies and Tracking</h3>
            <div className="space-y-2 text-sm">
              <p>We use cookies and similar technologies to:</p>
              <p>• <strong>Essential:</strong> Enable core platform functionality.</p>
              <p>• <strong>Analytics:</strong> Understand how users interact with our platform.</p>
              <p>• <strong>Security:</strong> Detect fraudulent activity and security threats.</p>
              <p>• <strong>Preferences:</strong> Remember your settings and preferences.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">7. Data Retention</h3>
            <div className="space-y-2 text-sm">
              <p>• <strong>Active Accounts:</strong> Data retained while your account is active.</p>
              <p>• <strong>Inactive Accounts:</strong> Data may be retained for up to 7 years after account closure.</p>
              <p>• <strong>Legal Requirements:</strong> Some data retained longer to meet regulatory obligations.</p>
              <p>• <strong>Deletion:</strong> You can request immediate deletion of non-essential data.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">8. International Transfers</h3>
            <div className="space-y-2 text-sm">
              <p>Your information may be transferred to and processed in countries other than your own.</p>
              <p>We ensure adequate protection through:</p>
              <p>• <strong>Adequacy Decisions:</strong> Transfers to countries with adequate protection.</p>
              <p>• <strong>Standard Contractual Clauses:</strong> Legal safeguards for international transfers.</p>
              <p>• <strong>Certification Programs:</strong> Privacy frameworks and certifications.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">9. Children's Privacy</h3>
            <div className="space-y-2 text-sm">
              <p>VonVault is not intended for users under 18 years of age.</p>
              <p>We do not knowingly collect personal information from children under 18.</p>
              <p>If we become aware of such collection, we will delete the information immediately.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">10. Changes to This Policy</h3>
            <div className="space-y-2 text-sm">
              <p>We may update this Privacy Policy from time to time.</p>
              <p>Material changes will be communicated through:</p>
              <p>• Email notifications to registered users</p>
              <p>• Prominent notices on our platform</p>
              <p>• Updates to the "Last Updated" date above</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">11. Contact Us</h3>
            <div className="space-y-2 text-sm">
              <p>For privacy-related questions or requests, contact us:</p>
              <p>• <strong>Email:</strong> privacy@vonvault.com</p>
              <p>• <strong>Address:</strong> VonVault Privacy Officer, [Company Address]</p>
              <p>• <strong>Response Time:</strong> We respond to privacy requests within 30 days.</p>
            </div>
          </section>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-4 bg-blue-900/20 border-blue-500/30">
        <h3 className="text-blue-300 font-medium mb-2">Privacy Controls</h3>
        <div className="space-y-2 text-blue-400 text-sm">
          <p>• Contact support to exercise your privacy rights</p>
          <p>• Update your preferences in account settings</p>
          <p>• Review your data in the account dashboard</p>
          <p>• Opt out of non-essential communications anytime</p>
        </div>
      </Card>
    </div>
  );
};