import { redirect } from "next/navigation";
import { ConsoleHeader } from "@/components/dashboard/console-shell";
import { StatsChart } from "@/components/dashboard/stats-chart";
import { Panel, Stat } from "@/components/ui/primitives";
import { getMyProfile, getMyStats } from "@/lib/api/business";
import { formatCount } from "@/lib/utils";

export const metadata = { title: "Statistics" };

export default async function StatisticsPage() {
  const profile = await getMyProfile();
  if (!profile) redirect("/dashboard/profile");

  const stats = await getMyStats(14);
  const recent = stats.series.reduce(
    (acc, day) => ({
      views: acc.views + day.views,
      follows: acc.follows + day.follows,
      likes: acc.likes + day.likes,
    }),
    { views: 0, follows: 0, likes: 0 }
  );

  return (
    <>
      <ConsoleHeader title="Statistics" description="The last 14 days, and your totals." />

      <div className="space-y-4">
        <Panel className="p-7">
          <div className="grid grid-cols-2 gap-7 sm:grid-cols-4">
            <Stat label="Total followers" value={formatCount(stats.totals.followers)} />
            <Stat label="Total likes" value={formatCount(stats.totals.likes)} />
            <Stat label="Total views" value={formatCount(stats.totals.views)} />
            <Stat label="Products live" value={stats.totals.products} />
          </div>
        </Panel>

        <Panel className="p-7">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-display text-base font-semibold">Last 14 days</h2>
            <p className="text-xs text-ink-subtle">
              {recent.views} views · {recent.follows} new followers · {recent.likes} likes
            </p>
          </div>
          <StatsChart data={stats.series} />
        </Panel>
      </div>
    </>
  );
}
