import React, { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

interface DashboardCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  children,
  className = '',
  onClick,
}) => {
  return (
    <Card
      className={`overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {title && (
        <div className="p-4 border-b border-neutral-light bg-neutral-light/10">
          <h3 className="text-md font-medium text-secondary">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </Card>
  );
};

export default DashboardCard;
