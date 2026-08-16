"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type ConsoleNavItem = {
  href: string;
  label: string;
  /**
   * A rendered element, not a component reference — component functions can't
   * cross the server/client boundary, but elements serialize fine.
   */
  icon: React.ReactNode;
};

export function ConsoleNav({ items }: { items: ConsoleNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Console" className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {items.map((item) => {
        // The index route must match exactly, or it stays active everywhere.
        const active =
          pathname === item.href ||
          (item.href.split("/").length > 2 && pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm transition-colors",
              active ? "bg-surface-2 text-ink" : "text-ink-muted hover:bg-surface-1 hover:text-ink"
            )}
          >
            <span aria-hidden className="shrink-0">
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
