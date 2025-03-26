import React, { useState, useEffect, Suspense, ReactElement } from 'react';
import '@/styles/settings.css';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  WelcomeSection, 
  NavigationMenu 
} from '@/components/dashboard';
import { 
  Home, FolderOpen, FileText, Bookmark, Users, Bell, Settings as SettingsIcon, LogOut,
  User as UserIcon, Shield as ShieldIcon, CreditCard, Key, PaintBucket, Type, Layout, Accessibility,
  Keyboard, Globe, Lock, Shield, Bell as BellIcon, Sliders, Database, Server,
  Cloud, Workflow, Zap, User, Users as UsersIcon, History, Save, BookOpen, Mic,
  Smartphone, Monitor, Radio, Mail, Clock, Check as CheckIcon, PlusCircle, Link, RefreshCw, GraduationCap,
  ChevronUp, ChevronDown, FileCode, Archive
} from 'lucide-react';
import FileTemplate from '@/components/icons/FileTemplate';

const Settings: React.FC = (): ReactElement => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userName = user?.email?.split('@')[0] || 'User';
  const [activeCategory, setActiveCategory] = useState('account-profile');
  const [activeSubcategory, setActiveSubcategory] = useState('user-profile');
  const [mobileMenuExpanded, setMobileMenuExpanded] = useState(false);
  
  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setMobileMenuExpanded(!mobileMenuExpanded);
  };

  const navigationItems = [
    { path: '/dashboard', label: 'Home', icon: <Home size={20} color="#3d3d3a" /> },
    { path: '/projects', label: 'My Projects', icon: <FolderOpen size={20} color="#3d3d3a" /> },
    { path: '/templates', label: 'Templates', icon: <FileText size={20} color="#3d3d3a" /> },
    { path: '/bookmarks', label: 'Bookmarks', icon: <Bookmark size={20} color="#3d3d3a" /> },
    { path: '/team', label: 'Team', icon: <Users size={20} color="#3d3d3a" /> },
    { path: '/notifications', label: 'Notifications', icon: <Bell size={20} color="#3d3d3a" /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon size={20} color="#ae5630" /> },
    { path: '/logout', label: 'Logout', icon: <LogOut size={20} color="#3d3d3a" /> }
  ];

  // Define settings categories and subcategories
  const settingsCategories = [
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
        { id: 'team-admin', label: 'Team Administration', icon: <Users size={16} /> }
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

  return (
    <div className="bg-[#EDEAE2] min-h-screen">
      {/* Dashboard Content */}
      <div className="px-1 sm:px-5 py-8 w-full sm:max-w-8xl mx-auto">
        {/* Welcome Section */}
        <WelcomeSection 
          userName={userName}
          draftCount={3} 
          publishedCount={8}
        />
        
        {/* Horizontal Navigation Menu */}
        <NavigationMenu items={navigationItems} />
        
        {/* Settings Title 
        <Card className="mb-6 overflow-hidden shadow-sm sm:shadow-md hover:shadow-lg transition-shadow">
          <div className="p-4 border-b border-neutral-light/40 bg-white/5">
            <h1 className="text-2xl font-comfortaa text-[#ae5630] flex items-center">
              <SettingsIcon size={24} className="mr-2" />
              Settings
            </h1>
            <p className="text-[#3d3d3a] mt-1">Configure your MagicMuse experience</p>
          </div>
        </Card>*/}
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Column - Settings Navigation */}
          <div className="lg:col-span-3">
            <Card className="settings-menu shadow-sm sm:shadow-md hover:shadow-lg transition-shadow mb-4 lg:mb-6 sticky top-0">
              <div className="p-3 sm:p-4 border-b border-neutral-light/40 bg-white/5 flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-comfortaa text-[#1a1918]">Settings Menu</h2>
                <button 
                  className="lg:hidden text-[#ae5630]" 
                  onClick={toggleMobileMenu}
                  aria-label={mobileMenuExpanded ? "Collapse menu" : "Expand menu"}
                >
                  {mobileMenuExpanded ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>
              <div className={`p-3 sm:p-4 ${mobileMenuExpanded ? 'block' : 'hidden lg:block'} max-h-[calc(100vh-200px)] overflow-y-auto`}>
                <nav>
                  <ul className="space-y-1">
                    {settingsCategories.map((category) => (
                      <li key={category.id}>
                        <button
                          className={`settings-menu-item w-full text-left ${
                            activeCategory === category.id 
                              ? 'active' 
                              : ''
                          }`}
                          onClick={() => {
                            setActiveCategory(category.id);
                            setActiveSubcategory(category.subcategories[0].id);
                            if (window.innerWidth < 1024) {
                              setMobileMenuExpanded(false);
                            }
                          }}
                        >
                          <span className="text-current">{category.icon}</span>
                          <span className="text-xs sm:text-sm md:text-base">{category.label}</span>
                        </button>
                        
                        {/* Show subcategories if category is active */}
                        {activeCategory === category.id && (
                          <ul className="settings-submenu space-y-1">
                            {category.subcategories.map((subcategory) => (
                              <li key={subcategory.id}>
                                <button
                                  className={`settings-submenu-item w-full text-left ${
                                    activeSubcategory === subcategory.id 
                                      ? 'active' 
                                      : ''
                                  }`}
                                  onClick={() => {
                                    setActiveSubcategory(subcategory.id);
                                    if (window.innerWidth < 1024) {
                                      setMobileMenuExpanded(false);
                                    }
                                  }}
                                >
                                  <span className="text-current">{subcategory.icon}</span>
                                  <span className="text-xs sm:text-sm">{subcategory.label}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </Card>
          </div>
          
          {/* Right Column - Settings Content */}
          <div className="lg:col-span-9">
            <Card className="shadow-sm sm:shadow-md hover:shadow-lg transition-shadow">
              <div className="p-3 sm:p-4 border-b border-neutral-light/40 bg-white/5">
                <h2 className="text-lg sm:text-xl font-comfortaa text-[#1a1918]">
                  {settingsCategories.find(cat => cat.id === activeCategory)?.subcategories.find(sub => sub.id === activeSubcategory)?.label}
                </h2>
              </div>
              <div className="p-3 sm:p-4 md:p-6">
                {/* Dynamic Settings Content based on activeSubcategory */}
                <SettingsContent subcategoryId={activeSubcategory} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

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
        return (
          <div className="space-y-6">
            <div className="settings-form-section">
              <h3 className="settings-form-title">Profile Information</h3>
              <p className="settings-form-description">Manage how your profile appears to others</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="settings-label">
                    Display Name
                  </label>
                  <input
                    type="text"
                    className="settings-input"
                    placeholder="Your display name"
                    defaultValue="Arcanadraconi"
                  />
                </div>
                
                <div>
                  <label className="settings-label">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    className="settings-input"
                    placeholder="e.g. Writer, Designer, Developer"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="settings-label">
                    Bio / About Me
                  </label>
                  <textarea
                    className="settings-textarea"
                    placeholder="Write a short bio about yourself"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Profile Picture</h3>
              <p className="settings-form-description">Upload an avatar to personalize your account</p>
              
              <div className="flex items-center gap-4 mt-4">
                <div className="w-20 h-20 rounded-full bg-[#6d371f] flex items-center justify-center text-white text-2xl">
                  A
                </div>
                
                <div>
                  <Button variant="outline" size="sm" className="mb-2">
                    Upload New Image
                  </Button>
                  <p className="text-xs text-[#3d3d3a]">
                    Recommended: Square JPG or PNG, at least 200×200 pixels
                  </p>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Social Media Connections</h3>
              <p className="settings-form-description">Connect your social media accounts</p>
              
              <div className="grid grid-cols-1 gap-4 mt-4">
                <div className="settings-field-group">
                  <label className="settings-label">
                    Twitter / X
                  </label>
                  <input
                    type="text"
                    className="settings-input"
                    placeholder="https://twitter.com/username"
                  />
                </div>
                
                <div className="settings-field-group">
                  <label className="settings-label">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    className="settings-input"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                
                <div className="settings-field-group">
                  <label className="settings-label">
                    Personal Website
                  </label>
                  <input
                    type="text"
                    className="settings-input"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Professional Credentials</h3>
              <p className="settings-form-description">Add your expertise areas and credentials</p>
              
              <div className="space-y-4 mt-4">
                <div className="settings-field-group">
                  <label className="settings-label">
                    Areas of Expertise
                  </label>
                  <input
                    type="text"
                    className="settings-input"
                    placeholder="e.g. Fiction Writing, Content Marketing, UX Design"
                  />
                  <p className="text-xs text-[#3d3d3a] mt-1">
                    Separate multiple areas with commas
                  </p>
                </div>
                
                <div className="settings-field-group">
                  <label className="settings-label">
                    Credentials & Certifications
                  </label>
                  <textarea
                    className="settings-textarea"
                    placeholder="List your relevant credentials, degrees, or certifications"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Portfolio Showcase</h3>
              <p className="settings-form-description">Select projects to showcase on your profile</p>
              
              <div className="space-y-2 mt-4">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                  <span className="ml-2">Fantasy Novel</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                  <span className="ml-2">Character Profiles</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                  <span className="ml-2">World Building</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                  <span className="ml-2">Plot Outline</span>
                </label>
              </div>
            </div>
            
            <div className="settings-footer">
              <Button variant="primary" className="text-white">
                Save Changes
              </Button>
            </div>
          </div>
        );
        
      case 'theme':
        return (
          <div className="space-y-6">
            <div className="settings-form-section">
              <h3 className="settings-form-title">Theme Selection</h3>
              <p className="settings-form-description">Choose your preferred visual theme</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="relative cursor-pointer group">
                  <div className="rounded-md overflow-hidden border-2 border-[#ae5630] shadow-sm">
                    <div className="h-24 bg-[#EDEAE2]">
                      <div className="h-6 bg-[#1a1918]"></div>
                      <div className="p-2">
                        <div className="w-1/2 h-3 bg-[#ae5630] rounded mb-2"></div>
                        <div className="w-full h-2 bg-[#3d3d3a] rounded opacity-20 mb-1"></div>
                        <div className="w-full h-2 bg-[#3d3d3a] rounded opacity-20 mb-1"></div>
                      </div>
                    </div>
                    <div className="p-2 text-center text-sm font-medium">Light Theme</div>
                  </div>
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#ae5630] flex items-center justify-center text-white">
                    <CheckIcon size={12} />
                  </div>
                </div>
                
                <div className="relative cursor-pointer group">
                  <div className="rounded-md overflow-hidden border-2 border-transparent hover:border-[#ae5630] shadow-sm transition-all">
                    <div className="h-24 bg-[#1a1918]">
                      <div className="h-6 bg-[#000000]"></div>
                      <div className="p-2">
                        <div className="w-1/2 h-3 bg-[#ae5630] rounded mb-2"></div>
                        <div className="w-full h-2 bg-[#edeae2] rounded opacity-20 mb-1"></div>
                        <div className="w-full h-2 bg-[#edeae2] rounded opacity-20 mb-1"></div>
                      </div>
                    </div>
                    <div className="p-2 text-center text-sm font-medium">Dark Theme</div>
                  </div>
                </div>
                
                <div className="relative cursor-pointer group">
                  <div className="rounded-md overflow-hidden border-2 border-transparent hover:border-[#ae5630] shadow-sm transition-all">
                    <div className="h-24 bg-gradient-to-b from-[#EDEAE2] to-[#1a1918]">
                      <div className="h-6 bg-[#1a1918]"></div>
                      <div className="p-2">
                        <div className="w-1/2 h-3 bg-[#ae5630] rounded mb-2"></div>
                        <div className="w-full h-2 bg-[#3d3d3a] rounded opacity-20 mb-1"></div>
                        <div className="w-full h-2 bg-[#3d3d3a] rounded opacity-20 mb-1"></div>
                      </div>
                    </div>
                    <div className="p-2 text-center text-sm font-medium">System Default</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Color Scheme</h3>
              <p className="settings-form-description">Customize your theme colors</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="settings-label">
                    Primary Color
                  </label>
                  <div className="color-picker-container">
                    <input
                      type="color"
                      className="color-picker"
                      value="#ae5630"
                    />
                    <input
                      type="text"
                      className="settings-input"
                      value="#ae5630"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="settings-label">
                    Secondary Color
                  </label>
                  <div className="color-picker-container">
                    <input
                      type="color"
                      className="color-picker"
                      value="#6d371f"
                    />
                    <input
                      type="text"
                      className="settings-input"
                      value="#6d371f"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Custom Themes</h3>
              <p className="settings-form-description">Create and save custom theme presets</p>
              
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="new-theme-preset-card">
                  <div className="text-center">
                    <PlusCircle size={24} className="mx-auto text-[#3d3d3a]" />
                    <span className="text-sm block mt-1">New Theme</span>
                  </div>
                </div>
                
                <div className="theme-preset-card">
                  <div className="w-full h-full bg-gradient-to-br from-[#2a9d8f] to-[#264653]">
                    <div className="theme-preset-name">
                      <span>Ocean Breeze</span>
                    </div>
                  </div>
                </div>
                
                <div className="theme-preset-card">
                  <div className="w-full h-full bg-gradient-to-br from-[#f4a261] to-[#e76f51]">
                    <div className="theme-preset-name">
                      <span>Sunset</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Time-Based Themes</h3>
              <p className="settings-form-description">Automatically switch themes based on time of day</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable automatic theme switching</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="settings-label">
                      Day Theme (6:00 AM - 6:00 PM)
                    </label>
                    <select className="settings-select">
                      <option>Light Theme</option>
                      <option>Ocean Breeze</option>
                      <option>Sunset</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="settings-label">
                      Night Theme (6:00 PM - 6:00 AM)
                    </label>
                    <select className="settings-select">
                      <option>Dark Theme</option>
                      <option>Ocean Breeze</option>
                      <option>Sunset</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-footer">
              <Button variant="outline" className="mr-2">
                Reset to Default
              </Button>
              <Button variant="primary" className="text-white">
                Save Changes
              </Button>
            </div>
          </div>
        );
        
      case 'ai-assistant':
        return (
          <div className="space-y-6">
            <div className="settings-form-section">
              <h3 className="settings-form-title">Suggestion Frequency</h3>
              <p className="settings-form-description">Control how often the AI assistant provides suggestions</p>
              
              <div className="mt-4 space-y-4">
                <div>
                  <label className="settings-label">Suggestion Frequency</label>
                  <div className="mt-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      defaultValue="3"
                      className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-[#3d3d3a] mt-1">
                      <span>Minimal</span>
                      <span>Balanced</span>
                      <span>Comprehensive</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Tone Settings</h3>
              <p className="settings-form-description">Set the default tone for AI-generated content</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="settings-label">Default Tone</label>
                  <select className="settings-select">
                    <option>Professional</option>
                    <option>Casual</option>
                    <option>Academic</option>
                    <option>Creative</option>
                    <option>Technical</option>
                    <option>Conversational</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Content Complexity</label>
                  <select className="settings-select">
                    <option>Simple</option>
                    <option>Standard</option>
                    <option>Detailed</option>
                    <option>Advanced</option>
                    <option>Expert</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">AI Content Generation</h3>
              <p className="settings-form-description">Balance between factual accuracy and creativity</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Factual Accuracy Priority</label>
                  <div className="mt-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      defaultValue="4"
                      className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-[#3d3d3a] mt-1">
                      <span>Lower</span>
                      <span>Balanced</span>
                      <span>Higher</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="settings-label">Creativity Level</label>
                  <div className="mt-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      defaultValue="3"
                      className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-[#3d3d3a] mt-1">
                      <span>Conservative</span>
                      <span>Balanced</span>
                      <span>Imaginative</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Context Retention</h3>
              <p className="settings-form-description">Control how much context the AI remembers during your session</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable contextual awareness</span>
                </div>
                
                <div>
                  <label className="settings-label">Context Window Size</label>
                  <select className="settings-select">
                    <option>Small (recent paragraphs only)</option>
                    <option>Medium (current section)</option>
                    <option>Large (entire document)</option>
                    <option>Custom</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Topic Expertise</h3>
              <p className="settings-form-description">Configure specialized knowledge areas for the AI</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Specialized Domains</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Fiction Writing</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Academic</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Technical</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Business</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Marketing</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Creative</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="settings-label">Custom Knowledge Area</label>
                  <input
                    type="text"
                    className="settings-input"
                    placeholder="Enter specialized knowledge area (e.g., 'Medieval History')"
                  />
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Citation Preferences</h3>
              <p className="settings-form-description">Configure citation style and source quality preferences</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="settings-label">Citation Style</label>
                  <select className="settings-select">
                    <option>APA (7th Edition)</option>
                    <option>MLA (8th Edition)</option>
                    <option>Chicago (17th Edition)</option>
                    <option>Harvard</option>
                    <option>IEEE</option>
                    <option>Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Source Quality Priority</label>
                  <select className="settings-select">
                    <option>Academic Sources Only</option>
                    <option>High-quality Publications</option>
                    <option>Balanced Mix</option>
                    <option>Diverse Sources</option>
                    <option>All Available Sources</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">AI Intervention Timing</h3>
              <p className="settings-form-description">Control when the AI offers suggestions</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Suggestion Timing</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="intervention-timing"
                        className="form-radio text-[#ae5630]"
                        defaultChecked
                      />
                      <span className="ml-2">Real-time (as you type)</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="intervention-timing"
                        className="form-radio text-[#ae5630]"
                      />
                      <span className="ml-2">On pause (when you stop typing)</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="intervention-timing"
                        className="form-radio text-[#ae5630]"
                      />
                      <span className="ml-2">On-demand only (when requested)</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="settings-label">Pause Threshold</label>
                  <select className="settings-select">
                    <option>Short (1 second)</option>
                    <option>Medium (3 seconds)</option>
                    <option>Long (5 seconds)</option>
                    <option>Very Long (10 seconds)</option>
                    <option>Custom</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="settings-footer">
              <Button variant="outline" className="mr-2">
                Reset to Default
              </Button>
              <Button variant="primary" className="text-white">
                Save Changes
              </Button>
            </div>
          </div>
        );
        
      case 'writing-style':
        return (
          <div className="space-y-6">
            <div className="settings-form-section">
              <h3 className="settings-form-title">Personal Writing Style Learning</h3>
              <p className="settings-form-description">Configure how the AI learns and adapts to your writing style</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable writing style adaptation</span>
                </div>
                
                <div>
                  <label className="settings-label">Learning Mode</label>
                  <select className="settings-select">
                    <option>Passive (learn from your writing)</option>
                    <option>Interactive (ask for feedback)</option>
                    <option>Manual (use uploaded samples)</option>
                    <option>Hybrid (combination approach)</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Sample Threshold</label>
                  <select className="settings-select">
                    <option>Minimal (500 words)</option>
                    <option>Standard (2,000 words)</option>
                    <option>Extensive (5,000+ words)</option>
                    <option>Custom</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Terminology Preferences</h3>
              <p className="settings-form-description">Manage custom dictionaries and terminology preferences</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Custom Dictionary</label>
                  <textarea
                    className="settings-textarea"
                    placeholder="Add custom terms and definitions (one per line in format: term:definition)"
                  ></textarea>
                </div>
                
                <div>
                  <label className="settings-label">Dictionary Upload</label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Upload Dictionary</Button>
                    <span className="text-xs text-[#3d3d3a]">
                      Supported formats: CSV, TXT, XLSX
                    </span>
                  </div>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Apply custom terms to suggestions</span>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Industry-Specific Language</h3>
              <p className="settings-form-description">Configure specialized language settings for your industry</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Industry</label>
                  <select className="settings-select">
                    <option>General</option>
                    <option>Technology</option>
                    <option>Healthcare</option>
                    <option>Finance</option>
                    <option>Legal</option>
                    <option>Education</option>
                    <option>Marketing</option>
                    <option>Creative Arts</option>
                    <option>Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Specialized Sub-domain</label>
                  <input
                    type="text"
                    className="settings-input"
                    placeholder="e.g., 'Machine Learning' for Technology industry"
                  />
                </div>
                
                <div>
                  <label className="settings-label">Technical Terminology Level</label>
                  <div className="mt-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      defaultValue="3"
                      className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-[#3d3d3a] mt-1">
                      <span>General</span>
                      <span>Moderate</span>
                      <span>Highly Technical</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Brand Voice Configuration</h3>
              <p className="settings-form-description">Align AI suggestions with your brand's voice and style</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Voice Characteristics</label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="text-xs text-[#3d3d3a] mb-1 block">Formal vs. Casual</label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        defaultValue="3"
                        className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#3d3d3a] mb-1 block">Serious vs. Playful</label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        defaultValue="3"
                        className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#3d3d3a] mb-1 block">Reserved vs. Bold</label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        defaultValue="3"
                        className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#3d3d3a] mb-1 block">Traditional vs. Innovative</label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        defaultValue="3"
                        className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="settings-label">Style Guide Upload</label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Upload Style Guide</Button>
                    <span className="text-xs text-[#3d3d3a]">
                      Supported formats: PDF, DOCX, TXT
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Target Audience Configuration</h3>
              <p className="settings-form-description">Customize tone and style for your specific audience</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Primary Audience</label>
                  <select className="settings-select">
                    <option>General</option>
                    <option>Technical Professionals</option>
                    <option>Executives</option>
                    <option>Academic</option>
                    <option>Creative Readers</option>
                    <option>Customers/Consumers</option>
                    <option>Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Educational Level</label>
                  <select className="settings-select">
                    <option>General</option>
                    <option>High School</option>
                    <option>Undergraduate</option>
                    <option>Graduate</option>
                    <option>Field Expert</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Audience Familiarity</label>
                  <select className="settings-select">
                    <option>Newcomers (explain everything)</option>
                    <option>Some Knowledge (moderate explanations)</option>
                    <option>Knowledgeable (minimal explanations)</option>
                    <option>Experts (technical language welcome)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Cultural Sensitivity</h3>
              <p className="settings-form-description">Configure localization and cultural preferences</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Region-Specific Content</label>
                  <select className="settings-select">
                    <option>Global (culturally neutral)</option>
                    <option>North America</option>
                    <option>Europe</option>
                    <option>Asia-Pacific</option>
                    <option>Latin America</option>
                    <option>Middle East & Africa</option>
                    <option>Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Cultural References</label>
                  <select className="settings-select">
                    <option>Avoid cultural references</option>
                    <option>Global references only</option>
                    <option>Region-specific references allowed</option>
                    <option>Custom</option>
                  </select>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable inclusivity suggestions</span>
                </div>
              </div>
            </div>
            
            <div className="settings-footer">
              <Button variant="outline" className="mr-2">
                Reset to Default
              </Button>
              <Button variant="primary" className="text-white">
                Save Changes
              </Button>
            </div>
          </div>
        );
        
      case 'language':
        return (
          <div className="space-y-6">
            <div className="settings-form-section">
              <h3 className="settings-form-title">Primary Language</h3>
              <p className="settings-form-description">Set your primary working language for MagicMuse</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Primary Language</label>
                  <select className="settings-select">
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>English (Australia)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Chinese (Simplified)</option>
                    <option>Japanese</option>
                    <option>Korean</option>
                    <option>Portuguese</option>
                    <option>Russian</option>
                    <option>Arabic</option>
                    <option>Hindi</option>
                  </select>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Use system language</span>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Secondary Languages</h3>
              <p className="settings-form-description">Add additional languages for multilingual users</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Secondary Languages</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Spanish</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">French</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">German</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Italian</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Portuguese</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Chinese</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <Button variant="outline" size="sm">
                    Add Other Language
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Regional Variants</h3>
              <p className="settings-form-description">Configure region-specific language preferences</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">English Variant</label>
                  <select className="settings-select">
                    <option>American English (US)</option>
                    <option>British English (UK)</option>
                    <option>Australian English</option>
                    <option>Canadian English</option>
                    <option>Indian English</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Spanish Variant</label>
                  <select className="settings-select">
                    <option>European Spanish (Spain)</option>
                    <option>Latin American Spanish</option>
                    <option>Mexican Spanish</option>
                  </select>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Apply regional spelling conventions</span>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Translation Preferences</h3>
              <p className="settings-form-description">Configure how MagicMuse handles translations</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Default Translation Target</label>
                  <select className="settings-select">
                    <option>Primary Language</option>
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Chinese (Simplified)</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Translation Style</label>
                  <select className="settings-select">
                    <option>Literal (closest possible translation)</option>
                    <option>Natural (idiomatic, flowing language)</option>
                    <option>Formal (professional, conservative)</option>
                    <option>Casual (conversational, relaxed)</option>
                  </select>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Preserve original formatting</span>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Industry-Specific Terminology</h3>
              <p className="settings-form-description">Configure specialized language databases</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Terminology Databases</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Technology</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Medical</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Legal</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Finance</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Scientific</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Academic</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="settings-label">Upload Custom Terminology Database</label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Upload Database</Button>
                    <span className="text-xs text-[#3d3d3a]">
                      Supported formats: CSV, TXT, XLSX, TMX
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Idioms and Cultural References</h3>
              <p className="settings-form-description">Configure how MagicMuse handles idiomatic expressions</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Idiom Handling</label>
                  <select className="settings-select">
                    <option>Preserve idioms when possible</option>
                    <option>Replace with equivalent in target language</option>
                    <option>Explain idioms literally</option>
                    <option>Avoid idiomatic expressions entirely</option>
                  </select>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Provide explanations for cultural references</span>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Custom Glossary</h3>
              <p className="settings-form-description">Manage project-specific terminology</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Project Glossaries</label>
                  <select className="settings-select">
                    <option>Fantasy Novel</option>
                    <option>Technical Documentation</option>
                    <option>Marketing Content</option>
                    <option>Blog Posts</option>
                    <option>+ Create New Glossary</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Glossary Terms</label>
                  <textarea
                    className="settings-textarea"
                    placeholder="Enter terms and definitions (one per line) in format: term:definition"
                    defaultValue="worldbuilding:The process of creating an imaginary world for a story
mana:A magical energy source in fantasy stories
character arc:The transformation of a character throughout a narrative"
                  ></textarea>
                </div>
                
                <div>
                  <label className="settings-label">Import/Export</label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Import</Button>
                    <Button variant="outline" size="sm">Export</Button>
                    <span className="text-xs text-[#3d3d3a]">
                      Supported formats: CSV, TXT, XLSX
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-footer">
              <Button variant="outline" className="mr-2">
                Reset to Default
              </Button>
              <Button variant="primary" className="text-white">
                Save Changes
              </Button>
            </div>
          </div>
        );
        
      case 'content-privacy':
        return (
          <div className="space-y-6">
            <div className="settings-form-section">
              <h3 className="settings-form-title">Default Visibility</h3>
              <p className="settings-form-description">Configure the default privacy settings for new documents</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Default Document Visibility</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="visibility"
                        className="form-radio text-[#ae5630]"
                        defaultChecked
                      />
                      <span className="ml-2">Private (only you can access)</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="visibility"
                        className="form-radio text-[#ae5630]"
                      />
                      <span className="ml-2">Team (only your team members can access)</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="visibility"
                        className="form-radio text-[#ae5630]"
                      />
                      <span className="ml-2">Public (anyone with the link can view)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Data Retention</h3>
              <p className="settings-form-description">Configure how long your content is stored</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Content Retention Policy</label>
                  <select className="settings-select">
                    <option>Standard (retain indefinitely)</option>
                    <option>Extended Archive (backup for 7 years)</option>
                    <option>Regulatory Compliance (varies by content type)</option>
                    <option>Custom Retention</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Automatic Content Archiving</label>
                  <select className="settings-select">
                    <option>Never archive automatically</option>
                    <option>Archive after 1 year of inactivity</option>
                    <option>Archive after 2 years of inactivity</option>
                    <option>Archive after 3 years of inactivity</option>
                    <option>Custom timeframe</option>
                  </select>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Notify before automatic archiving</span>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Encryption Options</h3>
              <p className="settings-form-description">Configure encryption for sensitive content</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable end-to-end encryption for sensitive documents</span>
                </div>
                
                <div>
                  <label className="settings-label">Encryption Level</label>
                  <select className="settings-select">
                    <option>Standard (AES-256)</option>
                    <option>High (AES-256 with additional protections)</option>
                    <option>Maximum (Multi-layered encryption)</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Password Recovery Options</label>
                  <select className="settings-select">
                    <option>Standard recovery (email verification)</option>
                    <option>Enhanced recovery (multi-factor authentication)</option>
                    <option>No recovery (highest security, risk of permanent loss)</option>
                  </select>
                </div>
                
                <div className="text-xs text-[#3d3d3a] bg-[#f9f7f1] p-3 rounded-md border border-[#bcb7af]">
                  <p>⚠️ Note: End-to-end encrypted documents cannot be accessed by MagicMuse support and cannot be recovered if the password is lost under certain recovery settings.</p>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Third-Party Access</h3>
              <p className="settings-form-description">Control which third parties can access your content</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Connected Services Access</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Google Drive</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Dropbox</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Microsoft OneDrive</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">WordPress</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Medium</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="settings-label">API Integration Access</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Read Access</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Write Access</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Delete Access</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Data Export</h3>
              <p className="settings-form-description">Configure options for exporting your content</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Export Formats</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">TXT</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">DOCX</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">PDF</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Markdown</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">HTML</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">RTF</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="settings-label">Bulk Export</label>
                  <Button variant="outline" size="sm">Export All Content</Button>
                  <p className="text-xs text-[#3d3d3a] mt-1">Download a complete archive of all your content</p>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Include version history in exports</span>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Account Deletion</h3>
              <p className="settings-form-description">Manage account deletion and data removal options</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Data Handling on Deletion</label>
                  <select className="settings-select">
                    <option>Keep all content (transfer ownership)</option>
                    <option>Archive content (read-only access for collaborators)</option>
                    <option>Delete everything (no recovery possible)</option>
                  </select>
                </div>
                
                <div className="text-xs text-[#3d3d3a] bg-[#f9f7f1] p-3 rounded-md border border-[#bcb7af]">
                  <p>⚠️ Warning: Account deletion is permanent and cannot be undone. Depending on your selection, your content may be permanently removed from our systems.</p>
                </div>
                
                <div>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                    Request Account Deletion
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Content Classification</h3>
              <p className="settings-form-description">Configure automatic content classification for privacy levels</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable automatic content classification</span>
                </div>
                
                <div>
                  <label className="settings-label">Classification Rules</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Detect personal information</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Detect financial information</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Detect confidential business information</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Detect medical information</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="settings-label">Action on Detection</label>
                  <select className="settings-select">
                    <option>Notify only (no automatic changes)</option>
                    <option>Automatically set to Private</option>
                    <option>Automatically encrypt document</option>
                    <option>Ask for confirmation</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Temporary Access</h3>
              <p className="settings-form-description">Configure temporary access grants with expiration dates</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable temporary access links</span>
                </div>
                
                <div>
                  <label className="settings-label">Default Expiration</label>
                  <select className="settings-select">
                    <option>24 hours</option>
                    <option>7 days</option>
                    <option>30 days</option>
                    <option>Custom</option>
                    <option>No default (specify each time)</option>
                  </select>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Notify when temporary access expires</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Require password for temporary access links</span>
                </div>
              </div>
            </div>
            
            <div className="settings-footer">
              <Button variant="outline" className="mr-2">
                Reset to Default
              </Button>
              <Button variant="primary" className="text-white">
                Save Changes
              </Button>
            </div>
          </div>
        );
        
      case 'collaboration':
        return (
          <div className="space-y-6">
            <div className="settings-form-section">
              <h3 className="settings-form-title">Default Sharing Settings</h3>
              <p className="settings-form-description">Configure default permissions when sharing content</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Default Permission Level</label>
                  <select className="settings-select">
                    <option>View only</option>
                    <option>Comment</option>
                    <option>Suggest edits</option>
                    <option>Edit</option>
                    <option>Full access (edit and share)</option>
                  </select>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Allow recipients to download shared content</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Allow recipients to copy shared content</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Allow recipients to share with others</span>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Comment Permissions</h3>
              <p className="settings-form-description">Configure how comments work in shared documents</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Default Comment Settings</label>
                  <select className="settings-select">
                    <option>Anyone with access can comment</option>
                    <option>Only specific permission levels can comment</option>
                    <option>Only team members can comment</option>
                    <option>Comments disabled by default</option>
                  </select>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Allow comment reactions</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Allow comment threading/replies</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Email notifications for comments</span>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Edit/View/Suggest Permissions</h3>
              <p className="settings-form-description">Configure detailed permission levels for collaborators</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Team Members Default Access</label>
                  <select className="settings-select">
                    <option>View</option>
                    <option>Comment</option>
                    <option>Suggest</option>
                    <option>Edit</option>
                    <option>Full access</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">External Collaborators Default Access</label>
                  <select className="settings-select">
                    <option>View</option>
                    <option>Comment</option>
                    <option>Suggest</option>
                    <option>Edit</option>
                    <option>No default (specify each time)</option>
                  </select>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Track edit history with contributor names</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show collaborator presence indicators</span>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Team Access Controls</h3>
              <p className="settings-form-description">Configure access levels for team members</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Team Members</label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#ae5630] flex items-center justify-center text-white text-sm mr-2">
                          JD
                        </div>
                        <div>
                          <p className="text-sm font-medium">John Doe</p>
                          <p className="text-xs text-[#3d3d3a]">john.doe@example.com</p>
                        </div>
                      </div>
                      <select className="text-sm py-1 px-2 border rounded bg-white">
                        <option>Admin</option>
                        <option>Editor</option>
                        <option>Viewer</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#6d371f] flex items-center justify-center text-white text-sm mr-2">
                          JS
                        </div>
                        <div>
                          <p className="text-sm font-medium">Jane Smith</p>
                          <p className="text-xs text-[#3d3d3a]">jane.smith@example.com</p>
                        </div>
                      </div>
                      <select className="text-sm py-1 px-2 border rounded bg-white">
                        <option>Admin</option>
                        <option selected>Editor</option>
                        <option>Viewer</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Button variant="outline" size="sm">
                    Invite New Team Member
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">External Collaborator Limitations</h3>
              <p className="settings-form-description">Set access limitations for external collaborators</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Require authentication for external access</span>
                </div>
                
                <div>
                  <label className="settings-label">External Domain Restrictions</label>
                  <select className="settings-select">
                    <option>Allow all domains</option>
                    <option>Allow specific domains only</option>
                    <option>Block specific domains</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Approved Domains</label>
                  <textarea
                    className="settings-textarea"
                    placeholder="Enter domain names, one per line (e.g., company.com)"
                  ></textarea>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Apply watermarks for external viewers</span>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Approval Workflows</h3>
              <p className="settings-form-description">Configure approval processes for content</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable approval workflows</span>
                </div>
                
                <div>
                  <label className="settings-label">Default Approvers</label>
                  <select className="settings-select" multiple>
                    <option selected>John Doe (Admin)</option>
                    <option selected>Jane Smith (Editor)</option>
                    <option>Alex Johnson (Editor)</option>
                  </select>
                  <p className="text-xs text-[#3d3d3a] mt-1">
                    Hold Ctrl/Cmd to select multiple approvers
                  </p>
                </div>
                
                <div>
                  <label className="settings-label">Approval Requirements</label>
                  <select className="settings-select">
                    <option>Any one approver</option>
                    <option>Majority of approvers</option>
                    <option>All approvers</option>
                    <option>Specific sequence of approvers</option>
                  </select>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Allow approval overrides by admins</span>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Content Protection</h3>
              <p className="settings-form-description">Configure watermarking and copy protection options</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Apply watermark to shared documents</span>
                </div>
                
                <div>
                  <label className="settings-label">Watermark Type</label>
                  <select className="settings-select">
                    <option>User email</option>
                    <option>Custom text</option>
                    <option>Date/time</option>
                    <option>Company logo</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Custom Watermark Text</label>
                  <input
                    type="text"
                    className="settings-input"
                    placeholder="Enter custom watermark text"
                    value="Confidential"
                  />
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Disable copy/paste for shared documents</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Disable printing for shared documents</span>
                </div>
              </div>
            </div>
            
            <div className="settings-footer">
              <Button variant="outline" className="mr-2">
                Reset to Default
              </Button>
              <Button variant="primary" className="text-white">
                Save Changes
              </Button>
            </div>
          </div>
        );
        
      case 'security':
        return (
          <React.Suspense fallback={fallback}>
            <SecuritySettings />
          </React.Suspense>
        );
        
      case 'subscription':
        return (
          <React.Suspense fallback={fallback}>
            <SubscriptionSettings />
          </React.Suspense>
        );
        
      case 'responsible-ai':
        return (
          <React.Suspense fallback={fallback}>
            <AIEthicsSettings />
          </React.Suspense>
        );
        
      case 'learning':
        return (
          <React.Suspense fallback={fallback}>
            <LearningSettings />
          </React.Suspense>
        );
        
      case 'mobile-specific':
        return (
          <React.Suspense fallback={fallback}>
            <MobileSettings />
          </React.Suspense>
        );
        
      case 'cross-device':
        return (
          <React.Suspense fallback={fallback}>
            <CrossDeviceSettings />
          </React.Suspense>
        );
        
      case 'version-history':
        return (
          <React.Suspense fallback={fallback}>
            <VersionHistorySettings />
          </React.Suspense>
        );
        
      case 'backup-recovery':
        return (
          <React.Suspense fallback={fallback}>
            <BackupRecoverySettings />
          </React.Suspense>
        );
        
      case 'template-settings':
        return (
          <React.Suspense fallback={fallback}>
            <TemplateSettings />
          </React.Suspense>
        );
        
      case 'resource-library':
        return (
          <React.Suspense fallback={fallback}>
            <ResourceLibrarySettings />
          </React.Suspense>
        );
        
      case 'voice-speech':
        return (
          <React.Suspense fallback={fallback}>
            <VoiceSpeechSettings />
          </React.Suspense>
        );
        
      case 'keyboard-input':
        return (
          <React.Suspense fallback={fallback}>
            <KeyboardInputSettings />
          </React.Suspense>
        );
        
      case 'data-usage':
        return (
          <div className="space-y-6">
            <div className="settings-form-section">
              <h3 className="settings-form-title">AI Training</h3>
              <p className="settings-form-description">Configure how your content is used for AI training</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Allow content to be used for AI training</span>
                </div>
                
                <div>
                  <label className="settings-label">Training Scope</label>
                  <select className="settings-select">
                    <option>All content</option>
                    <option>Non-sensitive content only</option>
                    <option>Public content only</option>
                    <option>None</option>
                  </select>
                </div>
                
                <div className="text-xs text-[#3d3d3a] bg-[#f9f7f1] p-3 rounded-md border border-[#bcb7af]">
                  <p>Note: When your content is used for AI training, it helps improve MagicMuse's suggestions and features. All data is anonymized and no personally identifiable information is retained in the training process.</p>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Analytics Participation</h3>
              <p className="settings-form-description">Configure your participation in analytics data collection</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable usage analytics</span>
                </div>
                
                <div>
                  <label className="settings-label">Analytics Level</label>
                  <select className="settings-select">
                    <option>Basic (feature usage only)</option>
                    <option>Standard (feature usage and performance)</option>
                    <option>Detailed (all interactions and errors)</option>
                    <option>None</option>
                  </select>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Include AI suggestion analytics</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Include performance metrics</span>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Feature Improvement</h3>
              <p className="settings-form-description">Configure how your feedback helps improve features</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Share feature improvement data</span>
                </div>
                
                <div>
                  <label className="settings-label">Feature Feedback Types</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">AI suggestion acceptance rate</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Interface usage patterns</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Command usage frequency</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Content structure analysis</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Usage Data Collection</h3>
              <p className="settings-form-description">Configure what usage data is collected</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Data Collection Categories</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Feature usage statistics</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Error reports</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Performance metrics</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Session recordings</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Interaction heatmaps</span>
                    </label>
                  </div>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Send automatic crash reports</span>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Personalization Data</h3>
              <p className="settings-form-description">Configure how your data is used for personalization</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable personalized features</span>
                </div>
                
                <div>
                  <label className="settings-label">Personalization Level</label>
                  <select className="settings-select">
                    <option>High (all personalization features)</option>
                    <option>Medium (smart suggestions only)</option>
                    <option>Low (basic preferences only)</option>
                    <option>None</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Personalization Data Storage</label>
                  <select className="settings-select">
                    <option>Store on your device only</option>
                    <option>Store in your account</option>
                    <option>Store and use for product improvement</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Anonymous Contributions</h3>
              <p className="settings-form-description">Configure options for anonymous data contributions</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable anonymous data contributions</span>
                </div>
                
                <div>
                  <label className="settings-label">Contribution Categories</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Writing patterns</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Edit patterns</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">AI suggestion feedback</span>
                    </label>
                  </div>
                </div>
                
                <div className="text-xs text-[#3d3d3a] bg-[#f9f7f1] p-3 rounded-md border border-[#bcb7af]">
                  <p>Anonymous contributions help improve MagicMuse for all users while ensuring your privacy. No identifiable information is included in these contributions.</p>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Data Purging</h3>
              <p className="settings-form-description">Configure scheduled data purging and minimization</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable scheduled data purging</span>
                </div>
                
                <div>
                  <label className="settings-label">Purge Schedule</label>
                  <select className="settings-select">
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Bi-annually</option>
                    <option>Annually</option>
                    <option>Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Data Categories to Purge</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Usage analytics</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Search history</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Feature preferences</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">AI training data</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <Button variant="outline" size="sm">Purge Data Now</Button>
                  <p className="text-xs text-[#3d3d3a] mt-1">
                    Immediately purge selected data categories
                  </p>
                </div>
              </div>
            </div>
            
            <div className="settings-footer">
              <Button variant="outline" className="mr-2">
                Reset to Default
              </Button>
              <Button variant="primary" className="text-white">
                Save Changes
              </Button>
            </div>
          </div>
        );
        
      case 'email-notifications':
        return (
          <div className="space-y-6">
            <div className="settings-form-section">
              <h3 className="settings-form-title">Document Sharing Alerts</h3>
              <p className="settings-form-description">Configure email notifications for document sharing activities</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Notify when someone shares a document with you</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Notify when someone accesses your shared document</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Notify when shared access permissions change</span>
                </div>
                
                <div>
                  <label className="settings-label">Notification Frequency</label>
                  <select className="settings-select">
                    <option>Immediate (per event)</option>
                    <option>Daily digest</option>
                    <option>Weekly summary</option>
                    <option>Never</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Comment and Feedback Notifications</h3>
              <p className="settings-form-description">Configure email notifications for comments and feedback</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Notify when someone comments on your document</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Notify when someone replies to your comment</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Notify when someone mentions you (@username)</span>
                </div>
                
                <div>
                  <label className="settings-label">Notification Grouping</label>
                  <select className="settings-select">
                    <option>Group by document</option>
                    <option>Group by sender</option>
                    <option>No grouping (individual emails)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Account Security Alerts</h3>
              <p className="settings-form-description">Configure email notifications for account security events</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Notify about new device sign-ins</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Notify about password changes</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Notify about permission changes</span>
                </div>
                
                <div className="text-xs text-[#3d3d3a] bg-[#f9f7f1] p-3 rounded-md border border-[#bcb7af]">
                  <p>⚠️ Security alerts cannot be disabled for critical account activities like email address changes or suspicious login attempts.</p>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Marketing and Product Updates</h3>
              <p className="settings-form-description">Configure email notifications for MagicMuse updates</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Product announcements and new features</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Tips and best practices</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Educational webinars and events</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Special offers and promotions</span>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Team Activity Digests</h3>
              <p className="settings-form-description">Configure email notifications for team activities</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Receive team activity digests</span>
                </div>
                
                <div>
                  <label className="settings-label">Digest Frequency</label>
                  <select className="settings-select">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Never</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Digest Content</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Document updates</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">New team documents</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Team member activities</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Admin changes</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Project Deadline Reminders</h3>
              <p className="settings-form-description">Configure email notifications for project deadlines</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Send deadline reminder emails</span>
                </div>
                
                <div>
                  <label className="settings-label">Reminder Schedule</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">1 week before deadline</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">3 days before deadline</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">1 day before deadline</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Day of deadline</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Custom Notification Schedules</h3>
              <p className="settings-form-description">Configure custom notification schedules and digest options</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable custom notification schedules</span>
                </div>
                
                <div>
                  <label className="settings-label">Notification Delivery Time</label>
                  <select className="settings-select">
                    <option>Morning (8:00 AM)</option>
                    <option>Midday (12:00 PM)</option>
                    <option>Afternoon (4:00 PM)</option>
                    <option>Evening (7:00 PM)</option>
                    <option>Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Notification-Free Hours</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#3d3d3a] mb-1 block">Start Time</label>
                      <select className="settings-select">
                        <option>6:00 PM</option>
                        <option>7:00 PM</option>
                        <option>8:00 PM</option>
                        <option>9:00 PM</option>
                        <option>10:00 PM</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[#3d3d3a] mb-1 block">End Time</label>
                      <select className="settings-select">
                        <option>6:00 AM</option>
                        <option>7:00 AM</option>
                        <option>8:00 AM</option>
                        <option>9:00 AM</option>
                        <option>10:00 AM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Priority Notifications</h3>
              <p className="settings-form-description">Configure high-priority notifications for time-sensitive alerts</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable priority notifications</span>
                </div>
                
                <div>
                  <label className="settings-label">Priority Categories</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Approaching deadlines</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Security alerts</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Client comments</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Team member requests</span>
                    </label>
                  </div>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Send priority notifications even during notification-free hours</span>
                </div>
              </div>
            </div>
            
            <div className="settings-footer">
              <Button variant="outline" className="mr-2">
                Reset to Default
              </Button>
              <Button variant="primary" className="text-white">
                Save Changes
              </Button>
            </div>
          </div>
        );
        
      case 'in-app-notifications':
        return (
          <div className="space-y-6">
            <div className="settings-form-section">
              <h3 className="settings-form-title">Real-Time Collaboration Alerts</h3>
              <p className="settings-form-description">Configure in-app notifications for real-time collaboration</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show notifications when collaborators join a document</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show notifications when changes are made to your document</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show notifications when someone comments on your document</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show notifications for @mentions</span>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">System Announcements</h3>
              <p className="settings-form-description">Configure in-app notifications for system announcements</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show system maintenance notifications</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show new feature announcements</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show tips and best practices</span>
                </div>
                
                <div>
                  <label className="settings-label">System Announcement Display Duration</label>
                  <select className="settings-select">
                    <option>Brief (5 seconds)</option>
                    <option>Standard (10 seconds)</option>
                    <option>Extended (15 seconds)</option>
                    <option>Until dismissed</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Feature Updates</h3>
              <p className="settings-form-description">Configure in-app notifications for feature updates</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show notifications for major updates</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show notifications for minor updates</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show feature tour for new features</span>
                </div>
                
                <div>
                  <label className="settings-label">Update Notification Format</label>
                  <select className="settings-select">
                    <option>Compact (text only)</option>
                    <option>Standard (text with icons)</option>
                    <option>Detailed (text, icons, and images)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">AI Suggestion Alerts</h3>
              <p className="settings-form-description">Configure in-app notifications for AI-generated suggestions</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show notifications for AI writing suggestions</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show notifications for AI content optimization suggestions</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show notifications for AI research suggestions</span>
                </div>
                
                <div>
                  <label className="settings-label">AI Notification Frequency</label>
                  <select className="settings-select">
                    <option>High (show all suggestions)</option>
                    <option>Medium (show important suggestions)</option>
                    <option>Low (show critical suggestions only)</option>
                    <option>None (disable AI suggestion notifications)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Document Status Changes</h3>
              <p className="settings-form-description">Configure in-app notifications for document status changes</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show notifications for document completion</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show notifications for document approval</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show notifications for document rejection</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show notifications for version conflicts</span>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Do Not Disturb</h3>
              <p className="settings-form-description">Configure Do Not Disturb mode for in-app notifications</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable Do Not Disturb mode</span>
                </div>
                
                <div>
                  <label className="settings-label">Do Not Disturb Schedule</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#3d3d3a] mb-1 block">Start Time</label>
                      <select className="settings-select">
                        <option>6:00 PM</option>
                        <option>7:00 PM</option>
                        <option>8:00 PM</option>
                        <option>9:00 PM</option>
                        <option>10:00 PM</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[#3d3d3a] mb-1 block">End Time</label>
                      <select className="settings-select">
                        <option>6:00 AM</option>
                        <option>7:00 AM</option>
                        <option>8:00 AM</option>
                        <option>9:00 AM</option>
                        <option>10:00 AM</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="settings-label">Priority Exceptions</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Security alerts</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Deadline reminders</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Document completion</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">@mentions</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Notification Grouping</h3>
              <p className="settings-form-description">Configure how in-app notifications are grouped</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="settings-label">Grouping Method</label>
                  <select className="settings-select">
                    <option>Group by document</option>
                    <option>Group by project</option>
                    <option>Group by notification type</option>
                    <option>Group by sender</option>
                    <option>No grouping</option>
                  </select>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Collapse similar notifications</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show notification count badges</span>
                </div>
                
                <div>
                  <label className="settings-label">Maximum Visible Notifications</label>
                  <select className="settings-select">
                    <option>5 most recent</option>
                    <option>10 most recent</option>
                    <option>20 most recent</option>
                    <option>Show all</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="settings-footer">
              <Button variant="outline" className="mr-2">
                Reset to Default
              </Button>
              <Button variant="primary" className="text-white">
                Save Changes
              </Button>
            </div>
          </div>
        );
        
      case 'reminders':
        return (
          <div className="space-y-6">
            <div className="settings-form-section">
              <h3 className="settings-form-title">Project Deadline Reminders</h3>
              <p className="settings-form-description">Configure reminders for project deadlines</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable project deadline reminders</span>
                </div>
                
                <div>
                  <label className="settings-label">Reminder Schedule</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">1 week before deadline</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">3 days before deadline</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">1 day before deadline</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Day of deadline</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Past deadline (daily until completed)</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="settings-label">Notification Channels</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">In-app notifications</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Email</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Calendar integration</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Custom Milestone Alerts</h3>
              <p className="settings-form-description">Configure reminders for custom project milestones</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable custom milestone alerts</span>
                </div>
                
                <div>
                  <label className="settings-label">Milestone Types</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Draft completion</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Review phase</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Approval needed</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Publication scheduled</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="settings-label">Milestone Reminders</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">When milestone is approaching</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">When milestone is reached</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">When milestone is delayed</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Regular Usage Reminders</h3>
              <p className="settings-form-description">Configure reminders to encourage regular use of MagicMuse</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable regular usage reminders</span>
                </div>
                
                <div>
                  <label className="settings-label">Reminder Frequency</label>
                  <select className="settings-select">
                    <option>Daily</option>
                    <option>Every 3 days</option>
                    <option>Weekly</option>
                    <option>Bi-weekly</option>
                    <option>Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Preferred Time</label>
                  <select className="settings-select">
                    <option>Morning (9:00 AM)</option>
                    <option>Midday (12:00 PM)</option>
                    <option>Afternoon (3:00 PM)</option>
                    <option>Evening (7:00 PM)</option>
                    <option>Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Reminder Content</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Progress updates on active projects</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Writing prompts and inspiration</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Feature highlights and tips</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Team Activity Notifications</h3>
              <p className="settings-form-description">Configure reminders for team activity updates</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable team activity notifications</span>
                </div>
                
                <div>
                  <label className="settings-label">Notification Schedule</label>
                  <select className="settings-select">
                    <option>Real-time</option>
                    <option>Daily digest</option>
                    <option>Weekly summary</option>
                    <option>Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Activity Types</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Document edits</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Comments and feedback</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">New document creation</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Template usage</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Administrative changes</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Content Calendar Integration</h3>
              <p className="settings-form-description">Configure reminders from integrated content calendars</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable content calendar integration</span>
                </div>
                
                <div>
                  <label className="settings-label">Connected Calendars</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Google Calendar</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Microsoft Outlook</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Apple Calendar</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Custom Editorial Calendar</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="settings-label">Calendar Event Types</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Content deadlines</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Publishing schedules</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Editorial meetings</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Content strategy events</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Smart Reminders</h3>
              <p className="settings-form-description">Configure AI-driven smart reminders based on your work patterns</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable smart reminders</span>
                </div>
                
                <div>
                  <label className="settings-label">Smart Reminder Types</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Productivity time suggestions</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Project progress reminders</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Content improvement suggestions</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Abandoned draft follow-ups</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="settings-label">Learning Period</label>
                  <select className="settings-select">
                    <option>1 week</option>
                    <option>2 weeks</option>
                    <option>1 month</option>
                    <option>Continuous learning</option>
                  </select>
                  <p className="text-xs text-[#3d3d3a] mt-1">
                    How long the AI should observe your work patterns before making suggestions
                  </p>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Contextual Reminders</h3>
              <p className="settings-form-description">Configure content-based reminders triggered by document context</p>
              
              <div className="space-y-4 mt-4">
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enable contextual reminders</span>
                </div>
                
                <div>
                  <label className="settings-label">Content Triggers</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Research needs</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Fact verification</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Citation requirements</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Style consistency</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="settings-label">Sensitivity Level</label>
                  <select className="settings-select">
                    <option>Low (minimal interruptions)</option>
                    <option>Medium (balanced approach)</option>
                    <option>High (comprehensive assistance)</option>
                    <option>Custom</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="settings-footer">
              <Button variant="outline" className="mr-2">
                Reset to Default
              </Button>
              <Button variant="primary" className="text-white">
                Save Changes
              </Button>
            </div>
          </div>
        );
        
      case 'connected-services':
        return (
          <div className="space-y-6">
            <div className="settings-form-section">
              <h3 className="settings-form-title">Cloud Storage Integration</h3>
              <p className="settings-form-description">Connect cloud storage services to MagicMuse</p>
              
              <div className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#4285F4] rounded-lg flex items-center justify-center text-white mr-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 13L17 10L14 7V13Z" fill="white"/>
                          <path d="M7 13L4 10L7 7V13Z" fill="white"/>
                          <path d="M4 10L9 15H15L20 10L15 5H9L4 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Google Drive</p>
                        <p className="text-xs text-[#3d3d3a]">Connected as user@example.com</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#0062ff] rounded-lg flex items-center justify-center text-white mr-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 15H5V9H19V15Z" fill="white"/>
                          <path d="M5 15L8 18H16L19 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                          <path d="M5 9L8 6H16L19 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Dropbox</p>
                        <p className="text-xs text-[#3d3d3a]">Connected as user@example.com</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#28a8ea] rounded-lg flex items-center justify-center text-white mr-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 6L3 11L12 16L21 11L12 6Z" fill="white"/>
                          <path d="M3 17L12 22L21 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">OneDrive</p>
                        <p className="text-xs text-[#3d3d3a]">Not connected</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="primary" size="sm" className="text-white">Connect</Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <PlusCircle size={16} />
                    <span>Add New Service</span>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">CMS Connections</h3>
              <p className="settings-form-description">Connect content management systems</p>
              
              <div className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#21759b] rounded-lg flex items-center justify-center text-white mr-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM3.5 12C3.5 8.4 5.5 5.2 8.5 3.8L8.7 4C8.9 4.2 9 4.5 9 5C9 5.5 9.5 6 10 6C10.5 6 11 6.5 11 7C11 7.5 10.5 8 10 8C9.5 8 9 8.5 9 9C9 9.5 9.5 10 10 10H11C12.5 10 13.5 11 13.5 12.5C13.5 13.5 13 14.4 12.1 14.8L12 14.9C12 15.9 11.5 16.8 10.7 17.3C14.8 17.2 18 14.9 18 12C18 9.8 16 8 13.5 8H13C12.8 8 12.6 7.9 12.5 7.8C12.2 7.5 12.3 7 12.6 6.8C13.3 6.3 13.7 5.5 13.7 4.7C13.7 4.3 13.6 3.9 13.4 3.6C16.5 5 18.5 8.3 18.5 12C18.5 17.2 15.6 21.7 10.5 22C10.8 21.6 11 21 11 20.5C11 19.1 9.9 18 8.5 18C8.3 18 8 18 7.8 18.1C7.3 18.3 6.7 18.1 6.4 17.7C5.9 16.9 5.9 15.9 6.4 15C6.6 14.7 6.9 14.5 7.2 14.3C7.6 14.1 7.9 13.7 7.9 13.2C7.9 12.3 8.7 11.5 9.6 11.5C11 11.5 12 10.5 12 9.1C12 8.3 11.5 7.6 10.8 7.3C10.5 7.2 10.1 7.2 9.9 7.4C9.7 7.6 9.4 7.7 9.1 7.7C8.8 7.7 8.5 7.6 8.3 7.4C8 7.1 8 6.6 8.3 6.3C8.5 6.1 8.7 6 9 6C9.3 6 9.5 5.8 9.5 5.5C9.5 5.2 9.3 5 9 5C8.5 5 8 4.5 8 4C8 3.7 8.2 3.4 8.4 3.2C5.3 4.6 3.5 8 3.5 12ZM10.5 20.5C10.5 20.8 10.3 21 10 21C6.4 20.5 3.5 16.7 3.5 12.1C3.5 11.1 3.7 10.1 4 9.2C4.8 9.8 5.8 10 6.7 9.8C7.2 9.7 7.7 9.8 8.1 10.1C8.5 10.4 8.7 10.9 8.7 11.4C8.7 11.7 8.5 11.9 8.2 11.9C8.1 11.9 7.9 11.9 7.7 11.9C7.3 11.9 7.1 12.1 7.1 12.5C7.1 12.9 7.3 13.1 7.7 13.1C8.1 13.1 8.5 13.3 8.7 13.7C8.9 14.1 8.9 14.5 8.7 14.9C8.4 15.3 8.2 15.8 8 16.3C8 16.7 8.2 17.1 8.5 17.3C8.8 17.5 9.3 17.5 9.7 17.3C9.9 17.2 10.1 17.1 10.2 17C10.4 17 10.5 17.2 10.5 17.4V20.5Z" fill="white"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">WordPress</p>
                        <p className="text-xs text-[#3d3d3a]">Not connected</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="primary" size="sm" className="text-white">Connect</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#000000] rounded-lg flex items-center justify-center text-white mr-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 6V18H12V20H3C2.4 20 2 19.6 2 19V5C2 4.4 2.4 4 3 4H12V6H4Z" fill="white"/>
                          <path d="M21 16V8C21 6.9 20.1 6 19 6H14V8H19V16H14V18H19C20.1 18 21 17.1 21 16Z" fill="white"/>
                          <path d="M15 12L10 8V10.5H3V13.5H10V16L15 12Z" fill="white"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Medium</p>
                        <p className="text-xs text-[#3d3d3a]">Connected as user@example.com</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#ff5722] rounded-lg flex items-center justify-center text-white mr-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.8 12L18.4 9.6V4H14.4V5.6L12 3.2L3.2 12H6.4V20H11.2V16H12.8V20H17.6V12H20.8Z" fill="white"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Custom Blog</p>
                        <p className="text-xs text-[#3d3d3a]">Not connected</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="primary" size="sm" className="text-white">Connect</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Social Media Platforms</h3>
              <p className="settings-form-description">Connect social media platforms for sharing</p>
              
              <div className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#1DA1F2] rounded-lg flex items-center justify-center text-white mr-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 5.8C21.2 6.1 20.4 6.3 19.5 6.4C20.4 5.9 21.1 5 21.4 4C20.6 4.5 19.7 4.8 18.8 5C18 4.1 16.9 3.5 15.7 3.5C13.5 3.5 11.6 5.3 11.6 7.6C11.6 7.9 11.6 8.2 11.7 8.5C8.3 8.3 5.2 6.7 3.2 4.2C2.9 4.8 2.7 5.4 2.7 6.1C2.7 7.4 3.3 8.5 4.3 9.2C3.6 9.2 2.9 9 2.4 8.7V8.8C2.4 10.7 3.9 12.4 5.8 12.7C5.5 12.8 5.1 12.8 4.8 12.8C4.5 12.8 4.3 12.8 4 12.7C4.5 14.3 6 15.5 7.7 15.5C6.3 16.6 4.6 17.2 2.8 17.2C2.5 17.2 2.3 17.2 2 17.1C3.7 18.3 5.8 19 7.9 19C15.7 19 20 12.8 20 7.5C20 7.3 20 7.2 20 7C20.8 6.4 21.5 5.7 22 5.8Z" fill="white"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Twitter</p>
                        <p className="text-xs text-[#3d3d3a]">Not connected</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="primary" size="sm" className="text-white">Connect</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#0077B5] rounded-lg flex items-center justify-center text-white mr-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H6.5V10H9V17ZM7.7 8.7C6.8 8.7 6 7.9 6 7C6 6.1 6.8 5.3 7.7 5.3C8.6 5.3 9.4 6.1 9.4 7C9.4 7.9 8.6 8.7 7.7 8.7ZM18 17H15.5V13.5C15.5 12.7 14.8 12 14 12C13.2 12 12.5 12.7 12.5 13.5V17H10V10H12.5V11.3C12.9 10.5 13.8 10 14.9 10C16.6 10 18 11.4 18 13.1V17Z" fill="white"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">LinkedIn</p>
                        <p className="text-xs text-[#3d3d3a]">Connected as user@example.com</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#3b5998] rounded-lg flex items-center justify-center text-white mr-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 3H4C3.4 3 3 3.4 3 4V20C3 20.6 3.4 21 4 21H12V14H10V11H12V9C12 7.3 13.3 6 15 6H18V9H15C14.4 9 14 9.4 14 10V11H18L17.5 14H14V21H20C20.6 21 21 20.6 21 20V4C21 3.4 20.6 3 20 3Z" fill="white"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Facebook</p>
                        <p className="text-xs text-[#3d3d3a]">Not connected</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="primary" size="sm" className="text-white">Connect</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Project Management Tools</h3>
              <p className="settings-form-description">Connect project management tools for seamless workflow integration</p>
              
              <div className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#026aa7] rounded-lg flex items-center justify-center text-white mr-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="5" width="6" height="14" rx="1" fill="white"/>
                          <rect x="11" y="5" width="10" height="6" rx="1" fill="white"/>
                          <rect x="11" y="13" width="10" height="6" rx="1" fill="white"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Trello</p>
                        <p className="text-xs text-[#3d3d3a]">Connected as user@example.com</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#2D8CFF] rounded-lg flex items-center justify-center text-white mr-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="white"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Asana</p>
                        <p className="text-xs text-[#3d3d3a]">Not connected</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="primary" size="sm" className="text-white">Connect</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#6264A7] rounded-lg flex items-center justify-center text-white mr-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM8 17.5H6V9H8V17.5ZM13 17.5H11V6.5H13V17.5ZM18 17.5H16V13H18V17.5Z" fill="white"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Microsoft Teams</p>
                        <p className="text-xs text-[#3d3d3a]">Not connected</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="primary" size="sm" className="text-white">Connect</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">E-commerce Platforms</h3>
              <p className="settings-form-description">Connect e-commerce platforms for monetized content</p>
              
              <div className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#96bf48] rounded-lg flex items-center justify-center text-white mr-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.9 4.8C14.9 4.8 14.1 5 13.3 5.2C13.1 4.1 12.7 3.1 11.9 2.5C11.3 1.9 10.5 1.6 9.6 1.6C7.7 1.6 6 3.1 5.7 5.2C5.5 5.9 5.6 6.6 5.7 7.3C4 7.7 2.9 8.3 2.7 8.3C2.4 8.5 2.4 8.5 2.4 8.8L2 19.4C2 19.6 2 19.7 2.2 19.9C2.4 20 5.2 21.5 9.6 21.5C14 21.5 16.8 20 17 19.9C17.2 19.8 17.2 19.6 17.2 19.4L16.8 8.8C16.8 8.5 16.8 8.5 16.5 8.3L14.9 4.8Z" fill="white"/>
                          <path d="M9.5 9.1L8.8 11.4C8.8 11.4 8.1 11.1 7.3 11.2C5.9 11.3 5.9 12.2 5.9 12.4C6 13.8 9.2 14 9.6 16.5C9.9 18.5 8.5 19.9 6.6 20C4.2 20.1 3 18.4 3 18.4L3.5 16.8C3.5 16.8 4.7 17.9 5.7 17.8C6.3 17.8 6.6 17.2 6.5 16.8C6.4 15 3.6 15.3 3.2 12.9C2.8 10.9 4 9 6.7 8.7C8.2 8.7 9 9.1 9 9.1" stroke="white" strokeWidth="0.4"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Shopify</p>
                        <p className="text-xs text-[#3d3d3a]">Not connected</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="primary" size="sm" className="text-white">Connect</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#21759b] rounded-lg flex items-center justify-center text-white mr-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 5H3C2.4 5 2 5.4 2 6V18C2 18.6 2.4 19 3 19H21C21.6 19 22 18.6 22 18V6C22 5.4 21.6 5 21 5ZM10 13H7C6.4 13 6 12.6 6 12C6 11.4 6.4 11 7 11H10C10.6 11 11 11.4 11 12C11 12.6 10.6 13 10 13ZM18 17H7C6.4 17 6 16.6 6 16C6 15.4 6.4 15 7 15H18C18.6 15 19 15.4 19 16C19 16.6 18.6 17 18 17ZM18 13H14C13.4 13 13 12.6 13 12C13 11.4 13.4 11 14 11H18C18.6 11 19 11.4 19 12C19 12.6 18.6 13 18 13ZM18 9H7C6.4 9 6 8.6 6 8C6 7.4 6.4 7 7 7H18C18.6 7 19 7.4 19 8C19 8.6 18.6 9 18 9Z" fill="white"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">WooCommerce</p>
                        <p className="text-xs text-[#3d3d3a]">Not connected</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="primary" size="sm" className="text-white">Connect</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-section">
              <h3 className="settings-form-title">Analytics Services</h3>
              <p className="settings-form-description">Connect analytics services for performance tracking</p>
              
              <div className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#F9AB00] rounded-lg flex items-center justify-center text-white mr-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 20L16 11H8L12 20Z" fill="white"/>
                          <path d="M12 4L8 13H16L12 4Z" fill="white"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Google Analytics</p>
                        <p className="text-xs text-[#3d3d3a]">Connected as user@example.com</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-[#f9f7f1] rounded-md">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#4353FF] rounded-lg flex items-center justify-center text-white mr-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 12C20 16.4 16.4 20 12 20C7.6 20 4 16.4 4 12C4 7.6 7.6 4 12 4V12H20Z" fill="white"/>
                          <path d="M20 4H12V12H20V4Z" fill="white"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Segment</p>
                        <p className="text-xs text-[#3d3d3a]">Not connected</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="primary" size="sm" className="text-white">Connect</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-footer">
              <Button variant="outline" className="mr-2">
                Refresh Connections
              </Button>
              <Button variant="primary" className="text-white">
                Save Changes
              </Button>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="space-y-4">
            <p>Settings for: {subcategoryId}</p>
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
    }
};

// FileTemplate component is imported at the top of the file,
// so we don't need to define it again here

export default Settings;
