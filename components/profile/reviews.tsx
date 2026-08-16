"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/primitives";
import { submitReview } from "@/lib/api/engagement-actions";
import { cn, timeAgo } from "@/lib/utils";
import type { Rating, Review, TargetType } from "@/lib/api/types";

export function Stars({ value, size = "sm" }: { value: number; size?: "sm" | "md" }) {
  return (
    <span
      className="inline-flex gap-0.5"
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(
            size === "sm" ? "size-3.5" : "size-5",
            i <= Math.round(value) ? "fill-lavender text-lavender" : "text-line-strong"
          )}
        />
      ))}
    </span>
  );
}

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <fieldset className="flex items-center gap-1">
      <legend className="sr-only">Your rating</legend>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
          aria-pressed={value === i}
          className="rounded p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              "size-6",
              i <= value ? "fill-lavender text-lavender" : "text-line-strong"
            )}
          />
        </button>
      ))}
    </fieldset>
  );
}

export function Reviews({
  targetType,
  targetId,
  initialReviews,
  rating,
  isAuthed,
  canReview,
  path,
}: {
  targetType: TargetType;
  targetId: string;
  initialReviews: Review[];
  rating: Rating;
  isAuthed: boolean;
  canReview: boolean;
  path: string;
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [summary, setSummary] = useState(rating);
  const [score, setScore] = useState(5);
  const [text, setText] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await submitReview(targetType, targetId, score, text, path);
      if (result.ok) {
        setSummary(result.data.rating);
        setReviews((prev) => [
          result.data.review,
          ...prev.filter((r) => r.id !== result.data.review.id),
        ]);
        setText("");
        toast.success("Thanks for the review.");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Stars value={summary.average ?? 0} size="md" />
        <p className="text-sm text-ink-muted">
          {summary.average ? (
            <>
              <strong className="font-semibold text-ink tabular-nums">
                {summary.average.toFixed(1)}
              </strong>{" "}
              · {summary.count} {summary.count === 1 ? "review" : "reviews"}
            </>
          ) : (
            "No reviews yet"
          )}
        </p>
      </div>

      {isAuthed && canReview && (
        <form onSubmit={handleSubmit} className="surface space-y-4 rounded-[var(--radius-md)] p-5">
          <StarInput value={score} onChange={setScore} />
          <Textarea
            value={text}
            maxLength={1000}
            onChange={(e) => setText(e.target.value)}
            placeholder="How was it? (optional)"
          />
          <Button type="submit" size="sm" loading={pending}>
            Submit review
          </Button>
        </form>
      )}

      {!isAuthed && (
        <p className="surface rounded-[var(--radius-sm)] px-5 py-4 text-sm text-ink-muted">
          <Link
            href={`/login?next=${encodeURIComponent(path)}`}
            className="text-lavender underline underline-offset-4"
          >
            Sign in
          </Link>{" "}
          to leave a review.
        </p>
      )}

      {reviews.length > 0 && (
        <ul className="space-y-6">
          {reviews.map((review) => (
            <li key={review.id} className="flex gap-3.5">
              <Avatar src={review.user.image} name={review.user.name} className="size-9" />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-baseline gap-2">
                  <span className="text-sm font-medium text-ink">
                    {review.user.name ?? "Someone"}
                  </span>
                  <time className="text-xs text-ink-subtle" dateTime={review.createdAt}>
                    {timeAgo(review.createdAt)}
                  </time>
                </p>
                <div className="mt-1">
                  <Stars value={review.rating} />
                </div>
                {review.text && (
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{review.text}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
