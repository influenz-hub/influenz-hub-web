import Link from "next/link";
import { ConsoleHeader } from "@/components/dashboard/console-shell";
import { FlagToggle } from "@/components/admin/controls";
import { EmptyState, Panel } from "@/components/ui/primitives";
import { listAdminBusinesses } from "@/lib/api/admin";
import { cn, formatCount } from "@/lib/utils";

export const metadata = { title: "Businesses" };

const FILTERS = [
  { label: "All", value: undefined },
  { label: "Awaiting verification", value: "false" },
  { label: "Verified", value: "true" },
];

export default async function AdminBusinessesPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string }>;
}) {
  const { verified } = await searchParams;
  const businesses = await listAdminBusinesses(undefined, verified);

  return (
    <>
      <ConsoleHeader
        title="Businesses"
        description="Verify businesses, and choose who gets featured on the homepage."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const active = verified === filter.value;
          return (
            <Link
              key={filter.label}
              href={filter.value ? `/admin/businesses?verified=${filter.value}` : "/admin/businesses"}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
                active
                  ? "border-violet/50 bg-violet/10 text-lavender"
                  : "border-line text-ink-muted hover:text-ink"
              )}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      {businesses.length === 0 ? (
        <EmptyState title="No businesses here" description="Nothing matches that filter." />
      ) : (
        <ul className="space-y-2">
          {businesses.map((business) => (
            <li key={business.id}>
              <Panel className="flex flex-wrap items-center gap-4 p-4">
                <div className="min-w-40 flex-1">
                  <Link
                    href={`/profile/${business.slug}`}
                    className="text-sm font-medium text-ink hover:underline"
                  >
                    {business.businessName}
                  </Link>
                  <p className="truncate text-xs text-ink-subtle">
                    {business.category?.name ?? "Uncategorised"} ·{" "}
                    {formatCount(business.followerCount)} followers · {business._count.stores} stores
                    {business.user.email && ` · ${business.user.email}`}
                  </p>
                </div>

                <div className="flex items-center gap-5">
                  <FlagToggle
                    profileId={business.id}
                    flag="verified"
                    value={business.verified}
                    label="Verified"
                  />
                  <FlagToggle
                    profileId={business.id}
                    flag="featured"
                    value={business.featured}
                    label="Featured"
                  />
                </div>
              </Panel>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
