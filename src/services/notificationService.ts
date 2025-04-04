import { supabase } from './supabase'; // Import the Supabase client instance
import { addToast } from '@/store/slices/uiSlice';
import { store } from '@/store/store';

// Define the Notification type based on NotificationsPanel.tsx
export interface Notification {
  id: string; // Assuming UUID from Supabase
  user_id: string; // Assuming it's linked to a user
  title: string;
  message: string;
  timestamp: string; // Supabase timestampz
  read: boolean;
  created_at: string; // Supabase default timestamp
  // Add any other relevant fields from your DB schema
  link?: string; // Optional link for the notification
  type?: string; // Optional type (e.g., 'comment', 'invitation', 'system')
}

/**
 * Fetches notifications for the current user from the Supabase 'notifications' table.
 * @param options - Optional parameters like limit.
 * @returns An array of notifications or null if an error occurred.
 */
export const getNotificationsAPI = async (options: {
  limit?: number;
  unreadOnly?: boolean;
} = {}): Promise<Notification[] | null> => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Error getting Supabase session:", sessionError);
      store.dispatch(addToast({ type: 'error', message: 'Authentication error.' }));
      return null;
    }
    if (!session?.user) {
      console.log("No active user session found.");
      // store.dispatch(addToast({ type: 'info', message: 'Please log in to see notifications.' }));
      return []; // Return empty array if not logged in
    }

    const userId = session.user.id;

    let query = supabase
      .from('notifications') // Assuming your table is named 'notifications'
      .select('*')
      .eq('user_id', userId) // Filter by the current user's ID
      .order('created_at', { ascending: false }); // Order by creation date, newest first

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.unreadOnly) {
      query = query.eq('read', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching notifications:", error);
      store.dispatch(
        addToast({ type: 'error', message: `Failed to fetch notifications: ${error.message}` })
      );
      return null;
    }

    // Ensure data conforms to the Notification interface (optional, for safety)
    // You might need type casting or validation depending on strictness
    return data as Notification[];

  } catch (error: any) {
    console.error("Unexpected error fetching notifications:", error);
    store.dispatch(
      addToast({ type: 'error', message: 'An unexpected error occurred while fetching notifications.' })
    );
    return null;
  }
};

/**
 * Marks a specific notification as read.
 * @param notificationId - The ID of the notification to mark as read.
 * @returns True if successful, false otherwise.
 */
export const markNotificationAsReadAPI = async (notificationId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notificationId);

        if (error) {
            console.error("Error marking notification as read:", error);
            store.dispatch(addToast({ type: 'error', message: `Failed to update notification: ${error.message}` }));
            return false;
        }
        return true;
    } catch (error: any) {
        console.error("Unexpected error updating notification:", error);
        store.dispatch(addToast({ type: 'error', message: 'An unexpected error occurred.' }));
        return false;
    }
};

/**
 * Marks all unread notifications for the current user as read.
 * @returns True if successful, false otherwise.
 */
export const markAllNotificationsAsReadAPI = async (): Promise<boolean> => {
    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session?.user) {
            console.error("Error getting session or no user:", sessionError);
            store.dispatch(addToast({ type: 'error', message: 'Authentication error.' }));
            return false;
        }
        const userId = session.user.id;

        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', userId)
            .eq('read', false); // Only update unread ones

        if (error) {
            console.error("Error marking all notifications as read:", error);
            store.dispatch(addToast({ type: 'error', message: `Failed to update notifications: ${error.message}` }));
            return false;
        }
        // Optionally dispatch a success toast
        // store.dispatch(addToast({ type: 'success', message: 'All notifications marked as read.' }));
        return true;
    } catch (error: any) {
        console.error("Unexpected error updating notifications:", error);
        store.dispatch(addToast({ type: 'error', message: 'An unexpected error occurred.' }));
        return false;
    }
};
