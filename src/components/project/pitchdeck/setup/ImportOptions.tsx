import React, { useRef, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Label } from '@/components/ui/Label';
import { UploadCloud, Copy, Cloud } from 'lucide-react';
import { useProjectWorkflowStore } from '@/store/projectWorkflowStore';
import {
  uploadProjectFile,
  getAllProjectsAPI,
  getProjectAPI,
  updateProjectAPI
} from '@/services/projectService';
import { store } from '@/store/store';
import { addToast } from '@/store/slices/uiSlice';

const ImportOptions: React.FC = () => {
  // State for tabs and form inputs
  const [activeTab, setActiveTab] = useState('file');
  const [importUrl, setImportUrl] = useState('');
  const [outlineContent, setOutlineContent] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  
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

  // Handle file selection and upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.type);
      setSelectedFile(file);

      // Check if projectId exists before uploading
      if (!isProjectSaved) {
        console.log("Project not saved yet - storing file selection but not uploading");
        store.dispatch(addToast({
          type: 'info',
          message: 'File selected! Click "Continue to Requirements" to save your project first, then your file will be uploaded.'
        }));
        
        // Store the file selection in state but don't upload yet
        if (event.target) event.target.value = '';
        return; // Don't proceed with upload yet
      }

      setIsUploading(true);
      try {
        const result = await uploadProjectFile(projectId, file);
        if (result) {
          console.log('Upload successful:', result);
          setSelectedFile(null); // Clear selection after successful upload
          store.dispatch(addToast({
            type: 'success',
            message: `Successfully uploaded ${file.name}`
          }));
        } else {
          console.error('Upload failed (service returned null)');
        }
      } catch (error) {
        console.error('Upload failed unexpectedly:', error);
      } finally {
        setIsUploading(false);
        if (event.target) event.target.value = '';
      }
    } else {
      setSelectedFile(null);
      if (event.target) event.target.value = '';
    }
  };

  // URL import handler
  const handleUrlImport = async () => {
    if (!importUrl) return;
    
    if (!isProjectSaved) {
      store.dispatch(addToast({
        type: 'info',
        message: 'Please save your project first before importing from URL.'
      }));
      return;
    }
    
    setIsImporting(true);
    try {
      // Simulate URL import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update project with imported content
      const updateResult = await updateProjectAPI(projectId, {
        description: `${useProjectWorkflowStore.getState().description || ''}\n\nImported from URL: ${importUrl}`,
      });
      
      if (updateResult) {
        store.dispatch(addToast({
          type: 'success',
          message: `Successfully imported content from URL`
        }));
        setImportUrl('');
      }
    } catch (error: any) {
      console.error("Error importing from URL:", error);
      store.dispatch(addToast({
        type: 'error',
        message: `Failed to import from URL: ${error.message || 'Unknown error'}`
      }));
    } finally {
      setIsImporting(false);
    }
  };

  // Outline import handler
  const handleOutlineImport = async () => {
    if (!outlineContent) return;
    
    if (!isProjectSaved) {
      store.dispatch(addToast({
        type: 'info',
        message: 'Please save your project first before creating from outline.'
      }));
      return;
    }
    
    setIsImporting(true);
    try {
      // Simulate outline processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update project with outline content
      const updateResult = await updateProjectAPI(projectId, {
        description: `${useProjectWorkflowStore.getState().description || ''}\n\nOutline:\n${outlineContent}`,
      });
      
      if (updateResult) {
        store.dispatch(addToast({
          type: 'success',
          message: `Successfully created content from outline`
        }));
        setOutlineContent('');
      }
    } catch (error: any) {
      console.error("Error creating from outline:", error);
      store.dispatch(addToast({
        type: 'error',
        message: `Failed to create from outline: ${error.message || 'Unknown error'}`
      }));
    } finally {
      setIsImporting(false);
    }
  };

  // Clone project handler
  const handleClone = async () => {
    if (!isProjectSaved) {
      store.dispatch(addToast({
        type: 'info',
        message: 'Please save your project first before cloning from an existing project.'
      }));
      return;
    }
    
    setIsImporting(true);
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
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold font-heading text-secondary mb-4">Import Content (Optional)</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="file">Upload File</TabsTrigger>
          <TabsTrigger value="url">Import from URL</TabsTrigger>
          <TabsTrigger value="outline">Create from Outline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="file" className="space-y-4">
          <div className="border-2 border-dashed border-neutral-light rounded-lg p-6 text-center">
            <div className="mb-4">
              <UploadCloud className="mx-auto h-12 w-12 text-neutral-muted" />
            </div>
            <p className="text-sm text-neutral-muted mb-4">
              Drag and drop file here, or click to select file
            </p>
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                className="relative"
                disabled={!isProjectSaved}
              >
                Browse Files
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  accept=".pdf,.pptx,.docx"
                  disabled={!isProjectSaved}
                />
              </Button>
            </div>
            <p className="text-xs text-neutral-muted mt-4">
              Supported formats: .pdf, .pptx, .docx
            </p>
            {!isProjectSaved && (
              <p className="text-xs text-amber-600 mt-2">
                Please save your project first before uploading files.
              </p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="url" className="space-y-4">
          <div>
            <Label htmlFor="importUrl" className="block mb-2">URL to Import From</Label>
            <Input
              id="importUrl"
              type="url"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              placeholder="https://example.com/presentation"
              className="w-full"
            />
            <p className="text-xs text-neutral-muted mt-1">
              Enter the URL of the content you'd like to import as a starting point for your pitch deck.
            </p>
          </div>
          <Button 
            onClick={handleUrlImport} 
            disabled={!importUrl || isImporting || !isProjectSaved} 
            variant="outline" 
            className="w-full sm:w-auto"
          >
            {isImporting ? 'Importing...' : 'Import Content'}
          </Button>
          {!isProjectSaved && (
            <p className="text-xs text-amber-600">
              Please save your project first before importing from URL.
            </p>
          )}
        </TabsContent>
        
        <TabsContent value="outline" className="space-y-4">
          <div>
            <Label htmlFor="outlineContent" className="block mb-2">Pitch Deck Outline</Label>
            <Textarea
              id="outlineContent"
              value={outlineContent}
              onChange={(e) => setOutlineContent(e.target.value)}
              placeholder="# Introduction
- Company overview
- Problem statement

## Market Analysis
- Target market
- Market size
- Competitors

## Solution
- Product/service description
- Unique value proposition
- Demo or visuals"
              className="w-full h-48 font-mono text-sm"
            />
            <p className="text-xs text-neutral-muted mt-1">
              Paste your outline using markdown formatting or simple bullet points.
            </p>
          </div>
          <Button 
            onClick={handleOutlineImport} 
            disabled={!outlineContent || isImporting || !isProjectSaved} 
            variant="outline" 
            className="w-full sm:w-auto"
          >
            {isImporting ? 'Processing...' : 'Use Outline'}
          </Button>
          {!isProjectSaved && (
            <p className="text-xs text-amber-600">
              Please save your project first before creating from outline.
            </p>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Comment out for now - will add later | Clone Existing Project Option
      <div className="mt-6 pt-6 border-t border-neutral-light">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium">Clone Existing Project</h4>
            <p className="text-xs text-neutral-muted">
              Start with content from one of your existing pitch decks
            </p>
          </div>
          <Button 
            onClick={handleClone} 
            disabled={isImporting || !isProjectSaved}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Copy size={16} /> Clone Project
          </Button>
        </div>
        {!isProjectSaved && (
          <p className="text-xs text-amber-600 mt-2">
            Please save your project first before cloning from an existing project.
          </p>
        )}
      </div>*/}
    </Card>
  );
};
export default ImportOptions;