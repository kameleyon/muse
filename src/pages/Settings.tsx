import React from 'react';
import '@/styles/settings.css';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import SettingsLayout from '@/features/settings/components/SettingsLayout';

const Settings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userName = user?.email?.split('@')[0] || 'User';

  return (
    <div className="bg-[#EDEAE2] min-h-screen">
      <div className="py-2 w-full mx-auto">
        <SettingsLayout />
      </div>
    </div>
  );
};

export default Settings;
