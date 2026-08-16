"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState, Textarea } from "@/components/ui/primitives";
import { postComment } from "@/lib/api/engagement-actions";
import { timeAgo } from "@/lib/utils";
import type { Comment, TargetType } from "@/lib/api/types";

const MAX = 500;

export function Comments({
  targetType,
  targetId,
  initialComments,
  isAuthed,
  path,
}: {
  targetType: TargetType;
  targetId: string;
  initialComments: Comment[];
  isAuthed: boolean;
  path: string;
}) {
  const [text, setText] = useState("");
  const [pending, startTransition] = useTransition();

  /**
   * Locally-posted comments are held separately and merged on top of the server
   * list, rather than copying props into state and syncing with an effect. When
   * revalidation delivers the real row, deduping by id drops the local copy.
   */
  const [justPosted, setJustPosted] = useState<Comment[]>([]);

  const comments = useMemo(() => {
    const seen = new Set(initialComments.map((c) => c.id));
    return [...justPosted.filter((c) => !seen.has(c.id)), ...initialComments];
  }, [initialComments, justPosted]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const value = text.trim();
    if (!value) return;

    startTransition(async () => {
      const result = await postComment(targetType, targetId, value, path);
      if (result.ok) {
        setJustPosted((prev) => [result.data, ...prev]);
        setText("");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-8">
      {isAuthed ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="comment" className="sr-only">
            Add a comment
          </label>
          <Textarea
            id="comment"
            value={text}
            maxLength={MAX}
            onChange={(e) => setText(e.target.value)}
            placeholder="Say something…"
            className="min-h-24"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-subtle">
              {text.length}/{MAX}
            </span>
            <Button type="submit" size="sm" loading={pending} disabled={!text.trim()}>
              Post comment
            </Button>
          </div>
        </form>
      ) : (
        <p className="surface rounded-[var(--radius-sm)] px-5 py-4 text-sm text-ink-muted">
          <Link
            href={`/login?next=${encodeURIComponent(path)}`}
            className="text-lavender underline underline-offset-4"
          >
            Sign in
          </Link>{" "}
          to join the conversation.
        </p>
      )}

      {comments.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="size-5" />}
          title="No comments yet"
          description="Be the first to say something."
        />
      ) : (
        <ul className="space-y-6">
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-3.5">
              <Avatar src={comment.user.image} name={comment.user.name} className="size-9" />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-baseline gap-2">
                  <span className="text-sm font-medium text-ink">
                    {comment.user.name ?? "Someone"}
                  </span>
                  <time className="text-xs text-ink-subtle" dateTime={comment.createdAt}>
                    {timeAgo(comment.createdAt)}
                  </time>
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">
                  {comment.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
