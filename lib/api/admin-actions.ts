"use server";

import { revalidatePath } from "next/cache";
import { authedFetch } from "./auth-actions";
import { ApiError } from "./client";
import type { FormState } from "./business-actions";
import type { ReportStatus, Role } from "./types";

export async function setUserRoleAction(userId: string, role: Role) {
  await authedFetch(`/admin/users/${userId}/role`, { method: "PATCH", body: { role } });
  revalidatePath("/admin/users");
}

export async function setBusinessFlagAction(
  profileId: string,
  flag: "verified" | "featured",
  value: boolean
) {
  await authedFetch(`/admin/businesses/${profileId}/flags`, {
    method: "PATCH",
    body: { [flag]: value },
  });
  revalidatePath("/admin/businesses");
}

export async function createCategoryAction(_prev: FormState, form: FormData): Promise<FormState> {
  const name = String(form.get("name") ?? "").trim();

  try {
    await authedFetch("/admin/categories", { method: "POST", body: { name } });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Couldn't create that category." };
  }

  revalidatePath("/admin/categories");
  return { success: `Added "${name}".` };
}

export async function deleteCategoryAction(id: string) {
  await authedFetch(`/admin/categories/${id}`, { method: "DELETE" });
  revalidatePath("/admin/categories");
}

export async function setReportStatusAction(id: string, status: ReportStatus) {
  await authedFetch(`/admin/reports/${id}`, { method: "PATCH", body: { status } });
  revalidatePath("/admin/reports");
}
