import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, ArrowUpRight, Compass, ShieldCheck, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CardGridSkeleton,
  Deck,
  Eyebrow,
  SectionHeader,
  Skeleton,
} from "@/components/ui/primitives";
import { CreatorCard } from "@/components/discovery/creator-card";
import { ProductCard, StoreCard } from "@/components/discovery/cards";
import { getHomeFeed } from "@/lib/api/discovery";

/* -------------------------------------------------------------------------- */
/* Hero — asymmetric and left-aligned: the statement leads, the proof sits      */
/* beside it. A centred hero would flatten that relationship.                   */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="glow-ambient -top-40 left-[10%] h-[420px] w-[520px]" aria-hidden />

      <div className="container-page relative grid gap-16 py-(--spacing-section) lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div className="animate-rise">
          <Eyebrow>Where independent ideas become influential</Eyebrow>

          <h1 className="text-display-xl mt-6">
            Discover the minds behind{" "}
            <span className="text-gradient-brand">the next big things.</span>
          </h1>

          <Deck className="mt-7">
            Influenz Hub is a spotlight for independent creators, stores, and makers — the people
            building something real, before everyone else finds them.
          </Deck>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link href="/discover">
                Start exploring <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">Become an Indie</Link>
            </Button>
          </div>
        </div>

        {/* The growth ladder doubles as proof that this is a platform for
            progression, not a static directory (STYLE.md §16). */}
        <div className="animate-rise [animation-delay:120ms]">
          <div className="surface rounded-[var(--radius-lg)] p-7">
            <Eyebrow>The Indie ladder</Eyebrow>
            <ul className="mt-5 space-y-1">
              {[
                { emoji: "🌱", label: "Emerging", note: "Just getting started" },
                { emoji: "🔥", label: "Growing", note: "Building real momentum" },
                { emoji: "💎", label: "Influential", note: "Established and trusted" },
                { emoji: "👑", label: "Featured", note: "Front and centre" },
              ].map((tier, i) => (
                <li
                  key={tier.label}
                  className="flex items-center gap-4 rounded-[var(--radius-sm)] px-3 py-3 transition-colors hover:bg-surface-2"
                  style={{ opacity: 0.55 + i * 0.15 }}
                >
                  <span className="text-xl" aria-hidden>
                    {tier.emoji}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-ink">{tier.label}</span>
                    <span className="block text-xs text-ink-subtle">{tier.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Featured creators — one lead at scale, the rest supporting.                  */
/* -------------------------------------------------------------------------- */

async function FeaturedCreators() {
  const { creators } = await getHomeFeed();
  if (creators.length === 0) return null;

  const [lead, ...rest] = creators;

  return (
    <section className="container-page py-(--spacing-section)">
      <SectionHeader
        eyebrow={creators[0]?.personalized ? "Picked for you" : "In the spotlight"}
        title="Creators worth knowing"
        deck="People building something with their own hands, their own way."
        action={
          <Button variant="secondary" asChild>
            <Link href="/creators">
              All creators <ArrowUpRight />
            </Link>
          </Button>
        }
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        {lead && <CreatorCard creator={lead} variant="lead" priority />}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:content-start">
          {rest.slice(0, 2).map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </div>

      {rest.length > 2 && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(2, 5).map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */

async function TrendingStores() {
  const { stores } = await getHomeFeed();
  if (stores.length === 0) return null;

  return (
    <section className="border-y border-line bg-surface-1/40">
      <div className="container-page py-(--spacing-section)">
        <SectionHeader
          eyebrow="Open now"
          title="Stores people are finding"
          action={
            <Button variant="secondary" asChild>
              <Link href="/stores">
                All stores <ArrowUpRight />
              </Link>
            </Button>
          }
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>
    </section>
  );
}

async function NewProducts() {
  const { products } = await getHomeFeed();
  if (products.length === 0) return null;

  return (
    <section className="container-page py-(--spacing-section)">
      <SectionHeader eyebrow="Fresh" title="Just listed" />
      <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function HowItHelps() {
  const items = [
    {
      icon: Compass,
      title: "Get discovered",
      body: "Reach people already looking for what you make — by category, by place, by what they follow.",
    },
    {
      icon: TrendingUp,
      title: "Grow, visibly",
      body: "Views, followers, and engagement in one place, and a level that moves as you do.",
    },
    {
      icon: ShieldCheck,
      title: "Earn trust",
      body: "Verification and real reviews so a first-time visitor knows you're worth buying from.",
    },
  ];

  return (
    <section className="border-t border-line">
      <div className="container-page py-(--spacing-section)">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Eyebrow>For creators</Eyebrow>
            <h2 className="text-display-lg mt-4 measure-tight">
              Built for the people doing the work.
            </h2>
            <Button className="mt-8" asChild>
              <Link href="/register">
                Become an Indie <ArrowRight />
              </Link>
            </Button>
          </div>

          <ul className="space-y-px">
            {items.map((item) => (
              <li key={item.title} className="border-t border-line py-7 first:border-t-0 first:pt-0">
                <div className="flex gap-5">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-line-strong text-lavender">
                    <item.icon className="size-4" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                    <p className="measure mt-1.5 text-sm leading-relaxed text-ink-muted">
                      {item.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function SectionSkeleton() {
  return (
    <div className="container-page py-(--spacing-section)">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-4 h-10 w-80 max-w-full" />
      <div className="mt-12">
        <CardGridSkeleton count={3} />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<SectionSkeleton />}>
        <FeaturedCreators />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <TrendingStores />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <NewProducts />
      </Suspense>
      <HowItHelps />
    </>
  );
}
