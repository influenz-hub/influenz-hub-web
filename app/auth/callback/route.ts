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
 * Landing point for the server-side Google flow. The API redirects here with a
 * refresh token, which we immediately exchange for a full token pair and store
 * in httpOnly cookies — so no token is ever readable by client JavaScript, and
 * the one that appeared in the URL is rotated out of use straight away.
 */
export async function GET(req: NextRequest) {
  const refreshToken = req.nextUrl.searchParams.get("refreshToken");
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login?error=oauth", req.url));
  }

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  }).catch(() => null);

  if (!res?.ok) {
    return NextResponse.redirect(new URL("/login?error=oauth", req.url));
  }

  const { data } = await res.json();
  const response = NextResponse.redirect(new URL("/dashboard", req.url));
  response.cookies.set(ACCESS_COOKIE, data.accessToken, cookieOptions(15 * 60));
  response.cookies.set(REFRESH_COOKIE, data.refreshToken, cookieOptions(30 * 24 * 60 * 60));

  return response;
}
