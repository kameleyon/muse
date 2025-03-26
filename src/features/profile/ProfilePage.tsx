import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProfileSidebar from './components/ProfileSidebar';
import ProfileInfo from './components/ProfileInfo';
import SecuritySettings from './components/SecuritySettings';
import ChatHistorySettings from './components/ChatHistorySettings';
import NotificationSettings from './components/NotificationSettings';
import AppearanceSettings from './components/AppearanceSettings';
import SubscriptionSettings from './components/SubscriptionSettings';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading mb-2">Profile Settings</h1>
        <p className="text-neutral-medium max-w-3xl">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          {/* Profile Information */}
          {activeTab === 'profile' && <ProfileInfo />}

          {/* Password/Security */}
          {activeTab === 'password' && <SecuritySettings />}
          
          {/* Chat History */}
          {activeTab === 'chat-history' && <ChatHistorySettings />}

          {/* Notifications */}
          {activeTab === 'notifications' && <NotificationSettings />}

          {/* Appearance */}
          {activeTab === 'appearance' && <AppearanceSettings />}

          {/* Subscription */}
          {activeTab === 'subscription' && <SubscriptionSettings />}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
