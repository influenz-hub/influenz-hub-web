import type { Envelope } from "./types";

export const API_URL = process.env.API_URL ?? "http://localhost:4000/api/v1";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
  query?: Record<string, string | number | boolean | undefined | null>;
  /** Next.js caching hints; defaults to no-store since most reads are personalized. */
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
};

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const url = new URL(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/**
 * Single entry point for talking to the API. Unwraps the `{ data }` envelope and
 * turns the `{ error }` envelope into a typed ApiError, so callers deal in
 * domain values rather than transport details.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, query, cache, revalidate, tags } = options;

  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      ...(cache ? { cache } : revalidate === undefined ? { cache: "no-store" } : {}),
      ...(revalidate !== undefined || tags ? { next: { revalidate, tags } } : {}),
    });
  } catch {
    // The API being unreachable is an operational failure, not a 4xx — make
    // that distinction visible rather than surfacing a confusing parse error.
    throw new ApiError(503, "API_UNREACHABLE", "Can't reach the Influenz Hub API");
  }

  if (res.status === 204) return undefined as T;

  const payload = (await res.json().catch(() => null)) as
    | Envelope<T>
    | { error: { code: string; message: string; details?: unknown } }
    | null;

  if (!res.ok) {
    const err = payload && "error" in payload ? payload.error : null;
    throw new ApiError(
      res.status,
      err?.code ?? "UNKNOWN",
      err?.message ?? `Request failed with ${res.status}`,
      err?.details
    );
  }

  return (payload as Envelope<T>).data;
}

/** Variant that also returns pagination metadata. */
export async function apiFetchWithMeta<T>(
  path: string,
  options: RequestOptions = {}
): Promise<Envelope<T>> {
  const { method = "GET", body, token, query } = options;

  const res = await fetch(buildUrl(path, query), {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    const err = payload?.error;
    throw new ApiError(res.status, err?.code ?? "UNKNOWN", err?.message ?? "Request failed", err?.details);
  }

  return payload as Envelope<T>;
}
