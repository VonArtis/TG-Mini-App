import React from 'react';
import type { ScreenProps } from '../../types';
import { CleanHeader } from '../layout/CleanHeader';
import { Card } from '../common/Card';
import { useLanguage } from '../../hooks/useLanguage';

export const TermsOfServiceScreen: React.FC<ScreenProps> = ({ onBack }) => {
  const { t } = useLanguage();

  return (
    <div className="px-6 pb-8 pt-4 space-y-6">
      <CleanHeader 
        title="📋 Terms of Service" 
        onBack={onBack}
      />

      <Card className="p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">📋</div>
          <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            VonVault Terms of Service
          </h2>
          <p className="text-gray-400 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6 text-gray-300">
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">1. Acceptance of Terms</h3>
            <div className="space-y-2 text-sm">
              <p>By accessing and using VonVault ("the Platform"), you accept and agree to be bound by these Terms of Service.</p>
              <p>If you do not agree to these terms, you may not access or use the Platform.</p>
              <p>These terms apply to all users, including visitors, registered users, and premium subscribers.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">2. Eligibility</h3>
            <div className="space-y-2 text-sm">
              <p>• You must be at least 18 years old to use VonVault</p>
              <p>• You must have legal capacity to enter into binding agreements</p>
              <p>• You must not be prohibited from using the service under applicable laws</p>
              <p>• You must provide accurate and complete information during registration</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">3. Account Registration</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Account Creation:</strong> You must create an account to access investment features.</p>
              <p><strong>Information Accuracy:</strong> All information provided must be accurate and up-to-date.</p>
              <p><strong>Account Security:</strong> You are responsible for maintaining account security.</p>
              <p><strong>Verification:</strong> We may require identity verification for compliance purposes.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">4. Investment Services</h3>
            <div className="space-y-2 text-sm">
              <p><strong>DeFi Platform:</strong> VonVault provides access to decentralized finance investment opportunities.</p>
              <p><strong>Risk Disclosure:</strong> All investments carry risk, including potential loss of principal.</p>
              <p><strong>No Guarantees:</strong> Past performance does not guarantee future results.</p>
              <p><strong>Professional Advice:</strong> Platform does not provide personalized investment advice.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">5. User Responsibilities</h3>
            <div className="space-y-2 text-sm">
              <p>• <strong>Compliance:</strong> Follow all applicable laws and regulations</p>
              <p>• <strong>Accurate Information:</strong> Provide truthful and current information</p>
              <p>• <strong>Security:</strong> Protect your account credentials and private keys</p>
              <p>• <strong>Prohibited Activities:</strong> Do not engage in fraudulent or illegal activities</p>
              <p>• <strong>System Integrity:</strong> Do not attempt to compromise platform security</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">6. Prohibited Activities</h3>
            <div className="space-y-2 text-sm">
              <p>Users may not:</p>
              <p>• Use the platform for money laundering or terrorist financing</p>
              <p>• Manipulate markets or engage in fraudulent trading</p>
              <p>• Attempt to hack, reverse engineer, or compromise the platform</p>
              <p>• Share accounts or allow unauthorized access</p>
              <p>• Violate any applicable laws or regulations</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">7. Fees and Payments</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Transaction Fees:</strong> Certain transactions may incur fees as disclosed.</p>
              <p><strong>Network Fees:</strong> Blockchain network fees are separate and beyond our control.</p>
              <p><strong>Fee Changes:</strong> Fees may change with reasonable notice.</p>
              <p><strong>Payment Processing:</strong> Third-party payment processors may apply additional fees.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">8. Intellectual Property</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Platform Ownership:</strong> VonVault owns all platform intellectual property.</p>
              <p><strong>License:</strong> We grant you limited, non-exclusive access to use the platform.</p>
              <p><strong>Restrictions:</strong> You may not copy, modify, or redistribute platform content.</p>
              <p><strong>User Content:</strong> You retain ownership of content you submit but grant us usage rights.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">9. Disclaimers</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Service Availability:</strong> Platform provided "as is" without warranties.</p>
              <p><strong>Investment Risk:</strong> All investments are subject to market risk and volatility.</p>
              <p><strong>Third-Party Services:</strong> We are not responsible for third-party service failures.</p>
              <p><strong>Regulatory Changes:</strong> Service may be affected by regulatory changes.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">10. Limitation of Liability</h3>
            <div className="space-y-2 text-sm">
              <p>VonVault's liability is limited to the maximum extent permitted by law.</p>
              <p>We are not liable for:</p>
              <p>• Investment losses or market volatility</p>
              <p>• Third-party service interruptions</p>
              <p>• User errors or security breaches</p>
              <p>• Force majeure events or regulatory changes</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">11. Indemnification</h3>
            <div className="space-y-2 text-sm">
              <p>You agree to indemnify VonVault against claims arising from:</p>
              <p>• Your violation of these terms</p>
              <p>• Your use of the platform</p>
              <p>• Your violation of applicable laws</p>
              <p>• Infringement of third-party rights</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">12. Termination</h3>
            <div className="space-y-2 text-sm">
              <p><strong>User Termination:</strong> You may close your account at any time.</p>
              <p><strong>Platform Termination:</strong> We may suspend or terminate accounts for violations.</p>
              <p><strong>Effect of Termination:</strong> Access to services will cease upon termination.</p>
              <p><strong>Data Retention:</strong> Some data may be retained per our Privacy Policy.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">13. Dispute Resolution</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Governing Law:</strong> These terms are governed by [Jurisdiction] law.</p>
              <p><strong>Arbitration:</strong> Disputes may be subject to binding arbitration.</p>
              <p><strong>Class Action Waiver:</strong> You waive rights to participate in class actions.</p>
              <p><strong>Informal Resolution:</strong> Contact support first to resolve disputes.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">14. Changes to Terms</h3>
            <div className="space-y-2 text-sm">
              <p>We may modify these terms with notice to users.</p>
              <p>Material changes will be communicated via email or platform notification.</p>
              <p>Continued use constitutes acceptance of modified terms.</p>
              <p>You may terminate your account if you disagree with changes.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">15. Contact Information</h3>
            <div className="space-y-2 text-sm">
              <p>For questions about these terms, contact us:</p>
              <p>• <strong>Email:</strong> legal@vonvault.com</p>
              <p>• <strong>Address:</strong> VonVault Legal Department, [Company Address]</p>
              <p>• <strong>Support:</strong> Available through the platform help center</p>
            </div>
          </section>
        </div>
      </Card>

      {/* Legal Notice */}
      <Card className="p-4 bg-yellow-900/20 border-yellow-500/30">
        <h3 className="text-yellow-300 font-medium mb-2">Important Legal Notice</h3>
        <div className="space-y-1 text-yellow-400 text-sm">
          <p>• These terms constitute a legally binding agreement</p>
          <p>• Investment involves risk and potential loss of capital</p>
          <p>• Consult professional advisors before making investment decisions</p>
          <p>• Report any violations or concerns to our support team</p>
        </div>
      </Card>
    </div>
  );
};