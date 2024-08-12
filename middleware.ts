// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Check for the access token in the URL query parameters
  const urlToken = url.searchParams.get('access_token');

  // Retrieve the token from cookies
  const cookieToken = req.cookies.get('access_token');

  // If the access token is present in the URL, store it in cookies
  if (urlToken && !cookieToken) {
    // Set the access token in cookies
    const response = NextResponse.next();
    response.cookies.set('access_token', urlToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    });
    return response;
  }

  // If there is no token and the user is trying to access the dashboard, redirect to the login page
  if (!cookieToken && url.pathname === '/dashboard') {
    console.log('Redirecting to login page');
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If the token exists or it's not a dashboard page, let the request proceed
  return NextResponse.next();
}

// Apply the middleware to the relevant routes
export const config = {
  matcher: ['/dashboard'],
};
