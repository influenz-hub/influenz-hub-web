import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { imageOr, timeAgo } from "@/lib/utils";
import type { Post } from "@/lib/api/types";

export function PostFeed({
  posts,
  author,
}: {
  posts: Post[];
  author?: { slug: string; businessName: string; logo: string | null };
}) {
  return (
    <ul className="max-w-2xl space-y-6">
      {posts.map((post) => {
        const by = post.profile ?? author;

        return (
          <li key={post.id} className="surface rounded-[var(--radius-md)] p-6">
            {by && (
              <div className="flex items-center gap-3">
                <Link href={`/profile/${by.slug}`}>
                  <Avatar src={by.logo} name={by.businessName} className="size-9" />
                </Link>
                <div>
                  <Link
                    href={`/profile/${by.slug}`}
                    className="text-sm font-medium text-ink hover:underline"
                  >
                    {by.businessName}
                  </Link>
                  <time className="block text-xs text-ink-subtle" dateTime={post.createdAt}>
                    {timeAgo(post.createdAt)}
                  </time>
                </div>
              </div>
            )}

            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">
              {post.text}
            </p>

            {post.images[0] && (
              <div className="relative mt-4 aspect-16/10 overflow-hidden rounded-[var(--radius-sm)] bg-surface-3">
                <Image
                  src={imageOr(post.images[0], `${post.id}-post`, 1000, 620)}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 640px"
                  className="image-fill"
                />
              </div>
            )}

            {(post.store || post.product) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.store && (
                  <Link
                    href={`/store/${post.store.slug}`}
                    className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-violet/50 hover:text-ink"
                  >
                    {post.store.name}
                  </Link>
                )}
                {post.product && (
                  <Link
                    href={`/product/${post.product.slug}`}
                    className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-violet/50 hover:text-ink"
                  >
                    {post.product.name}
                  </Link>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
