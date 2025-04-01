import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users, MessageSquare, GitBranch, X, Send, Clock } from 'lucide-react';
import { useProjectWorkflowStore } from '@/store/projectWorkflowStore';
import { useDispatch } from 'react-redux';
import { addToast } from '@/store/slices/uiSlice';
import * as collaborationService from '@/services/collaborationService';

interface User {
  id: string;
  name: string;
  initial: string;
  color?: string;
}

interface Comment {
  id: string;
  userId: string;
  timestamp: string;
  text: string;
  resolved: boolean;
  userName?: string;
}

interface Version {
  id: string;
  timestamp: string;
  userId: string;
  description: string;
  userName?: string;
}

const CollaborationTools: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState<User[]>([
    { id: 'current', name: 'You', initial: 'Y', color: '#ae5630' },
    { id: 'collaborator', name: 'Collaborator', initial: 'C', color: '#232321' }
  ]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [showCommentsPanel, setShowCommentsPanel] = useState(false);
  const [showVersionsPanel, setShowVersionsPanel] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Get project ID from store
  const { projectId } = useProjectWorkflowStore();
  const dispatch = useDispatch();
  
  // Connect to collaboration service on mount
  useEffect(() => {
    if (!projectId) return;
    
    // Connect to collaboration socket
    const handleEditOperation = (op: any) => {
      console.log('Received edit operation:', op);
      // In a real implementation, this would update the editor content
    };
    
    const handlePresenceUpdate = (update: any) => {
      if (update.users) {
        const formattedUsers = update.users.map((user: any, index: number) => ({
          id: user.id,
          name: user.name,
          initial: user.name.charAt(0).toUpperCase(),
          color: index === 0 ? '#ae5630' : '#232321'
        }));
        setActiveUsers(formattedUsers);
      }
    };
    
    // Connect to collaboration socket
    collaborationService.connectCollaborationSocket(
      projectId,
      'current',
      handleEditOperation,
      handlePresenceUpdate
    );
    
    // Load comments
    loadComments();
    
    // Simulate versions
    setVersions([
      {
        id: 'v1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        userId: 'current',
        description: 'Initial draft',
        userName: 'You'
      },
      {
        id: 'v2',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        userId: 'collaborator',
        description: 'Added market analysis section',
        userName: 'Collaborator'
      },
      {
        id: 'v3',
        timestamp: new Date().toISOString(),
        userId: 'current',
        description: 'Updated financial projections',
        userName: 'You'
      }
    ]);
    
    // Cleanup on unmount
    return () => {
      collaborationService.disconnectCollaborationSocket();
    };
  }, [projectId]);
  
  const loadComments = async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    try {
      const fetchedComments = await collaborationService.getComments(projectId);
      // Add user names to comments
      const commentsWithNames = fetchedComments.map(comment => ({
        ...comment,
        userName: comment.userId === 'current' ? 'You' : 'Collaborator'
      }));
      setComments(commentsWithNames);
    } catch (error) {
      console.error('Failed to load comments:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Failed to load comments'
      }));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleShowComments = () => {
    setShowCommentsPanel(prev => !prev);
    setShowVersionsPanel(false);
    
    if (!showCommentsPanel) {
      loadComments();
    }
  };
  
  const handleShowVersions = () => {
    setShowVersionsPanel(prev => !prev);
    setShowCommentsPanel(false);
  };
  
  const handleAddComment = async () => {
    if (!newComment.trim() || !projectId) return;
    
    setIsLoading(true);
    try {
      const comment = await collaborationService.addComment(projectId, {
        userId: 'current',
        text: newComment.trim()
      });
      
      // Add user name to comment
      const commentWithName = {
        ...comment,
        userName: 'You'
      };
      
      setComments(prev => [...prev, commentWithName]);
      setNewComment('');
      
      dispatch(addToast({
        type: 'success',
        message: 'Comment added successfully'
      }));
    } catch (error) {
      console.error('Failed to add comment:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Failed to add comment'
      }));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResolveComment = async (commentId: string) => {
    if (!projectId) return;
    
    setIsLoading(true);
    try {
      await collaborationService.updateComment(projectId, commentId, { resolved: true });
      
      // Update local state
      setComments(prev => prev.map(comment => 
        comment.id === commentId ? { ...comment, resolved: true } : comment
      ));
      
      dispatch(addToast({
        type: 'success',
        message: 'Comment resolved'
      }));
    } catch (error) {
      console.error('Failed to resolve comment:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Failed to resolve comment'
      }));
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm relative">
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2">Collaboration</h4>
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-md">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            <p className="text-sm text-neutral-dark">Loading...</p>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {/* Presence Indicators */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-medium">Active:</span>
          <div className="flex -space-x-2">
            {activeUsers.map(user => (
              <span 
                key={user.id}
                className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center ring-1 ring-white"
                style={{ backgroundColor: user.color || '#ae5630' }}
                title={user.name}
              >
                {user.initial}
              </span>
            ))}
          </div>
        </div>
        
        {/* Feedback/Comments */}
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            className={`w-full text-xs justify-start ${showCommentsPanel ? 'bg-neutral-light/20' : ''}`} 
            onClick={handleShowComments}
          >
            <MessageSquare size={14} className="mr-1"/> Comments ({comments.length})
          </Button>
          
          {showCommentsPanel && (
            <div className="mt-2 border border-neutral-light rounded-md p-2 bg-white">
              <div className="max-h-60 overflow-y-auto mb-2">
                {comments.length === 0 ? (
                  <p className="text-xs text-neutral-medium text-center py-4">No comments yet</p>
                ) : (
                  <div className="space-y-2">
                    {comments.map(comment => (
                      <div 
                        key={comment.id} 
                        className={`p-2 rounded-md text-xs ${comment.resolved ? 'bg-green-50 border border-green-100' : 'bg-neutral-light/10'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="font-medium">{comment.userName}</div>
                          {!comment.resolved && (
                            <button 
                              className="text-neutral-medium hover:text-green-600" 
                              onClick={() => handleResolveComment(comment.id)}
                              title="Resolve comment"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                        <div className="mt-1">{comment.text}</div>
                        <div className="text-[10px] text-neutral-medium mt-1 flex justify-between">
                          <span>{formatDate(comment.timestamp)}</span>
                          {comment.resolved && <span className="text-green-600">Resolved</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 text-xs p-1.5 border border-neutral-light rounded-md"
                />
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="text-xs text-white"
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isLoading}
                >
                  <Send size={12} className="mr-1" /> Add
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Version Management */}
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            className={`w-full text-xs justify-start ${showVersionsPanel ? 'bg-neutral-light/20' : ''}`} 
            onClick={handleShowVersions}
          >
            <GitBranch size={14} className="mr-1"/> Version History
          </Button>
          
          {showVersionsPanel && (
            <div className="mt-2 border border-neutral-light rounded-md p-2 bg-white">
              <div className="max-h-60 overflow-y-auto">
                {versions.length === 0 ? (
                  <p className="text-xs text-neutral-medium text-center py-4">No version history</p>
                ) : (
                  <div className="space-y-2">
                    {versions.map(version => (
                      <div 
                        key={version.id} 
                        className="p-2 rounded-md text-xs bg-neutral-light/10 hover:bg-neutral-light/20 cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div className="font-medium">{version.description}</div>
                          <div className="text-[10px] text-neutral-medium flex items-center">
                            <Clock size={10} className="mr-1" />
                            {formatDate(version.timestamp)}
                          </div>
                        </div>
                        <div className="text-[10px] text-neutral-medium mt-1">
                          By {version.userName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CollaborationTools;