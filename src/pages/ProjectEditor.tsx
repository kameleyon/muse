// src/pages/ProjectEditor.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { addToast } from '@/store/slices/uiSlice';
import Loading from '@/components/common/Loading';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card'; // Import Card component
import RichTextEditor from '@/features/editor/RichTextEditor';
import SetupForm from '@/features/project_setup/components/SetupForm';
import ProjectSidebar from '@/features/project_editor/components/ProjectSidebar';
import {
  getProjectById,
  getModulesByProjectId,
  getCurrentVersionByModuleId,
  getContentBlocksByVersionId,
  getVersionsByModuleId, // Import new function
  updateContentBlock,
  Project,
  ContentModule,
  Version,
  ContentBlock,
} from '@/services/projectService';
import './ProjectEditor.css';

const ProjectEditor: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [project, setProject] = useState<Project | null>(null);
  const [module, setModule] = useState<ContentModule | null>(null);
  const [currentVersion, setCurrentVersion] = useState<Version | null>(null); // Renamed from 'version'
  const [allVersions, setAllVersions] = useState<Version[]>([]); // State for all versions
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isLoadingProject, setIsLoadingProject] = useState<boolean>(true); // Loading for initial project fetch
  const [isLoadingEditor, setIsLoadingEditor] = useState<boolean>(false); // Loading for editor/version data
  const [error, setError] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [needsSetup, setNeedsSetup] = useState<boolean>(false);

  // Fetch only project initially to check setup status
  const fetchProjectShell = useCallback(async () => {
    if (!projectId) {
      setError('Project ID is missing.');
      setIsLoadingProject(false);
      return;
    }
    setIsLoadingProject(true);
    setError(null);
    setNeedsSetup(false);

    try {
      const fetchedProject = await getProjectById(projectId);
      if (!fetchedProject) throw new Error('Project not found.');
      setProject(fetchedProject);

      if (!fetchedProject.setup_details) {
        setNeedsSetup(true);
      } else {
        setNeedsSetup(false);
        // If setup is done, immediately trigger fetching editor data
        fetchEditorData(projectId);
      }
    } catch (err: any) {
      console.error('Error fetching project shell:', err);
      setError(`Failed to load project: ${err.message}`);
      dispatch(addToast({ type: 'error', message: `Failed to load project: ${err.message}` }));
    } finally {
      setIsLoadingProject(false);
    }
  }, [projectId, dispatch]); // Removed fetchEditorData from deps, called manually

  // Fetch modules, versions, blocks for the editor view
  const fetchEditorData = useCallback(async (projId: string) => {
    setIsLoadingEditor(true); // Use separate loading state for editor part
    setError(null); // Clear previous errors if refetching
    setHasUnsavedChanges(false);

    try {
      const fetchedModules = await getModulesByProjectId(projId);
      if (!fetchedModules || fetchedModules.length === 0) throw new Error('No modules found.');
      const currentModule = fetchedModules[0];
      setModule(currentModule);

      const fetchedVersions = await getVersionsByModuleId(currentModule.module_id);
      setAllVersions(fetchedVersions);

      let initialVersion = fetchedVersions.find((v: Version) => v.is_current); // Add type annotation
      if (!initialVersion && fetchedVersions.length > 0) {
          initialVersion = fetchedVersions[0];
      }
      if (!initialVersion) throw new Error('No versions found for this module.');
      setCurrentVersion(initialVersion);

      await fetchVersionContent(initialVersion.version_id); // Fetch content for the initial version

    } catch (err: any) {
      console.error('Error fetching editor data:', err);
      setError(`Failed to load editor data: ${err.message}`);
      dispatch(addToast({ type: 'error', message: `Failed to load editor data: ${err.message}` }));
    } finally {
      setIsLoadingEditor(false);
    }
  }, [dispatch]); // Removed fetchVersionContent from deps

  // Fetch content blocks for a specific version
  const fetchVersionContent = useCallback(async (versionId: string) => {
      setIsLoadingEditor(true); // Still loading editor parts
      try {
          const versionBlocks = await getContentBlocksByVersionId(versionId);
          setBlocks(versionBlocks);
          if (versionBlocks.length > 0 && versionBlocks[0].content_data?.text !== undefined) {
              setEditorContent(versionBlocks[0].content_data.text);
          } else {
              setEditorContent('');
          }
          // Update currentVersion state without re-fetching all versions
          const selectedVersion = allVersions.find(v => v.version_id === versionId);
          setCurrentVersion(selectedVersion || null);
          setHasUnsavedChanges(false);
      } catch (err: any) {
          console.error(`Error fetching content for version ${versionId}:`, err);
          dispatch(addToast({ type: 'error', message: `Failed to load version content: ${err.message}` }));
      } finally {
          setIsLoadingEditor(false);
      }
  }, [dispatch, allVersions]); // Depend on allVersions

  // Initial fetch for project shell
  useEffect(() => {
    fetchProjectShell();
  }, [fetchProjectShell]);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    if (!hasUnsavedChanges) {
        setHasUnsavedChanges(true);
    }
  };

  const handleSave = async () => {
     if (!blocks || blocks.length === 0 || !user?.id || !currentVersion) {
         dispatch(addToast({ type: 'error', message: 'Cannot save: No content block/version loaded or user not logged in.' }));
         return;
     }
     const blockToSave = blocks[0];
     if (blockToSave.version_id !== currentVersion.version_id) {
         dispatch(addToast({ type: 'error', message: 'Save error: Block does not match current version.' }));
         return;
     }

     setIsLoadingEditor(true); // Use editor loading state
     setHasUnsavedChanges(false);
     try {
         await updateContentBlock(blockToSave.block_id, editorContent, user.id);
         dispatch(addToast({ type: 'success', message: 'Content saved successfully!' }));
     } catch (err: any) {
         console.error('Error saving content:', err);
         dispatch(addToast({ type: 'error', message: `Failed to save content: ${err.message}` }));
         setHasUnsavedChanges(true);
     } finally {
         setIsLoadingEditor(false);
     }
  };

  const handleSetupComplete = () => {
      setNeedsSetup(false);
      // Fetch editor data now that setup is done
      if (projectId) {
          fetchEditorData(projectId);
      }
  };

  const handleSelectVersion = (versionId: string) => {
      if (versionId === currentVersion?.version_id) return;
      if (hasUnsavedChanges) {
          if (!window.confirm("You have unsaved changes. Are you sure you want to switch versions? Changes will be lost.")) {
              return;
          }
      }
      fetchVersionContent(versionId); // Fetch content for the selected version
  };

  // --- Render Logic ---

  if (isLoadingProject) {
    return <Loading />; // Show loading only for initial project shell fetch
  }

  if (error && !project) { // Show error only if project couldn't be loaded at all
    return <div className="project-editor-page">Error: {error}</div>;
  }

  if (!project) {
      // Should not happen if not loading and no error, but safety check
      return <div className="project-editor-page">Could not load project information.</div>;
  }

  // Always render the grid layout
  return (
    <div className="project-editor-page grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Left Column - Sidebar */}
        <div className="lg:col-span-3">
            <ProjectSidebar
                project={project}
                module={module} // Module might be null during setup
                versions={allVersions} // Versions might be empty during setup
                currentVersionId={currentVersion?.version_id || null} // currentVersion might be null
                onSelectVersion={handleSelectVersion}
            />
        </div>

        {/* Right Column - Main Content Area */}
        <div className="lg:col-span-9 py-8">
            {/* Wrap content in Card for consistent styling */}
            <Card className="shadow-sm sm:shadow-md hover:shadow-lg transition-shadow">
                {/* Conditionally render SetupForm or Editor */}
                {needsSetup ? (
                    // Apply padding within the card for the form
                    <div className="p-3 sm:p-4 md:p-6 ">
                        <SetupForm projectId={project.project_id} onComplete={handleSetupComplete} />
                    </div>
                ) : (
                    <>
                    {/* Show loading indicator for editor data */}
                    {isLoadingEditor && <Loading />}

                    {/* Show error specific to editor data loading */}
                    {error && !isLoadingEditor && (
                         <div className="p-4 text-red-600 bg-red-100 border border-red-400 rounded">
                            Error loading editor data: {error}
                         </div>
                    )}

                    {/* Render editor only if module and version are loaded */}
                    {!isLoadingEditor && module && currentVersion && (
                        <>
                            <div className="project-editor-header">
                                <h1 className="project-editor-title">
                                    {project.project_name}
                                </h1>
                                <p className="project-editor-subtitle">
                                    Editing: {module.module_name} (Version {currentVersion.version_number} - {currentVersion.version_name})
                                </p>
                            </div>
                            <div className="editor-container">
                                <div className="editor-toolbar-area">
                                    <Button
                                        variant="primary"
                                        onClick={handleSave}
                                        disabled={isLoadingEditor || !hasUnsavedChanges}
                                        className={ (isLoadingEditor || !hasUnsavedChanges) ? 'button-disabled' : '' }
                                    >
                                        {isLoadingEditor ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                                <RichTextEditor
                                    key={currentVersion.version_id}
                                    initialContent={editorContent}
                                    onChange={handleEditorChange}
                                    editable={!isLoadingEditor}
                                />
                            </div>
                        </>
                    )}
                </>
                )}
            </Card> {/* Close Card component */}
        </div>
    </div>
  );
};

export default ProjectEditor;