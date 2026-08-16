import "server-only";
import { apiFetch, apiFetchWithMeta } from "./client";
import { getAccessToken } from "./session";
import type {
  MyProfile,
  MyStats,
  MyStore,
  Notification,
  Post,
  ProductCard,
  ServiceCard,
} from "./types";

async function get<T>(path: string, query?: Record<string, string | number | undefined>) {
  return apiFetch<T>(path, { token: await getAccessToken(), query });
}

export async function getMyProfile() {
  return get<MyProfile | null>("/me/profile");
}

export async function getMyStores() {
  return get<MyStore[]>("/me/stores").catch(() => [] as MyStore[]);
}

export async function getStoreProducts(storeId: string) {
  return get<{ store: { id: string; name: string; slug: string }; products: ProductCard[] }>(
    `/me/stores/${storeId}/products`
  );
}

export async function getMyPosts() {
  return get<Post[]>("/me/posts").catch(() => [] as Post[]);
}

export async function getMyStats(days = 14) {
  return get<MyStats>("/me/stats", { days });
}

export async function getMyNotifications(limit = 40) {
  return apiFetchWithMeta<Notification[]>("/me/notifications", {
    token: await getAccessToken(),
    query: { limit },
  }).catch(() => ({ data: [] as Notification[], meta: { total: 0 } }));
}

/**
 * Opening the notifications page is the read receipt. This deliberately does
 * *not* call revalidatePath — that isn't allowed during render, and the list we
 * just fetched is already the state we want to show.
 */
export async function markNotificationsRead() {
  await apiFetch("/me/notifications/read", {
    method: "POST",
    token: await getAccessToken(),
  }).catch(() => {});
}

export type MyService = ServiceCard;
