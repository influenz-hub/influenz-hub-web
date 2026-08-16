import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { apiFetch } from "./client";
import type { SessionUser } from "./types";

export const ACCESS_COOKIE = "ih_access";
export const REFRESH_COOKIE = "ih_refresh";

/**
 * Tokens live in httpOnly cookies rather than localStorage, so a script
 * injected into the page can't read them. Server Components read the access
 * token here; `proxy.ts` handles refreshing it when it expires, because Next
 * only allows writing cookies from middleware, Route Handlers, and Actions.
 */
export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(ACCESS_COOKIE)?.value;
}

/**
 * Deduped per request: several Server Components on one page can each ask for
 * the session without triggering repeat calls to /auth/me.
 */
export const getSession = cache(async (): Promise<SessionUser | null> => {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    return await apiFetch<SessionUser>("/auth/me", { token });
  } catch {
    // An expired or revoked token simply means "not signed in" for rendering.
    return null;
  }
});

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHENTICATED");
  return session;
}

/** Cookie options shared by every place that writes the session. */
export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export const ACCESS_MAX_AGE = 15 * 60;
export const REFRESH_MAX_AGE = 30 * 24 * 60 * 60;
