import React from 'react';
import { Link } from 'react-router-dom';

export type ActivityType = 'project_created' | 'template_used' | 'tokens_purchased' | 'team_joined' | 'project_completed';

interface ActivityItem {
  id: string;
  type: ActivityType;
  timestamp: string;
  title?: string;
  amount?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  // Helper to get appropriate icon for activity type
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'project_created':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        );
      case 'template_used':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
            />
          </svg>
        );
      case 'tokens_purchased':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'team_joined':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        );
      case 'project_completed':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  // Helper to get activity description based on type
  const getActivityDescription = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'project_created':
        return (
          <>Created a new project <span className="font-medium">{activity.title}</span></>
        );
      case 'template_used':
        return (
          <>Used the <span className="font-medium">{activity.title}</span> template</>
        );
      case 'tokens_purchased':
        return (
          <>Purchased <span className="font-medium">{activity.amount}</span></>
        );
      case 'team_joined':
        return (
          <>Joined team <span className="font-medium">{activity.title}</span></>
        );
      case 'project_completed':
        return (
          <>Completed project <span className="font-medium">{activity.title}</span></>
        );
      default:
        return 'Activity performed';
    }
  };

  return (
    <div className="bg-neutral-white rounded-lg p-6 border border-neutral-light/40 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold font-heading text-secondary">Recent Activity</h2>
        <Link to="/activity" className="text-primary text-sm hover:underline">
          View all
        </Link>
      </div>
      
      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-neutral-light/40 last:border-0">
              <div className="p-2 rounded-full bg-neutral-light/20 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div>
                <p className="text-sm text-secondary">
                  {getActivityDescription(activity)}
                </p>
                <p className="text-xs text-neutral-medium mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-neutral-medium">No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
