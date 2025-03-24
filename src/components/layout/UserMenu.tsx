import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

import { User, logout } from '@/store/slices/authSlice';

interface UserMenuProps {
  user: User;
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  // Default avatar if user doesn't have one
  const avatarUrl = user.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.fullName || user.email);

  return (
    <div className="relative">
      <button
        className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-teal rounded-full"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="sr-only">Open user menu</span>
        <img
          src={avatarUrl}
          alt="User avatar"
          className="h-8 w-8 rounded-full object-cover border-2 border-neutral-light   "
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for clicking away */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown menu */}
            <motion.div
              className="absolute right-0 mt-2 w-48 py-2 bg-white    rounded-md shadow-dropdown border border-neutral-light    z-20"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 py-2 border-b border-neutral-light   ">
                <p className="text-sm font-medium text-secondary    truncate">
                  {user.fullName || 'User'}
                </p>
                <p className="text-xs text-neutral-medium    truncate">
                  {user.email}
                </p>
              </div>
              
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-secondary    hover:bg-neutral-light/10   "
                onClick={() => setIsOpen(false)}
              >
                Your Profile
              </Link>
              
              <Link
                to="/settings"
                className="block px-4 py-2 text-sm text-secondary    hover:bg-neutral-light/10   "
                onClick={() => setIsOpen(false)}
              >
                Settings
              </Link>
              
              <button
                className="w-full text-left px-4 py-2 text-sm text-error hover:bg-neutral-light/10   "
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
