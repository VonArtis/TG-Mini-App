import React, { useState } from 'react';
import type { ScreenProps } from '../../types';
import { ScreenHeader } from '../layout/ScreenHeader';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { useApp } from '../../context/AppContext';

export const WithdrawalScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ amount?: string; account?: string }>({});
  const { user } = useApp();

  // Check if user is verified
  const isVerified = user?.email_verified && user?.phone_verified;

  const validateForm = () => {
    const newErrors: { amount?: string; account?: string } = {};
    
    if (!account) {
      newErrors.account = 'Please select a bank account';
    }
    
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWithdraw = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate withdrawal API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      const accountName = account === 'checking' ? 'Checking Account' : 'Savings Account';
      alert(`Successfully withdrew $${parseFloat(amount).toLocaleString()} to ${accountName}`);
      setAmount('');
      setAccount('');
      setErrors({});
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('Withdrawal failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-12 pb-8">
      <ScreenHeader title="Withdraw Funds" onBack={onBack} />

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Bank Account <span className="text-red-400">*</span>
          </label>
          <select
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="w-full p-3 border border-purple-500 bg-gray-900 text-white rounded-lg focus:border-purple-400 focus:outline-none"
          >
            <option value="">Select account</option>
            <option value="checking">Checking Account (*****1234)</option>
            <option value="savings">Savings Account (*****5678)</option>
          </select>
          {errors.account && <p className="text-red-400 text-sm mt-1">{errors.account}</p>}
        </div>
        
        <Input
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          prefix="$"
          required
          error={errors.amount}
        />

        <Button
          onClick={handleWithdraw}
          loading={loading}
          disabled={!amount || !account}
          fullWidth
          size="lg"
          variant="danger"
        >
          Withdraw Funds
        </Button>
      </div>
    </div>
  );
};