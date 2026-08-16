import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Clock, MapPin, Package, Phone } from "lucide-react";
import { ProductCard } from "@/components/discovery/cards";
import { Comments } from "@/components/profile/comments";
import { Reviews } from "@/components/profile/reviews";
import { PostFeed } from "@/components/profile/post-feed";
import { FollowButton, LikeButton } from "@/components/profile/engagement-buttons";
import { Deck, EmptyState, Panel, SectionHeader, Stat } from "@/components/ui/primitives";
import { getStore } from "@/lib/api/discovery";
import { getComments, getReviews } from "@/lib/api/engagement";
import { getSession } from "@/lib/api/session";
import { ApiError } from "@/lib/api/client";
import { formatCount, imageOr } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  try {
    const store = await getStore(slug);
    return { title: store.name, description: store.description ?? undefined };
  } catch {
    return { title: "Store" };
  }
}

export default async function StorePage({ params }: { params: Params }) {
  const { slug } = await params;

  let store;
  try {
    store = await getStore(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const [session, comments, reviewData] = await Promise.all([
    getSession(),
    getComments("STORE", store.id),
    getReviews("STORE", store.id),
  ]);

  const path = `/store/${store.slug}`;
  const isOwner = session?.profile?.id === store.profile.id;

  return (
    <article>
      <div className="relative aspect-21/9 max-h-[420px] w-full overflow-hidden bg-surface-2">
        <Image
          src={imageOr(store.images[0], `${store.slug}-store`, 1800, 780)}
          alt=""
          fill
          priority
          sizes="100vw"
          className="image-fill"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ground via-ground/50 to-transparent" />
      </div>

      <div className="container-page relative -mt-24 pb-24">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Link
              href={`/profile/${store.profile.slug}`}
              className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {store.profile.businessName}
              {store.profile.verified && (
                <BadgeCheck className="size-3.5 text-violet" aria-label="Verified" />
              )}
            </Link>
            <h1 className="text-display-lg mt-2">{store.name}</h1>
          </div>

          {!isOwner && (
            <div className="flex gap-2.5">
              <LikeButton
                targetType="STORE"
                targetId={store.id}
                initialLiked={store.viewerHasLiked}
                initialCount={store.likeCount}
                isAuthed={Boolean(session)}
                path={path}
              />
              <FollowButton
                targetType="STORE"
                targetId={store.id}
                initialFollowing={store.viewerIsFollowing}
                isAuthed={Boolean(session)}
                path={path}
              />
            </div>
          )}
        </header>

        {store.description && <Deck className="mt-7">{store.description}</Deck>}

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <div className="min-w-0 space-y-16">
            <section>
              <SectionHeader title="Products" />
              <div className="mt-8">
                {store.products.length === 0 ? (
                  <EmptyState
                    icon={<Package className="size-5" />}
                    title="Nothing listed yet"
                    description="This store hasn't added products — check back soon."
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3">
                    {store.products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={{
                          ...product,
                          store: {
                            slug: store.slug,
                            name: store.name,
                            profile: {
                              slug: store.profile.slug,
                              businessName: store.profile.businessName,
                            },
                          },
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>

            {store.posts.length > 0 && (
              <section>
                <SectionHeader eyebrow="Updates" title="Latest news" />
                <div className="mt-8">
                  <PostFeed posts={store.posts} />
                </div>
              </section>
            )}

            <section>
              <SectionHeader title="Reviews" />
              <div className="mt-8 max-w-2xl">
                <Reviews
                  targetType="STORE"
                  targetId={store.id}
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
              <div className="mt-8 max-w-2xl">
                <Comments
                  targetType="STORE"
                  targetId={store.id}
                  initialComments={comments}
                  isAuthed={Boolean(session)}
                  path={path}
                />
              </div>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <Panel className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <Stat label="Followers" value={formatCount(store.followerCount)} />
                <Stat label="Likes" value={formatCount(store.likeCount)} />
                <Stat label="Views" value={formatCount(store.viewCount)} />
              </div>
            </Panel>

            <Panel className="space-y-5 p-6">
              <h2 className="font-display text-base font-semibold">Details</h2>

              {store.category && (
                <p className="text-sm text-ink-muted">
                  <span className="text-ink-subtle">Category</span>
                  <br />
                  {store.category.name}
                </p>
              )}

              {store.location && (
                <p className="flex items-start gap-2.5 text-sm text-ink-muted">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-ink-subtle" aria-hidden />
                  {store.location}
                </p>
              )}

              {store.contactInfo && (
                <p className="flex items-start gap-2.5 break-all text-sm text-ink-muted">
                  <Phone className="mt-0.5 size-4 shrink-0 text-ink-subtle" aria-hidden />
                  {store.contactInfo}
                </p>
              )}

              {store.openingHours && (
                <div className="text-sm">
                  <p className="mb-2.5 flex items-center gap-2.5 font-medium text-ink">
                    <Clock className="size-4 text-ink-subtle" aria-hidden />
                    Opening hours
                  </p>
                  <dl className="space-y-1.5 text-ink-muted">
                    {Object.entries(store.openingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between gap-4">
                        <dt>{day}</dt>
                        <dd className="tabular-nums">{hours}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </Panel>
          </aside>
        </div>
      </div>
    </article>
  );
}
