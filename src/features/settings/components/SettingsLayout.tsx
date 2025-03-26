import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import SettingsMenu from '@/features/settings/components/SettingsMenu';
import SettingsContent from '@/features/settings/components/SettingsContent';
import '@/styles/settings.css';

const SettingsLayout: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('account-profile');
  const [activeSubcategory, setActiveSubcategory] = useState('user-profile');
  const [mobileMenuExpanded, setMobileMenuExpanded] = useState(false);
  
  return (
    <div className="bg-[#EDEAE2] min-h-screen">
      <div className="py-2 w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Column - Settings Navigation */}
          <div className="lg:col-span-3">
            <SettingsMenu 
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
                  {activeSubcategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Settings
                </h2>
              </div>
              <div className="p-3 sm:p-4 md:p-6">
                <SettingsContent subcategoryId={activeSubcategory} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
