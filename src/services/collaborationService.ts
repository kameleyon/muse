// src/services/collaborationService.ts

// Placeholder for WebSocket/API base URL
const API_BASE_URL = '/api/collaboration'; 
const WS_URL = 'wss://your-collab-server.com'; // Example WebSocket URL

// --- Interfaces ---
interface EditOperation {
  sectionId: string;
  // Define operation structure (e.g., based on OT or CRDT)
  op: any; 
  timestamp: number;
  userId: string;
}

interface Comment {
  id: string;
  sectionId?: string; // Optional: element-specific comments
  elementId?: string; // Optional: element-specific comments
  userId: string;
  timestamp: string;
  text: string;
  resolved: boolean;
  replies?: Comment[];
}

interface Notification {
  id: string;
  type: 'mention' | 'comment_reply' | 'edit_conflict' | string;
  userId: string; // User who should receive it
  timestamp: string;
  message: string;
  projectId: string;
  read: boolean;
}

// --- API Functions (using HTTP for non-realtime actions) ---

/**
 * Fetches existing comments for a project.
 * @param projectId - The ID of the project.
 * @returns Promise resolving to an array of comments.
 */
export const getComments = async (projectId: string): Promise<Comment[]> => {
  console.log('API CALL: getComments', projectId);
  // Replace with actual fetch/axios call
  await new Promise(resolve => setTimeout(resolve, 300));
  // Simulate response
  return [
    { id: 'cmt_1', sectionId: 'overview', userId: 'user_456', timestamp: new Date().toISOString(), text: 'Looks good!', resolved: false },
  ];
};

/**
 * Adds a new comment.
 * @param projectId - The ID of the project.
 * @param commentData - Data for the new comment.
 * @returns Promise resolving to the created comment.
 */
export const addComment = async (projectId: string, commentData: Omit<Comment, 'id' | 'timestamp' | 'resolved'>): Promise<Comment> => {
  console.log('API CALL: addComment', projectId, commentData);
   // Replace with actual fetch/axios call
  await new Promise(resolve => setTimeout(resolve, 250));
  // Simulate response
  return { id: `cmt_${Date.now()}`, timestamp: new Date().toISOString(), resolved: false, ...commentData };
};

/**
 * Resolves or updates a comment.
 * @param projectId - The ID of the project.
 * @param commentId - The ID of the comment.
 * @param updateData - Data to update (e.g., { resolved: true }).
 * @returns Promise resolving to the updated comment.
 */
export const updateComment = async (projectId: string, commentId: string, updateData: Partial<Comment>): Promise<Comment> => {
  console.log('API CALL: updateComment', projectId, commentId, updateData);
   // Replace with actual fetch/axios call
  await new Promise(resolve => setTimeout(resolve, 200));
   // Simulate response (need original comment data ideally)
  return { id: commentId, sectionId: 'overview', userId: 'user_456', timestamp: new Date().toISOString(), text: 'Updated text', resolved: true, ...updateData };
};

/**
 * Fetches notifications for the current user.
 * @returns Promise resolving to an array of notifications.
 */
export const getNotifications = async (): Promise<Notification[]> => {
  console.log('API CALL: getNotifications');
   // Replace with actual fetch/axios call
  await new Promise(resolve => setTimeout(resolve, 300));
   // Simulate response
  return [
    { id: 'notif_1', type: 'mention', userId: 'current_user', timestamp: new Date().toISOString(), message: 'User 456 mentioned you in Overview', projectId: 'proj_123', read: false },
  ];
};

/**
 * Marks a notification as read.
 * @param notificationId - The ID of the notification.
 * @returns Promise resolving when complete.
 */
export const markNotificationRead = async (notificationId: string): Promise<void> => {
  console.log('API CALL: markNotificationRead', notificationId);
   // Replace with actual fetch/axios call
  await new Promise(resolve => setTimeout(resolve, 150));
};


// --- WebSocket Simulation (for real-time aspects) ---

let ws: WebSocket | null = null;
let onEditReceived: ((op: EditOperation) => void) | null = null;
let onPresenceUpdate: ((update: any) => void) | null = null;

/** Connects to the collaboration WebSocket server. */
export const connectCollaborationSocket = (
  projectId: string, 
  userId: string,
  editCallback: (op: EditOperation) => void,
  presenceCallback: (update: any) => void
) => {
  console.log(`Simulating WebSocket connection for project ${projectId}, user ${userId}...`);
  onEditReceived = editCallback;
  onPresenceUpdate = presenceCallback;
  // In a real app:
  // ws = new WebSocket(`${WS_URL}?projectId=${projectId}&userId=${userId}`);
  // ws.onopen = () => console.log('Collaboration WS connected');
  // ws.onmessage = (event) => {
  //   const message = JSON.parse(event.data);
  //   if (message.type === 'edit') {
  //     onEditReceived?.(message.payload as EditOperation);
  //   } else if (message.type === 'presence') {
  //     onPresenceUpdate?.(message.payload);
  //   }
  // };
  // ws.onerror = (error) => console.error('Collaboration WS error:', error);
  // ws.onclose = () => console.log('Collaboration WS closed');

  // Simulate receiving presence update after connection
  setTimeout(() => {
     onPresenceUpdate?.({ users: [{ id: userId, name: 'You' }, { id: 'user_789', name: 'Collaborator' }] });
  }, 500);
   // Simulate receiving an edit from another user
   setTimeout(() => {
     onEditReceived?.({ sectionId: 'overview', op: { /* example op */ }, timestamp: Date.now(), userId: 'user_789' });
   }, 3000);
};

/** Disconnects from the collaboration WebSocket server. */
export const disconnectCollaborationSocket = () => {
  console.log('Simulating WebSocket disconnection...');
  // ws?.close();
  ws = null;
  onEditReceived = null;
  onPresenceUpdate = null;
};

/** Sends an edit operation over the WebSocket. */
export const sendEditOperation = (op: EditOperation) => {
  console.log('Simulating sending edit operation via WebSocket:', op);
  // if (ws?.readyState === WebSocket.OPEN) {
  //   ws.send(JSON.stringify({ type: 'edit', payload: op }));
  // } else {
  //   console.error('WebSocket not connected, cannot send edit.');
  // }
   // Simulate receiving own edit back (or confirmation) - depends on backend logic
   setTimeout(() => {
     // onEditReceived?.(op); // Or handle confirmation message
   }, 100);
};

// Add more functions as needed (manage locks, sync activity, etc.)