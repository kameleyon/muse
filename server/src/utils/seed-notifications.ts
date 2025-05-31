import { supabaseAdmin } from '../services/supabase';
import logger from './logger';

/**
 * Seeds initial notifications for testing and demonstration
 */
export const seedNotifications = async (): Promise<void> => {
  try {
    // Check if notifications table exists and has data
    const { data: existingNotifications, error: checkError } = await supabaseAdmin
      .from('notifications')
      .select('id')
      .limit(1);

    if (checkError) {
      logger.error('Error checking existing notifications:', checkError);
      return;
    }

    // If notifications already exist, skip seeding
    if (existingNotifications && existingNotifications.length > 0) {
      logger.info('Notifications already exist, skipping seed');
      return;
    }

    // Get all users to create sample notifications for each
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) {
      logger.error('Error fetching users for notification seeding:', usersError);
      return;
    }

    if (!users.users || users.users.length === 0) {
      logger.info('No users found, skipping notification seeding');
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
        const { error: insertError } = await supabaseAdmin
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
          logger.error(`Error creating notification for user ${user.id}:`, insertError);
        }
      }
    }

    logger.info(`Successfully seeded notifications for ${users.users.length} users`);
  } catch (error) {
    logger.error('Unexpected error seeding notifications:', error);
  }
};

/**
 * Creates a single notification for a specific user
 */
export const createUserNotification = async (
  userId: string,
  title: string,
  message: string,
  type: string = 'info',
  link?: string
): Promise<boolean> => {
  try {
    const { error } = await supabaseAdmin
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
      logger.error('Error creating user notification:', error);
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Unexpected error creating user notification:', error);
    return false;
  }
};