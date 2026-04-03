import { NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/mentor-dashboard'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('authToken')?.value;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));

  // No token → redirect to login immediately
  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('auth', 'login');
    return NextResponse.redirect(url);
  }

  // Token exists → verify it against the DB session
  if (isProtected && token) {
    try {
      const verifyRes = await fetch(new URL('/api/auth/verify-session', request.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await verifyRes.json();

      if (!verifyRes.ok || !data.valid) {
        // Session is stale (another device logged in) — force logout
        const url = request.nextUrl.clone();
        url.pathname = '/';
        url.searchParams.set('auth', 'login');
        url.searchParams.set('reason', 'session_expired');

        const response = NextResponse.redirect(url);
        // Clear the stale cookie
        response.cookies.set('authToken', '', { maxAge: 0, path: '/' });
        return response;
      }
    } catch (err) {
      // If verify call fails (network/timeout), let through — don't block on infra errors
      console.error('Session verify fetch failed:', err);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/mentor-dashboard/:path*'],
};