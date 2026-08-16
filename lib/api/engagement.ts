import "server-only";
import { apiFetch } from "./client";
import { getAccessToken } from "./session";
import type { Comment, Rating, Review, TargetType } from "./types";

export async function getComments(targetType: TargetType, targetId: string, limit = 30) {
  return apiFetch<Comment[]>("/engagement/comments", {
    token: await getAccessToken(),
    query: { targetType, targetId, limit },
  }).catch(() => [] as Comment[]);
}

export async function getReviews(targetType: TargetType, targetId: string, limit = 30) {
  return apiFetch<{ reviews: Review[]; rating: Rating }>("/engagement/reviews", {
    token: await getAccessToken(),
    query: { targetType, targetId, limit },
  }).catch(() => ({ reviews: [] as Review[], rating: { average: null, count: 0 } }));
}
