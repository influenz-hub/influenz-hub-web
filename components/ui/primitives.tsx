import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Typography                                                                  */
/* -------------------------------------------------------------------------- */

export function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("eyebrow", className)} {...props} />;
}

export function Deck({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-deck measure text-ink-muted", className)} {...props} />;
}

/**
 * Section headers keep the eyebrow → headline → deck rhythm consistent across
 * the site rather than each page inventing its own.
 */
export function SectionHeader({
  eyebrow,
  title,
  deck,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  deck?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-6", className)}>
      <div>
        {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
        <h2 className="text-display-lg measure-tight">{title}</h2>
        {deck && <Deck className="mt-4">{deck}</Deck>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Surfaces                                                                    */
/* -------------------------------------------------------------------------- */

export function Panel({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("surface rounded-[var(--radius-md)]", className)} {...props} />;
}

/* -------------------------------------------------------------------------- */
/* Badge                                                                       */
/* -------------------------------------------------------------------------- */

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border text-xs font-medium leading-none",
  {
    variants: {
      variant: {
        outline: "border-line-strong bg-surface-2/60 text-ink-muted",
        brand: "border-violet/40 bg-violet/10 text-lavender",
        solid: "gradient-brand border-transparent text-white",
        success: "border-success/30 bg-success/10 text-success",
        danger: "border-danger/30 bg-danger/10 text-danger",
      },
      size: {
        sm: "px-2 py-1",
        md: "px-3 py-1.5",
      },
    },
    defaultVariants: { variant: "outline", size: "sm" },
  }
);

export function Badge({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

/* -------------------------------------------------------------------------- */
/* Form controls                                                               */
/* -------------------------------------------------------------------------- */

const fieldStyles =
  "w-full rounded-[var(--radius-sm)] border border-line bg-surface-2 px-4 text-ink placeholder:text-ink-subtle transition-colors hover:border-line-strong focus:border-violet/60 disabled:opacity-50";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(fieldStyles, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(fieldStyles, "min-h-28 py-3 leading-relaxed", className)} {...props} />;
}

export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return <select className={cn(fieldStyles, "h-11 cursor-pointer pr-10", className)} {...props} />;
}

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-ink-subtle">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty & loading states                                                      */
/* -------------------------------------------------------------------------- */

/** Written, not blank: say what belongs here and offer the next action. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "surface flex flex-col items-center rounded-[var(--radius-md)] px-6 py-16 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-5 flex size-12 items-center justify-center rounded-full border border-line-strong bg-surface-2 text-ink-muted">
          {icon}
        </div>
      )}
      <h3 className="text-display-sm">{title}</h3>
      {description && <p className="measure-tight mt-2 text-sm text-ink-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-[var(--radius-sm)] bg-surface-2", className)}
      {...props}
    />
  );
}

/** Mirrors CreatorCard's proportions so nothing shifts when content arrives. */
export function CardSkeleton() {
  return (
    <div className="surface overflow-hidden rounded-[var(--radius-md)]">
      <Skeleton className="aspect-4/3 rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat                                                                        */
/* -------------------------------------------------------------------------- */

export function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="font-display text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs uppercase tracking-wide text-ink-subtle">{label}</p>
    </div>
  );
}
