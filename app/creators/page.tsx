import { Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { FilterBar } from "@/components/discovery/filter-bar";
import { CreatorCard } from "@/components/discovery/creator-card";
import { EmptyState } from "@/components/ui/primitives";
import { getCategories, listCreators } from "@/lib/api/discovery";

export const metadata = { title: "Creators" };

type SearchParams = Promise<{ q?: string; categoryId?: string; sort?: string }>;

export default async function CreatorsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const [categories, { data: creators }] = await Promise.all([
    getCategories(),
    listCreators({
      q: params.q,
      categoryId: params.categoryId,
      sort: params.sort as "popular" | "newest" | "featured" | undefined,
      limit: 24,
    }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="The people"
        title="Creators"
        deck="Independent makers, studios, and small brands — each building something of their own."
      >
        <FilterBar
          action="/creators"
          categories={categories}
          placeholder="Search creators…"
          values={params}
        />
      </PageHeader>

      <div className="container-page py-14">
        {creators.length === 0 ? (
          <EmptyState
            icon={<Users className="size-5" />}
            title="No creators match that"
            description="Try a broader search, or clear the filters to see everyone."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {creators.map((creator, i) => (
              <CreatorCard key={creator.id} creator={creator} priority={i < 3} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
