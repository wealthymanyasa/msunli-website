import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { NextResponse } from 'next/server';

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes
} from "routes"


const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  //allow every single api route
  if (isApiAuthRoute) {
    return null;
  }
  //check auth routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null;
  }

  if(!isLoggedIn && !isPublicRoute){
    return NextResponse.redirect(new URL("/signin", nextUrl))
  }

  return null;
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'
  ],
}