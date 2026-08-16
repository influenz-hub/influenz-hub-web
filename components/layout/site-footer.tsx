import Link from "next/link";
import { Wordmark } from "./wordmark";

const COLUMNS = [
  {
    title: "Discover",
    links: [
      { href: "/discover", label: "Everything" },
      { href: "/creators", label: "Creators" },
      { href: "/stores", label: "Stores" },
      { href: "/services", label: "Services" },
    ],
  },
  {
    title: "For creators",
    links: [
      { href: "/register", label: "Become an Indie" },
      { href: "/how-it-works", label: "How Influenz helps" },
      { href: "/dashboard", label: "Your dashboard" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="measure-tight mt-5 text-sm leading-relaxed text-ink-muted">
              A spotlight for independent creators, brands, and talents — not another catalogue.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-ink">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <p className="text-xs text-ink-subtle">
            © {new Date().getFullYear()} Influenz Hub
          </p>
          <p className="text-xs text-ink-subtle">
            Where independent ideas become influential.
          </p>
        </div>
      </div>
    </footer>
  );
}
