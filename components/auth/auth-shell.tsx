import Link from "next/link";
import { Wordmark } from "@/components/layout/wordmark";

/**
 * Auth pages get their own composition: a single centred column on a quiet
 * ground, with one ambient glow so it still feels like the same product.
 */
export function AuthShell({
  eyebrow,
  title,
  deck,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  deck?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden px-6 py-16">
      <div className="glow-ambient -top-32 left-1/2 h-[360px] w-[520px] -translate-x-1/2" aria-hidden />

      <div className="relative w-full max-w-md">
        <div className="mb-9 text-center">
          <Link href="/" className="inline-flex" aria-label="Influenz Hub — home">
            <Wordmark />
          </Link>
          <p className="eyebrow mt-8">{eyebrow}</p>
          <h1 className="text-display-md mt-3">{title}</h1>
          {deck && <p className="mt-3 text-sm leading-relaxed text-ink-muted">{deck}</p>}
        </div>

        <div className="surface rounded-[var(--radius-lg)] p-7">{children}</div>

        {footer && <div className="mt-7 text-center text-sm text-ink-muted">{footer}</div>}
      </div>
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-[var(--radius-sm)] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
    >
      {message}
    </p>
  );
}

export function FormSuccess({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="status"
      className="rounded-[var(--radius-sm)] border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
    >
      {message}
    </p>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="h-px flex-1 bg-line" />
      <span className="text-xs uppercase tracking-wider text-ink-subtle">{label}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
