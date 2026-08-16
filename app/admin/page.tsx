import Link from "next/link";
import { ConsoleHeader } from "@/components/dashboard/console-shell";
import { Panel, Stat } from "@/components/ui/primitives";
import { getAdminOverview } from "@/lib/api/admin";
import { formatCount } from "@/lib/utils";

export const metadata = { title: "Admin" };

export default async function AdminOverviewPage() {
  const overview = await getAdminOverview();

  const totals = [
    { label: "Users", value: overview.users },
    { label: "Businesses", value: overview.businesses },
    { label: "Stores", value: overview.stores },
    { label: "Products", value: overview.products },
  ];

  const queues = [
    {
      label: "Open reports",
      value: overview.openReports,
      href: "/admin/reports?status=OPEN",
      urgent: overview.openReports > 0,
    },
    {
      label: "Awaiting verification",
      value: overview.unverified,
      href: "/admin/businesses?verified=false",
      urgent: false,
    },
  ];

  return (
    <>
      <ConsoleHeader title="Overview" description="Platform health at a glance." />

      <div className="space-y-4">
        <Panel className="p-7">
          <div className="grid grid-cols-2 gap-7 sm:grid-cols-4">
            {totals.map((item) => (
              <Stat key={item.label} label={item.label} value={formatCount(item.value)} />
            ))}
          </div>
        </Panel>

        <div className="grid gap-4 sm:grid-cols-2">
          {queues.map((queue) => (
            <Link
              key={queue.label}
              href={queue.href}
              className="surface card-interactive rounded-[var(--radius-md)] p-6 hover:border-violet/40"
            >
              <p className="font-display text-3xl font-semibold tabular-nums">{queue.value}</p>
              <p className="mt-1 text-sm text-ink-muted">{queue.label}</p>
              {queue.urgent && (
                <p className="mt-2 text-xs text-danger">Needs review</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
