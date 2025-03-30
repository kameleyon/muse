export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

export const sampleNotifications: NotificationItem[] = [
    { id: 'not1', title: 'New Comment', message: 'John commented on your Fantasy Novel', timestamp: new Date().toISOString(), read: false },
    { id: 'not2', title: 'Template Update', message: 'Character Template has been updated', timestamp: new Date().toISOString(), read: false },
    { id: 'not3', title: 'Plan Renewal', message: 'Your subscription will renew in 3 days', timestamp: new Date(Date.now() - 86400000).toISOString(), read: true },
    { id: 'not4', title: 'Team Invitation', message: 'You have been invited to join the Fiction Writers team', timestamp: new Date(Date.now() - 172800000).toISOString(), read: true }
];