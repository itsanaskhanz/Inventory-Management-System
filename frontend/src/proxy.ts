import { jwtVerify, JWTVerifyResult } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { hasAccessToRoute } from "./config/routes";
import { JwtPayload } from "./types/auth.types";

const SKIP_MIDDLEWARE = [
  "/_next/",
  "/favicon.ico",
  "/red-bg.png",
  "/images/",
  "/fonts/",
];
const PUBLIC_PATHS = ["/auth/login", "/auth/register"];
export const proxy = async (request: NextRequest) => {
  try {
    // Pathname
    const pathname = request.nextUrl.pathname;
    console.log("Pathname:", pathname);
    // Cookiess
    const cookie = request.cookies;
    // console.log("Cookie:", cookie);
    // Token
    const token = cookie.get("token")?.value;
    console.log("Token:", token);
    // Public paths check
    if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
      if (token) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return NextResponse.next();
    }
    // Skip middleware and api routes
    if (
      pathname.startsWith("/api") ||
      SKIP_MIDDLEWARE.some((path) => pathname.startsWith(path))
    ) {
      return NextResponse.next();
    }
    // Token check
    if (!token) {
      console.log("No token found, redirecting to /auth/login");
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    // Verify token
    const JWT_SECRET = process.env.JWT_SECRET;
    const decodedToken: JWTVerifyResult<JwtPayload> = await jwtVerify(
      token,
      JWT_SECRET
        ? new TextEncoder().encode(JWT_SECRET)
        : new TextEncoder().encode("default-secret"),
    );
    console.log("Decoded Token:", decodedToken);
    // Check access
    const hasAccess = hasAccessToRoute(pathname, decodedToken.payload.role);
    if (!hasAccess) {
      console.log(
        `User with role ${decodedToken.payload.role} does not have access to ${pathname}, redirecting to /auth/login`,
      );
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  } catch (err) {
    console.error("Error in proxy:", err);
  }
};

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (starts with /api/)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder image files
     */
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.ico$|.*\\.webp$).*)",
  ],
};
