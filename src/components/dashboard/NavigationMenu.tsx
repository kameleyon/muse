import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface NavigationMenuProps {
  items: MenuItem[];
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ items }) => {
  const location = useLocation();
  
  return (
    <div className="mb-6 bg-neutral-white rounded-xl p-4 border border-neutral-light/40 shadow-sm">
      <div className="flex justify-between md:justify-end">
        {items.map((item, index) => (
          <Link 
            key={index}
            to={item.path} 
            className={`flex items-center px-1 sm:px-4 py-2 ${location.pathname === item.path ? 'text-primary' : 'text-neutral-medium hover:text-primary'}`}
          >
            <span className="mx-auto md:mr-2">{item.icon}</span>
            <span className="hidden md:inline">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavigationMenu;
