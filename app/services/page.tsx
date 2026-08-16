import { Wrench } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { FilterBar } from "@/components/discovery/filter-bar";
import { ServiceCard } from "@/components/discovery/cards";
import { EmptyState } from "@/components/ui/primitives";
import { getCategories, listServices } from "@/lib/api/discovery";

export const metadata = { title: "Services" };

type SearchParams = Promise<{ q?: string; categoryId?: string }>;

export default async function ServicesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const [categories, { data: services }] = await Promise.all([
    getCategories(),
    listServices({ q: params.q, categoryId: params.categoryId, limit: 24 }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Hire independently"
        title="Services"
        deck="Design, development, photography, consulting — offered directly by the people doing it."
      >
        <FilterBar
          action="/services"
          categories={categories}
          placeholder="Search services…"
          values={params}
          showSort={false}
        />
      </PageHeader>

      <div className="container-page py-14">
        {services.length === 0 ? (
          <EmptyState
            icon={<Wrench className="size-5" />}
            title="No services match that"
            description="Try a broader search, or clear the filters."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
