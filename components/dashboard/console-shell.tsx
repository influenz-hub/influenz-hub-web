import Link from "next/link";
import { ConsoleNav, type ConsoleNavItem } from "./console-nav";

/**
 * Shared chrome for the two authenticated consoles (dashboard and admin). The
 * layout is deliberately denser than the public site — this is a working tool,
 * not an editorial page — while keeping the same tokens.
 */
export function ConsoleShell({
  title,
  items,
  children,
}: {
  title: string;
  items: ConsoleNavItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="container-page py-10">
      <div className="grid gap-10 lg:grid-cols-[13rem_1fr] lg:gap-14">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <p className="eyebrow mb-4">{title}</p>
          <ConsoleNav items={items} />
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

export function ConsoleHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-display-md">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-ink-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="mb-4 inline-block text-sm text-ink-subtle transition-colors hover:text-ink"
    >
      ← {children}
    </Link>
  );
}
