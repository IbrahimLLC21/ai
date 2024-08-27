import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';
import { authMiddleware } from "@clerk/nextjs";

// Define Clerk authentication middleware
const clerkMiddleware = authMiddleware({
  publicRoutes: ["/", "/api/webhook"]
});

// Define locale handling middleware
function handleLocale(request: NextRequest) {
  const locale = request.headers.get('accept-language') || 'en';
  const url = new URL(request.url);
  url.searchParams.set('locale', locale);
  return NextResponse.redirect(url);
}

// Combine locale handling with Clerk authentication
export async function middleware(request: NextRequest, event: NextFetchEvent) {
  // Apply Clerk authentication middleware with the request and event
  const clerkHandledResponse = await clerkMiddleware(request, event);

  // If user is authenticated and trying to access public routes, redirect to dashboard
  if (clerkHandledResponse?.status === 302 && clerkHandledResponse?.headers.get('location') === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If authentication is successful, handle locale
  if (!clerkHandledResponse || clerkHandledResponse.status === 200) {
    // Check if locale needs to be handled
    const localeHandledResponse = handleLocale(request);
    if (localeHandledResponse.redirected) {
      return localeHandledResponse;
    }
  }
  
  return clerkHandledResponse;
}

// Configure the matcher for middleware
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
};