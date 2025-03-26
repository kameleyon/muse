import React from 'react';
import { Card } from '@/components/ui/Card';
import { settingsCategories, SettingsCategory, SettingsSubcategory } from '@/features/settings/data/settingsCategories';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface SettingsMenuProps {
  activeCategory: string;
  activeSubcategory: string;
  setActiveCategory: (category: string) => void;
  setActiveSubcategory: (subcategory: string) => void;
  mobileMenuExpanded: boolean;
  setMobileMenuExpanded: (expanded: boolean) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  activeCategory,
  activeSubcategory,
  setActiveCategory,
  setActiveSubcategory,
  mobileMenuExpanded,
  setMobileMenuExpanded
}) => {
  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setMobileMenuExpanded(!mobileMenuExpanded);
  };

  return (
    <Card className="settings-menu shadow-sm sm:shadow-md hover:shadow-lg transition-shadow mb-4 lg:mb-6 sticky top-0">
      <div className="p-3 sm:p-4 border-b border-neutral-light/40 bg-white/5 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-comfortaa text-[#1a1918]">Settings Menu</h2>
        <button 
          className="lg:hidden text-[#ae5630]" 
          onClick={toggleMobileMenu}
          aria-label={mobileMenuExpanded ? "Collapse menu" : "Expand menu"}
        >
          {mobileMenuExpanded ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </button>
      </div>
      <div className={`p-3 sm:p-4 ${mobileMenuExpanded ? 'block' : 'hidden lg:block'}`}>
        <nav>
          <ul className="space-y-1">
            {settingsCategories.map((category: SettingsCategory) => (
              <li key={category.id}>
                <button
                  className={`settings-menu-item w-full text-left ${
                    activeCategory === category.id 
                      ? 'active' 
                      : ''
                  }`}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setActiveSubcategory(category.subcategories[0].id);
                    if (window.innerWidth < 1024) {
                      setMobileMenuExpanded(false);
                    }
                  }}
                >
                  <span className="text-current">{category.icon}</span>
                  <span className="text-xs sm:text-sm md:text-base">{category.label}</span>
                </button>
                
                {/* Show subcategories if category is active */}
                {activeCategory === category.id && (
                  <ul className="settings-submenu space-y-1">
                    {category.subcategories.map((subcategory: SettingsSubcategory) => (
                      <li key={subcategory.id}>
                        <button
                          className={`settings-submenu-item w-full text-left ${
                            activeSubcategory === subcategory.id 
                              ? 'active' 
                              : ''
                          }`}
                          onClick={() => {
                            setActiveSubcategory(subcategory.id);
                            if (window.innerWidth < 1024) {
                              setMobileMenuExpanded(false);
                            }
                          }}
                        >
                          <span className="text-current">{subcategory.icon}</span>
                          <span className="text-xs sm:text-sm">{subcategory.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Card>
  );
};

export default SettingsMenu;
