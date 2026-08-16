import { Badge } from "@/components/ui/primitives";
import { GROWTH } from "@/lib/utils";
import type { GrowthLevel } from "@/lib/api/types";

/**
 * Status is earned, so it's stated quietly — a hairline chip, not a loud fill.
 * Only the top tier gets the brand treatment.
 */
export function GrowthBadge({ level, className }: { level: GrowthLevel; className?: string }) {
  const { label, emoji } = GROWTH[level];

  return (
    <Badge variant={level === "FEATURED" ? "brand" : "outline"} className={className}>
      <span aria-hidden>{emoji}</span>
      {label}
    </Badge>
  );
}
