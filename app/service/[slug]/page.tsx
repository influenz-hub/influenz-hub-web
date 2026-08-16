import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Mail } from "lucide-react";
import { Comments } from "@/components/profile/comments";
import { Reviews, Stars } from "@/components/profile/reviews";
import { LikeButton } from "@/components/profile/engagement-buttons";
import { Badge, SectionHeader } from "@/components/ui/primitives";
import { getService } from "@/lib/api/discovery";
import { getComments, getReviews } from "@/lib/api/engagement";
import { getSession } from "@/lib/api/session";
import { ApiError } from "@/lib/api/client";
import { formatPriceRange, imageOr } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  try {
    const service = await getService(slug);
    return { title: service.name, description: service.description ?? undefined };
  } catch {
    return { title: "Service" };
  }
}

export default async function ServicePage({ params }: { params: Params }) {
  const { slug } = await params;

  let service;
  try {
    service = await getService(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const [session, comments, reviewData] = await Promise.all([
    getSession(),
    getComments("SERVICE", service.id),
    getReviews("SERVICE", service.id),
  ]);

  const path = `/service/${service.slug}`;
  const price = formatPriceRange(service.priceMin, service.priceMax);
  const isOwner = session?.profile?.slug === service.profile.slug;

  return (
    <article className="container-page py-12 sm:py-16">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="relative aspect-4/3 overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface-2">
          <Image
            src={imageOr(service.images[0], `${service.slug}-service`, 1000, 750)}
            alt={service.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="image-fill"
          />
        </div>

        <div className="lg:py-4">
          <Link
            href={`/profile/${service.profile.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            {service.profile.businessName}
            {service.profile.verified && (
              <BadgeCheck className="size-3.5 text-violet" aria-label="Verified" />
            )}
          </Link>

          <h1 className="text-display-lg mt-3">{service.name}</h1>

          {reviewData.rating.count > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <Stars value={reviewData.rating.average ?? 0} />
              <span className="text-sm text-ink-subtle">
                {reviewData.rating.average?.toFixed(1)} ({reviewData.rating.count})
              </span>
            </div>
          )}

          {price && <p className="mt-7 font-display text-3xl font-bold tabular-nums">{price}</p>}

          {service.category && (
            <div className="mt-4">
              <Badge>{service.category.name}</Badge>
            </div>
          )}

          {service.description && (
            <p className="measure mt-7 leading-relaxed text-ink-muted">{service.description}</p>
          )}

          <div className="mt-9 flex flex-wrap items-center gap-2.5">
            <LikeButton
              targetType="SERVICE"
              targetId={service.id}
              initialLiked={service.viewerHasLiked ?? false}
              initialCount={service.likeCount}
              isAuthed={Boolean(session)}
              path={path}
            />
          </div>

          {service.contactMethod && (
            <p className="mt-8 flex items-center gap-2 border-t border-line pt-6 text-sm text-ink-muted">
              <Mail className="size-4 text-ink-subtle" aria-hidden />
              <span className="break-all">{service.contactMethod}</span>
            </p>
          )}
        </div>
      </div>

      <div className="mt-20 grid gap-16 lg:grid-cols-2">
        <section>
          <SectionHeader title="Reviews" />
          <div className="mt-8">
            <Reviews
              targetType="SERVICE"
              targetId={service.id}
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
              targetType="SERVICE"
              targetId={service.id}
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
