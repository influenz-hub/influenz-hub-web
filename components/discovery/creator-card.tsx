import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, MapPin } from "lucide-react";
import { GrowthBadge } from "./growth-badge";
import { cn, formatCount, imageOr } from "@/lib/utils";
import type { CreatorCard as Creator } from "@/lib/api/types";

/**
 * An editorial unit, not a product tile: the creator's face, their line of
 * story, and their standing. Two scales — `lead` anchors a section, `default`
 * supports it (docs/DESIGN.md, "Layout").
 */
export function CreatorCard({
  creator,
  variant = "default",
  priority,
}: {
  creator: Creator;
  variant?: "default" | "lead";
  priority?: boolean;
}) {
  const isLead = variant === "lead";

  return (
    <article className="group relative h-full">
      <Link
        href={`/profile/${creator.slug}`}
        className="surface card-interactive flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] hover:-translate-y-0.5 hover:border-violet/40"
      >
        <div
          className={cn(
            "relative overflow-hidden bg-surface-3",
            isLead ? "aspect-16/10" : "aspect-4/3"
          )}
        >
          <Image
            src={imageOr(creator.banner, `${creator.slug}-banner`, 1200, 800)}
            alt=""
            fill
            sizes={isLead ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 768px) 100vw, 33vw"}
            priority={priority}
            className="image-fill transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
          {/* Scrim so the badge stays legible over any photograph. */}
          <div className="absolute inset-0 bg-linear-to-t from-surface-1 via-surface-1/10 to-transparent" />
          <div className="absolute left-4 top-4">
            <GrowthBadge level={creator.growthLevel} />
          </div>
        </div>

        <div className={cn("flex flex-1 flex-col p-5", isLead && "p-7")}>
          <div className="flex items-start gap-3">
            <span className="relative -mt-11 size-14 shrink-0 overflow-hidden rounded-[14px] border-2 border-surface-1 bg-surface-3">
              <Image
                src={imageOr(creator.logo, `${creator.slug}-logo`, 200, 200)}
                alt=""
                fill
                sizes="56px"
                className="image-fill"
              />
            </span>
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            <h3 className={cn("font-display font-semibold", isLead ? "text-display-md" : "text-lg")}>
              {creator.businessName}
            </h3>
            {creator.verified && (
              <>
                <BadgeCheck className="size-4 shrink-0 text-violet" aria-hidden />
                <span className="sr-only">Verified</span>
              </>
            )}
          </div>

          <p className="mt-1 text-sm text-ink-subtle">
            {creator.category?.name ?? "Independent"}
            {creator.location && (
              <span className="ml-2 inline-flex items-center gap-1">
                <MapPin className="size-3" aria-hidden />
                {creator.location}
              </span>
            )}
          </p>

          {creator.description && (
            <p
              className={cn(
                "mt-3 text-sm leading-relaxed text-ink-muted",
                isLead ? "line-clamp-3" : "line-clamp-2"
              )}
            >
              {creator.description}
            </p>
          )}

          <div className="mt-auto flex items-center gap-4 pt-5 text-xs text-ink-subtle">
            <span>
              <strong className="font-semibold text-ink-muted">
                {formatCount(creator.followerCount)}
              </strong>{" "}
              followers
            </span>
            {creator.storeCount > 0 && (
              <span>
                <strong className="font-semibold text-ink-muted">{creator.storeCount}</strong>{" "}
                {creator.storeCount === 1 ? "store" : "stores"}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
