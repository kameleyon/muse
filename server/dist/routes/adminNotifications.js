"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const supabase_1 = require("../services/supabase");
const seed_notifications_1 = require("../utils/seed-notifications");
const logger_1 = __importDefault(require("../utils/logger"));
const router = express_1.default.Router();
// Get all notifications (admin view)
router.get('/admin/notifications', auth_1.auth, async (req, res) => {
    try {
        const { data, error } = await supabase_1.supabaseAdmin
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            logger_1.default.error('Error fetching admin notifications:', error);
            return res.status(500).json({ error: 'Failed to fetch notifications' });
        }
        res.json(data);
    }
    catch (error) {
        logger_1.default.error('Unexpected error in admin notifications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Create notification for all users
router.post('/admin/notifications/broadcast', auth_1.auth, async (req, res) => {
    try {
        const { title, message, type = 'announcement', link } = req.body;
        if (!title || !message) {
            return res.status(400).json({ error: 'Title and message are required' });
        }
        // Get all users
        const { data: users, error: usersError } = await supabase_1.supabaseAdmin.auth.admin.listUsers();
        if (usersError) {
            logger_1.default.error('Error fetching users for broadcast:', usersError);
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
        let successCount = 0;
        let errorCount = 0;
        // Create notification for each user
        for (const user of users.users) {
            const success = await (0, seed_notifications_1.createUserNotification)(user.id, title, message, type, link);
            if (success) {
                successCount++;
            }
            else {
                errorCount++;
            }
        }
        logger_1.default.info(`Broadcast notification created for ${successCount} users, ${errorCount} errors`);
        res.json({
            success: true,
            message: `Notification sent to ${successCount} users`,
            successCount,
            errorCount
        });
    }
    catch (error) {
        logger_1.default.error('Unexpected error in broadcast notification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Create notification for specific user
router.post('/admin/notifications', auth_1.auth, async (req, res) => {
    try {
        const { userId, title, message, type = 'announcement', link } = req.body;
        if (!userId || !title || !message) {
            return res.status(400).json({ error: 'User ID, title, and message are required' });
        }
        const success = await (0, seed_notifications_1.createUserNotification)(userId, title, message, type, link);
        if (success) {
            res.json({ success: true, message: 'Notification created successfully' });
        }
        else {
            res.status(500).json({ error: 'Failed to create notification' });
        }
    }
    catch (error) {
        logger_1.default.error('Unexpected error creating admin notification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Update notification
router.put('/admin/notifications/:id', auth_1.auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, message, type, link } = req.body;
        const { error } = await supabase_1.supabaseAdmin
            .from('notifications')
            .update({
            title,
            message,
            type,
            link: link || null
        })
            .eq('id', id);
        if (error) {
            logger_1.default.error('Error updating notification:', error);
            return res.status(500).json({ error: 'Failed to update notification' });
        }
        res.json({ success: true, message: 'Notification updated successfully' });
    }
    catch (error) {
        logger_1.default.error('Unexpected error updating notification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Delete notification
router.delete('/admin/notifications/:id', auth_1.auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase_1.supabaseAdmin
            .from('notifications')
            .delete()
            .eq('id', id);
        if (error) {
            logger_1.default.error('Error deleting notification:', error);
            return res.status(500).json({ error: 'Failed to delete notification' });
        }
        res.json({ success: true, message: 'Notification deleted successfully' });
    }
    catch (error) {
        logger_1.default.error('Unexpected error deleting notification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
