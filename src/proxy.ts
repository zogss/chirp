import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Clerk usernames are lowercase, so "/@Username" and "/Username" are the profile at "/username"
const PROFILE_PATH = /^\/(?:@|%40)?([\w-]+)$/;

// Every route is public: pages render for signed-out visitors, and tRPC's `privateProcedure`
// rejects unauthenticated mutations. Clerk still needs to run to resolve the session.
export default clerkMiddleware((_auth, req) => {
  const { pathname } = req.nextUrl;
  const username = PROFILE_PATH.exec(pathname)?.[1]?.toLowerCase();

  // redirecting here (instead of in the page) gives a real 308, before any HTML is streamed
  if (username && pathname !== `/${username}`) {
    const url = req.nextUrl.clone();
    url.pathname = `/${username}`;
    return NextResponse.redirect(url, 308);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
