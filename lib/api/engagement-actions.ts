"use server";

import { revalidatePath } from "next/cache";
import { authedFetch } from "./auth-actions";
import { ApiError } from "./client";
import type { Comment, Rating, Review, TargetType } from "./types";

export type EngagementResult<T> = { ok: true; data: T } | { ok: false; error: string };

function fail(err: unknown, fallback: string) {
  const message = err instanceof ApiError ? err.message : fallback;
  return { ok: false as const, error: message };
}

export async function toggleLike(
  targetType: TargetType,
  targetId: string,
  liked: boolean,
  path: string
): Promise<EngagementResult<{ liked: boolean; likeCount: number }>> {
  try {
    const data = await authedFetch<{ liked: boolean; likeCount: number }>("/engagement/likes", {
      method: "POST",
      body: { targetType, targetId, liked },
    });
    revalidatePath(path);
    return { ok: true, data };
  } catch (err) {
    return fail(err, "Couldn't update your like.");
  }
}

export async function toggleFollow(
  targetType: TargetType,
  targetId: string,
  following: boolean,
  path: string
): Promise<EngagementResult<{ following: boolean; followerCount: number }>> {
  try {
    const data = await authedFetch<{ following: boolean; followerCount: number }>(
      "/engagement/follows",
      { method: "POST", body: { targetType, targetId, following } }
    );
    revalidatePath(path);
    return { ok: true, data };
  } catch (err) {
    return fail(err, "Couldn't update follow.");
  }
}

export async function postComment(
  targetType: TargetType,
  targetId: string,
  text: string,
  path: string
): Promise<EngagementResult<Comment>> {
  try {
    const data = await authedFetch<Comment>("/engagement/comments", {
      method: "POST",
      body: { targetType, targetId, text },
    });
    revalidatePath(path);
    return { ok: true, data };
  } catch (err) {
    return fail(err, "Couldn't post your comment.");
  }
}

export async function submitReview(
  targetType: TargetType,
  targetId: string,
  rating: number,
  text: string,
  path: string
): Promise<EngagementResult<{ review: Review; rating: Rating }>> {
  try {
    const data = await authedFetch<{ review: Review; rating: Rating }>("/engagement/reviews", {
      method: "PUT",
      body: { targetType, targetId, rating, text: text || undefined },
    });
    revalidatePath(path);
    return { ok: true, data };
  } catch (err) {
    return fail(err, "Couldn't submit your review.");
  }
}

/**
 * Fire-and-forget: a failed view count should never surface to the reader or
 * block the page, so failures are swallowed deliberately.
 */
export async function recordView(targetType: TargetType, targetId: string) {
  await authedFetch("/engagement/views", {
    method: "POST",
    body: { targetType, targetId },
  }).catch(() => {});
}
