import React, { Suspense, lazy } from 'react';
import { Button } from '@/components/ui/Button';

// Lazy load settings modules
const UserProfileSettings = lazy(() => import('@/features/settings/components/account/UserProfileSettings'));
const ThemeSettings = lazy(() => import('@/features/settings/components/interface/ThemeSettings'));
const AIAssistantSettings = lazy(() => import('@/features/settings/components/ai/AIAssistantSettings'));
const WritingStyleSettings = lazy(() => import('@/features/settings/components/ai/WritingStyleSettings'));
const LanguageSettings = lazy(() => import('@/features/settings/components/ai/LanguageSettings'));
const ContentPrivacySettings = lazy(() => import('@/features/settings/components/privacy/ContentPrivacySettings'));
const CollaborationSettings = lazy(() => import('@/features/settings/components/privacy/CollaborationSettings'));
const DataUsageSettings = lazy(() => import('@/features/settings/components/privacy/DataUsageSettings'));
const EmailNotificationSettings = lazy(() => import('@/features/settings/components/notifications/EmailNotificationSettings'));
const InAppNotificationSettings = lazy(() => import('@/features/settings/components/notifications/InAppNotificationSettings'));
const RemindersSettings = lazy(() => import('@/features/settings/components/notifications/RemindersSettings'));
const ConnectedServicesSettings = lazy(() => import('@/features/settings/components/integration/ConnectedServicesSettings'));

// Fallback for lazy-loaded components
const Fallback = () => (
  <div className="p-4 flex items-center justify-center">
    <div className="animate-pulse text-[#ae5630]">Loading settings...</div>
  </div>
);

// Generic settings placeholder for not yet implemented settings
const GenericSettings = ({ title }: { title: string }) => (
  <div className="space-y-4">
    <p>Settings for: {title}</p>
    <p className="text-[#3d3d3a]">
      These settings are currently being implemented. Please check back soon!
    </p>
    <div className="flex justify-end">
      <Button variant="primary" className="text-white">
        Save Changes
      </Button>
    </div>
  </div>
);

interface SettingsContentProps {
  subcategoryId: string;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ subcategoryId }) => {
  return (
    <Suspense fallback={<Fallback />}>
      {(() => {
        // Map subcategory IDs to their corresponding components
        switch (subcategoryId) {
          // Account & Profile
          case 'user-profile':
            return <UserProfileSettings />;
          case 'account-settings':
            return <GenericSettings title="Account Settings" />;
          case 'subscription':
            return <GenericSettings title="Subscription Management" />;
          case 'api-access':
            return <GenericSettings title="API Access Settings" />;
          
          // User Interface
          case 'theme':
            return <ThemeSettings />;
          case 'editor':
            return <GenericSettings title="Editor Preferences" />;
          case 'layout':
            return <GenericSettings title="Layout Customization" />;
          case 'accessibility':
            return <GenericSettings title="Accessibility Settings" />;
          
          // AI Behavior
          case 'writing-style':
            return <WritingStyleSettings />;
          case 'ai-assistant':
            return <AIAssistantSettings />;
          case 'language':
            return <LanguageSettings />;
          
          // Privacy & Data
          case 'content-privacy':
            return <ContentPrivacySettings />;
          case 'collaboration':
            return <CollaborationSettings />;
          case 'data-usage':
            return <DataUsageSettings />;
          
          // Notifications
          case 'email-notifications':
            return <EmailNotificationSettings />;
          case 'in-app-notifications':
            return <InAppNotificationSettings />;
          case 'reminders':
            return <RemindersSettings />;
          
          // Integration
          case 'connected-services':
            return <ConnectedServicesSettings />;
          case 'import-export':
            return <GenericSettings title="Import/Export Preferences" />;
          case 'workflow':
            return <GenericSettings title="Workflow Integration" />;
          
          // Other categories
          default:
            return <GenericSettings title={subcategoryId.replace(/-/g, ' ')} />;
        }
      })()}
    </Suspense>
  );
};

export default SettingsContent;
