import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { payments, enrollments, courses, notifications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import axios from 'axios';
import { createAdminNotification } from '@/lib/notifications';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { reference, courseId, paymentType, billingEmail, billingAddress } = body;

        if (!reference || !courseId) {
            return NextResponse.json({ error: 'Reference and Course ID are required' }, { status: 400 });
        }

        // 1. Verify payment with Paystack
        const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${paystackSecret}`,
            },
        });

        const data = response.data.data;

        if (data.status !== 'success') {
            return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
        }

        // 2. Check if transaction was already processed
        // We can use uniqueIndex on transactionId in DB, but checking here too
        const existingPayment = await db.query.payments.findFirst({
            where: eq(payments.transactionId, reference),
        });

        if (existingPayment) {
            return NextResponse.json({ error: 'Transaction already processed' }, { status: 400 });
        }

        // 3. Get course price for verification (optional but recommended)
        const course = await db.query.courses.findFirst({
            where: eq(courses.id, courseId),
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // 4. Create Payment record and Enrollment record in a transaction
        await db.transaction(async (tx) => {
            // Create Payment
            await tx.insert(payments).values({
                amount: course.price,
                status: 'SUCCESS',
                transactionId: reference,
                userId: session.user.id,
                courseId: courseId,
                paymentType: paymentType || 'SELF',
            });

            // Create Enrollment
            await tx.insert(enrollments).values({
                userId: session.user.id,
                courseId: courseId,
                status: 'ACTIVE',
                billingEmail: billingEmail,
                billingAddress: billingAddress,
            });

            // Notify user
            await tx.insert(notifications).values({
                userId: session.user.id,
                title: 'Enrollment Confirmed',
                message: `Payment for "${course.title}" was successful. You now have full access.`,
                type: 'SUCCESS',
                link: `/dashboard/courses/${courseId}`,
            });

            // Notify Admin
            await createAdminNotification({
                title: 'New Enrollment (Paid)',
                message: `${session.user.name} has just paid for "${course.title}". Verify the transaction details.`,
                type: 'SUCCESS',
                link: `/admin/enrollments`
            });
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Paystack Verification Error:', err.response?.data || err.message);
        return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
    }
}
