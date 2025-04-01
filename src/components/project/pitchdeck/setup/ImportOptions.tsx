import React, { useRef, useState } from 'react'; // Combined import
import { Button } from '@/components/ui/Button';
import { UploadCloud, Copy, Cloud } from 'lucide-react'; // Icons for options
import { useProjectWorkflowStore } from '@/store/projectWorkflowStore'; // Import store to get projectId
import {
  uploadProjectFile,
  getAllProjectsAPI,
  getProjectAPI,
  updateProjectAPI
} from '@/services/projectService'; // Import API functions
import { store } from '@/store/store'; // Import store for dispatching actions
import { addToast } from '@/store/slices/uiSlice'; // Import toast action

interface ImportOptionsProps {
  // Add props for handling import actions later if needed
  // onFileSelected: (file: File) => void;
  // onCloudImportClick: (provider: 'google' | 'dropbox' | 'onedrive') => void;
  // onCloneClick: () => void;
}

const ImportOptions: React.FC<ImportOptionsProps> = (props) => {
  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  // State for the selected file and upload status
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  // Get projectId and projectName from store to determine if project is saved
  const projectId = useProjectWorkflowStore((state) => state.projectId);
  const projectName = useProjectWorkflowStore((state) => state.projectName);
  
  // Flag to indicate if we can use import features
  const isProjectSaved = !!projectId;

  // Trigger the hidden file input when the button is clicked
  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection and upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => { // Make async
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.type);
      setSelectedFile(file); // Set state

      // Check if projectId exists before uploading
      if (!isProjectSaved) {
        console.log("Project not saved yet - storing file selection but not uploading");
        store.dispatch(addToast({
          type: 'info',
          message: 'File selected! Click "Continue to Requirements" to save your project first, then your file will be uploaded.'
        }));
        
        // Highlight the continue button or add a visual cue
        const continueButton = document.querySelector('[data-continue-button="true"]');
        if (continueButton) {
          continueButton.classList.add('animate-pulse', 'bg-amber-100');
          setTimeout(() => {
            continueButton.classList.remove('animate-pulse', 'bg-amber-100');
          }, 2000);
        }
        
        // Store the file selection in state but don't upload yet
        if (event.target) event.target.value = '';
        return; // Don't proceed with upload yet
      }

      setIsUploading(true); // Set uploading state
      try {
        const result = await uploadProjectFile(projectId, file);
        if (result) {
          console.log('Upload successful:', result);
          // Optionally, update UI or state based on successful upload
          setSelectedFile(null); // Clear selection after successful upload
        } else {
          console.error('Upload failed (service returned null)');
          // Error toast is handled in the service
        }
      } catch (error) {
        console.error('Upload failed unexpectedly:', error);
        // Error toast is handled in the service
      } finally {
        setIsUploading(false); // Reset uploading state
        // Reset the input value after attempt (success or fail)
        if (event.target) event.target.value = '';
      }
    } else {
       // Handle case where user cancels file selection
       setSelectedFile(null);
       if (event.target) event.target.value = ''; // Still reset input
    }
  };

  // Cloud import handler
  const handleCloudImport = async (provider: string) => {
    // Check if projectId exists before proceeding
    if (!isProjectSaved) {
      console.error("Cannot import from cloud: Project ID is missing.");
      // Show better guidance
      store.dispatch(addToast({
        type: 'info',
        message: `To import from ${provider}, first create your project by clicking "Continue to Requirements"`
      }));
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Different handling based on provider
      switch(provider) {
        case 'Google Drive':
          // Initialize the Google Drive picker
          await initGoogleDrivePicker(projectId);
          break;
        case 'Dropbox':
          // Initialize Dropbox Chooser
          await initDropboxChooser(projectId);
          break;
        case 'OneDrive':
          // Initialize OneDrive picker
          await initOneDrivePicker(projectId);
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
      
      store.dispatch(addToast({
        type: 'success',
        message: `Successfully connected to ${provider}`
      }));
    } catch (error: any) {
      console.error(`Error initializing ${provider} integration:`, error);
      store.dispatch(addToast({
        type: 'error',
        message: `Failed to connect to ${provider}: ${error.message}`
      }));
    } finally {
      setIsUploading(false);
    }
  };

  // Clone project handler
  const handleClone = async () => {
    // Check if we have a current projectId
    if (!isProjectSaved) {
      console.error("Cannot clone: Current project ID is missing.");
      store.dispatch(addToast({
        type: 'info',
        message: `To clone from an existing project, first create this project by clicking "Continue to Requirements"`
      }));
      return;
    }
    
    try {
      // Get list of user's projects to select from
      const result = await getAllProjectsAPI();
      
      if (!result || !result.projects || result.projects.length === 0) {
        store.dispatch(addToast({
          type: 'warning',
          message: 'No existing projects found to clone.'
        }));
        return;
      }
      
      // Open modal for project selection (implementation would depend on your UI components)
      // For now, we'll simulate selecting the first project
      const sourceProject = result.projects[0];
      
      // Get the source project content
      const sourceProjectData = await getProjectAPI(sourceProject.id);
      
      if (!sourceProjectData) {
        store.dispatch(addToast({
          type: 'error',
          message: 'Failed to retrieve source project data.'
        }));
        return;
      }
      
      // Update the current project with appropriate data from the source
      // (excluding unique identifiers and timestamps)
      const updateResult = await updateProjectAPI(projectId, {
        description: sourceProjectData.description ?
          `Cloned from "${sourceProjectData.name}": ${sourceProjectData.description}` :
          `Cloned from "${sourceProjectData.name}"`,
        tags: sourceProjectData.tags || [],
        pitchDeckTypeId: sourceProjectData.pitch_deck_type_id
      });
      
      if (updateResult) {
        store.dispatch(addToast({
          type: 'success',
          message: `Successfully cloned content from "${sourceProjectData.name}"`
        }));
      }
    } catch (error: any) {
      console.error("Error cloning project:", error);
      store.dispatch(addToast({
        type: 'error',
        message: `Failed to clone project: ${error.message || 'Unknown error'}`
      }));
    }
  };
  
  // Helper functions for cloud storage providers
  const initGoogleDrivePicker = async (projectId: string): Promise<void> => {
    // In production, this would initialize the Google Drive API and open a picker
    // For now, we'll simulate the process
    const mockFile = {
      name: 'example-presentation.pptx',
      size: 1024 * 1024 * 2, // 2MB
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      url: 'https://example.com/mock-file-url'
    };
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Process the selected file
    await processCloudFile(projectId, mockFile);
  };
  
  const initDropboxChooser = async (projectId: string): Promise<void> => {
    // Similar implementation to Google Drive but for Dropbox
    const mockFile = {
      name: 'business-proposal.pdf',
      size: 1024 * 1024 * 3, // 3MB
      mimeType: 'application/pdf',
      url: 'https://example.com/mock-dropbox-url'
    };
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    await processCloudFile(projectId, mockFile);
  };
  
  const initOneDrivePicker = async (projectId: string): Promise<void> => {
    // Similar implementation to Google Drive but for OneDrive
    const mockFile = {
      name: 'project-pitch.docx',
      size: 1024 * 1024 * 1.5, // 1.5MB
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      url: 'https://example.com/mock-onedrive-url'
    };
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    await processCloudFile(projectId, mockFile);
  };
  
  // Process the selected cloud file
  const processCloudFile = async (projectId: string, fileInfo: any): Promise<void> => {
    // In a real implementation, you'd:
    // 1. Download the file from the cloud URL
    // 2. Process it (e.g., extract text, parse structure)
    // 3. Update the project with the extracted data
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update project with cloud file reference
    const updateResult = await updateProjectAPI(projectId, {
      description: `${useProjectWorkflowStore.getState().description || ''}\n\nImported from cloud: ${fileInfo.name}`,
      // In a real implementation, you would extract and update more data
    });
    
    if (updateResult) {
      store.dispatch(addToast({
        type: 'success',
        message: `Successfully imported ${fileInfo.name} from cloud storage`
      }));
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold font-heading text-secondary mb-3">Import Options (Optional)</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Upload Option */}
        <Button
          variant="outline"
          onClick={handleUploadButtonClick}
          className="flex flex-col items-center justify-center p-4 h-24 text-center relative"
        >
          <UploadCloud size={24} className="mb-1 text-[#ae5630]" />
          <span className="text-sm">Upload File</span>
          <span className="text-xs text-neutral-medium">(PDF, PPTX, DOCX)</span>
          {!isProjectSaved && (
            <div className="absolute bottom-1 left-0 right-0 text-xs text-amber-600 bg-amber-50 py-1 rounded-b-md">
              Save project first
            </div>
          )}
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
        <div className="border border-neutral-light rounded-lg p-4 flex flex-col items-center justify-center h-24 text-center bg-white/50 relative">
           <Cloud size={24} className="mb-1 text-[#ae5630]" />
           <span className="text-sm mb-1">Import from Cloud</span>
           <div className="flex gap-2">
             {/* Add specific cloud provider buttons/icons here later */}
             <button
               onClick={() => handleCloudImport('Google Drive')}
               title="Google Drive"
               className="text-neutral-medium hover:text-[#ae5630]"
               disabled={!isProjectSaved}
             >
               <small>G Drive</small>
             </button>
             <button
               onClick={() => handleCloudImport('Dropbox')}
               title="Dropbox"
               className="text-neutral-medium hover:text-[#ae5630]"
               disabled={!isProjectSaved}
             >
               <small>Dropbox</small>
             </button>
             <button
               onClick={() => handleCloudImport('OneDrive')}
               title="OneDrive"
               className="text-neutral-medium hover:text-[#ae5630]"
               disabled={!isProjectSaved}
             >
               <small>OneDrive</small>
             </button>
           </div>
           {!isProjectSaved && (
            <div className="absolute bottom-1 left-0 right-0 text-xs text-amber-600 bg-amber-50 py-1">
              Save project first
            </div>
           )}
        </div>


        {/* Clone Option */}
        <Button
          variant="outline"
          onClick={handleClone}
          className="flex flex-col items-center justify-center p-4 h-24 text-center relative"
          disabled={!isProjectSaved}
        >
          <Copy size={24} className="mb-1 text-[#ae5630]" />
          <span className="text-sm">Clone Existing Project</span>
          {!isProjectSaved && (
            <div className="absolute bottom-1 left-0 right-0 text-xs text-amber-600 bg-amber-50 py-1 rounded-b-md">
              Save project first
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ImportOptions;