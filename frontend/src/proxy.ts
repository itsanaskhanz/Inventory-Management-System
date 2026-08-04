import { jwtVerify, JWTVerifyResult } from "jose";
import { NextRequest, NextResponse } from "next/server";
import appConfig from "./config/app.config";
import { hasAccessToRoute } from "./config/routes";
import { JwtPayload } from "./types/auth.types";

const SKIP_MIDDLEWARE = ["/_next/", "/favicon.ico", "/images/", "/fonts/"];
const AUTH_PATHS = appConfig.security.authPaths;
const PUBLIC_PATHS = appConfig.security.publicPaths;
const COOKIE_NAME = appConfig.security.cookieName;

export const proxy = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (AUTH_PATHS.some((path) => pathname.startsWith(path))) {
    if (
      pathname.startsWith("/auth/register") &&
      !appConfig.features.enableRegistration
    ) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return token
      ? NextResponse.redirect(new URL("/", request.url))
      : NextResponse.next();
  }

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/api") ||
    SKIP_MIDDLEWARE.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (!JWT_SECRET) {
    console.error("Missing JWT_SECRET environment variable");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const decodedToken: JWTVerifyResult<JwtPayload> = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET),
    );

    const hasAccess = hasAccessToRoute(pathname, decodedToken.payload.role);
    if (!hasAccess) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
};

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.ico$|.*\\.webp$).*)",
  ],
};
