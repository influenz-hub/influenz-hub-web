import "server-only";
import { apiFetch, apiFetchWithMeta } from "./client";
import { getAccessToken } from "./session";
import type {
  Category,
  CreatorCard,
  HomeFeed,
  ProductCard,
  ProductDetail,
  ProfileDetail,
  SearchResults,
  ServiceCard,
  ServiceDetail,
  StoreCard,
  StoreDetail,
} from "./types";

export type ListParams = {
  q?: string;
  categoryId?: string;
  location?: string;
  sort?: "popular" | "newest" | "featured";
  cursor?: string;
  limit?: number;
};

/**
 * Public reads still send the viewer's token when there is one, so responses can
 * include "have I liked / followed this" without a second round trip.
 */
async function publicFetch<T>(path: string, query?: ListParams) {
  return apiFetch<T>(path, { token: await getAccessToken(), query });
}

export async function getHomeFeed() {
  return publicFetch<HomeFeed>("/home");
}

export async function getCategories() {
  // Categories change rarely; a short revalidate avoids refetching per request.
  return apiFetch<Category[]>("/categories", { revalidate: 300, tags: ["categories"] });
}

export async function search(params: ListParams) {
  return publicFetch<SearchResults>("/search", params);
}

export async function listCreators(params: ListParams = {}) {
  return apiFetchWithMeta<CreatorCard[]>("/creators", {
    token: await getAccessToken(),
    query: params,
  });
}

export async function listStores(params: ListParams = {}) {
  return apiFetchWithMeta<StoreCard[]>("/stores", {
    token: await getAccessToken(),
    query: params,
  });
}

export async function listProducts(params: ListParams & { storeId?: string } = {}) {
  return apiFetchWithMeta<ProductCard[]>("/products", {
    token: await getAccessToken(),
    query: params,
  });
}

export async function listServices(params: ListParams = {}) {
  return apiFetchWithMeta<ServiceCard[]>("/services", {
    token: await getAccessToken(),
    query: params,
  });
}

export async function getProfile(slug: string) {
  return publicFetch<ProfileDetail>(`/profiles/${slug}`);
}

export async function getStore(slug: string) {
  return publicFetch<StoreDetail>(`/stores/${slug}`);
}

export async function getProduct(slug: string) {
  return publicFetch<ProductDetail>(`/products/${slug}`);
}

export async function getService(slug: string) {
  return publicFetch<ServiceDetail>(`/services/${slug}`);
}
