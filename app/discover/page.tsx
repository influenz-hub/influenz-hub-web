import Link from "next/link";
import { SearchX } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { FilterBar } from "@/components/discovery/filter-bar";
import { CreatorCard } from "@/components/discovery/creator-card";
import { ProductCard, ServiceCard, StoreCard } from "@/components/discovery/cards";
import { EmptyState, SectionHeader } from "@/components/ui/primitives";
import { getCategories, getHomeFeed, search } from "@/lib/api/discovery";

export const metadata = { title: "Discover" };

type SearchParams = Promise<{ q?: string; categoryId?: string }>;

export default async function DiscoverPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const isSearching = Boolean(params.q || params.categoryId);
  const categories = await getCategories();

  return (
    <>
      <PageHeader
        eyebrow="Explore everything"
        title={isSearching ? "Search results" : "Discover"}
        deck={
          isSearching
            ? undefined
            : "Creators, stores, products, and services — all in one place."
        }
      >
        <FilterBar
          action="/discover"
          categories={categories}
          placeholder="Search creators, stores, products…"
          values={params}
          showSort={false}
        />

        {!isSearching && (
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/discover?categoryId=${category.id}`}
                className="rounded-full border border-line px-4 py-2 text-sm text-ink-muted transition-colors hover:border-violet/50 hover:text-ink"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </PageHeader>

      <div className="container-page py-14">
        {isSearching ? (
          <SearchResults q={params.q} categoryId={params.categoryId} />
        ) : (
          <BrowseEverything />
        )}
      </div>
    </>
  );
}

async function SearchResults({ q, categoryId }: { q?: string; categoryId?: string }) {
  const results = await search({ q, categoryId, limit: 12 });
  const total =
    results.creators.length +
    results.stores.length +
    results.products.length +
    results.services.length;

  if (total === 0) {
    return (
      <EmptyState
        icon={<SearchX className="size-5" />}
        title={q ? `Nothing found for "${q}"` : "Nothing here yet"}
        description="Try a different word, or browse by category instead."
      />
    );
  }

  return (
    <div className="space-y-16">
      {results.creators.length > 0 && (
        <section>
          <SectionHeader title="Creators" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.creators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        </section>
      )}

      {results.stores.length > 0 && (
        <section>
          <SectionHeader title="Stores" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {results.stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </section>
      )}

      {results.products.length > 0 && (
        <section>
          <SectionHeader title="Products" />
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {results.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {results.services.length > 0 && (
        <section>
          <SectionHeader title="Services" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {results.services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

async function BrowseEverything() {
  const { creators, stores, products } = await getHomeFeed();

  return (
    <div className="space-y-16">
      <section>
        <SectionHeader
          eyebrow={creators[0]?.personalized ? "Based on who you follow" : "Trending"}
          title="Creators to know"
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Stores" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Just listed" />
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
