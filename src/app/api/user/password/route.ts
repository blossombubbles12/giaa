import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { users, notifications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const parsed = passwordSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 });
        }

        const { currentPassword, newPassword } = parsed.data;

        // Verify current password
        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id)
        });

        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            return NextResponse.json({ message: 'Incorrect current password' }, { status: 401 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.update(users)
            .set({ password: hashedPassword, updatedAt: new Date() })
            .where(eq(users.id, session.user.id));

        // Create a notification
        await db.insert(notifications).values({
            userId: session.user.id,
            title: 'Security Update',
            message: 'Your cryptographic vault key (password) has been successfully rotated.',
            type: 'WARNING'
        });

        return NextResponse.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
