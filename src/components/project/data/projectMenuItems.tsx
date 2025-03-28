import React from 'react';
import {
  LayoutDashboard, // Project Overview
  GitCommit, // Version History
  GitBranch, // Branches/Alternatives
  ListChecks, // Workflow Steps
  Settings2, // Project Setup (generic step)
  ClipboardList, // Requirements Gathering
  DraftingCompass, // Design & Structure
  Bot, // Content Generation
  PenTool, // Editing & Enhancement
  CheckSquare, // Quality Assurance
  PackageCheck, // Finalization & Delivery
  Users, // Collaboration / Team Members
  MessageSquare, // Comments
  History, // Activity Log
  Gauge, // Quality Metrics
  FileText, // Templates / My Templates
  Library, // Public Templates
  BookOpen, // Resources / Knowledge Base
  GraduationCap, // Tutorials
  BrainCircuit, // AI Assistant
  BarChart2, // Analytics
  Settings // Settings (general)
} from 'lucide-react';

export interface ProjectSubItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface ProjectMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  subItems?: ProjectSubItem[];
}

export const projectMenuItems: ProjectMenuItem[] = [
  {
    id: 'overview',
    label: 'Project Overview',
    icon: <LayoutDashboard size={18} />,
  },
  {
    id: 'version-history',
    label: 'Version History',
    icon: <GitCommit size={18} />,
    subItems: [
      { id: 'main-version', label: 'Main Version', icon: <GitCommit size={16} /> },
      { id: 'branches', label: 'Branches/Alternatives', icon: <GitBranch size={16} /> },
    ],
  },
  {
    id: 'workflow',
    label: 'Workflow Steps',
    icon: <ListChecks size={18} />,
    subItems: [
      { id: 'step-setup', label: '1. Project Setup', icon: <Settings2 size={16} /> },
      { id: 'step-requirements', label: '2. Requirements Gathering', icon: <ClipboardList size={16} /> },
      { id: 'step-design', label: '3. Design & Structure', icon: <DraftingCompass size={16} /> },
      { id: 'step-generation', label: '4. Content Generation', icon: <Bot size={16} /> },
      { id: 'step-editing', label: '5. Editing & Enhancement', icon: <PenTool size={16} /> },
      { id: 'step-qa', label: '6. Quality Assurance', icon: <CheckSquare size={16} /> },
      { id: 'step-finalization', label: '7. Finalization & Delivery', icon: <PackageCheck size={16} /> },
    ],
  },
  {
    id: 'collaboration',
    label: 'Collaboration',
    icon: <Users size={18} />,
    subItems: [
      { id: 'team-members', label: 'Team Members', icon: <Users size={16} /> },
      { id: 'comments', label: 'Comments', icon: <MessageSquare size={16} /> },
      { id: 'activity-log', label: 'Activity Log', icon: <History size={16} /> },
    ],
  },
  {
    id: 'quality',
    label: 'Quality Metrics',
    icon: <Gauge size={18} />,
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: <FileText size={18} />,
    subItems: [
      { id: 'my-templates', label: 'My Templates', icon: <FileText size={16} /> },
      { id: 'public-templates', label: 'Public Templates', icon: <Library size={16} /> },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: <BookOpen size={18} />,
    subItems: [
      { id: 'ai-assistant', label: 'AI Assistant', icon: <BrainCircuit size={16} /> },
      { id: 'knowledge-base', label: 'Knowledge Base', icon: <BookOpen size={16} /> },
      { id: 'tutorials', label: 'Tutorials', icon: <GraduationCap size={16} /> },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart2 size={18} />,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings size={18} />,
  },
];