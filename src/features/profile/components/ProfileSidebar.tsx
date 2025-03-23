import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full md:w-64"
    >
      <Card>
        <CardContent className="p-4">
          <nav className="flex flex-col space-y-1">
            <button
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'profile'
                  ? 'bg-primary text-secondary'
                  : 'text-secondary hover:bg-neutral-light/20'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile Information
            </button>
            <button
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'password'
                  ? 'bg-primary text-secondary'
                  : 'text-secondary hover:bg-neutral-light/20'
              }`}
              onClick={() => setActiveTab('password')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Security
            </button>
            <button
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'notifications'
                  ? 'bg-primary text-secondary'
                  : 'text-secondary hover:bg-neutral-light/20'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              Notifications
            </button>
            <button
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'appearance'
                  ? 'bg-primary text-secondary'
                  : 'text-secondary hover:bg-neutral-light/20'
              }`}
              onClick={() => setActiveTab('appearance')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.172 2.172a2 2 0 010 2.828l-8.486 8.486a4 4 0 01-5.656 0 2 2 0 010-2.828l8.486-8.486z"
                />
              </svg>
              Appearance
            </button>
            <button
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'subscription'
                  ? 'bg-primary text-secondary'
                  : 'text-secondary hover:bg-neutral-light/20'
              }`}
              onClick={() => setActiveTab('subscription')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Subscription
            </button>
          </nav>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileSidebar;
