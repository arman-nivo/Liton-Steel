import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

const SKIP = /^\/(api|_next|admin|edit|media|uploads|fonts|favicon\.ico|robots\.txt|sitemap\.xml|opengraph-image|icon|apple-icon)(\/|$)|\.[a-zA-Z0-9]+$/;

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Editor is password-protected.
  if (pathname === "/edit" || pathname.startsWith("/edit/")) {
    const s = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
    if (!s) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Canonical English URLs have no prefix; /en/... redirects to /...
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en/, "") || "/";
    return NextResponse.redirect(url, 308);
  }
  if (pathname === "/bn" || pathname.startsWith("/bn/")) return NextResponse.next();
  if (SKIP.test(pathname)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = { matcher: ["/((?!_next/static|_next/image).*)"] };
