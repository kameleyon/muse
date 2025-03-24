import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { completeLogout } from '@/utils/clearCache';

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleItemClick = (item: MenuItem, event: React.MouseEvent) => {
    if (item.path === '/logout') {
      // Prevent default navigation
      event.preventDefault();
      
      // Perform logout actions
      completeLogout(dispatch).then(() => {
        // Redirect to landing page after logout
        navigate('/');
      });
    }
  };
  
  return (
    <div className="mb-6 bg-neutral-white rounded-xl p-4 border border-neutral-light/40 shadow-sm">
      <div className="flex justify-between md:justify-end">
        {items.map((item, index) => (
          <Link 
            key={index}
            to={item.path} 
            onClick={(e) => handleItemClick(item, e)}
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
