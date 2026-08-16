"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

export function Avatar({
  src,
  name,
  className,
}: {
  src?: string | null;
  name?: string | null;
  className?: string;
}) {
  const label = name ?? "";
  const fallback =
    label
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "?";

  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full border border-line",
        className
      )}
    >
      <AvatarPrimitive.Image
        src={src ?? undefined}
        alt={label}
        className="size-full object-cover"
      />
      <AvatarPrimitive.Fallback
        className="flex size-full items-center justify-center bg-surface-3 text-xs font-semibold text-ink-muted"
        delayMs={200}
      >
        {fallback}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
