import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import { Button } from '../ui/Button';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar(!sidebarOpen));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-20 bg-white shadow-sm">
      <div className="px-4 py-3 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={handleToggleSidebar}
              className="p-2 rounded-md text-secondary hover:bg-neutral-light/20 lg:hidden"
              aria-label="Toggle sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="ml-4 lg:hidden">
              <Link to="/" className="flex items-center">
                <img
                  src="/mmiologo.png"
                  alt="magicmuse Logo"
                  className="h-8 w-auto mr-2"
                />
                <span className="font-heading font-bold text-xl text-secondary">
                  magicmuse
                </span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.fullName || user.email}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-white">
                          {user.fullName
                            ? user.fullName.substring(0, 1)
                            : user.email.substring(0, 1).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="ml-2 text-sm font-medium text-secondary hidden md:block">
                      {user.fullName || user.email}
                    </span>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  aria-label="Log out"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth/login">Login</Link>
                </Button>
                <Button variant="primary" size="sm" asChild>
                  <Link to="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
