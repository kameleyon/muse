import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  PlusCircle, 
  FolderOpen, 
  Settings, 
  HelpCircle, 
  FileText, 
  Zap,
  MessageSquare,
  Download,
  Users,
  BookOpen
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  primary?: boolean;
}

const EnhancedQuickActions: React.FC = () => {
  const actions: QuickAction[] = [
    {
      id: 'new-content',
      label: 'New Content',
      icon: <PlusCircle size={20} />,
      path: '/generator',
      primary: true
    },
    {
      id: 'view-library',
      label: 'View Library',
      icon: <FolderOpen size={20} />,
      path: '/projects'
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: <FileText size={20} />,
      path: '/templates'
    },
    {
      id: 'chat',
      label: 'AI Chat',
      icon: <MessageSquare size={20} />,
      path: '/chat',
      primary: true
    },
    {
      id: 'export',
      label: 'Export',
      icon: <Download size={20} />,
      path: '/export'
    },
    {
      id: 'team',
      label: 'Team',
      icon: <Users size={20} />,
      path: '/team'
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: <HelpCircle size={20} />,
      path: '/help'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={20} />,
      path: '/settings'
    }
  ];

  // Separate primary and secondary actions
  const primaryActions = actions.filter(action => action.primary);
  const secondaryActions = actions.filter(action => !action.primary);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow bg-white border border-neutral-light/30 rounded-xl overflow-hidden">
      <CardHeader className="border-b border-neutral-light/40 pb-4">
        <div className="bg-gradient-to-r from-primary/10 to-transparent rounded-xl p-6">
          <CardTitle className="text-xl font-bold font-heading text-secondary flex items-center">
            <Zap className="h-5 w-5 mr-2 text-primary" />
            Quick Actions
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {primaryActions.map((action) => (
            <Link
              key={action.id}
              to={action.path}
              className="no-underline"
            >
              <Button
                variant="primary"
                size="lg"
                fullWidth={true}
                className="flex items-center justify-center h-16 bg-primary hover:bg-primary-hover transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <span className="mr-2 bg-white/20 p-1.5 rounded-full">{action.icon}</span>
                <span className="font-medium text-white">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
          {secondaryActions.map((action) => (
            <Link
              key={action.id}
              to={action.path}
              className="no-underline"
            >
              <Button
                variant="ghost"
                size="sm"
                fullWidth={true}
                className="flex items-center justify-start px-3 py-2 h-auto min-h-[2.5rem] bg-transparent border-none hover:bg-transparent"
              >
                <span className="mr-2 text-primary">{action.icon}</span>
                <span className="text-neutral-medium">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>

        {/* Personalized Suggestion */}
        <div className="mt-4 p-3 bg-neutral-light/10 rounded-lg border border-neutral-light/30 shadow-sm">
          <div className="flex items-center">
            <BookOpen size={16} className="text-primary mr-2 flex-shrink-0" />
            <p className="text-sm text-neutral-dark">
              <span className="font-medium">Suggested:</span> Continue working on "Marketing Strategy"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedQuickActions;
