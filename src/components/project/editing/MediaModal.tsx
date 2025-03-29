import React, { useState, ChangeEvent } from 'react'; // Import useState, ChangeEvent
import { Button } from '@/components/ui/Button'; // Assuming Button is available

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MediaModal: React.FC<MediaModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadStatus('idle'); // Reset status when a new file is selected
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');
    console.log("Uploading file:", selectedFile.name);
    // TODO: Implement actual file upload logic here (e.g., call a service)
    // Example: await mediaService.uploadFile(selectedFile);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload
      console.log("Simulated upload successful for:", selectedFile.name);
      setUploadStatus('success');
      // Optionally clear file or close modal on success
      // setSelectedFile(null);
      // onClose();
    } catch (error) {
       console.error("Simulated upload failed:", error);
       setUploadStatus('error');
    }
  };


  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" 
      onClick={onClose} // Close on overlay click
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-neutral-dark">Media Library</h3>
          <button 
            onClick={onClose} 
            className="text-neutral-medium hover:text-neutral-dark"
            aria-label="Close modal"
          >
            &times; {/* Simple close icon */}
          </button>
        </div>
        
        {/* File Upload Section */}
        <div className="space-y-4">
          <div>
            <label htmlFor="media-upload" className="block text-sm font-medium text-neutral-dark mb-1">
              Upload New Media
            </label>
            <input
              id="media-upload"
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-neutral-medium file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              accept="image/*,video/*" // Accept images and videos
            />
            {selectedFile && <p className="text-xs text-neutral-medium mt-1">Selected: {selectedFile.name}</p>}
          </div>

          {/* Upload Status */}
          {uploadStatus === 'uploading' && <p className="text-sm text-blue-600">Uploading...</p>}
          {uploadStatus === 'success' && <p className="text-sm text-green-600">Upload successful!</p>}
          {uploadStatus === 'error' && <p className="text-sm text-red-600">Upload failed. Please try again.</p>}

          {/* TODO: Add browsing/existing media section here later */}
          <div className="border-t pt-4 mt-4">
             <p className="text-sm text-neutral-medium">Existing media browsing will appear here.</p>
          </div>

        </div>

        <div className="mt-6 flex justify-between items-center"> {/* Changed to justify-between */}
          {/* Upload Button */}
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!selectedFile || uploadStatus === 'uploading'}
            className="text-white" // Ensure text visibility
          >
            {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload Selected File'}
          </Button>
          
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MediaModal;