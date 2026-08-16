"use server";

import { revalidatePath } from "next/cache";
import { authedFetch } from "./auth-actions";
import { ApiError } from "./client";

export type FormState = { error?: string; success?: string; fieldErrors?: Record<string, string> } | null;

/**
 * Turns an ApiError into form state. Validation errors from the API carry a
 * `details` array, which we map back onto the fields that produced them.
 */
function toFormState(err: unknown, fallback: string): FormState {
  if (err instanceof ApiError) {
    const details = err.details as { path: string; message: string }[] | undefined;
    if (Array.isArray(details) && details.length > 0) {
      return {
        error: "Please check the highlighted fields.",
        fieldErrors: Object.fromEntries(details.map((d) => [d.path, d.message])),
      };
    }
    return { error: err.message };
  }
  return { error: fallback };
}

const str = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
};

const imageList = (form: FormData, key: string) => {
  const value = str(form, key);
  return value ? [value] : [];
};

/* ---------------------------------- Profile -------------------------------- */

export async function saveProfileAction(_prev: FormState, form: FormData): Promise<FormState> {
  try {
    await authedFetch("/me/profile", {
      method: "PUT",
      body: {
        businessName: str(form, "businessName") ?? "",
        description: str(form, "description"),
        categoryId: str(form, "categoryId"),
        location: str(form, "location"),
        contactEmail: str(form, "contactEmail") ?? "",
        contactPhone: str(form, "contactPhone"),
        logo: str(form, "logo") ?? "",
        banner: str(form, "banner") ?? "",
      },
    });
  } catch (err) {
    return toFormState(err, "Couldn't save your profile.");
  }

  revalidatePath("/dashboard", "layout");
  return { success: "Profile saved." };
}

/* ---------------------------------- Stores --------------------------------- */

function storeBody(form: FormData) {
  return {
    name: str(form, "name") ?? "",
    description: str(form, "description"),
    categoryId: str(form, "categoryId"),
    location: str(form, "location"),
    contactInfo: str(form, "contactInfo"),
    images: imageList(form, "image"),
  };
}

export async function saveStoreAction(_prev: FormState, form: FormData): Promise<FormState> {
  const id = str(form, "id");
  try {
    await authedFetch(id ? `/me/stores/${id}` : "/me/stores", {
      method: id ? "PUT" : "POST",
      body: storeBody(form),
    });
  } catch (err) {
    return toFormState(err, "Couldn't save the store.");
  }

  revalidatePath("/dashboard/stores");
  return { success: id ? "Store updated." : "Store created." };
}

export async function deleteStoreAction(id: string) {
  await authedFetch(`/me/stores/${id}`, { method: "DELETE" });
  revalidatePath("/dashboard/stores");
}

/* --------------------------------- Products -------------------------------- */

export async function saveProductAction(_prev: FormState, form: FormData): Promise<FormState> {
  const id = str(form, "id");
  const storeId = str(form, "storeId");

  const body = {
    name: str(form, "name") ?? "",
    description: str(form, "description"),
    categoryId: str(form, "categoryId"),
    price: str(form, "price") ?? "0",
    stock: str(form, "stock") ?? "0",
    available: form.get("available") === "on",
    images: imageList(form, "image"),
  };

  try {
    await authedFetch(id ? `/me/products/${id}` : `/me/stores/${storeId}/products`, {
      method: id ? "PUT" : "POST",
      body,
    });
  } catch (err) {
    return toFormState(err, "Couldn't save the product.");
  }

  revalidatePath(`/dashboard/stores/${storeId}`);
  return { success: id ? "Product updated." : "Product added." };
}

export async function deleteProductAction(id: string, storeId: string) {
  await authedFetch(`/me/products/${id}`, { method: "DELETE" });
  revalidatePath(`/dashboard/stores/${storeId}`);
}

/* --------------------------------- Services -------------------------------- */

export async function saveServiceAction(_prev: FormState, form: FormData): Promise<FormState> {
  const id = str(form, "id");

  const body = {
    name: str(form, "name") ?? "",
    description: str(form, "description"),
    categoryId: str(form, "categoryId"),
    priceMin: str(form, "priceMin"),
    priceMax: str(form, "priceMax"),
    contactMethod: str(form, "contactMethod"),
    images: imageList(form, "image"),
  };

  try {
    await authedFetch(id ? `/me/services/${id}` : "/me/services", {
      method: id ? "PUT" : "POST",
      body,
    });
  } catch (err) {
    return toFormState(err, "Couldn't save the service.");
  }

  revalidatePath("/dashboard/services");
  return { success: id ? "Service updated." : "Service added." };
}

export async function deleteServiceAction(id: string) {
  await authedFetch(`/me/services/${id}`, { method: "DELETE" });
  revalidatePath("/dashboard/services");
}

/* ---------------------------------- Posts ---------------------------------- */

export async function createPostAction(_prev: FormState, form: FormData): Promise<FormState> {
  try {
    await authedFetch("/me/posts", {
      method: "POST",
      body: {
        text: str(form, "text") ?? "",
        images: imageList(form, "image"),
        storeId: str(form, "storeId"),
      },
    });
  } catch (err) {
    return toFormState(err, "Couldn't publish your post.");
  }

  revalidatePath("/dashboard/posts");
  return { success: "Posted." };
}

export async function deletePostAction(id: string) {
  await authedFetch(`/me/posts/${id}`, { method: "DELETE" });
  revalidatePath("/dashboard/posts");
}

/* ------------------------------ Notifications ------------------------------ */

export async function markNotificationsReadAction() {
  await authedFetch("/me/notifications/read", { method: "POST" }).catch(() => {});
  revalidatePath("/dashboard/notifications");
}
