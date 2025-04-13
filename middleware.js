import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/card(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth(); // ✅ important: await here!


  if (!userId && isProtectedRoute(req)) {
    const signInUrl = new URL("/", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/profile(.*)',
    '/dashboard(.*)',
    '/cards(.*)',
    '/about',
  ],
};

