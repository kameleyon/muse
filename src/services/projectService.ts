import { addToast } from '@/store/slices/uiSlice'; // For showing notifications
import { store } from '@/store/store'; // Corrected store import path

interface ProjectData {
  projectName: string;
  description?: string;
  privacy?: 'private' | 'team' | 'public';
  tags?: string[];
  teamMembers?: string[]; // Add teamMembers
  pitchDeckTypeId?: string | null; // Add pitchDeckTypeId (allow null)
  // Add other fields as needed
}

interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  privacy: string;
  tags: string[] | null;
  team_members: string[] | null; // Added team_members
  pitch_deck_type_id: string | null; // Added pitch_deck_type_id
  created_at: string;
  updated_at: string;
  // Add other fields returned by the backend
}

interface CreateProjectResponse {
  message: string;
  project: Project;
}

// Interface for file upload response (adjust as needed based on backend)
interface UploadFileResponse {
    message: string;
    filePath?: string; // Example: path where file is stored
}


// Helper to get the auth token from supabase
const getAuthToken = (): string | null => {
  try {
    // Get from localStorage where Supabase client stores the token
    const supabaseData = localStorage.getItem('supabase.auth.token');
    if (supabaseData) {
      const parsed = JSON.parse(supabaseData);
      return parsed.currentSession?.access_token || null;
    }
    return null;
  } catch (error) {
    console.error("Error retrieving auth token:", error);
    return null;
  }
};


/**
 * Creates a new project by sending data to the backend using fetch.
 * @param projectData - The data for the new project.
 * @returns The created project data or null if an error occurred.
 */
export const createProjectAPI = async (projectData: ProjectData): Promise<Project | null> => {
  // Use relative API URL to work with any port the server is running on
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'; // Use relative path for same-origin requests
  const url = `${apiBaseUrl}/projects`;
  const token = getAuthToken(); // Get auth token if needed

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    console.log(`Creating project with data:`, projectData);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(projectData),
    });
    
    console.log(`Server response status: ${response.status}`);
    
    // First check if the response has content
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`Server returned non-JSON response: ${contentType}`);
      store.dispatch(
        addToast({
          type: 'error',
          message: `Server returned invalid response format: ${response.status} ${response.statusText}`
        })
      );
      return null;
    }
    
    // Try to parse the JSON safely
    let responseData;
    try {
      const text = await response.text();
      console.log(`Raw response: ${text}`);
      responseData = text ? JSON.parse(text) : null;
    } catch (parseError) {
      console.error("Failed to parse server response:", parseError);
      store.dispatch(
        addToast({ type: 'error', message: 'Server returned invalid JSON data' })
      );
      return null;
    }
    
    if (response.ok && responseData && 'project' in responseData) {
      store.dispatch(
        addToast({ type: 'success', message: 'Project created successfully!' })
      );
      console.log("Project created:", responseData.project);
      return responseData.project;
    } else {
      // Handle API errors (both network and application-level)
      const errorMessage = responseData && 'message' in responseData
        ? responseData.message
        : `HTTP error! status: ${response.status}`;
        
      console.error("Error creating project:", responseData);
      store.dispatch(
        addToast({ type: 'error', message: errorMessage })
      );
      return null;
    }
  } catch (error: any) {
    console.error("Network or unexpected error creating project:", error);
    store.dispatch(
      addToast({ type: 'error', message: `Network error: ${error.message || 'Unknown error'}` })
    );
    return null;
  }
};

/**
 * Uploads a file for a specific project.
 * @param projectId - The ID of the project to associate the file with.
 * @param file - The File object to upload.
 * @returns Information about the uploaded file or null on error.
 */
export const uploadProjectFile = async (projectId: string, file: File): Promise<UploadFileResponse | null> => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'; // Use relative path for same-origin requests
    const url = `${apiBaseUrl}/projects/${projectId}/upload`; // Define upload endpoint
    const token = getAuthToken();

    const formData = new FormData();
    formData.append('file', file); // 'file' should match the name expected by the backend middleware (e.g., multer)

    const headers: HeadersInit = {}; // Don't set Content-Type for FormData, browser does it with boundary
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: formData,
        });

        const responseData: UploadFileResponse | { message: string; error?: string } = await response.json();

        if (response.ok) {
            store.dispatch(
                addToast({ type: 'success', message: responseData.message || 'File uploaded successfully!' })
            );
            return responseData;
        } else {
            const errorMessage = 'message' in responseData ? responseData.message : `HTTP error! status: ${response.status}`;
            console.error("Error uploading file:", responseData);
            store.dispatch(
                addToast({ type: 'error', message: errorMessage })
            );
            return null;
        }
    } catch (error: any) {
        console.error("Network or unexpected error uploading file:", error);
        store.dispatch(
            addToast({ type: 'error', message: 'An unexpected network error occurred during file upload.' })
        );
        return null;
    }
};


/**
 * Gets a project by ID.
 * @param projectId - The ID of the project to retrieve.
 * @returns The project data or null if an error occurred.
 */
export const getProjectAPI = async (projectId: string): Promise<Project | null> => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'; // Use relative path for same-origin requests
  const url = `${apiBaseUrl}/projects/${projectId}`;
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching project:", errorData);
      store.dispatch(
        addToast({ type: 'error', message: errorData.message || `HTTP error! status: ${response.status}` })
      );
      return null;
    }

    const responseData = await response.json();
    return responseData.project;
  } catch (error: any) {
    console.error("Network or unexpected error fetching project:", error);
    store.dispatch(
      addToast({ type: 'error', message: 'An unexpected network error occurred.' })
    );
    return null;
  }
};

/**
 * Updates an existing project with new data.
 * @param projectId - The ID of the project to update.
 * @param projectData - The updated data for the project.
 * @returns The updated project data or null if an error occurred.
 */
export const updateProjectAPI = async (projectId: string, projectData: Partial<ProjectData>): Promise<Project | null> => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'; // Use relative path for same-origin requests
  const url = `${apiBaseUrl}/projects/${projectId}`;
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error updating project:", errorData);
      store.dispatch(
        addToast({ type: 'error', message: errorData.message || `HTTP error! status: ${response.status}` })
      );
      return null;
    }

    const responseData = await response.json();
    store.dispatch(
      addToast({ type: 'success', message: 'Project updated successfully!' })
    );
    return responseData.project;
  } catch (error: any) {
    console.error("Network or unexpected error updating project:", error);
    store.dispatch(
      addToast({ type: 'error', message: 'An unexpected network error occurred.' })
    );
    return null;
  }
};

/**
 * Deletes a project by ID.
 * @param projectId - The ID of the project to delete.
 * @returns True if deletion was successful, false otherwise.
 */
export const deleteProjectAPI = async (projectId: string): Promise<boolean> => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'; // Use relative path for same-origin requests
  const url = `${apiBaseUrl}/projects/${projectId}`;
  const token = getAuthToken();

  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error deleting project:", errorData);
      store.dispatch(
        addToast({ type: 'error', message: errorData.message || `HTTP error! status: ${response.status}` })
      );
      return false;
    }

    store.dispatch(
      addToast({ type: 'success', message: 'Project deleted successfully!' })
    );
    return true;
  } catch (error: any) {
    console.error("Network or unexpected error deleting project:", error);
    store.dispatch(
      addToast({ type: 'error', message: 'An unexpected network error occurred.' })
    );
    return false;
  }
};

/**
 * Gets all projects for the current user.
 * @param options - Optional parameters for filtering and pagination.
 * @returns An array of projects or null if an error occurred.
 */
export const getAllProjectsAPI = async (options: {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  pitchDeckTypeId?: string;
} = {}): Promise<{projects: Project[], meta: any} | null> => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'; // Use relative path for same-origin requests
  
  // Build query string from options
  const queryParams = new URLSearchParams();
  if (options.limit) queryParams.append('limit', options.limit.toString());
  if (options.offset) queryParams.append('offset', options.offset.toString());
  if (options.sortBy) queryParams.append('sortBy', options.sortBy);
  if (options.sortOrder) queryParams.append('sortOrder', options.sortOrder);
  if (options.pitchDeckTypeId) queryParams.append('pitchDeckTypeId', options.pitchDeckTypeId);
  
  const url = `${apiBaseUrl}/projects${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching projects:", errorData);
      store.dispatch(
        addToast({ type: 'error', message: errorData.message || `HTTP error! status: ${response.status}` })
      );
      return null;
    }

    const responseData = await response.json();
    return responseData;
  } catch (error: any) {
    console.error("Network or unexpected error fetching projects:", error);
    store.dispatch(
      addToast({ type: 'error', message: 'An unexpected network error occurred.' })
    );
    return null;
  }
};