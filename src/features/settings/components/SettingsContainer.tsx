import React, { useState, ReactElement } from 'react';
import '@/styles/settings.css';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Card } from '@/components/ui/Card';
import SettingsNavigation from './SettingsNavigation';
import SettingsContent from './SettingsContent';
import { settingsCategories } from '../data/settingsData';

const SettingsContainer: React.FC = (): ReactElement => {
  const [activeCategory, setActiveCategory] = useState('account-profile');
  const [activeSubcategory, setActiveSubcategory] = useState('user-profile');
  const [mobileMenuExpanded, setMobileMenuExpanded] = useState(false);
  
  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setMobileMenuExpanded(!mobileMenuExpanded);
  };

  return (
    <div className="bg-[#EDEAE2] min-h-screen">
      {/* Dashboard Content */}
      <div className="py-8 w-full mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Column - Settings Navigation */}
          <div className="lg:col-span-3">
            <SettingsNavigation 
              activeCategory={activeCategory}
              activeSubcategory={activeSubcategory}
              setActiveCategory={setActiveCategory}
              setActiveSubcategory={setActiveSubcategory}
              mobileMenuExpanded={mobileMenuExpanded}
              toggleMobileMenu={toggleMobileMenu}
              settingsCategories={settingsCategories}
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

export default SettingsContainer;