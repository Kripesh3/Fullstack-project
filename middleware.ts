import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /auth/login, /events/create)
  const { pathname } = request.nextUrl;

  // Check if the user is authenticated by looking for the auth token
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  // Define protected routes that require server-side authentication
  // Removed /profile since it uses client-side authentication
  const protectedRoutes: string[] = [];
  const authRoutes = ['/auth/login', '/auth/register'];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.includes(pathname);

  // If user is authenticated and trying to access auth pages, redirect to events
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/events', request.url));
  }

  // If user is not authenticated and trying to access protected route
  if (!token && isProtectedRoute) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin (let admin routes handle their own authentication)
     * - organizer (let organizer routes handle their own authentication)
     * - events/create (let event creation handle its own authentication)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|admin|organizer|events/create).*)',
  ],
};
