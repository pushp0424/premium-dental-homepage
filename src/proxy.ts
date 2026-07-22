import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "md_session";
const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "meridian-dental-demo-jwt-secret-change-in-production"
);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;

  let role: string | undefined;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secretKey);
      role = payload.role as string;
    } catch {
      role = undefined;
    }
  }

  const requiresPatient = pathname.startsWith("/portal");
  const requiresAdmin = pathname.startsWith("/admin");

  if ((requiresPatient && role !== "PATIENT") || (requiresAdmin && role !== "ADMIN")) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
};
