// src/services/projectService.ts
import { supabase } from './supabase';
import {
  ProjectCategory,
  ProjectSubcategory,
  ProjectSection,
  ProjectItem,
} from '@/features/project_creation/data/projectCategories'; // Assuming path is correct

// --- Existing Interfaces/Types ---
interface CreateProjectDetails {
  userId: string;
  projectName: string;
  category: ProjectCategory;
  subcategory: ProjectSubcategory;
  section: ProjectSection;
  item: ProjectItem;
}

// --- New Interfaces/Types for Fetched Data ---
// Mirroring schema from Contentflow.md and Supabase image
export interface Project {
  project_id: string;
  user_id: string;
  project_name: string;
  project_type: string;
  creation_date: string;
  last_modified: string;
  status: string;
  default_template_id?: string | null;
  visibility_settings?: any | null; // Use specific type if defined
  collaborative_settings?: any | null; // Use specific type if defined
  setup_details?: Record<string, any> | null; // RE-ADDED for setup form data
}

// ... (ContentModule, Version, ContentBlock interfaces remain the same) ...
export interface ContentModule {
  module_id: string;
  project_id: string;
  module_name: string;
  module_type: string;
  parent_module_id?: string | null;
  display_order: number;
  creation_date: string;
  last_modified: string;
  status: string;
}

export interface Version {
  version_id: string;
  module_id: string;
  version_number: number;
  version_name: string;
  creator_id: string;
  creation_date: string;
  version_notes?: string | null;
  is_current: boolean;
  quality_score?: number | null;
  approval_status: string;
}

export interface ContentBlock {
  block_id: string;
  version_id: string;
  block_type: string; // e.g., 'text', 'markdown', 'image_url'
  content_data: any; // JSONB or text depending on block_type
  display_order: number;
  last_modified: string;
  modified_by: string;
}


// --- Existing createProject function ---
export const createProject = async (details: CreateProjectDetails): Promise<string> => {
  // ... (setup logic) ...
  const { userId, projectName, category, subcategory, section, item } = details;
  const projectType = `${category.id}:${subcategory.id}:${section.id}:${item.id}`;
  const moduleType = `${section.id}:${item.id}`;

  // --- 1. Insert into 'projects' table ---
  const { data: projectData, error: projectError } = await supabase
    .from('projects')
    .insert({
      user_id: userId,
      project_name: projectName,
      project_type: projectType,
      creation_date: new Date().toISOString(),
      last_modified: new Date().toISOString(),
      status: 'Draft',
      default_template_id: null,
      setup_details: null, // RE-ADDED initialization
    })
    .select('project_id')
    .single();

  // ... (error handling) ...
  if (projectError || !projectData) {
    console.error('Error creating project:', projectError);
    throw new Error(`Failed to create project: ${projectError?.message || 'Unknown error'}`);
  }
  const newProjectId = projectData.project_id;


  // ... (module, version, block insertion logic remains the same) ...
    // --- 2. Insert into 'content_modules' table ---
  const { data: moduleData, error: moduleError } = await supabase
    .from('content_modules')
    .insert({
      project_id: newProjectId,
      module_name: item.name,
      module_type: moduleType,
      display_order: 1,
      creation_date: new Date().toISOString(),
      last_modified: new Date().toISOString(),
      status: 'Draft',
    })
    .select('module_id')
    .single();

  if (moduleError || !moduleData) {
    console.error('Error creating content module:', moduleError);
    throw new Error(`Failed to create content module: ${moduleError?.message || 'Unknown error'}`);
  }
  const newModuleId = moduleData.module_id;

  // --- 3. Insert into 'versions' table ---
  const { data: versionData, error: versionError } = await supabase
    .from('versions')
    .insert({
      module_id: newModuleId,
      version_number: 1,
      version_name: 'Initial Draft',
      creator_id: userId,
      creation_date: new Date().toISOString(),
      is_current: true,
      approval_status: 'Draft',
    })
    .select('version_id')
    .single();

  if (versionError || !versionData) {
    console.error('Error creating initial version:', versionError);
    throw new Error(`Failed to create initial version: ${versionError?.message || 'Unknown error'}`);
  }
  const newVersionId = versionData.version_id;

  // --- 4. Insert initial 'content_blocks' ---
  const { error: blockError } = await supabase
    .from('content_blocks')
    .insert({
        version_id: newVersionId,
        block_type: 'markdown',
        content_data: { text: '' },
        display_order: 1,
        last_modified: new Date().toISOString(),
        modified_by: userId,
    });

   if (blockError) {
      console.error('Error creating initial content block:', blockError);
   }


  console.log(`Successfully created project structure for project ID: ${newProjectId}`);
  return newProjectId;
};


// --- Existing Fetching Functions ---

/** Fetches project details by ID */
export const getProjectById = async (projectId: string): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*, setup_details') // RE-ADDED selection of setup_details
    .eq('project_id', projectId)
    .single();

  if (error) {
    console.error(`Error fetching project ${projectId}:`, error);
    throw error;
  }
  return data;
};

// ... (getModulesByProjectId, getCurrentVersionByModuleId, getContentBlocksByVersionId remain the same) ...
export const getModulesByProjectId = async (projectId: string): Promise<ContentModule[]> => {
  const { data, error } = await supabase
    .from('content_modules')
    .select('*')
    .eq('project_id', projectId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error(`Error fetching modules for project ${projectId}:`, error);
    throw error;
  }
  return data || [];
};

export const getCurrentVersionByModuleId = async (moduleId: string): Promise<Version | null> => {
  const { data, error } = await supabase
    .from('versions')
    .select('*')
    .eq('module_id', moduleId)
    .eq('is_current', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
        return null;
    }
    console.error(`Error fetching current version for module ${moduleId}:`, error);
    throw error;
  }
  return data;
};

export const getContentBlocksByVersionId = async (versionId: string): Promise<ContentBlock[]> => {
  const { data, error } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('version_id', versionId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error(`Error fetching content blocks for version ${versionId}:`, error);
    throw error;
  }
  return data || [];
};


// --- Existing Update Function ---
export const updateContentBlock = async (blockId: string, htmlContent: string, userId: string): Promise<ContentBlock | null> => {
    const newContentData = { text: htmlContent };
    const { data, error } = await supabase
        .from('content_blocks')
        .update({
            content_data: newContentData,
            last_modified: new Date().toISOString(),
            modified_by: userId,
        })
        .eq('block_id', blockId)
        .select()
        .single();

    if (error) {
        console.error(`Error updating content block ${blockId}:`, error);
        throw error;
    }
    return data;
};


// --- RE-ADD Function to Update Setup Details ---

/**
 * Updates the setup_details (JSONB) and default_template_id for a project.
 * @param projectId The ID of the project to update.
 * @param setupData An object containing the setup details (e.g., { audience: '...', industry: '...' }).
 * @param templateId The selected template ID.
 * @returns The updated project data.
 * @throws If the database operation fails.
 */
export const updateProjectSetupDetails = async (
    projectId: string,
    setupData: Record<string, any>,
    templateId: string | null // Allow null if no template selected
): Promise<Project | null> => {
    const { data, error } = await supabase
        .from('projects')
        .update({
            setup_details: setupData,
            default_template_id: templateId,
            last_modified: new Date().toISOString(), // Update last modified timestamp
        })
        .eq('project_id', projectId)
        .select('*, setup_details') // Return the updated project data including setup_details
        .single();

    if (error) {
        console.error(`Error updating setup details for project ${projectId}:`, error);
        throw error;
    }
    return data;
};


// --- NEW Function to Fetch Versions ---

/** Fetches all versions for a given module ID, ordered by version number */
export const getVersionsByModuleId = async (moduleId: string): Promise<Version[]> => {
  const { data, error } = await supabase
    .from('versions')
    .select('*')
    .eq('module_id', moduleId)
    .order('version_number', { ascending: false }); // Show newest first

  if (error) {
    console.error(`Error fetching versions for module ${moduleId}:`, error);
    throw error;
  }
  return data || [];
};


// Add other project-related service functions here as needed