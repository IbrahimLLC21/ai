import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';
import { authMiddleware } from "@clerk/nextjs";

// Define locale handling middleware
function handleLocale(request: NextRequest) {
  const locale = request.headers.get('accept-language') || 'en';
  const url = new URL(request.url);
  url.searchParams.set('locale', locale);
  return NextResponse.redirect(url);
}

// Define Clerk authentication middleware
const clerkMiddleware = authMiddleware({
  publicRoutes: ["/", "/api/webhook"]
});

// Combine locale handling with Clerk authentication
export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const localeHandledResponse = handleLocale(request);

  // Apply Clerk authentication middleware with the request and event
  const clerkHandledResponse = await clerkMiddleware(request, event);

  // If locale handling is not needed for authentication-protected routes
  if (localeHandledResponse.redirected) {
    return localeHandledResponse;
  }
  
  return clerkHandledResponse;
}

// Configure the matcher for middleware
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
};
