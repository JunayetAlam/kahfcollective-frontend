import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { User } from "./types";
import { verifyJWT } from "./utils/verifyJWT";

const roleBasedRoutes = {
  USER: ["/", "/checkout", "/checkout/complete", "/profile", "/study-circles", "/study-circles/feed", "/course-details/*"],
  INSTRUCTOR: [
    "/dashboard",
    "/dashboard/discussion",
    "/dashboard/my-courses",
    "/dashboard/students",
    "/dashboard/profile",
    "/dashboard/quiz",
    "/",
    "/checkout",
    "/checkout/complete",
    "/profile",
    "/study-circles",
    "/study-circles/feed",
    "/course-details/*",
  ],
  SUPERADMIN: [
    "/dashboard",
    "/dashboard/content",
    "/dashboard/discussion",
    "/dashboard/profile",
    "/dashboard/users",
    "/",
    "/checkout",
    "/checkout/complete",
    "/profile",
    "/study-circles",
    "/study-circles/feed",
    "/course-details/*",
  ],
} as const;

type Role = keyof typeof roleBasedRoutes;

const matchRoute = (pathname: string, route: string) => {
  if (route.endsWith("/*")) {
    const baseRoute = route.slice(0, -2);
    return pathname.startsWith(baseRoute);
  }
  return pathname === route;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    if (pathname.startsWith("/auth")) return NextResponse.next();
    return NextResponse.redirect(
      new URL(`/auth/sign-in?redirect=${pathname}`, request.url)
    );
  }

  try {
    const user = verifyJWT(token) as User;

    if (pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (user.role === "USER" && !user.isUserVerified) {
      if (pathname.startsWith("/checkout")) return NextResponse.next();
      return NextResponse.redirect(new URL("/checkout/purchase", request.url));
    }

    if (user?.role && roleBasedRoutes[user.role as Role]) {
      const allowedRoutes = roleBasedRoutes[user.role as Role] as readonly string[];
      if (allowedRoutes.some((route) => matchRoute(pathname, route))) {
        return NextResponse.next();
      }
    }
  } catch {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:page*",
    "/auth/:page*",
    "/profile",
    "/checkout/:path*",
    "/study-circles/:path*",
    "/course-details/:path*",
  ],
};
