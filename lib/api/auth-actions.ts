"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiFetch, ApiError } from "./client";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  ACCESS_MAX_AGE,
  REFRESH_MAX_AGE,
  sessionCookieOptions,
  getAccessToken,
} from "./session";
import type { AuthResult } from "./types";

export type ActionState = { error?: string; success?: string } | null;

async function persistSession(result: AuthResult) {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, result.accessToken, sessionCookieOptions(ACCESS_MAX_AGE));
  jar.set(REFRESH_COOKIE, result.refreshToken, sessionCookieOptions(REFRESH_MAX_AGE));
}

/** Only allow relative paths, so a crafted `next` param can't bounce users offsite. */
function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

function messageFor(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback;
}

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const next = safeNext(formData.get("next"));

  try {
    const result = await apiFetch<AuthResult>("/auth/login", {
      method: "POST",
      body: {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      },
    });
    await persistSession(result);
  } catch (err) {
    return { error: messageFor(err, "Couldn't sign you in. Try again.") };
  }

  redirect(next);
}

export async function registerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const next = safeNext(formData.get("next"));

  try {
    const result = await apiFetch<AuthResult>("/auth/register", {
      method: "POST",
      body: {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      },
    });
    await persistSession(result);
  } catch (err) {
    return { error: messageFor(err, "Couldn't create your account.") };
  }

  redirect(next);
}

export async function requestEmailLinkAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await apiFetch("/auth/email/request", {
      method: "POST",
      body: { email: String(formData.get("email") ?? "") },
    });
    return { success: "Check your inbox for a sign-in link." };
  } catch (err) {
    return { error: messageFor(err, "Couldn't send the link.") };
  }
}

export async function requestPhoneCodeAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await apiFetch("/auth/phone/request", {
      method: "POST",
      body: { phone: String(formData.get("phone") ?? "") },
    });
    return { success: "We sent you a code." };
  } catch (err) {
    return { error: messageFor(err, "Couldn't send a code to that number.") };
  }
}

export async function verifyPhoneCodeAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const next = safeNext(formData.get("next"));

  try {
    const result = await apiFetch<AuthResult>("/auth/phone/verify", {
      method: "POST",
      body: {
        phone: String(formData.get("phone") ?? ""),
        code: String(formData.get("code") ?? ""),
      },
    });
    await persistSession(result);
  } catch (err) {
    return { error: messageFor(err, "That code didn't work.") };
  }

  redirect(next);
}

export async function verifyEmailTokenAction(token: string) {
  const result = await apiFetch<AuthResult>("/auth/email/verify", {
    method: "POST",
    body: { token },
  });
  await persistSession(result);
}

export async function logoutAction() {
  const jar = await cookies();
  const refreshToken = jar.get(REFRESH_COOKIE)?.value;

  if (refreshToken) {
    // Revoke server-side too — clearing the cookie alone would leave a valid
    // refresh token in existence.
    await apiFetch("/auth/logout", { method: "POST", body: { refreshToken } }).catch(() => {});
  }

  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
  redirect("/");
}

/** Used by Server Actions in other modules that need an authenticated call. */
export async function authedFetch<T>(
  path: string,
  options: Parameters<typeof apiFetch<T>>[1] = {}
): Promise<T> {
  const token = await getAccessToken();
  return apiFetch<T>(path, { ...options, token });
}
