import jsPDF from 'jspdf';

function decodeHtml(html: string) {
    if (!html) return '';
    return html
        .replace(/&nbsp;/g, ' ')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/<[^>]*>/g, '')
        .trim();
}

async function getBase64Image(url: string): Promise<string | null> {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        return null;
    }
}

export async function buildBrochurePDF(course: any, currencySymbol: string): Promise<jsPDF> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const W = pdf.internal.pageSize.getWidth();
    let y = 0;

    const blue = [37, 99, 235] as const;
    const dark = [15, 23, 42] as const;
    const grey = [100, 116, 139] as const;
    const lightGrey = [241, 245, 249] as const;

    // Load Logo
    const logoBase64 = await getBase64Image('/gialogo.png');

    // Header bar
    pdf.setFillColor(...blue);
    pdf.rect(0, 0, W, 25, 'F');
    
    if (logoBase64) {
        pdf.addImage(logoBase64, 'PNG', 14, 5, 12, 12);
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('GIA ADVISORY CONSULTING SERVICES', 28, 12);
    } else {
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('GIA ADVISORY CONSULTING SERVICES', 14, 12);
    }
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('EXECUTIVE LEARNING & CERTIFICATION', 14, 18);
    pdf.setFontSize(7);
    pdf.text('https://giaadvisory.com', W - 14, 15, { align: 'right' });

    y = 40;

    // Course type badge
    pdf.setFillColor(...lightGrey);
    pdf.roundedRect(14, y, 40, 6, 2, 2, 'F');
    pdf.setTextColor(...blue);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.text((course.type || 'PROGRAM').toUpperCase(), 34, y + 4.2, { align: 'center' });
    y += 12;

    // Title
    pdf.setTextColor(...dark);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    const titleLines = pdf.splitTextToSize(course.title.toUpperCase(), W - 28);
    pdf.text(titleLines, 14, y);
    y += titleLines.length * 8 + 4;

    // Meta row
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...grey);
    pdf.text(`Duration: ${course.duration || 'Flexible'}`, 14, y);
    pdf.text(`Certificate: ${course.certificationType?.name || 'Professional Certificate'}`, 100, y);
    pdf.text(`Price: ${currencySymbol}${Number(course.price).toLocaleString()}`, W - 14, y, { align: 'right' });
    y += 6;

    // Divider
    pdf.setDrawColor(...blue);
    pdf.setLineWidth(0.5);
    pdf.line(14, y, W - 14, y);
    y += 10;

    // Description
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...blue);
    pdf.text('EXECUTIVE SUMMARY', 14, y);
    y += 6;
    pdf.setFontSize(8.5);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...dark);
    const descText = decodeHtml(course.description || '');
    const descLines = pdf.splitTextToSize(descText, W - 28);
    descLines.slice(0, 15).forEach((line: string) => {
        if (y > 270) { pdf.addPage(); y = 20; }
        pdf.text(line, 14, y);
        y += 5;
    });
    y += 4;

    // Curriculum
    if (course.lessons?.length) {
        if (y > 250) { pdf.addPage(); y = 20; }
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...blue);
        pdf.text('COURSE CURRICULUM', 14, y);
        y += 6;
        course.lessons.forEach((lesson: any, i: number) => {
            if (y > 270) { pdf.addPage(); y = 20; }
            pdf.setFillColor(...lightGrey);
            pdf.roundedRect(14, y - 3.5, W - 28, 8, 1, 1, 'F');
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...dark);
            pdf.text(`${i + 1}.`, 18, y + 1);
            pdf.setFont('helvetica', 'normal');
            pdf.text(pdf.splitTextToSize(decodeHtml(lesson.title), W - 42)[0], 26, y + 1);
            y += 10;
        });
        y += 4;
    }

    // Schedules
    if (course.schedules?.length) {
        if (y > 240) { pdf.addPage(); y = 20; }
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...blue);
        pdf.text('UPCOMING SCHEDULES', 14, y);
        y += 6;
        course.schedules.forEach((s: any) => {
            if (y > 270) { pdf.addPage(); y = 20; }
            const dateStr = new Date(s.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
            pdf.setFillColor(239, 246, 255);
            pdf.roundedRect(14, y - 3.5, W - 28, 8, 1, 1, 'F');
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...dark);
            pdf.text(dateStr, 18, y + 1);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...grey);
            pdf.text(s.location || 'Online Session', W - 18, y + 1, { align: 'right' });
            y += 10;
        });
    }

    // Footer
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFillColor(...dark);
        pdf.rect(0, 280, W, 17, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(6.5);
        pdf.setFont('helvetica', 'bold');
        pdf.text('GIA ADVISORY CONSULTING SERVICES', 14, 286);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Plot 1, CMD/Jubilee Road, Magodo, Lagos, Nigeria', 14, 290);
        pdf.text('Email: info@giaadvisory.com | Web: https://giaadvisory.com', 14, 294);
        pdf.text(`Page ${i} of ${pageCount}`, W - 14, 294, { align: 'right' });
    }

    return pdf;
}

export async function buildCalendarPDF(schedules: any[]): Promise<jsPDF> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const W = pdf.internal.pageSize.getWidth();
    const blue = [37, 99, 235] as const;
    const dark = [15, 23, 42] as const;
    const grey = [100, 116, 139] as const;
    const lightGrey = [241, 245, 249] as const;

    let y = 0;

    // Load Logo
    const logoBase64 = await getBase64Image('/gialogo.png');

    // Header
    pdf.setFillColor(...blue);
    pdf.rect(0, 0, W, 25, 'F');
    
    if (logoBase64) {
        pdf.addImage(logoBase64, 'PNG', 14, 5, 12, 12);
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('GIA ADVISORY CONSULTING SERVICES', 28, 12);
    } else {
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('GIA ADVISORY CONSULTING SERVICES', 14, 12);
    }
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('TRAINING CALENDAR 2026', 14, 18);
    pdf.setFontSize(8);
    pdf.text('https://giaadvisory.com', W - 14, 15, { align: 'right' });

    y = 40;

    if (!schedules.length) {
        pdf.setFontSize(11);
        pdf.setTextColor(...grey);
        pdf.text('No sessions scheduled yet.', 14, y);
    } else {
        schedules.forEach((s) => {
            if (y > 265) { pdf.addPage(); y = 20; }
            const dateStr = new Date(s.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
            pdf.setFillColor(...lightGrey);
            pdf.roundedRect(14, y - 4, W - 28, 14, 2, 2, 'F');
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...dark);
            pdf.text(decodeHtml(s.course.title), 20, y + 1);
            pdf.setFontSize(7.5);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...grey);
            pdf.text(dateStr, 20, y + 6.5);
            pdf.setTextColor(...blue);
            pdf.text(s.location || 'Online Session', W - 20, y + 6.5, { align: 'right' });
            y += 17;
        });
    }

    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFillColor(...dark);
        pdf.rect(0, 280, W, 17, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(6.5);
        pdf.setFont('helvetica', 'bold');
        pdf.text('GIA ADVISORY CONSULTING SERVICES', 14, 286);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Plot 1, CMD/Jubilee Road, Magodo, Lagos, Nigeria', 14, 290);
        pdf.text('Email: info@giaadvisory.com | Web: https://giaadvisory.com', 14, 294);
        pdf.text(`Page ${i} of ${pageCount}`, W - 14, 294, { align: 'right' });
    }

    return pdf;
}
