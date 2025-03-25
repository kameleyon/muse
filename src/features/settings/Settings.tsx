import React, { useState, useEffect, ReactElement } from 'react';
import '@/styles/settings.css';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Card } from '@/components/ui/Card';
import SettingsNavigation from './components/SettingsNavigation';
import SettingsContent from './components/SettingsContent';
import { settingsCategories } from './data/settingsCategories';

const Settings: React.FC = (): ReactElement => {
  interface AuthState {
    user: {
      email?: string;
    };
  }

  const { user } = useSelector<RootState, AuthState>((state: RootState) => state.auth as AuthState);
  const userName = user?.email?.split('@')[0] || 'User';
  const [activeCategory, setActiveCategory] = useState('account-profile');
  const [activeSubcategory, setActiveSubcategory] = useState('user-profile');
  const [mobileMenuExpanded, setMobileMenuExpanded] = useState(false);
  
  return (
    <div className="bg-[#EDEAE2] min-h-screen">
      {/* Dashboard Content */}
      <div className=" w-full sm:max-w-full mx-auto">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Column - Settings Navigation */}
          <div className="lg:col-span-3">
            <SettingsNavigation 
              settingsCategories={settingsCategories}
              activeCategory={activeCategory}
              activeSubcategory={activeSubcategory}
              setActiveCategory={setActiveCategory}
              setActiveSubcategory={setActiveSubcategory}
              mobileMenuExpanded={mobileMenuExpanded}
              setMobileMenuExpanded={setMobileMenuExpanded}
            />
          </div>
          
          {/* Right Column - Settings Content */}
          <div className="lg:col-span-9">
            <Card className="shadow-sm sm:shadow-md hover:shadow-lg transition-shadow">
              <div className="p-3 sm:p-4 border-b border-neutral-light/40 bg-white/5">
                <h2 className="text-lg sm:text-xl font-comfortaa text-[#1a1918]">
                  {settingsCategories.find(cat => cat.id === activeCategory)?.subcategories.find(sub => sub.id === activeSubcategory)?.label}
                </h2>
              </div>
              <div className="p-3 sm:p-4 md:p-6">
                {/* Dynamic Settings Content based on activeSubcategory */}
                <SettingsContent subcategoryId={activeSubcategory} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;