import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck, Globe, Mail, MapPin } from "lucide-react";
import { PostFeed } from "@/components/profile/post-feed";
import { Comments } from "@/components/profile/comments";
import { FollowButton, LikeButton } from "@/components/profile/engagement-buttons";
import { GrowthBadge } from "@/components/discovery/growth-badge";
import { ServiceCard, StoreCard } from "@/components/discovery/cards";
import { Deck, SectionHeader, Stat } from "@/components/ui/primitives";
import { getProfile } from "@/lib/api/discovery";
import { getComments } from "@/lib/api/engagement";
import { getSession } from "@/lib/api/session";
import { ApiError } from "@/lib/api/client";
import { formatCount, imageOr } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  try {
    const profile = await getProfile(slug);
    return {
      title: profile.businessName,
      description: profile.description ?? undefined,
    };
  } catch {
    return { title: "Creator" };
  }
}

export default async function ProfilePage({ params }: { params: Params }) {
  const { slug } = await params;

  let profile;
  try {
    profile = await getProfile(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const [session, comments] = await Promise.all([
    getSession(),
    getComments("PROFILE", profile.id),
  ]);

  const path = `/profile/${profile.slug}`;
  const isOwner = session?.profile?.id === profile.id;

  return (
    <article>
      {/* Banner: full-bleed, with a scrim so the header below stays readable. */}
      <div className="relative h-52 w-full overflow-hidden bg-surface-2 sm:h-72">
        <Image
          src={imageOr(profile.banner, `${profile.slug}-banner`, 1800, 600)}
          alt=""
          fill
          priority
          sizes="100vw"
          className="image-fill"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ground via-ground/40 to-transparent" />
      </div>

      <header className="container-page relative -mt-16 pb-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex items-end gap-5">
            <span className="relative size-28 shrink-0 overflow-hidden rounded-[var(--radius-md)] border-2 border-ground bg-surface-3 sm:size-32">
              <Image
                src={imageOr(profile.logo, `${profile.slug}-logo`, 300, 300)}
                alt=""
                fill
                sizes="128px"
                className="image-fill"
              />
            </span>

            <div className="pb-1">
              <GrowthBadge level={profile.growthLevel} className="mb-3" />
              <h1 className="text-display-md flex items-center gap-2">
                {profile.businessName}
                {profile.verified && (
                  <>
                    <BadgeCheck className="size-5 text-violet" aria-hidden />
                    <span className="sr-only">Verified</span>
                  </>
                )}
              </h1>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-subtle">
                {profile.category && <span>{profile.category.name}</span>}
                {profile.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" aria-hidden />
                    {profile.location}
                  </span>
                )}
              </p>
            </div>
          </div>

          {!isOwner && (
            <div className="flex gap-2.5">
              <LikeButton
                targetType="PROFILE"
                targetId={profile.id}
                initialLiked={profile.viewerHasLiked}
                initialCount={profile.likeCount}
                isAuthed={Boolean(session)}
                path={path}
              />
              <FollowButton
                targetType="PROFILE"
                targetId={profile.id}
                initialFollowing={profile.viewerIsFollowing ?? false}
                isAuthed={Boolean(session)}
                path={path}
              />
            </div>
          )}
        </div>

        {profile.description && <Deck className="mt-8">{profile.description}</Deck>}

        <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-5 border-y border-line py-6">
          <Stat label="Followers" value={formatCount(profile.followerCount)} />
          <Stat label="Profile views" value={formatCount(profile.viewCount)} />
          <Stat label="Stores" value={profile.stores.length} />
          <Stat label="Services" value={profile.services.length} />

          <div className="ml-auto flex flex-wrap gap-4 text-sm">
            {profile.contactEmail && (
              <a
                href={`mailto:${profile.contactEmail}`}
                className="inline-flex items-center gap-1.5 text-ink-muted transition-colors hover:text-ink"
              >
                <Mail className="size-4" aria-hidden />
                Contact
              </a>
            )}
            {profile.socialLinks &&
              Object.entries(profile.socialLinks).map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 capitalize text-ink-muted transition-colors hover:text-ink"
                >
                  <Globe className="size-4" aria-hidden />
                  {name}
                </a>
              ))}
          </div>
        </div>
      </header>

      <div className="container-page space-y-16 pb-24">
        {profile.stores.length > 0 && (
          <section>
            <SectionHeader title="Stores" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {profile.stores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={{
                    ...store,
                    profile: {
                      slug: profile.slug,
                      businessName: profile.businessName,
                      verified: profile.verified,
                      logo: profile.logo,
                    },
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {profile.services.length > 0 && (
          <section>
            <SectionHeader title="Services" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {profile.services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={{
                    ...service,
                    profile: {
                      slug: profile.slug,
                      businessName: profile.businessName,
                      verified: profile.verified,
                      logo: profile.logo,
                    },
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {profile.posts.length > 0 && (
          <section>
            <SectionHeader eyebrow="Updates" title="From the studio" />
            <div className="mt-8">
              <PostFeed
                posts={profile.posts}
                author={{
                  slug: profile.slug,
                  businessName: profile.businessName,
                  logo: profile.logo,
                }}
              />
            </div>
          </section>
        )}

        <section>
          <SectionHeader title="Comments" />
          <div className="mt-8 max-w-2xl">
            <Comments
              targetType="PROFILE"
              targetId={profile.id}
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
