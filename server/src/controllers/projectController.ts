import { Request, Response, NextFunction } from 'express';
import { supabaseClient, supabaseAdmin } from '../services/supabase';
import logger from '../utils/logger';

interface CreateProjectRequestBody {
  projectName: string;
  description?: string;
  privacy?: 'private' | 'team' | 'public';
  tags?: string[];
  teamMembers?: string[]; // Add teamMembers to interface
  pitchDeckTypeId?: string; // Add pitchDeckTypeId
  projectType: string; // Add projectType
}

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Log the request body to diagnose what we're receiving
    logger.info(`Request body: ${JSON.stringify(req.body)}`);
    
    const { projectName, projectType, description, privacy = 'private', tags = [], teamMembers = [], pitchDeckTypeId }: CreateProjectRequestBody = req.body;
    
    // @ts-ignore // Access user from the request object (added by auth middleware)
    const userId = req.user?.id || 'mock-user-id';
    
    // Debug user ID and auth
    logger.info(`User ID from request: ${userId}`);
    
    // Verify current user with supabaseClient
    try {
      const { data: authData, error: authError } = await supabaseClient.auth.getUser();
      if (authError) {
        logger.error(`Auth verification error: ${authError.message}`);
      } else if (authData.user) {
        logger.info(`Current supabaseClient auth user: ${authData.user.id}`);
      } else {
        logger.warn('No current user in supabaseClient');
      }
    } catch (e) {
      logger.error(`Error checking auth: ${e instanceof Error ? e.message : String(e)}`);
    }

    if (!userId) {
      logger.warn('Attempted to create project without authenticated user');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!projectName) {
      return res.status(400).json({ message: 'Project name is required' });
    }
    if (!projectType) {
      return res.status(400).json({ message: 'Project type is required' });
    }

    logger.info(`Creating project "${projectName}" (Type: ${projectType}) for user ${userId}`);

    // Convert values to appropriate types if needed
    const processedTags = Array.isArray(tags) ? tags : [];
    const processedTeamMembers = Array.isArray(teamMembers) ? teamMembers : [];

    // Log the data we're inserting
    logger.info(`Inserting data: ${JSON.stringify({
      user_id: userId,
      name: projectName, // Updated to use 'name' instead of 'project_name'
      type: projectType, // Use 'type' column (not 'project_type')
      description,
      privacy,
      tags: processedTags,
      team_members: processedTeamMembers,
      pitch_deck_type_id: pitchDeckTypeId
    })}`);

    try {
      // Create project payload with correct field names
      const projectPayload: any = {
        user_id: userId,
        name: projectName, // Updated to use 'name' instead of 'project_name'
        type: projectType, // Use 'type' column as per migration 20250409190500
        project_type: projectType, // Add project_type to match database constraints
        description: description,
        privacy: privacy,
        tags: processedTags,
        team_members: processedTeamMembers,
        pitch_deck_type_id: pitchDeckTypeId, // Add pitchDeckTypeId
        // Include setup_details directly in the initial object
        setup_details: {
          project_type: projectType
        }
      };
      
      logger.info(`Inserting project with payload: ${JSON.stringify(projectPayload)}`);
      
      // Try using admin client to bypass RLS
      logger.info('Using admin client to create project with service role token');
      const { data, error } = await supabaseAdmin
        .from('projects')
        .insert([projectPayload])
        .select()
        .single();
      
      if (error) {
        // If admin client fails, throw error to be caught by outer catch
        logger.error(`Supabase admin client error: ${error.message}`);
        logger.error(`Error details: ${JSON.stringify(error)}`);
        throw error;
      }
      
      if (!data) {
        logger.error('No data returned from database');
        throw new Error('No data returned from database');
      }
      
      logger.info(`Project created successfully with ID: ${data.id}`);
      return res.status(201).json({ message: 'Project created successfully', project: data });
      
    } catch (dbError) {
      // Return the database error without mock data
      logger.error(`Database error creating project: ${dbError}`);
      return res.status(500).json({
        message: 'Failed to create project in database',
        error: dbError instanceof Error ? dbError.message : String(dbError)
      });
    }

  } catch (err) {
    logger.error('Unexpected error in createProject controller:', err);
    // Send a formatted error response instead of passing to next
    return res.status(500).json({
      message: 'Internal server error while creating project',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};

// Add other project-related controller functions here (get, update, delete) later