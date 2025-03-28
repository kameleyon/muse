import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Link2, Mail, Users, Copy } from 'lucide-react'; // Icons

const SharingPermissions: React.FC = () => {
  // Placeholder state and handlers
  const shareLink = "https://magicmuse.io/share/proj_123/abc"; // Example link
  const handleCopyLink = () => navigator.clipboard.writeText(shareLink).then(() => console.log('Link copied!'));
  const handleShareEmail = () => console.log('Share via Email clicked');
  const handleManageTeam = () => console.log('Manage Team Access clicked');

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm">
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2">Sharing & Permissions</h4>
      <div className="space-y-4">
        {/* Share Link */}
        <div>
          <label className="settings-label flex items-center gap-1 mb-1"><Link2 size={14}/> Shareable Link</label>
          <div className="flex gap-2">
            <Input type="text" readOnly value={shareLink} className="settings-input text-sm flex-grow" />
            <Button variant="outline" size="sm" onClick={handleCopyLink} title="Copy Link">
              <Copy size={16} />
            </Button>
          </div>
           {/* Add link settings (password, expiry) later */}
        </div>

        {/* Direct Share */}
         <div>
          <label className="settings-label flex items-center gap-1 mb-1"><Mail size={14}/> Direct Share</label>
           <div className="flex gap-2">
             <Input type="email" placeholder="Enter email addresses, separated by commas" className="settings-input text-sm flex-grow" />
             <Button variant="secondary" size="sm" onClick={handleShareEmail}>Send Invite</Button>
           </div>
            {/* Add permission level dropdown later */}
        </div>

         {/* Team Access */}
         <div>
          <label className="settings-label flex items-center gap-1 mb-1"><Users size={14}/> Team Access</label>
           <p className="text-xs text-neutral-medium mb-2">Manage who on your team can view or edit this project.</p>
           <Button variant="outline" size="sm" onClick={handleManageTeam}>Manage Team Permissions</Button>
        </div>
         {/* Add Client Presentation Mode later */}
      </div>
    </Card>
  );
};

export default SharingPermissions;