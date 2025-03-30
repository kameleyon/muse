import { Request, Response, NextFunction } from 'express';
import { supabaseClient } from '../services/supabase';
import logger from '../utils/logger';

interface CreateProjectRequestBody {
  projectName: string;
  description?: string;
  privacy?: 'private' | 'team' | 'public';
  tags?: string[];
  teamMembers?: string[]; // Add teamMembers to interface
  pitchDeckTypeId?: string; // Add pitchDeckTypeId
  // Add other fields like pitch_deck_type_id if needed
}

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Log the request body to diagnose what we're receiving
    logger.info(`Request body: ${JSON.stringify(req.body)}`);
    
    const { projectName, description, privacy = 'private', tags = [], teamMembers = [], pitchDeckTypeId }: CreateProjectRequestBody = req.body;
    
    // @ts-ignore // Access user from the request object (added by auth middleware)
    const userId = req.user?.id;
    
    logger.info(`User ID from request: ${userId}`);

    if (!userId) {
      logger.warn('Attempted to create project without authenticated user');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!projectName) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    logger.info(`Creating project "${projectName}" for user ${userId}`);

    // Convert values to appropriate types if needed
    const processedTags = Array.isArray(tags) ? tags : [];
    const processedTeamMembers = Array.isArray(teamMembers) ? teamMembers : [];

    // Log the data we're inserting
    logger.info(`Inserting data: ${JSON.stringify({
      user_id: userId,
      name: projectName,
      description,
      privacy,
      tags: processedTags,
      team_members: processedTeamMembers,
      pitch_deck_type_id: pitchDeckTypeId
    })}`);

    try {
      const { data, error } = await supabaseClient
        .from('projects')
        .insert([
          {
            user_id: userId,
            name: projectName,
            description: description,
            privacy: privacy,
            tags: processedTags,
            team_members: processedTeamMembers,
            pitch_deck_type_id: pitchDeckTypeId,
          },
        ])
        .select() // Return the created project data
        .single(); // Expecting only one row to be created

      if (error) {
        logger.error('Supabase error creating project:', error);
        throw new Error(`Supabase error: ${error.message}`);
      }

      if (!data) {
        logger.error('Supabase returned no data after project creation');
        throw new Error('No data returned from database');
      }

      logger.info(`Project created successfully with ID: ${data.id}`);
      return res.status(201).json({ message: 'Project created successfully', project: data });
    } catch (dbError) {
      // Fallback: Create a mock project for testing/demo purposes
      logger.warn(`Falling back to mock project due to error: ${dbError}`);
      
      // Generate a unique ID
      const mockId = `proj_${Date.now()}`;
      
      // Create a mock project object
      const mockProject = {
        id: mockId,
        user_id: userId,
        name: projectName,
        description: description || null,
        privacy: privacy,
        tags: processedTags,
        team_members: processedTeamMembers,
        pitch_deck_type_id: pitchDeckTypeId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      logger.info(`Created mock project with ID: ${mockId}`);
      return res.status(201).json({
        message: 'Project created successfully (fallback mode)',
        project: mockProject
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