import React from 'react';
import { Card } from '@/components/ui/Card';

const SharingPermissions: React.FC = () => {
  return (
    <Card className="p-4 border border-dashed border-neutral-medium bg-neutral-light/20">
      <h4 className="font-semibold text-neutral-dark mb-2">Sharing & Permission Management</h4>
      <p className="text-sm text-neutral-medium">
        Placeholder for Direct Sharing (Email, Link), Team Sharing (Roles), Client Presentation Mode, and Integration Options (CRM, Calendar).
      </p>
      {/* Add basic sharing option placeholders later */}
    </Card>
  );
};

export default SharingPermissions;