import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const schema = z.object({
    token: z.string(),
    password: z.string().min(6),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid reset link' }, { status: 400 });
        }

        const { token, password } = parsed.data;

        const user = await db.query.users.findFirst({
            where: and(
                eq(users.resetToken, token),
                gt(users.resetTokenExpires, new Date())
            ),
        });

        if (!user) {
            return NextResponse.json({ error: 'Reset link has expired or is invalid' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.update(users)
            .set({ 
                password: hashedPassword,
                resetToken: null,
                resetTokenExpires: null,
                updatedAt: new Date(),
            })
            .where(eq(users.id, user.id));

        return NextResponse.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
