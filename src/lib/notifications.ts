import { db } from '@/db';
import { notifications } from '@/db/schema';

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

export async function createNotification({
    userId,
    title,
    message,
    type = 'INFO',
    link,
}: {
    userId: string;
    title: string;
    message: string;
    type?: NotificationType;
    link?: string;
}) {
    try {
        const [notification] = await db.insert(notifications).values({
            userId,
            title,
            message,
            type,
            link,
        }).returning();
        return notification;
    } catch (error) {
        console.error('Failed to create notification:', error);
        return null;
    }
}

export async function createAdminNotification({
    title,
    message,
    type = 'INFO',
    link,
}: {
    title: string;
    message: string;
    type?: NotificationType;
    link?: string;
}) {
    // In a real app, you'd fetch all admin IDs and notify them
    // For now, we'll assume there's at least one admin seeded
    // and we can find them. This is a placeholder for a more robust multi-admin system.
    const admins = await db.query.users.findMany({
        where: (u: any, { eq }: any) => eq(u.role, 'ADMIN'),
    });

    for (const admin of admins) {
        await createNotification({
            userId: admin.id,
            title,
            message,
            type,
            link,
        });
    }
}
