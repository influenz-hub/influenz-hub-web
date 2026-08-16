import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { ConsoleHeader } from "@/components/dashboard/console-shell";
import { GrowthBadge } from "@/components/discovery/growth-badge";
import { Button } from "@/components/ui/button";
import { EmptyState, Panel, Stat } from "@/components/ui/primitives";
import { getMyProfile, getMyStats } from "@/lib/api/business";
import { getSession } from "@/lib/api/session";
import { formatCount } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [session, profile] = await Promise.all([getSession(), getMyProfile()]);

  // Onboarding: without a profile there is nothing else to manage yet.
  if (!profile) {
    return (
      <>
        <ConsoleHeader title={`Welcome, ${session?.name ?? "there"}`} />
        <EmptyState
          icon={<Sparkles className="size-5" />}
          title="Set up your business profile"
          description="Your profile is your public page on Influenz Hub. Once it exists you can add stores, products, and services."
          action={
            <Button asChild>
              <Link href="/dashboard/profile">
                Create your profile <ArrowRight />
              </Link>
            </Button>
          }
        />
      </>
    );
  }

  const stats = await getMyStats(14).catch(() => null);
  const productCount = stats?.totals.products ?? 0;

  return (
    <>
      <ConsoleHeader
        title={profile.businessName}
        description="How your presence is doing."
        action={
          <Button variant="secondary" asChild>
            <Link href={`/profile/${profile.slug}`}>
              View public page <ArrowUpRight />
            </Link>
          </Button>
        }
      />

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <GrowthBadge level={profile.growthLevel} />
        {profile.verified && <span className="text-xs text-ink-subtle">Verified business</span>}
      </div>

      <Panel className="p-7">
        <div className="grid grid-cols-2 gap-7 sm:grid-cols-4">
          <Stat label="Followers" value={formatCount(profile.followerCount)} />
          <Stat label="Likes" value={formatCount(profile.likeCount)} />
          <Stat label="Profile views" value={formatCount(stats?.totals.views ?? 0)} />
          <Stat label="Products" value={productCount} />
        </div>
      </Panel>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <QuickAction
          href="/dashboard/stores"
          title="Stores & products"
          note={`${profile.stores.length} ${profile.stores.length === 1 ? "store" : "stores"}`}
        />
        <QuickAction
          href="/dashboard/services"
          title="Services"
          note={`${profile.services.length} listed`}
        />
        <QuickAction href="/dashboard/posts/new" title="Publish an update" note="Share what's new" />
      </div>
    </>
  );
}

function QuickAction({ href, title, note }: { href: string; title: string; note: string }) {
  return (
    <Link
      href={href}
      className="surface card-interactive group flex items-center justify-between rounded-[var(--radius-md)] p-5 hover:border-violet/40"
    >
      <span>
        <span className="block text-sm font-medium text-ink">{title}</span>
        <span className="block text-xs text-ink-subtle">{note}</span>
      </span>
      <ArrowRight className="size-4 text-ink-subtle transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
