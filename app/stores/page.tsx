import { Store } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { FilterBar } from "@/components/discovery/filter-bar";
import { StoreCard } from "@/components/discovery/cards";
import { EmptyState } from "@/components/ui/primitives";
import { getCategories, listStores } from "@/lib/api/discovery";

export const metadata = { title: "Stores" };

type SearchParams = Promise<{ q?: string; categoryId?: string; sort?: string }>;

export default async function StoresPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const [categories, { data: stores }] = await Promise.all([
    getCategories(),
    listStores({
      q: params.q,
      categoryId: params.categoryId,
      sort: params.sort as "popular" | "newest" | "featured" | undefined,
      limit: 24,
    }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Open for business"
        title="Stores"
        deck="Shops run by the people who make the work."
      >
        <FilterBar
          action="/stores"
          categories={categories}
          placeholder="Search stores…"
          values={params}
        />
      </PageHeader>

      <div className="container-page py-14">
        {stores.length === 0 ? (
          <EmptyState
            icon={<Store className="size-5" />}
            title="No stores match that"
            description="Try a broader search, or clear the filters to see everything."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
