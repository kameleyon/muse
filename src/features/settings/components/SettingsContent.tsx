import React, { ReactElement, Suspense } from 'react';
import UserProfileSettings from './sections/UserProfileSettings';
import ThemeSettings from './sections/ThemeSettings';
import AIAssistantSettings from './sections/AIAssistantSettings';
import WritingStyleSettings from './sections/WritingStyleSettings';
import LanguageSettings from './sections/LanguageSettings';
import ContentPrivacySettings from './sections/ContentPrivacySettings';
import CollaborationSettings from './sections/CollaborationSettings';

// This component will render different settings content based on the selected subcategory
const SettingsContent: React.FC<{ subcategoryId: string }> = ({ subcategoryId }): ReactElement => {
  // Import settings components
  const AppearanceSettings = React.lazy(() => import('@/features/profile/components/AppearanceSettings'));
  const NotificationSettings = React.lazy(() => import('@/features/profile/components/NotificationSettings'));
  const SecuritySettings = React.lazy(() => import('@/features/profile/components/SecuritySettings'));
  const SubscriptionSettings = React.lazy(() => import('@/features/profile/components/SubscriptionSettings'));
  const AIEthicsSettings = React.lazy(() => import('@/features/profile/components/AIEthicsSettings'));
  const LearningSettings = React.lazy(() => import('@/features/profile/components/LearningSettings'));
  const MobileSettings = React.lazy(() => import('@/features/profile/components/MobileSettings'));
  const CrossDeviceSettings = React.lazy(() => import('@/features/profile/components/CrossDeviceSettings'));
  const VersionHistorySettings = React.lazy(() => import('@/features/profile/components/VersionHistorySettings'));
  const BackupRecoverySettings = React.lazy(() => import('@/features/profile/components/BackupRecoverySettings'));
  const TemplateSettings = React.lazy(() => import('@/features/profile/components/TemplateSettings'));
  const ResourceLibrarySettings = React.lazy(() => import('@/features/profile/components/ResourceLibrarySettings'));
  const VoiceSpeechSettings = React.lazy(() => import('@/features/profile/components/VoiceSpeechSettings'));
  const KeyboardInputSettings = React.lazy(() => import('@/features/profile/components/KeyboardInputSettings'));
  
  // Fallback for lazy-loaded components
  const fallback = <div className="p-4 text-center">Loading settings...</div>;
  
  switch (subcategoryId) {
      case 'user-profile':
        return <UserProfileSettings />;
        
      case 'theme':
        return <ThemeSettings />;
        
      case 'ai-assistant':
        return <AIAssistantSettings />;
        
      case 'writing-style':
        return <WritingStyleSettings />;
        
      case 'language':
        return <LanguageSettings />;
        
      case 'content-privacy':
        return <ContentPrivacySettings />;
        
      case 'collaboration':
        return <CollaborationSettings />;
        
      case 'security':
        return (
          <Suspense fallback={fallback}>
            <SecuritySettings />
          </Suspense>
        );
        
      case 'subscription':
        return (
          <Suspense fallback={fallback}>
            <SubscriptionSettings />
          </Suspense>
        );
        
      case 'responsible-ai':
        return (
          <Suspense fallback={fallback}>
            <AIEthicsSettings />
          </Suspense>
        );
        
      case 'learning':
        return (
          <Suspense fallback={fallback}>
            <LearningSettings />
          </Suspense>
        );
        
      case 'mobile-specific':
        return (
          <Suspense fallback={fallback}>
            <MobileSettings />
          </Suspense>
        );
        
      case 'cross-device':
        return (
          <Suspense fallback={fallback}>
            <CrossDeviceSettings />
          </Suspense>
        );
        
      case 'version-history':
        return (
          <Suspense fallback={fallback}>
            <VersionHistorySettings />
          </Suspense>
        );
        
      case 'backup-recovery':
        return (
          <Suspense fallback={fallback}>
            <BackupRecoverySettings />
          </Suspense>
        );
        
      case 'template-settings':
        return (
          <Suspense fallback={fallback}>
            <TemplateSettings />
          </Suspense>
        );
        
      case 'resource-library':
        return (
          <Suspense fallback={fallback}>
            <ResourceLibrarySettings />
          </Suspense>
        );
        
      case 'voice-speech':
        return (
          <Suspense fallback={fallback}>
            <VoiceSpeechSettings />
          </Suspense>
        );
        
      case 'keyboard-input':
        return (
          <Suspense fallback={fallback}>
            <KeyboardInputSettings />
          </Suspense>
        );
        
      default:
        return <div className="p-4">Select a settings category to view options</div>;
  }
};

export default SettingsContent;