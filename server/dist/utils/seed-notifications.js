"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserNotification = exports.seedNotifications = void 0;
const supabase_1 = require("../services/supabase");
const logger_1 = __importDefault(require("./logger"));
/**
 * Seeds initial notifications for testing and demonstration
 */
const seedNotifications = async () => {
    try {
        // Check if notifications table exists and has data
        const { data: existingNotifications, error: checkError } = await supabase_1.supabaseAdmin
            .from('notifications')
            .select('id')
            .limit(1);
        if (checkError) {
            logger_1.default.error('Error checking existing notifications:', checkError);
            return;
        }
        // If notifications already exist, skip seeding
        if (existingNotifications && existingNotifications.length > 0) {
            logger_1.default.info('Notifications already exist, skipping seed');
            return;
        }
        // Get all users to create sample notifications for each
        const { data: users, error: usersError } = await supabase_1.supabaseAdmin.auth.admin.listUsers();
        if (usersError) {
            logger_1.default.error('Error fetching users for notification seeding:', usersError);
            return;
        }
        if (!users.users || users.users.length === 0) {
            logger_1.default.info('No users found, skipping notification seeding');
            return;
        }
        const sampleNotifications = [
            {
                title: "Introducing AI-Powered Book Generation 2.0",
                message: "We've revolutionized how books are created with our latest AI models. Experience 40% faster generation, enhanced character development, and seamless plot structuring. Your stories just got more compelling.\n\nKey improvements:\n• Advanced narrative AI with improved dialogue generation\n• Smart chapter transitions that maintain story flow\n• Enhanced genre-specific writing styles\n• Real-time collaboration features for co-authors\n\nReady to create your next bestseller? Start a new book project today and experience the future of AI-assisted writing.",
                type: "product-update",
                link: "/new-book",
                read: false
            },
            {
                title: "New Export Formats Now Available",
                message: "Your books can now be exported in multiple professional formats including EPUB, MOBI, and enhanced PDF with custom styling options.\n\nNew features include:\n• Professional EPUB formatting\n• Kindle-compatible MOBI export\n• Custom PDF themes and layouts\n• Batch export for multiple books\n\nPerfect for self-publishing on Amazon, Apple Books, and other platforms.",
                type: "feature",
                link: "/book-library",
                read: false
            },
            {
                title: "Writing Tip: Creating Compelling Characters",
                message: "Great characters are the heart of any story. Here's how to create memorable protagonists that readers will connect with:\n\nKey strategies:\n• Give characters clear motivations and goals\n• Create realistic flaws and strengths\n• Develop unique speaking patterns and mannerisms\n• Show character growth throughout the story\n\nOur AI can help you develop these character traits when you provide detailed character descriptions in your book outline.",
                type: "tip",
                link: null,
                read: false
            }
        ];
        // Create notifications for each user
        for (const user of users.users) {
            for (const notification of sampleNotifications) {
                const { error: insertError } = await supabase_1.supabaseAdmin
                    .from('notifications')
                    .insert({
                    user_id: user.id,
                    title: notification.title,
                    message: notification.message,
                    type: notification.type,
                    link: notification.link,
                    read: notification.read
                });
                if (insertError) {
                    logger_1.default.error(`Error creating notification for user ${user.id}:`, insertError);
                }
            }
        }
        logger_1.default.info(`Successfully seeded notifications for ${users.users.length} users`);
    }
    catch (error) {
        logger_1.default.error('Unexpected error seeding notifications:', error);
    }
};
exports.seedNotifications = seedNotifications;
/**
 * Creates a single notification for a specific user
 */
const createUserNotification = async (userId, title, message, type = 'info', link) => {
    try {
        const { error } = await supabase_1.supabaseAdmin
            .from('notifications')
            .insert({
            user_id: userId,
            title,
            message,
            type,
            link,
            read: false
        });
        if (error) {
            logger_1.default.error('Error creating user notification:', error);
            return false;
        }
        return true;
    }
    catch (error) {
        logger_1.default.error('Unexpected error creating user notification:', error);
        return false;
    }
};
exports.createUserNotification = createUserNotification;
