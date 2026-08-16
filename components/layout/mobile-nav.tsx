"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, PlusCircle, Store, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/lib/api/types";

/** Bottom navigation per docs/STYLE.md §15. */
export function MobileNav({ session }: { session: SessionUser | null }) {
  const pathname = usePathname();
  const authed = Boolean(session);

  const items = [
    { href: "/", label: "Home", icon: Home },
    { href: "/discover", label: "Explore", icon: Compass },
    { href: authed ? "/dashboard/posts/new" : "/login", label: "Create", icon: PlusCircle },
    { href: "/stores", label: "Stores", icon: Store },
    { href: authed ? "/dashboard" : "/login", label: authed ? "You" : "Log in", icon: User },
  ];

  // The dashboard has its own navigation; a second bar would compete with it.
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) return null;

  return (
    <nav
      aria-label="Primary mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ground/90 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex h-16 items-stretch">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <li key={item.label} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
                  active ? "text-lavender" : "text-ink-subtle"
                )}
              >
                <Icon className="size-5" aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
