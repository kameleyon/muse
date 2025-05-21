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
        const { projectName, projectType, description, privacy = 'private', tags = [], teamMembers = [], pitchDeckTypeId } = req.body;
        // @ts-ignore // Access user from the request object (added by auth middleware)
        const userId = req.user?.id || 'mock-user-id';
        // Debug user ID and auth
        logger_1.default.info(`User ID from request: ${userId}`);
        // Verify current user with supabaseClient
        try {
            const { data: authData, error: authError } = await supabase_1.supabaseClient.auth.getUser();
            if (authError) {
                logger_1.default.error(`Auth verification error: ${authError.message}`);
            }
            else if (authData.user) {
                logger_1.default.info(`Current supabaseClient auth user: ${authData.user.id}`);
            }
            else {
                logger_1.default.warn('No current user in supabaseClient');
            }
        }
        catch (e) {
            logger_1.default.error(`Error checking auth: ${e instanceof Error ? e.message : String(e)}`);
        }
        if (!userId) {
            logger_1.default.warn('Attempted to create project without authenticated user');
            return res.status(401).json({ message: 'User not authenticated' });
        }
        if (!projectName) {
            return res.status(400).json({ message: 'Project name is required' });
        }
        if (!projectType) {
            return res.status(400).json({ message: 'Project type is required' });
        }
        logger_1.default.info(`Creating project "${projectName}" (Type: ${projectType}) for user ${userId}`);
        // Convert values to appropriate types if needed
        const processedTags = Array.isArray(tags) ? tags : [];
        const processedTeamMembers = Array.isArray(teamMembers) ? teamMembers : [];
        // Log the data we're inserting
        logger_1.default.info(`Inserting data: ${JSON.stringify({
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
            const projectPayload = {
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
            logger_1.default.info(`Inserting project with payload: ${JSON.stringify(projectPayload)}`);
            // Try using admin client to bypass RLS
            logger_1.default.info('Using admin client to create project with service role token');
            const { data, error } = await supabase_1.supabaseAdmin
                .from('projects')
                .insert([projectPayload])
                .select()
                .single();
            if (error) {
                // If admin client fails, throw error to be caught by outer catch
                logger_1.default.error(`Supabase admin client error: ${error.message}`);
                logger_1.default.error(`Error details: ${JSON.stringify(error)}`);
                throw error;
            }
            if (!data) {
                logger_1.default.error('No data returned from database');
                throw new Error('No data returned from database');
            }
            logger_1.default.info(`Project created successfully with ID: ${data.id}`);
            return res.status(201).json({ message: 'Project created successfully', project: data });
        }
        catch (dbError) {
            // Return the database error without mock data
            logger_1.default.error(`Database error creating project: ${dbError}`);
            return res.status(500).json({
                message: 'Failed to create project in database',
                error: dbError instanceof Error ? dbError.message : String(dbError)
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
