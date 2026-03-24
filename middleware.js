import { NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/mentor-dashboard'];
const AUTH_ROUTES = ['/'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('authToken')?.value;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));

  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('auth', 'login');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/mentor-dashboard/:path*'],
};