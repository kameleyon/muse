import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentItem, updateContentItem } from '@/store/slices/contentSlice';
import { closeModal, addToast } from '@/store/slices/uiSlice';
import ContentExport from './ContentExport';
import { Button } from '@/components/ui/Button';

interface ContentDetailModalProps {
  content: ContentItem;
}

const ContentDetailModal: React.FC<ContentDetailModalProps> = ({ content }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content.content);
  const [editedTitle, setEditedTitle] = useState(content.title);
  const [showExport, setShowExport] = useState(false);

  // Content type name mapping
  const contentTypeNames = {
    blog: 'Blog Post',
    marketing: 'Marketing Copy',
    creative: 'Creative Writing',
    academic: 'Academic Content',
    social: 'Social Media Post',
  };

  // Handle saving edited content
  const handleSave = () => {
    const updatedContent = {
      ...content,
      title: editedTitle,
      content: editedContent,
      updatedAt: new Date().toISOString(),
    };

    dispatch(updateContentItem(updatedContent));
    dispatch(
      addToast({
        type: 'success',
        message: 'Content updated successfully',
      })
    );
    setIsEditing(false);
  };

  // Handle closing the modal
  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-neutral-dark rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-light dark:border-neutral-dark flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              {isEditing ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-xl font-bold font-heading w-full px-3 py-2 rounded-md border border-neutral-light dark:border-neutral-dark bg-white dark:bg-neutral-dark focus:outline-none focus:ring-2 focus:ring-accent-teal"
                />
              ) : (
                <h2 className="text-xl font-bold font-heading">{content.title}</h2>
              )}
              <div className="flex items-center mt-2">
                <span
                  className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
                    content.type === 'blog' ? 'bg-accent-teal/20 text-accent-teal' :
                    content.type === 'marketing' ? 'bg-primary/20 text-primary-hover' :
                    content.type === 'creative' ? 'bg-accent-purple/20 text-accent-purple' :
                    content.type === 'academic' ? 'bg-secondary/20 text-secondary dark:text-neutral-light' :
                    'bg-success/20 text-success'
                  } mr-2`}
                >
                  {contentTypeNames[content.type as keyof typeof contentTypeNames] || content.type}
                </span>
                <span className="text-xs text-neutral-medium">
                  Last updated: {new Date(content.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditedContent(content.content);
                      setEditedTitle(content.title);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleSave}>
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowExport(true)}
                  >
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleClose}>
                    Close
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isEditing ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-full px-3 py-2 rounded-md border border-neutral-light dark:border-neutral-dark bg-white dark:bg-neutral-dark focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all duration-200 resize-none font-mono"
              />
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                {/* In a real app, we'd use a markdown renderer here */}
                <pre className="whitespace-pre-wrap font-sans">{content.content}</pre>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="p-6 border-t border-neutral-light dark:border-neutral-dark">
            <div className="flex flex-wrap gap-1">
              {content.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-neutral-light/30 dark:bg-neutral-dark/30 text-neutral-medium px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Export Modal */}
          <ContentExport
            content={content.content}
            title={content.title}
            isOpen={showExport}
            onClose={() => setShowExport(false)}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ContentDetailModal;
