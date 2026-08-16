import { NextResponse, type NextRequest } from "next/server";

const ACCESS_COOKIE = "ih_access";
const REFRESH_COOKIE = "ih_refresh";
const API_URL = process.env.API_URL ?? "http://localhost:4000/api/v1";

const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge,
});

/**
 * Runs before every matched request. Two jobs:
 *
 * 1. Silent refresh. Access tokens last 15 minutes; when one expires but a
 *    refresh token is still present, we rotate here and write the new pair onto
 *    the response. This is the only layer that can both read the request and set
 *    cookies — Server Components can read but not write.
 * 2. Route protection. A coarse redirect for signed-out users. The API still
 *    enforces real authorization on every call; this only avoids rendering a
 *    dashboard shell that would fail to load.
 */
export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const access = req.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = req.cookies.get(REFRESH_COOKIE)?.value;

  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  const response = NextResponse.next();
  let hasSession = Boolean(access);

  if (!access && refresh) {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh }),
      });

      if (res.ok) {
        const { data } = await res.json();
        response.cookies.set(ACCESS_COOKIE, data.accessToken, cookieOptions(15 * 60));
        response.cookies.set(REFRESH_COOKIE, data.refreshToken, cookieOptions(30 * 24 * 60 * 60));
        hasSession = true;
      } else {
        // Refresh failed (expired, revoked, or replayed) — clear the stale
        // cookie so we don't retry it on every subsequent request.
        response.cookies.delete(REFRESH_COOKIE);
      }
    } catch {
      // API unreachable: leave cookies alone and let the page handle it.
    }
  }

  if (isProtected && !hasSession) {
    const login = new URL("/login", req.url);
    login.searchParams.set("next", pathname);
    const redirect = NextResponse.redirect(login);
    // Carry over any cookie changes made above.
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
    return redirect;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except static assets and image optimization — the refresh
     * needs to run on normal page navigations, not on asset requests.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
