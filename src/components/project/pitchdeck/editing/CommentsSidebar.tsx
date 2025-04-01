import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MessageSquare, X } from 'lucide-react';

// Placeholder comment structure
interface Comment {
  id: string;
  user: string;
  timestamp: string;
  text: string;
  replies?: Comment[]; // Optional replies
}

interface CommentsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  // Add props for comments data, adding comments, etc. later
}

const CommentsSidebar: React.FC<CommentsSidebarProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  // Placeholder data
  const comments: Comment[] = [
    { id: 'c1', user: 'Jo Constant', timestamp: '2 hours ago', text: 'Should we rephrase this section?' },
    { id: 'c2', user: 'AI Assistant', timestamp: '1 hour ago', text: 'Consider adding a statistic here.' },
  ];

  return (
    // Using fixed positioning for simplicity, adjust layout as needed
    <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-40 border-l border-neutral-light flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-neutral-light">
        <h4 className="font-semibold text-neutral-dark text-lg flex items-center gap-2">
          <MessageSquare size={18} /> Comments
        </h4>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close comments">
          <X size={18} />
        </Button>
      </div>

      {/* Add Comment Input Area */}
      <div className="p-4 border-b">
         <textarea 
            placeholder="Add a comment..." 
            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            rows={3}
         />
         <Button size="sm" className="mt-2 text-white">Add Comment</Button>
      </div>

      {/* Comments List */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {comments.length > 0 ? (
          comments.map(comment => (
            <Card key={comment.id} className="p-3 border border-neutral-light">
              <div className="flex justify-between items-center mb-1">
                 <span className="text-xs font-medium text-neutral-dark">{comment.user}</span>
                 <span className="text-xs text-neutral-medium">{comment.timestamp}</span>
              </div>
              <p className="text-sm text-neutral-dark">{comment.text}</p>
              {/* Add reply functionality later */}
            </Card>
          ))
        ) : (
          <div className="text-center text-neutral-medium p-4 text-sm">No comments yet.</div>
        )}
      </div>
    </div>
  );
};

export default CommentsSidebar;