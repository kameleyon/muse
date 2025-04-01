import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Link2, Mail, Users, Copy, Check, Loader2, Settings, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { useProjectWorkflowStore } from '@/store/projectWorkflowStore';
import { useDispatch } from 'react-redux';
import { addToast } from '@/store/slices/uiSlice';
import * as deliveryService from '@/services/deliveryService';

const SharingPermissions: React.FC = () => {
  const [shareLink, setShareLink] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const [showTeamMembers, setShowTeamMembers] = useState<boolean>(false);
  const [teamMembers, setTeamMembers] = useState<deliveryService.TeamMember[]>([]);
  const [showLinkOptions, setShowLinkOptions] = useState<boolean>(false);
  const [linkOptions, setLinkOptions] = useState({
    expiresIn: 0, // 0 means no expiration
    password: '',
    permissions: 'view' as 'view' | 'comment' | 'edit'
  });
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  
  // Get project ID from store
  const { projectId } = useProjectWorkflowStore();
  const dispatch = useDispatch();
  
  // Generate share link on mount if we have a project ID
  useEffect(() => {
    if (projectId && !shareLink) {
      generateShareLink();
    }
  }, [projectId]);
  
  // Load team members on mount if we have a project ID
  useEffect(() => {
    if (projectId) {
      loadTeamMembers();
    }
  }, [projectId]);
  
  const generateShareLink = async () => {
    if (!projectId) {
      dispatch(addToast({
        type: 'error',
        message: 'No project available for sharing'
      }));
      return;
    }
    
    setIsLoading(true);
    setActiveOperation('link');
    
    try {
      const result = await deliveryService.createShareableLink(projectId, linkOptions);
      setShareLink(result.url);
      
      dispatch(addToast({
        type: 'success',
        message: 'Shareable link created'
      }));
    } catch (error) {
      console.error('Failed to create shareable link:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Failed to create shareable link'
      }));
    } finally {
      setIsLoading(false);
      setActiveOperation(null);
    }
  };
  
  const handleCopyLink = () => {
    if (!shareLink) return;
    
    navigator.clipboard.writeText(shareLink).then(() => {
      setLinkCopied(true);
      
      dispatch(addToast({
        type: 'success',
        message: 'Link copied to clipboard'
      }));
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setLinkCopied(false), 2000);
    }).catch(error => {
      console.error('Failed to copy link:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Failed to copy link'
      }));
    });
  };
  
  const handleShareEmail = async () => {
    if (!projectId || !emailInput.trim()) {
      dispatch(addToast({
        type: 'error',
        message: 'Please enter at least one email address'
      }));
      return;
    }
    
    setIsLoading(true);
    setActiveOperation('email');
    
    try {
      // Parse email addresses
      const emails = emailInput.split(',').map(email => email.trim()).filter(email => email);
      
      if (emails.length === 0) {
        dispatch(addToast({
          type: 'error',
          message: 'Please enter at least one valid email address'
        }));
        return;
      }
      
      const result = await deliveryService.shareProjectWithEmails(projectId, emails, {
        permissions: linkOptions.permissions
      });
      
      if (result.success) {
        setEmailInput('');
        
        dispatch(addToast({
          type: 'success',
          message: result.message
        }));
      } else {
        dispatch(addToast({
          type: 'error',
          message: result.message
        }));
      }
    } catch (error) {
      console.error('Failed to share via email:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Failed to share via email'
      }));
    } finally {
      setIsLoading(false);
      setActiveOperation(null);
    }
  };
  
  const loadTeamMembers = async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    setActiveOperation('team');
    
    try {
      const members = await deliveryService.getTeamMembers(projectId);
      setTeamMembers(members);
    } catch (error) {
      console.error('Failed to load team members:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Failed to load team members'
      }));
    } finally {
      setIsLoading(false);
      setActiveOperation(null);
    }
  };
  
  const handleUpdatePermission = async (userId: string, permissions: 'view' | 'comment' | 'edit' | 'admin') => {
    if (!projectId) return;
    
    setIsLoading(true);
    setActiveOperation(`permission-${userId}`);
    
    try {
      const result = await deliveryService.updateTeamMemberPermissions(projectId, userId, permissions);
      
      if (result.success) {
        // Update local state
        setTeamMembers(prev => prev.map(member => 
          member.id === userId ? { ...member, permissions } : member
        ));
        
        dispatch(addToast({
          type: 'success',
          message: result.message
        }));
      } else {
        dispatch(addToast({
          type: 'error',
          message: result.message
        }));
      }
    } catch (error) {
      console.error('Failed to update permissions:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Failed to update permissions'
      }));
    } finally {
      setIsLoading(false);
      setActiveOperation(null);
    }
  };
  
  const handleManageTeam = () => {
    setShowTeamMembers(!showTeamMembers);
    
    if (!showTeamMembers && teamMembers.length === 0) {
      loadTeamMembers();
    }
  };
  
  const handleUpdateLinkOptions = () => {
    generateShareLink();
    setShowLinkOptions(false);
  };

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm relative">
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2">Sharing & Permissions</h4>
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-md">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            <p className="text-sm text-neutral-dark">
              {activeOperation === 'link' && 'Creating shareable link...'}
              {activeOperation === 'email' && 'Sending invitations...'}
              {activeOperation === 'team' && 'Loading team members...'}
              {activeOperation?.startsWith('permission-') && 'Updating permissions...'}
              {!activeOperation && 'Processing...'}
            </p>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {/* Share Link */}
        <div>
          <div className="flex justify-between items-center">
            <label className="settings-label flex items-center gap-1 mb-1"><Link2 size={14}/> Shareable Link</label>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              onClick={() => setShowLinkOptions(!showLinkOptions)}
              title="Link options"
            >
              {showLinkOptions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Input 
              type="text" 
              readOnly 
              value={shareLink || 'Generating link...'}
              className="settings-input text-sm flex-grow" 
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopyLink} 
              title="Copy Link"
              disabled={!shareLink || isLoading}
            >
              {linkCopied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            </Button>
          </div>
          
          {/* Link Options */}
          {showLinkOptions && (
            <div className="mt-2 p-2 border border-neutral-light rounded-md bg-white/50">
              <h6 className="text-xs font-medium mb-2 flex items-center gap-1">
                <Settings size={12} /> Link Options
              </h6>
              
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-neutral-medium block mb-1">Expiration</label>
                  <select 
                    className="settings-input text-xs w-full"
                    value={linkOptions.expiresIn}
                    onChange={(e) => setLinkOptions({...linkOptions, expiresIn: parseInt(e.target.value)})}
                  >
                    <option value="0">No expiration</option>
                    <option value="24">24 hours</option>
                    <option value="72">3 days</option>
                    <option value="168">7 days</option>
                    <option value="720">30 days</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-neutral-medium block mb-1">Password Protection</label>
                  <div className="flex gap-2">
                    <Input 
                      type="password" 
                      placeholder="Leave empty for no password" 
                      className="settings-input text-xs flex-grow"
                      value={linkOptions.password}
                      onChange={(e) => setLinkOptions({...linkOptions, password: e.target.value})}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      title="Password Protection"
                    >
                      <Shield size={14} />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-neutral-medium block mb-1">Permission Level</label>
                  <select 
                    className="settings-input text-xs w-full"
                    value={linkOptions.permissions}
                    onChange={(e) => setLinkOptions({...linkOptions, permissions: e.target.value as any})}
                  >
                    <option value="view">View only</option>
                    <option value="comment">Can comment</option>
                    <option value="edit">Can edit</option>
                  </select>
                </div>
                
                <div className="flex justify-end mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => setShowLinkOptions(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="text-xs text-white ml-2"
                    onClick={handleUpdateLinkOptions}
                  >
                    Update Link
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Direct Share */}
        <div>
          <label className="settings-label flex items-center gap-1 mb-1"><Mail size={14}/> Direct Share</label>
          <div className="flex gap-2">
            <Input 
              type="email" 
              placeholder="Enter email addresses, separated by commas" 
              className="settings-input text-sm flex-grow"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              disabled={isLoading}
            />
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleShareEmail}
              disabled={isLoading || !emailInput.trim() || !projectId}
            >
              {activeOperation === 'email' ? <Loader2 size={14} className="animate-spin mr-1"/> : null}
              Send Invite
            </Button>
          </div>
          <p className="text-xs text-neutral-medium mt-1">
            Recipients will receive an email with a link to access this project.
          </p>
        </div>

        {/* Team Access */}
        <div>
          <label className="settings-label flex items-center gap-1 mb-1"><Users size={14}/> Team Access</label>
          <p className="text-xs text-neutral-medium mb-2">Manage who on your team can view or edit this project.</p>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleManageTeam}
            disabled={isLoading}
          >
            {showTeamMembers ? 'Hide' : 'Manage'} Team Permissions
          </Button>
          
          {/* Team Members List */}
          {showTeamMembers && (
            <div className="mt-2 border border-neutral-light rounded-md bg-white/50 p-2">
              {teamMembers.length === 0 ? (
                <p className="text-xs text-neutral-medium text-center py-2">No team members found.</p>
              ) : (
                <ul className="space-y-2">
                  {teamMembers.map(member => (
                    <li key={member.id} className="p-2 border border-neutral-light rounded-md bg-white/80">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs font-medium">{member.name}</p>
                          <p className="text-[10px] text-neutral-medium">{member.email} • {member.role}</p>
                        </div>
                        <select 
                          className="settings-input text-xs"
                          value={member.permissions}
                          onChange={(e) => handleUpdatePermission(member.id, e.target.value as any)}
                          disabled={isLoading || activeOperation === `permission-${member.id}`}
                        >
                          <option value="view">View only</option>
                          <option value="comment">Can comment</option>
                          <option value="edit">Can edit</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              
              <div className="flex justify-end mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => setShowTeamMembers(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SharingPermissions;