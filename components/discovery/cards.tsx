import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Heart, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { formatCount, formatPrice, formatPriceRange, imageOr } from "@/lib/utils";
import type { ProductCard as Product, ServiceCard as Service, StoreCard as Store } from "@/lib/api/types";

export function StoreCard({ store }: { store: Store }) {
  return (
    <article className="group h-full">
      <Link
        href={`/store/${store.slug}`}
        className="surface card-interactive flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] hover:-translate-y-0.5 hover:border-violet/40"
      >
        <div className="relative aspect-4/3 overflow-hidden bg-surface-3">
          <Image
            src={imageOr(store.images[0], `${store.slug}-store`, 900, 700)}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="image-fill transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
          {store.category && (
            <Badge className="glass absolute left-3 top-3 !text-ink">{store.category.name}</Badge>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-lg font-semibold leading-snug">{store.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-ink-subtle">
            {store.profile.businessName}
            {store.profile.verified && (
              <BadgeCheck className="size-3.5 text-violet" aria-label="Verified" />
            )}
          </p>

          <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs text-ink-subtle">
            {store.location ? (
              <span className="inline-flex items-center gap-1 truncate">
                <MapPin className="size-3 shrink-0" aria-hidden />
                {store.location}
              </span>
            ) : (
              <span>{store.productCount} products</span>
            )}
            <span className="inline-flex shrink-0 items-center gap-1">
              <Heart className="size-3" aria-hidden />
              {formatCount(store.likeCount)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const price = formatPrice(product.price);

  return (
    <article className="group h-full">
      <Link href={`/product/${product.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-square overflow-hidden rounded-[var(--radius-sm)] border border-line bg-surface-2">
          <Image
            src={imageOr(product.images[0], `${product.slug}-product`, 700, 700)}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="image-fill transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
          {!product.available && (
            <div className="absolute inset-0 grid place-items-center bg-ground/70">
              <Badge variant="outline">Sold out</Badge>
            </div>
          )}
        </div>

        <div className="pt-3.5">
          <h3 className="line-clamp-1 text-sm font-medium text-ink transition-colors group-hover:text-lavender">
            {product.name}
          </h3>
          <p className="mt-0.5 truncate text-xs text-ink-subtle">{product.store.name}</p>
          {price && <p className="mt-1.5 text-sm font-semibold tabular-nums">{price}</p>}
        </div>
      </Link>
    </article>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  const price = formatPriceRange(service.priceMin, service.priceMax);

  return (
    <article className="group h-full">
      <Link
        href={`/service/${service.slug}`}
        className="surface card-interactive flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] hover:-translate-y-0.5 hover:border-violet/40"
      >
        <div className="relative aspect-16/10 overflow-hidden bg-surface-3">
          <Image
            src={imageOr(service.images[0], `${service.slug}-service`, 900, 560)}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="image-fill transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-base font-semibold leading-snug">{service.name}</h3>
          <p className="mt-1 text-sm text-ink-subtle">{service.profile.businessName}</p>
          {service.description && (
            <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-ink-muted">
              {service.description}
            </p>
          )}
          {price && (
            <p className="mt-auto pt-4 text-sm font-semibold tabular-nums text-lavender">{price}</p>
          )}
        </div>
      </Link>
    </article>
  );
}
