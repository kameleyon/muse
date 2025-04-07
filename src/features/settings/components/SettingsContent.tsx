import React, { Suspense, ReactElement } from 'react';

// Import settings components lazily
const UserProfileSettings = React.lazy(() => import('./sections/UserProfileSettings'));
const ThemeSettings = React.lazy(() => import('./sections/ThemeSettings'));
const AIAssistantSettings = React.lazy(() => import('./sections/AIAssistantSettings'));
const WritingStyleSettings = React.lazy(() => import('./sections/WritingStyleSettings'));
const LanguageSettings = React.lazy(() => import('./sections/LanguageSettings'));
const ContentPrivacySettings = React.lazy(() => import('./sections/ContentPrivacySettings'));
const CollaborationSettings = React.lazy(() => import('./sections/CollaborationSettings'));
const AccountSettings = React.lazy(() => import('./sections/AccountSettings'));
const SubscriptionSettings = React.lazy(() => import('@/features/profile/components/SubscriptionSettings'));
const APIAccessSettings = React.lazy(() => import('./sections/APIAccessSettings'));
const EditorSettings = React.lazy(() => import('./sections/EditorSettings'));
const LayoutSettings = React.lazy(() => import('./sections/LayoutSettings'));
const AccessibilitySettings = React.lazy(() => import('./sections/AccessibilitySettings'));
const DataUsageSettings = React.lazy(() => import('./sections/DataUsageSettings'));
const EmailNotificationSettings = React.lazy(() => import('./sections/EmailNotificationSettings'));
const InAppNotificationSettings = React.lazy(() => import('./sections/InAppNotificationSettings'));
const RemindersSettings = React.lazy(() => import('./sections/RemindersSettings'));
const ConnectedServicesSettings = React.lazy(() => import('./sections/ConnectedServicesSettings'));
const ImportExportSettings = React.lazy(() => import('./sections/ImportExportSettings'));
const WorkflowSettings = React.lazy(() => import('./sections/WorkflowSettings'));
const PerformanceSettings = React.lazy(() => import('./sections/PerformanceSettings'));
const SecuritySettings = React.lazy(() => import('@/features/profile/components/SecuritySettings'));
const TeamAdminSettings = React.lazy(() => import('./sections/TeamAdminSettings'));
const VersionHistorySettings = React.lazy(() => import('@/features/profile/components/VersionHistorySettings'));
const BackupRecoverySettings = React.lazy(() => import('@/features/profile/components/BackupRecoverySettings'));
const TemplateSettings = React.lazy(() => import('@/features/profile/components/TemplateSettings'));
const ResourceLibrarySettings = React.lazy(() => import('@/features/profile/components/ResourceLibrarySettings'));
const VoiceSpeechSettings = React.lazy(() => import('@/features/profile/components/VoiceSpeechSettings'));
const KeyboardInputSettings = React.lazy(() => import('@/features/profile/components/KeyboardInputSettings'));
const AIEthicsSettings = React.lazy(() => import('@/features/profile/components/AIEthicsSettings'));
const LearningSettings = React.lazy(() => import('@/features/profile/components/LearningSettings'));
const MobileSettings = React.lazy(() => import('@/features/profile/components/MobileSettings'));
const CrossDeviceSettings = React.lazy(() => import('@/features/profile/components/CrossDeviceSettings'));

interface SettingsContentProps {
  subcategoryId: string;
}

// This component will render different settings content based on the selected subcategory
const SettingsContent: React.FC<SettingsContentProps> = ({ subcategoryId }): ReactElement => {
  // Fallback for lazy-loaded components
  const fallback = <div className="p-4 text-center">Loading settings...</div>;
  
  // Render different settings based on subcategoryId
  const renderSettings = () => {
    switch (subcategoryId) {
      case 'user-profile':
        return <Suspense fallback={fallback}><UserProfileSettings /></Suspense>;
      case 'account-settings':
        return <Suspense fallback={fallback}><AccountSettings /></Suspense>;
      case 'subscription':
        return <Suspense fallback={fallback}><SubscriptionSettings /></Suspense>;
      case 'api-access':
        return <Suspense fallback={fallback}><APIAccessSettings /></Suspense>;
      case 'theme':
        return <Suspense fallback={fallback}><ThemeSettings /></Suspense>;
      case 'editor':
        return <Suspense fallback={fallback}><EditorSettings /></Suspense>;
      case 'layout':
        return <Suspense fallback={fallback}><LayoutSettings /></Suspense>;
      case 'accessibility':
        return <Suspense fallback={fallback}><AccessibilitySettings /></Suspense>;
      case 'writing-style':
        return <Suspense fallback={fallback}><WritingStyleSettings /></Suspense>;
      case 'ai-assistant':
        return <Suspense fallback={fallback}><AIAssistantSettings /></Suspense>;
      case 'language':
        return <Suspense fallback={fallback}><LanguageSettings /></Suspense>;
      case 'content-privacy':
        return <Suspense fallback={fallback}><ContentPrivacySettings /></Suspense>;
      case 'collaboration':
        return <Suspense fallback={fallback}><CollaborationSettings /></Suspense>;
      case 'data-usage':
        return <Suspense fallback={fallback}><DataUsageSettings /></Suspense>;
      case 'email-notifications':
        return <Suspense fallback={fallback}><EmailNotificationSettings /></Suspense>;
      case 'in-app-notifications':
        return <Suspense fallback={fallback}><InAppNotificationSettings /></Suspense>;
      case 'reminders':
        return <Suspense fallback={fallback}><RemindersSettings /></Suspense>;
      case 'connected-services':
        return <Suspense fallback={fallback}><ConnectedServicesSettings /></Suspense>;
      case 'import-export':
        return <Suspense fallback={fallback}><ImportExportSettings /></Suspense>;
      case 'workflow':
        return <Suspense fallback={fallback}><WorkflowSettings /></Suspense>;
      case 'performance':
        return <Suspense fallback={fallback}><PerformanceSettings /></Suspense>;
      case 'security':
        return <Suspense fallback={fallback}><SecuritySettings /></Suspense>;
      case 'team-admin':
        return <Suspense fallback={fallback}><TeamAdminSettings /></Suspense>;
      case 'version-history':
        return <Suspense fallback={fallback}><VersionHistorySettings /></Suspense>;
      case 'backup-recovery':
        return <Suspense fallback={fallback}><BackupRecoverySettings /></Suspense>;
      case 'template-settings':
        return <Suspense fallback={fallback}><TemplateSettings /></Suspense>;
      case 'resource-library':
        return <Suspense fallback={fallback}><ResourceLibrarySettings /></Suspense>;
      case 'voice-speech':
        return <Suspense fallback={fallback}><VoiceSpeechSettings /></Suspense>;
      case 'keyboard-input':
        return <Suspense fallback={fallback}><KeyboardInputSettings /></Suspense>;
      case 'responsible-ai':
        return <Suspense fallback={fallback}><AIEthicsSettings /></Suspense>;
      case 'learning':
        return <Suspense fallback={fallback}><LearningSettings /></Suspense>;
      case 'mobile-specific':
        return <Suspense fallback={fallback}><MobileSettings /></Suspense>;
      case 'cross-device':
        return <Suspense fallback={fallback}><CrossDeviceSettings /></Suspense>;
      default:
        return <div>Settings not found</div>;
    }
  };

  return renderSettings();
};

export default SettingsContent;