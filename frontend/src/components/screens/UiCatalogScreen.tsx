import React, { useState } from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { PasswordInput } from '../common/PasswordInput';
import { MobileLayout } from '../layout/MobileLayout';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../hooks/useLanguage';

export const UiCatalogScreen: React.FC<ScreenProps> = ({ onBack }) => {
  const [inputValue, setInputValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();

  return (
    <MobileLayout centered maxWidth="xs">
      <div className="absolute top-4 right-4">
        <LanguageSelector variant="compact" />
      </div>

      <div className="absolute top-4 left-4">
        <button onClick={onBack} className="p-2 text-gray-400 hover:text-white">←</button>
      </div>
      
      <div className="mb-6">
        <div className="text-6xl mb-4 text-center">🎨</div>
        <h1 className="text-2xl font-bold text-center mb-2">
          {t('ui.title', 'UI Catalog')}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {t('ui.subtitle', 'Component showcase')}
        </p>
      </div>

      <div className="w-full space-y-8">
        {/* Buttons */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-300">Buttons</h2>
          <div className="space-y-3">
            <Button fullWidth>Primary Button</Button>
            <Button variant="outline" fullWidth>Outline Button</Button>
            <Button variant="secondary" fullWidth>Secondary Button</Button>
            <Button loading fullWidth>Loading Button</Button>
            <Button disabled fullWidth>Disabled Button</Button>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-300">Form Inputs</h2>
          <div className="space-y-3">
            <Input
              label="Text Input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter text..."
            />
            
            <Input
              label="Email Input"
              type="email"
              value=""
              onChange={() => {}}
              placeholder="user@example.com"
            />
            
            <PasswordInput
              label="Password Input"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              placeholder="Enter password..."
              showPassword={showPassword}
              onToggleVisibility={() => setShowPassword(!showPassword)}
            />
            
            <Input
              label="Input with Error"
              value=""
              onChange={() => {}}
              error="This field is required"
              placeholder="This has an error"
            />
          </div>
        </div>

        {/* Cards Examples */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-300">Card Examples</h2>
          <div className="space-y-3">
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <div className="text-lg font-semibold text-purple-300 mb-2">Purple Card</div>
              <div className="text-gray-400 text-sm">This is a purple-themed card example</div>
            </div>
            
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <div className="text-lg font-semibold text-green-300 mb-2">Green Card</div>
              <div className="text-gray-400 text-sm">This is a green-themed card example</div>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <div className="text-lg font-semibold text-gray-300 mb-2">Gray Card</div>
              <div className="text-gray-400 text-sm">This is a gray-themed card example</div>
            </div>
          </div>
        </div>

        {/* Color Examples */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-300">Color Examples</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-purple-400">Purple Text</div>
            <div className="text-green-400">Green Text</div>
            <div className="text-blue-400">Blue Text</div>
            <div className="text-red-400">Red Text</div>
            <div className="text-yellow-400">Yellow Text</div>
            <div className="text-gray-400">Gray Text</div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};