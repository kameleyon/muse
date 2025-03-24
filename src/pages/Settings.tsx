import React, { useState, useEffect } from 'react';
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
  ChevronUp, ChevronDown
} from 'lucide-react';

const Settings: React.FC = () => {
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
        
        {/* Settings Title */}
        <Card className="mb-6 overflow-hidden shadow-sm sm:shadow-md hover:shadow-lg transition-shadow">
          <div className="p-4 border-b border-neutral-light/40 bg-white/5">
            <h1 className="text-2xl font-comfortaa text-[#ae5630] flex items-center">
              <SettingsIcon size={24} className="mr-2" />
              Settings
            </h1>
            <p className="text-[#3d3d3a] mt-1">Configure your MagicMuse experience</p>
          </div>
        </Card>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Settings Navigation */}
          <div className="col-span-12 lg:col-span-3">
            <Card className="settings-menu shadow-sm sm:shadow-md hover:shadow-lg transition-shadow mb-6">
              <div className="p-4 border-b border-neutral-light/40 bg-white/5 flex items-center justify-between">
                <h2 className="text-xl font-comfortaa text-[#1a1918]">Settings Menu</h2>
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
              <div className={`p-4 ${mobileMenuExpanded ? 'block' : 'hidden lg:block'}`}>
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
                          }}
                        >
                          <span className="text-current">{category.icon}</span>
                          <span className="text-sm sm:text-base">{category.label}</span>
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
                                  onClick={() => setActiveSubcategory(subcategory.id)}
                                >
                                  <span className="text-current">{subcategory.icon}</span>
                                  <span>{subcategory.label}</span>
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
          <div className="col-span-12 lg:col-span-9">
            <Card className="shadow-sm sm:shadow-md hover:shadow-lg transition-shadow">
              <div className="p-4 border-b border-neutral-light/40 bg-white/5">
                <h2 className="text-xl font-comfortaa text-[#1a1918]">
                  {settingsCategories.find(cat => cat.id === activeCategory)?.subcategories.find(sub => sub.id === activeSubcategory)?.label}
                </h2>
              </div>
              <div className="p-6">
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
const SettingsContent: React.FC<{ subcategoryId: string }> = ({ subcategoryId }) => {
  // For brevity, I'll implement just a few example settings sections
  // In a real implementation, you would have a more complete set of components for each subcategory
  
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

// Define a FileTemplate component since it's not in Lucide
const FileTemplate = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M8 13h8" />
    <path d="M8 17h8" />
    <path d="M8 9h2" />
  </svg>
);

export default Settings;
