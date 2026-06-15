import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { db } from '@/db';
import { certificates, users, courses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

/**
 * Service to handle dynamic certificate PDF generation.
 */
export async function generateCertificatePDF({
    studentName,
    courseTitle,
    date,
    verificationUrl,
}: {
    studentName: string;
    courseTitle: string;
    date: string;
    verificationUrl: string;
}) {
    // 1. Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // 2. Add a blank page (Standard Certificate Size: A4 Landscape)
    const page = pdfDoc.addPage([841.89, 595.28]); // A4 in points at 72 PPI
    const { width, height } = page.getSize();

    // 3. Load Fonts
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // 4. Background & Borders (Simulated until we use the actual image)
    // In a real app, we'd embed the generated template image here.
    // For now, we'll draw a premium border and layout.

    // Outer Frame
    page.drawRectangle({
        x: 20,
        y: 20,
        width: width - 40,
        height: height - 40,
        borderColor: rgb(0.1, 0.2, 0.4),
        borderWidth: 4,
    });

    // Inner Frame
    page.drawRectangle({
        x: 40,
        y: 40,
        width: width - 80,
        height: height - 80,
        borderColor: rgb(0.8, 0.6, 0.2),
        borderWidth: 1.5,
    });

    // 5. Text Overlay Logic

    // Subtitle
    page.drawText('CERTIFICATE OF COMPLETION', {
        x: width / 2 - 150,
        y: height - 150,
        size: 24,
        font: fontBold,
        color: rgb(0.1, 0.2, 0.4),
    });

    page.drawText('This is to certify that', {
        x: width / 2 - 60,
        y: height - 200,
        size: 14,
        font: fontRegular,
        color: rgb(0.4, 0.4, 0.4),
    });

    // Student Name (Main Highlight)
    page.drawText(studentName.toUpperCase(), {
        x: width / 2 - (studentName.length * 7),
        y: height - 260,
        size: 42,
        font: fontBold,
        color: rgb(0, 0, 0),
    });

    page.drawText('has successfully completed the professional course', {
        x: width / 2 - 140,
        y: height - 310,
        size: 14,
        font: fontRegular,
        color: rgb(0.4, 0.4, 0.4),
    });

    // Course Title
    page.drawText(courseTitle, {
        x: width / 2 - (courseTitle.length * 4),
        y: height - 360,
        size: 24,
        font: fontBold,
        color: rgb(0.1, 0.2, 0.4),
    });

    // Date
    page.drawText(`Issued on: ${date}`, {
        x: 80,
        y: 100,
        size: 10,
        font: fontRegular,
        color: rgb(0.5, 0.5, 0.5),
    });

    // Verification Info
    page.drawText(`Verify at: ${verificationUrl}`, {
        x: 80,
        y: 80,
        size: 8,
        font: fontRegular,
        color: rgb(0.6, 0.6, 0.6),
    });

    // 6. Return standard buffer
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}

/**
 * Helper to generate a secure verification hash.
 */
export function generateVerificationHash(userId: string, courseId: string) {
    const secret = process.env.NEXTAUTH_SECRET || 'gia-secret';
    return crypto.createHash('sha256')
        .update(`${userId}-${courseId}-${Date.now()}-${secret}`)
        .digest('hex');
}
