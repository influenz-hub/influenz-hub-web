import Link from "next/link";
import { redirect } from "next/navigation";
import { Newspaper, Plus } from "lucide-react";
import { ConsoleHeader } from "@/components/dashboard/console-shell";
import { ConfirmDelete } from "@/components/dashboard/confirm-delete";
import { Button } from "@/components/ui/button";
import { EmptyState, Panel } from "@/components/ui/primitives";
import { getMyPosts, getMyProfile } from "@/lib/api/business";
import { deletePostAction } from "@/lib/api/business-actions";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "Posts" };

export default async function DashboardPostsPage() {
  const profile = await getMyProfile();
  if (!profile) redirect("/dashboard/profile");

  const posts = await getMyPosts();

  const newPostButton = (
    <Button asChild>
      <Link href="/dashboard/posts/new">
        <Plus /> New post
      </Link>
    </Button>
  );

  return (
    <>
      <ConsoleHeader
        title="Posts"
        description="Updates that appear on your profile and notify your followers."
        action={newPostButton}
      />

      {posts.length === 0 ? (
        <EmptyState
          icon={<Newspaper className="size-5" />}
          title="Nothing posted yet"
          description="Updates keep followers coming back — announce a restock, a new piece, or an event."
          action={newPostButton}
        />
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li key={post.id}>
              <Panel className="flex items-start gap-4 p-5">
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">
                    {post.text}
                  </p>
                  <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-subtle">
                    <time dateTime={post.createdAt}>{timeAgo(post.createdAt)}</time>
                    {post.store && <span>· {post.store.name}</span>}
                  </p>
                </div>

                <ConfirmDelete
                  label="post"
                  name={post.text.slice(0, 40)}
                  onConfirm={deletePostAction.bind(null, post.id)}
                />
              </Panel>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
