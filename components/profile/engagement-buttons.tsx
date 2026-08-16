"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Heart, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleFollow, toggleLike } from "@/lib/api/engagement-actions";
import { cn, formatCount } from "@/lib/utils";
import type { TargetType } from "@/lib/api/types";

/**
 * Both controls update optimistically — engagement should feel instant — and
 * roll back with a toast if the server disagrees. Signed-out users are sent to
 * log in with a return path rather than silently failing.
 */

export function LikeButton({
  targetType,
  targetId,
  initialLiked,
  initialCount,
  isAuthed,
  path,
}: {
  targetType: TargetType;
  targetId: string;
  initialLiked: boolean;
  initialCount: number;
  isAuthed: boolean;
  path: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [state, setOptimistic] = useOptimistic(
    { liked: initialLiked, count: initialCount },
    (_prev, next: { liked: boolean; count: number }) => next
  );

  function handleClick() {
    if (!isAuthed) {
      router.push(`/login?next=${encodeURIComponent(path)}`);
      return;
    }

    const next = !state.liked;
    startTransition(async () => {
      setOptimistic({ liked: next, count: state.count + (next ? 1 : -1) });
      const result = await toggleLike(targetType, targetId, next, path);
      if (!result.ok) toast.error(result.error);
    });
  }

  return (
    <Button
      variant="secondary"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={state.liked}
      className={cn(state.liked && "border-violet/60 bg-violet/10")}
    >
      <Heart className={cn("transition-colors", state.liked && "fill-violet text-violet")} />
      <span className="tabular-nums">{formatCount(state.count)}</span>
      <span className="sr-only">{state.liked ? "Unlike" : "Like"}</span>
    </Button>
  );
}

export function FollowButton({
  targetType,
  targetId,
  initialFollowing,
  isAuthed,
  path,
}: {
  targetType: TargetType;
  targetId: string;
  initialFollowing: boolean;
  isAuthed: boolean;
  path: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [following, setOptimistic] = useOptimistic(initialFollowing, (_p, next: boolean) => next);

  function handleClick() {
    if (!isAuthed) {
      router.push(`/login?next=${encodeURIComponent(path)}`);
      return;
    }

    const next = !following;
    startTransition(async () => {
      setOptimistic(next);
      const result = await toggleFollow(targetType, targetId, next, path);
      if (!result.ok) toast.error(result.error);
    });
  }

  return (
    <Button
      variant={following ? "secondary" : "primary"}
      onClick={handleClick}
      disabled={pending}
      aria-pressed={following}
    >
      {following ? <Check /> : <Plus />}
      {following ? "Following" : "Follow"}
    </Button>
  );
}
