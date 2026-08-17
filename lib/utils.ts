import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { GrowthLevel } from "./api/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** ISO 4217 code for the West African CFA franc. */
export const CURRENCY = "XOF";
export const CURRENCY_LABEL = "F CFA";

/**
 * The CFA franc has no subunit in circulation, so prices are always whole
 * numbers — formatting with decimals would imply a precision that doesn't
 * exist. `fr-FR` is used because that's how amounts are written across the
 * CFA zone: `25 000 F CFA`, space-separated, symbol last.
 */
export function formatPrice(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return null;
  const num = typeof value === "number" ? value : Number.parseFloat(value);
  if (Number.isNaN(num)) return null;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatPriceRange(min: string | null, max: string | null) {
  const lo = formatPrice(min);
  const hi = formatPrice(max);
  if (lo && hi) return lo === hi ? lo : `${lo} – ${hi}`;
  return lo ?? hi ?? null;
}

export function formatCount(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: value >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export function timeAgo(date: string | Date) {
  const then = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.round((Date.now() - then.getTime()) / 1000);

  const steps: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
  ];

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  let value = seconds;

  for (const [limit, unit] of steps) {
    if (Math.abs(value) < limit) return formatter.format(-Math.round(value), unit);
    value /= limit;
  }
  return formatter.format(-Math.round(value), "year");
}

/** Growth levels from docs/STYLE.md §16. */
export const GROWTH: Record<GrowthLevel, { label: string; emoji: string }> = {
  EMERGING: { label: "Emerging", emoji: "🌱" },
  GROWING: { label: "Growing", emoji: "🔥" },
  INFLUENTIAL: { label: "Influential", emoji: "💎" },
  FEATURED: { label: "Featured", emoji: "👑" },
};

/**
 * Placeholder imagery until real uploads exist. Deterministic per key so a
 * given creator keeps the same image between renders.
 */
export function placeholder(key: string, w = 800, h = 600) {
  return `https://picsum.photos/seed/${encodeURIComponent(key)}/${w}/${h}`;
}

export function imageOr(src: string | null | undefined, key: string, w?: number, h?: number) {
  return src || placeholder(key, w, h);
}

export function initials(name: string | null | undefined) {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
