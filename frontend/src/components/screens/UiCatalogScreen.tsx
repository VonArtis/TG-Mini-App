import React, { useState } from 'react';
import type { ScreenProps } from '../../types';
import { CleanHeader } from '../layout/CleanHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { PasswordInput } from '../common/PasswordInput';
import { EnhancedProgressBar } from '../common/EnhancedProgressBar';
import { MembershipBadge } from '../common/MembershipBadge';
import { useLanguage } from '../../hooks/useLanguage';

export const UiCatalogScreen: React.FC<ScreenProps> = ({ onBack }) => {
  const [inputValue, setInputValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'buttons' | 'inputs' | 'cards' | 'components'>('buttons');
  const { t } = useLanguage();

  const renderButtons = () => (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Button Variants</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Primary Buttons</h4>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-purple-400 hover:bg-purple-500">Primary</Button>
              <Button size="sm" className="bg-purple-400 hover:bg-purple-500">Small</Button>
              <Button size="lg" className="bg-purple-400 hover:bg-purple-500">Large</Button>
              <Button disabled className="bg-purple-400 hover:bg-purple-500">Disabled</Button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Secondary Buttons</h4>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary">Secondary</Button>
              <Button variant="secondary" size="sm">Small</Button>
              <Button variant="secondary" size="lg">Large</Button>
              <Button variant="secondary" disabled>Disabled</Button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Outline Buttons</h4>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">Outline</Button>
              <Button variant="outline" size="sm">Small</Button>
              <Button variant="outline" size="lg">Large</Button>
              <Button variant="outline" disabled>Disabled</Button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Colored Buttons</h4>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-green-600 hover:bg-green-700">Success</Button>
              <Button className="bg-red-600 hover:bg-red-700">Danger</Button>
              <Button className="bg-yellow-600 hover:bg-yellow-700">Warning</Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Info</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderInputs = () => (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Input Components</h3>
        <div className="space-y-4">
          <Input
            label="Basic Input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter text here..."
          />

          <Input
            label="Email Input"
            type="email"
            value=""
            onChange={() => {}}
            placeholder="user@example.com"
          />

          <Input
            label="Number Input"
            type="number"
            value=""
            onChange={() => {}}
            placeholder="123.45"
          />

          <Input
            label="Input with Error"
            error="This field is required"
            value=""
            onChange={() => {}}
            placeholder="This has an error"
          />

          <PasswordInput
            label="Password Input"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            placeholder="Enter password..."
            showPassword={false}
            onToggleVisibility={() => {}}
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Textarea</label>
            <textarea
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[44px]"
              rows={4}
              placeholder="Enter multiple lines of text..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Select</label>
            <select className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[44px]">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderCards = () => (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Card Variants</h3>
        <div className="space-y-4">
          <Card className="p-4">
            <h4 className="font-semibold text-white mb-2">Basic Card</h4>
            <p className="text-gray-400 text-sm">This is a basic card with default styling.</p>
          </Card>

          <Card className="p-4 bg-blue-900/20 border-blue-500/30">
            <h4 className="font-semibold text-blue-300 mb-2">Blue Accent Card</h4>
            <p className="text-blue-400 text-sm">This card has a blue color theme.</p>
          </Card>

          <Card className="p-4 bg-green-900/20 border-green-500/30">
            <h4 className="font-semibold text-green-300 mb-2">Green Accent Card</h4>
            <p className="text-green-400 text-sm">This card has a green color theme.</p>
          </Card>

          <Card className="p-4 bg-red-900/20 border-red-500/30">
            <h4 className="font-semibold text-red-300 mb-2">Red Accent Card</h4>
            <p className="text-red-400 text-sm">This card has a red color theme.</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-500/30">
            <h4 className="font-semibold text-purple-300 mb-2">Gradient Card</h4>
            <p className="text-purple-400 text-sm">This card has a gradient background.</p>
          </Card>
        </div>
      </Card>
    </div>
  );

  const renderComponents = () => (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Progress Bars</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Basic Progress (25%)</h4>
            <EnhancedProgressBar progress={25} level="club" />
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Success Progress (75%)</h4>
            <EnhancedProgressBar progress={75} level="premium" />
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Warning Progress (50%)</h4>
            <EnhancedProgressBar progress={50} level="vip" />
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Large Progress (90%)</h4>
            <EnhancedProgressBar progress={90} level="elite" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Membership Badges</h3>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <MembershipBadge level="basic" />
            <MembershipBadge level="club" />
            <MembershipBadge level="premium" />
            <MembershipBadge level="vip" />
            <MembershipBadge level="elite" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Loading States</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Spinner</h4>
            <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full"></div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Pulse Animation</h4>
            <div className="w-16 h-16 bg-purple-400 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Icons & Emojis</h3>
        <div className="grid grid-cols-6 gap-4 text-2xl">
          <div className="text-center">🏠</div>
          <div className="text-center">💼</div>
          <div className="text-center">🔗</div>
          <div className="text-center">👤</div>
          <div className="text-center">🚀</div>
          <div className="text-center">💰</div>
          <div className="text-center">📈</div>
          <div className="text-center">🔐</div>
          <div className="text-center">✅</div>
          <div className="text-center">⚠️</div>
          <div className="text-center">❌</div>
          <div className="text-center">💎</div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="px-6 pb-8 pt-4 space-y-6">
      <CleanHeader 
        title="🎨 UI Catalog" 
        onBack={onBack}
      />

      {/* Tab Navigation */}
      <Card className="p-4">
        <div className="grid grid-cols-4 gap-2">
          <Button
            onClick={() => setActiveTab('buttons')}
            variant={activeTab === 'buttons' ? 'primary' : 'outline'}
            className={`min-h-[44px] text-sm ${activeTab === 'buttons' ? 'bg-purple-400 hover:bg-purple-500' : ''}`}
          >
            Buttons
          </Button>
          <Button
            onClick={() => setActiveTab('inputs')}
            variant={activeTab === 'inputs' ? 'primary' : 'outline'}
            className={`min-h-[44px] text-sm ${activeTab === 'inputs' ? 'bg-purple-400 hover:bg-purple-500' : ''}`}
          >
            Inputs
          </Button>
          <Button
            onClick={() => setActiveTab('cards')}
            variant={activeTab === 'cards' ? 'primary' : 'outline'}
            className={`min-h-[44px] text-sm ${activeTab === 'cards' ? 'bg-purple-400 hover:bg-purple-500' : ''}`}
          >
            Cards
          </Button>
          <Button
            onClick={() => setActiveTab('components')}
            variant={activeTab === 'components' ? 'primary' : 'outline'}
            className={`min-h-[44px] text-sm ${activeTab === 'components' ? 'bg-purple-400 hover:bg-purple-500' : ''}`}
          >
            Others
          </Button>
        </div>
      </Card>

      {activeTab === 'buttons' && renderButtons()}
      {activeTab === 'inputs' && renderInputs()}
      {activeTab === 'cards' && renderCards()}
      {activeTab === 'components' && renderComponents()}

      {/* Design System Info */}
      <Card className="p-4 bg-purple-900/20 border-purple-500/30">
        <h3 className="text-purple-300 font-medium mb-2">Design System</h3>
        <div className="space-y-1 text-purple-400 text-sm">
          <p>• Mobile-first design with 44px+ touch targets</p>
          <p>• Black (#000000) background, White (#ffffff) text</p>
          <p>• Purple (#9333ea) accent color throughout</p>
          <p>• Consistent spacing: px-6 pb-8 pt-4 space-y-6</p>
        </div>
      </Card>
    </div>
  );
};