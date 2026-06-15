import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const isAuth = !!token;
    const pathname = req.nextUrl.pathname;

    const isAdminRoute = pathname.startsWith('/admin');
    const isStudentRoute = pathname.startsWith('/dashboard');
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

    if (isAuthPage && isAuth) {
        const redirectTo = token?.role === 'ADMIN' ? '/admin' : '/dashboard';
        return NextResponse.redirect(new URL(redirectTo, req.url));
    }

    if (isAdminRoute && !isAuth) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (isAdminRoute && token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (isStudentRoute && !isAuth) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/dashboard/:path*', '/login', '/register'],
};
