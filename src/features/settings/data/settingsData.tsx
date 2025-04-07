import React from 'react';
import { 
  User as UserIcon, Shield as ShieldIcon, CreditCard, Key, PaintBucket, Type, Layout, Accessibility,
  Keyboard, Globe, Lock, Shield, Bell as BellIcon, Sliders, Database, Server,
  Cloud, Workflow, Zap, User, Users as UsersIcon, History, Save, BookOpen, Mic,
  Smartphone, Monitor, Radio, Mail, Clock, Link, RefreshCw, GraduationCap
} from 'lucide-react';
import FileTemplate from '@/components/icons/FileTemplate';
import { SettingsCategory } from '../types/settings';

// Define settings categories and subcategories
export const settingsCategories: SettingsCategory[] = [
  {
    id: 'account-profile',
    label: 'Account & Profile',
    icon: <UserIcon size={20} />,
    subcategories: [
      { id: 'user-profile', label: 'User Profile Settings', icon: <UserIcon size={16} /> },
      { id: 'account-settings', label: 'Account Settings', icon: <ShieldIcon size={16} /> },
      { id: 'subscription', label: 'Subscription Management', icon: <CreditCard size={16} /> },
      { id: 'api-access', label: 'API Access Settings', icon: <Key size={16} /> }
    ]
  },
  {
    id: 'ui-customization',
    label: 'User Interface',
    icon: <PaintBucket size={20} />,
    subcategories: [
      { id: 'theme', label: 'Theme Settings', icon: <PaintBucket size={16} /> },
      { id: 'editor', label: 'Editor Preferences', icon: <Type size={16} /> },
      { id: 'layout', label: 'Layout Customization', icon: <Layout size={16} /> },
      { id: 'accessibility', label: 'Accessibility Settings', icon: <Accessibility size={16} /> }
    ]
  },
  {
    id: 'ai-behavior',
    label: 'AI Behavior',
    icon: <Sliders size={20} />,
    subcategories: [
      { id: 'writing-style', label: 'Writing Style Adaptation', icon: <Type size={16} /> },
      { id: 'ai-assistant', label: 'AI Assistant Settings', icon: <Sliders size={16} /> },
      { id: 'language', label: 'Language Settings', icon: <Globe size={16} /> }
    ]
  },
  {
    id: 'privacy-data',
    label: 'Privacy & Data',
    icon: <Lock size={20} />,
    subcategories: [
      { id: 'content-privacy', label: 'Content Privacy', icon: <Lock size={16} /> },
      { id: 'collaboration', label: 'Collaboration Permissions', icon: <UsersIcon size={16} /> },
      { id: 'data-usage', label: 'Data Usage Preferences', icon: <Database size={16} /> }
    ]
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <BellIcon size={20} />,
    subcategories: [
      { id: 'email-notifications', label: 'Email Notifications', icon: <Mail size={16} /> },
      { id: 'in-app-notifications', label: 'In-App Notifications', icon: <BellIcon size={16} /> },
      { id: 'reminders', label: 'Reminder Settings', icon: <Clock size={16} /> }
    ]
  },
  {
    id: 'integration',
    label: 'Integration',
    icon: <Link size={20} />,
    subcategories: [
      { id: 'connected-services', label: 'Connected Services', icon: <Cloud size={16} /> },
      { id: 'import-export', label: 'Import/Export Preferences', icon: <RefreshCw size={16} /> },
      { id: 'workflow', label: 'Workflow Integration', icon: <Workflow size={16} /> }
    ]
  },
  {
    id: 'advanced',
    label: 'Advanced',
    icon: <Server size={20} />,
    subcategories: [
      { id: 'performance', label: 'Performance Optimization', icon: <Zap size={16} /> },
      { id: 'security', label: 'Security Configuration', icon: <Shield size={16} /> },
      { id: 'team-admin', label: 'Team Administration', icon: <UsersIcon size={16} /> }
    ]
  },
  {
    id: 'version-control',
    label: 'Content Version Control',
    icon: <History size={20} />,
    subcategories: [
      { id: 'version-history', label: 'Version History Management', icon: <History size={16} /> },
      { id: 'backup-recovery', label: 'Backup and Recovery', icon: <Save size={16} /> }
    ]
  },
  {
    id: 'templates-resources',
    label: 'Templates & Resources',
    icon: <FileTemplate size={20} />,
    subcategories: [
      { id: 'template-settings', label: 'Template Settings', icon: <FileTemplate size={16} /> },
      { id: 'resource-library', label: 'Resource Library Configuration', icon: <Database size={16} /> }
    ]
  },
  {
    id: 'input-accessibility',
    label: 'Input & Accessibility',
    icon: <Keyboard size={20} />,
    subcategories: [
      { id: 'voice-speech', label: 'Voice and Speech Settings', icon: <Mic size={16} /> },
      { id: 'keyboard-input', label: 'Keyboard and Input Configuration', icon: <Keyboard size={16} /> }
    ]
  },
  {
    id: 'ai-ethics',
    label: 'AI Ethics & Learning',
    icon: <BookOpen size={20} />,
    subcategories: [
      { id: 'responsible-ai', label: 'Responsible AI Settings', icon: <Shield size={16} /> },
      { id: 'learning', label: 'Learning and Development', icon: <GraduationCap size={16} /> }
    ]
  },
  {
    id: 'mobile-platform',
    label: 'Mobile & Cross-Platform',
    icon: <Smartphone size={20} />,
    subcategories: [
      { id: 'mobile-specific', label: 'Mobile-Specific Configuration', icon: <Smartphone size={16} /> },
      { id: 'cross-device', label: 'Cross-Device Synchronization', icon: <Monitor size={16} /> }
    ]
  }
];