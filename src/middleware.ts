import NextAuth, { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import authConfig from './auth.config';
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from '@/routes';

import createIntlMiddleware from 'next-intl/middleware';
import { pathnames, locales, localePrefix } from './config';

const { auth: middleware } = NextAuth(authConfig);

const intlMiddleware = createIntlMiddleware({
  locales,
  pathnames,
  localePrefix,
  defaultLocale: 'fr',
});

export default middleware(
  (req: NextRequest & { auth: Session | null }): Response | void => {
    const response = intlMiddleware(req);

    if (response) return response;
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.some((route) => {
      if (route === '/') {
        return nextUrl.pathname === route;
      } else {
        return nextUrl.pathname.startsWith(route);
      }
    });

    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) return;

    if (isAuthRoute) {
      if (isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      return;
    }

    if (!isLoggedIn && !isPublicRoute) {
      let callbackUrl = nextUrl.pathname;
      if (nextUrl.search) {
        callbackUrl += nextUrl.search;
      }

      const encodedCallbackUrl = encodeURIComponent(callbackUrl);

      return Response.redirect(
        new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
      );
    }

    const res = NextResponse.next();
    res.headers.set('Content-Type', 'true'); // Example header, adjust as necessary
    res.headers.set('Content-Disposition', 'true'); // Example header, adjust as necessary
    return res;
  }
);

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
    '/',
    '/(fr|en|es)/:path*',
  ],
};
