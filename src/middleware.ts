import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { TUser } from "./types";
import { verifyJWT } from "./utils/verifyJWT";

const AuthRoutes = ["/login", "/signup"];

type Role = keyof typeof roleBasedRoutes;

const roleBasedRoutes = {
  user: [/^\//],
  admin: [/^\//, /^\/dashboard/],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    if (AuthRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, request.url)
      );
    }
  }

  //   Extract token
  try {
    const user = verifyJWT(token) as TUser;

    if (user?.role && roleBasedRoutes[user?.role as Role]) {
      const routes = roleBasedRoutes[user?.role as Role];

      if (routes.some((route) => pathname.match(route))) {
        return NextResponse.next();
      }
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/dashboard/:page*", "/login", "/signup"],
};
