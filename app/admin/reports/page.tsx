import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { ConsoleHeader } from "@/components/dashboard/console-shell";
import { ReportStatusSelect } from "@/components/admin/controls";
import { Badge, EmptyState, Panel } from "@/components/ui/primitives";
import { listAdminReports } from "@/lib/api/admin";
import { cn, timeAgo } from "@/lib/utils";
import type { ReportStatus } from "@/lib/api/types";

export const metadata = { title: "Reports" };

const FILTERS: { label: string; value?: ReportStatus }[] = [
  { label: "All", value: undefined },
  { label: "Open", value: "OPEN" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Dismissed", value: "DISMISSED" },
];

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: ReportStatus }>;
}) {
  const { status } = await searchParams;
  const reports = await listAdminReports(status);

  return (
    <>
      <ConsoleHeader title="Reports" description="Content flagged by people using Influenz Hub." />

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <Link
            key={filter.label}
            href={filter.value ? `/admin/reports?status=${filter.value}` : "/admin/reports"}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
              status === filter.value
                ? "border-violet/50 bg-violet/10 text-lavender"
                : "border-line text-ink-muted hover:text-ink"
            )}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      {reports.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="size-5" />}
          title="Nothing to review"
          description="No reports match this filter — the platform is quiet."
        />
      ) : (
        <ul className="space-y-2">
          {reports.map((report) => (
            <li key={report.id}>
              <Panel className="flex flex-wrap items-start justify-between gap-4 p-5">
                <div className="min-w-48 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{report.targetType}</Badge>
                    <time className="text-xs text-ink-subtle" dateTime={report.createdAt}>
                      {timeAgo(report.createdAt)}
                    </time>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{report.reason}</p>
                  <p className="mt-2 text-xs text-ink-subtle">
                    Reported by {report.reporter.name ?? report.reporter.email ?? "a user"}
                  </p>
                </div>

                <ReportStatusSelect id={report.id} status={report.status} />
              </Panel>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
