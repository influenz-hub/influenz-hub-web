import "server-only";
import { apiFetch } from "./client";
import { getAccessToken } from "./session";
import type {
  AdminBusiness,
  AdminCategory,
  AdminOverview,
  AdminUser,
  Report,
  ReportStatus,
} from "./types";

async function get<T>(path: string, query?: Record<string, string | number | undefined>) {
  return apiFetch<T>(path, { token: await getAccessToken(), query });
}

export async function getAdminOverview() {
  return get<AdminOverview>("/admin/overview");
}

export async function listAdminUsers(q?: string) {
  return get<AdminUser[]>("/admin/users", { q, limit: 50 });
}

export async function listAdminBusinesses(q?: string, verified?: string) {
  return get<AdminBusiness[]>("/admin/businesses", { q, verified, limit: 50 });
}

export async function listAdminCategories() {
  return get<AdminCategory[]>("/admin/categories");
}

export async function listAdminReports(status?: ReportStatus) {
  return get<Report[]>("/admin/reports", { status, limit: 50 });
}
