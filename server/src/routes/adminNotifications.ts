import express from 'express';
import { auth } from '../middleware/auth';
import { supabaseAdmin } from '../services/supabase';
import { createUserNotification } from '../utils/seed-notifications';
import logger from '../utils/logger';

const router = express.Router();

// Get all notifications (admin view)
router.get('/admin/notifications', auth, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching admin notifications:', error);
      return res.status(500).json({ error: 'Failed to fetch notifications' });
    }

    res.json(data);
  } catch (error) {
    logger.error('Unexpected error in admin notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create notification for all users
router.post('/admin/notifications/broadcast', auth, async (req, res) => {
  try {
    const { title, message, type = 'announcement', link } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    // Get all users
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) {
      logger.error('Error fetching users for broadcast:', usersError);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    let successCount = 0;
    let errorCount = 0;

    // Create notification for each user
    for (const user of users.users) {
      const success = await createUserNotification(user.id, title, message, type, link);
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
    }

    logger.info(`Broadcast notification created for ${successCount} users, ${errorCount} errors`);
    
    res.json({ 
      success: true, 
      message: `Notification sent to ${successCount} users`,
      successCount,
      errorCount
    });
  } catch (error) {
    logger.error('Unexpected error in broadcast notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create notification for specific user
router.post('/admin/notifications', auth, async (req, res) => {
  try {
    const { userId, title, message, type = 'announcement', link } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({ error: 'User ID, title, and message are required' });
    }

    const success = await createUserNotification(userId, title, message, type, link);
    
    if (success) {
      res.json({ success: true, message: 'Notification created successfully' });
    } else {
      res.status(500).json({ error: 'Failed to create notification' });
    }
  } catch (error) {
    logger.error('Unexpected error creating admin notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update notification
router.put('/admin/notifications/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, type, link } = req.body;

    const { error } = await supabaseAdmin
      .from('notifications')
      .update({
        title,
        message,
        type,
        link: link || null
      })
      .eq('id', id);

    if (error) {
      logger.error('Error updating notification:', error);
      return res.status(500).json({ error: 'Failed to update notification' });
    }

    res.json({ success: true, message: 'Notification updated successfully' });
  } catch (error) {
    logger.error('Unexpected error updating notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete notification
router.delete('/admin/notifications/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Error deleting notification:', error);
      return res.status(500).json({ error: 'Failed to delete notification' });
    }

    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    logger.error('Unexpected error deleting notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;