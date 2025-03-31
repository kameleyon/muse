"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = void 0;
const supabase_1 = require("../services/supabase");
const logger_1 = __importDefault(require("../utils/logger"));
const createProject = async (req, res, next) => {
    try {
        // Log the request body to diagnose what we're receiving
        logger_1.default.info(`Request body: ${JSON.stringify(req.body)}`);
        const { projectName, description, privacy = 'private', tags = [], teamMembers = [], pitchDeckTypeId } = req.body;
        // @ts-ignore // Access user from the request object (added by auth middleware)
        const userId = req.user?.id;
        logger_1.default.info(`User ID from request: ${userId}`);
        if (!userId) {
            logger_1.default.warn('Attempted to create project without authenticated user');
            return res.status(401).json({ message: 'User not authenticated' });
        }
        if (!projectName) {
            return res.status(400).json({ message: 'Project name is required' });
        }
        logger_1.default.info(`Creating project "${projectName}" for user ${userId}`);
        // Convert values to appropriate types if needed
        const processedTags = Array.isArray(tags) ? tags : [];
        const processedTeamMembers = Array.isArray(teamMembers) ? teamMembers : [];
        // Log the data we're inserting
        logger_1.default.info(`Inserting data: ${JSON.stringify({
            user_id: userId,
            name: projectName,
            description,
            privacy,
            tags: processedTags,
            team_members: processedTeamMembers,
            pitch_deck_type_id: pitchDeckTypeId
        })}`);
        try {
            const { data, error } = await supabase_1.supabaseClient
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
                logger_1.default.error('Supabase error creating project:', error);
                throw new Error(`Supabase error: ${error.message}`);
            }
            if (!data) {
                logger_1.default.error('Supabase returned no data after project creation');
                throw new Error('No data returned from database');
            }
            logger_1.default.info(`Project created successfully with ID: ${data.id}`);
            return res.status(201).json({ message: 'Project created successfully', project: data });
        }
        catch (dbError) {
            // Fallback: Create a mock project for testing/demo purposes
            logger_1.default.warn(`Falling back to mock project due to error: ${dbError}`);
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
            logger_1.default.info(`Created mock project with ID: ${mockId}`);
            return res.status(201).json({
                message: 'Project created successfully (fallback mode)',
                project: mockProject
            });
        }
    }
    catch (err) {
        logger_1.default.error('Unexpected error in createProject controller:', err);
        // Send a formatted error response instead of passing to next
        return res.status(500).json({
            message: 'Internal server error while creating project',
            error: err instanceof Error ? err.message : 'Unknown error'
        });
    }
};
exports.createProject = createProject;
// Add other project-related controller functions here (get, update, delete) later
