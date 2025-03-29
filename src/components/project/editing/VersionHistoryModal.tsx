import React from 'react';
import { Button } from '@/components/ui/Button'; 

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  // Placeholder data
  const versions = [
    { id: 'v3', timestamp: '2025-03-29 04:45 AM', user: 'Jo Constant', changes: 'Edited introduction' },
    { id: 'v2', timestamp: '2025-03-29 03:10 AM', user: 'AI Assistant', changes: 'Generated initial draft' },
    { id: 'v1', timestamp: '2025-03-29 03:00 AM', user: 'Jo Constant', changes: 'Created project' },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" 
      onClick={onClose} // Close on overlay click
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg" // Made slightly wider
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex justify-between items-center mb-4 pb-3 border-b">
          <h3 className="text-lg font-semibold text-neutral-dark">Version History</h3>
          <button 
            onClick={onClose} 
            className="text-neutral-medium hover:text-neutral-dark"
            aria-label="Close modal"
          >
            &times; {/* Simple close icon */}
          </button>
        </div>
        
        {/* Placeholder List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2"> 
          {versions.length > 0 ? (
            versions.map(version => (
              <div key={version.id} className="border rounded-md p-3 flex justify-between items-center hover:bg-neutral-light/50">
                <div>
                  <p className="text-sm font-medium text-neutral-dark">{version.timestamp}</p>
                  <p className="text-xs text-neutral-medium">By: {version.user} - {version.changes}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => console.log(`Restore version ${version.id} clicked - Not Implemented`)}>
                  Restore
                </Button>
              </div>
            ))
          ) : (
             <p className="text-neutral-medium text-sm text-center py-4">No version history available.</p>
          )}
        </div>

        <div className="mt-6 flex justify-end pt-3 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VersionHistoryModal;