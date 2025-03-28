import React, { useRef } from 'react'; // Import useRef
import { Button } from '@/components/ui/Button';
import { UploadCloud, Copy, Cloud } from 'lucide-react'; // Icons for options

interface ImportOptionsProps {
  // Add props for handling import actions later if needed
  // onFileSelected: (file: File) => void;
  // onCloudImportClick: (provider: 'google' | 'dropbox' | 'onedrive') => void;
  // onCloneClick: () => void;
}

const ImportOptions: React.FC<ImportOptionsProps> = (props) => {
  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger the hidden file input when the button is clicked
  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.type);
      // TODO: Implement actual file processing/upload logic here
      // props.onFileSelected?.(file); // Example of passing file up if needed
    }
     // Reset the input value to allow selecting the same file again
     if (event.target) {
        event.target.value = '';
     }
  };

  // Placeholder handlers - implement actual logic later
  const handleCloudImport = (provider: string) => console.log(`Cloud import: ${provider} clicked`);
  const handleClone = () => console.log('Clone clicked');

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold font-heading text-secondary mb-3">Import Options (Optional)</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Upload Option */}
        <Button variant="outline" onClick={handleUploadButtonClick} className="flex flex-col items-center justify-center p-4 h-24 text-center">
          <UploadCloud size={24} className="mb-1 text-[#ae5630]" />
          <span className="text-sm">Upload File</span>
          <span className="text-xs text-neutral-medium">(PDF, PPTX, DOCX)</span>
        </Button>
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.pptx,.docx" // Specify accepted formats
        />

        {/* Cloud Import Option */}
        <div className="border border-neutral-light rounded-lg p-4 flex flex-col items-center justify-center h-24 text-center bg-white/50">
           <Cloud size={24} className="mb-1 text-[#ae5630]" />
           <span className="text-sm mb-1">Import from Cloud</span>
           <div className="flex gap-2">
             {/* Add specific cloud provider buttons/icons here later */}
             <button onClick={() => handleCloudImport('Google Drive')} title="Google Drive" className="text-neutral-medium hover:text-[#ae5630]"><small>G Drive</small></button>
             <button onClick={() => handleCloudImport('Dropbox')} title="Dropbox" className="text-neutral-medium hover:text-[#ae5630]"><small>Dropbox</small></button>
             <button onClick={() => handleCloudImport('OneDrive')} title="OneDrive" className="text-neutral-medium hover:text-[#ae5630]"><small>OneDrive</small></button>
           </div>
        </div>


        {/* Clone Option */}
        <Button variant="outline" onClick={handleClone} className="flex flex-col items-center justify-center p-4 h-24 text-center">
          <Copy size={24} className="mb-1 text-[#ae5630]" />
          <span className="text-sm">Clone Existing Project</span>
        </Button>
      </div>
    </div>
  );
};

export default ImportOptions;