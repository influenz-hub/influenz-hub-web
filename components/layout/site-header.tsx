import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLinks } from "./nav-links";
import { UserMenu } from "./user-menu";
import { Wordmark } from "./wordmark";
import type { SessionUser } from "@/lib/api/types";

export const NAV_ITEMS = [
  { href: "/discover", label: "Discover" },
  { href: "/creators", label: "Creators" },
  { href: "/stores", label: "Stores" },
  { href: "/services", label: "Services" },
];

export function SiteHeader({ session }: { session: SessionUser | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ground/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center gap-8">
        <Link href="/" className="shrink-0" aria-label="Influenz Hub — home">
          <Wordmark />
        </Link>

        <NavLinks items={NAV_ITEMS} className="hidden md:flex" />

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="quiet"
            size="icon"
            asChild
            className="hidden sm:inline-flex"
          >
            <Link href="/discover" aria-label="Search Influenz Hub">
              <Search />
            </Link>
          </Button>

          {session ? (
            <UserMenu session={session} />
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="quiet" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Become an Indie</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
