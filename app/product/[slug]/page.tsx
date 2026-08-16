import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Store as StoreIcon } from "lucide-react";
import { ProductCard } from "@/components/discovery/cards";
import { Comments } from "@/components/profile/comments";
import { Reviews, Stars } from "@/components/profile/reviews";
import { LikeButton } from "@/components/profile/engagement-buttons";
import { Badge, SectionHeader } from "@/components/ui/primitives";
import { getProduct } from "@/lib/api/discovery";
import { getComments, getReviews } from "@/lib/api/engagement";
import { getSession } from "@/lib/api/session";
import { ApiError } from "@/lib/api/client";
import { formatPrice, imageOr } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  try {
    const product = await getProduct(slug);
    return { title: product.name, description: product.description ?? undefined };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;

  let product;
  try {
    product = await getProduct(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const [session, comments, reviewData] = await Promise.all([
    getSession(),
    getComments("PRODUCT", product.id),
    getReviews("PRODUCT", product.id),
  ]);

  const path = `/product/${product.slug}`;
  const price = formatPrice(product.price);
  const isOwner = session?.profile?.slug === product.store.profile.slug;

  return (
    <article className="container-page py-12 sm:py-16">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface-2">
          <Image
            src={imageOr(product.images[0], `${product.slug}-product`, 1000, 1000)}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="image-fill"
          />
        </div>

        <div className="lg:py-4">
          <Link
            href={`/store/${product.store.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            <StoreIcon className="size-3.5" aria-hidden />
            {product.store.name}
            {product.store.profile.verified && (
              <BadgeCheck className="size-3.5 text-violet" aria-label="Verified" />
            )}
          </Link>

          <h1 className="text-display-lg mt-3">{product.name}</h1>

          {reviewData.rating.count > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <Stars value={reviewData.rating.average ?? 0} />
              <span className="text-sm text-ink-subtle">
                {reviewData.rating.average?.toFixed(1)} ({reviewData.rating.count})
              </span>
            </div>
          )}

          {price && (
            <p className="mt-7 font-display text-4xl font-bold tabular-nums">{price}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            {product.available ? (
              <Badge variant="success">In stock · {product.stock} available</Badge>
            ) : (
              <Badge variant="danger">Sold out</Badge>
            )}
            {product.category && <Badge>{product.category.name}</Badge>}
          </div>

          {product.description && (
            <p className="measure mt-7 leading-relaxed text-ink-muted">{product.description}</p>
          )}

          <div className="mt-9 flex flex-wrap gap-2.5">
            <LikeButton
              targetType="PRODUCT"
              targetId={product.id}
              initialLiked={product.viewerHasLiked ?? false}
              initialCount={product.likeCount}
              isAuthed={Boolean(session)}
              path={path}
            />
          </div>

          <p className="mt-8 border-t border-line pt-6 text-sm text-ink-subtle">
            Sold by{" "}
            <Link
              href={`/profile/${product.store.profile.slug}`}
              className="text-lavender underline-offset-4 hover:underline"
            >
              {product.store.profile.businessName}
            </Link>
          </p>
        </div>
      </div>

      {product.related.length > 0 && (
        <section className="mt-20">
          <SectionHeader title={`More from ${product.store.name}`} />
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
            {product.related.map((item) => (
              <ProductCard
                key={item.id}
                product={{
                  ...item,
                  description: null,
                  stock: 0,
                  createdAt: "",
                  category: null,
                  likeCount: 0,
                  store: {
                    slug: product.store.slug,
                    name: product.store.name,
                    profile: product.store.profile,
                  },
                }}
              />
            ))}
          </div>
        </section>
      )}

      <div className="mt-20 grid gap-16 lg:grid-cols-2">
        <section>
          <SectionHeader title="Reviews" />
          <div className="mt-8">
            <Reviews
              targetType="PRODUCT"
              targetId={product.id}
              initialReviews={reviewData.reviews}
              rating={reviewData.rating}
              isAuthed={Boolean(session)}
              canReview={!isOwner}
              path={path}
            />
          </div>
        </section>

        <section>
          <SectionHeader title="Comments" />
          <div className="mt-8">
            <Comments
              targetType="PRODUCT"
              targetId={product.id}
              initialComments={comments}
              isAuthed={Boolean(session)}
              path={path}
            />
          </div>
        </section>
      </div>
    </article>
  );
}
