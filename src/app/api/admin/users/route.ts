import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { users, testimonials, enrollments, payments, bookings, certificates, notifications } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { createAdminNotification } from '@/lib/notifications';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const allUsers = await db.query.users.findMany({
            columns: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
            orderBy: [desc(users.createdAt)],
        });
        return NextResponse.json(allUsers);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, email, password, role } = await req.json();

        if (!email || !password || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            role,
        }).returning();

        // Notify Admin
        await createAdminNotification({
            title: 'Account Provisioned',
            message: `A new ${role} account has been created for ${name} (${email}).`,
            type: 'INFO',
            link: '/admin/users'
        });

        return NextResponse.json(newUser[0]);
    } catch (err) {
        console.error('Create user error:', err);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Prevent self-deletion
        if (id === session.user.id) {
            return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
        }

        const userToDelete = await db.query.users.findFirst({
            where: eq(users.id, id)
        });

        if (!userToDelete) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Manual Cascade Delete for tables that might not have updated constraints
        // We use a transaction to ensure all cleanup happens or none
        await db.transaction(async (tx) => {
            // Delete related records manually to bypass restrictive DB constraints
            await tx.delete(testimonials).where(eq(testimonials.userId, id));
            await tx.delete(enrollments).where(eq(enrollments.userId, id));
            await tx.delete(payments).where(eq(payments.userId, id));
            await tx.delete(bookings).where(eq(bookings.userId, id));
            await tx.delete(certificates).where(eq(certificates.userId, id));
            await tx.delete(notifications).where(eq(notifications.userId, id));

            // Finally delete the user
            await tx.delete(users).where(eq(users.id, id));
        });

        await createAdminNotification({
            title: 'Account Terminated',
            message: `The account for ${userToDelete.name || userToDelete.email} has been permanently deleted by ${session.user.name}.`,
            type: 'WARNING',
            link: '/admin/users'
        });

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Delete user error:', err);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id, role, name, email, password } = await req.json();

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const updateData: any = {};
        if (role) updateData.role = role;
        if (name) updateData.name = name;
        if (email) updateData.email = email;

        if (password && password.length >= 6) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Prevent changing own role (to avoid locking out if only 1 admin)
        if (id === session.user.id && role && role !== 'ADMIN') {
            return NextResponse.json({ error: 'Cannot downgrade your own administrative role' }, { status: 400 });
        }

        await db.update(users)
            .set(updateData)
            .where(eq(users.id, id));

        return NextResponse.json({ message: 'User updated successfully' });
    } catch (err) {
        console.error('Update user error:', err);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
