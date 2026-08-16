import { cn } from "@/lib/utils";

/**
 * The mark is a small gradient lozenge rather than a literal icon — it reads as
 * a brand at 24px where a detailed glyph would not.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="gradient-brand relative flex size-7 items-center justify-center rounded-[9px]">
        <span className="size-2 rounded-full bg-white/90" />
      </span>
      <span className="font-display text-[15px] font-bold tracking-tight">Influenz Hub</span>
    </span>
  );
}
