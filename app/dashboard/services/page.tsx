import { redirect } from "next/navigation";
import { Wrench } from "lucide-react";
import { ConsoleHeader } from "@/components/dashboard/console-shell";
import { ServiceDialog } from "@/components/dashboard/entity-dialog";
import { ConfirmDelete } from "@/components/dashboard/confirm-delete";
import { EmptyState, Panel } from "@/components/ui/primitives";
import { getMyProfile } from "@/lib/api/business";
import { deleteServiceAction } from "@/lib/api/business-actions";
import { getCategories } from "@/lib/api/discovery";
import { formatPriceRange } from "@/lib/utils";

export const metadata = { title: "Services" };

export default async function DashboardServicesPage() {
  const profile = await getMyProfile();
  if (!profile) redirect("/dashboard/profile");

  const categories = await getCategories();
  const services = profile.services;

  return (
    <>
      <ConsoleHeader
        title="Services"
        description="Work you take on to order, alongside your stores."
        action={<ServiceDialog categories={categories} />}
      />

      {services.length === 0 ? (
        <EmptyState
          icon={<Wrench className="size-5" />}
          title="No services listed"
          description="List the work you do to order — consulting, design, photography, anything."
          action={<ServiceDialog categories={categories} />}
        />
      ) : (
        <ul className="space-y-3">
          {services.map((service) => {
            const price = formatPriceRange(service.priceMin, service.priceMax);
            return (
              <li key={service.id}>
                <Panel className="flex flex-wrap items-center gap-4 p-5">
                  <div className="min-w-40 flex-1">
                    <h2 className="font-medium">{service.name}</h2>
                    <p className="mt-0.5 text-sm text-ink-muted">
                      {price ?? "Price on request"}
                      {service.category && (
                        <span className="text-ink-subtle"> · {service.category.name}</span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <ServiceDialog service={service} categories={categories} />
                    <ConfirmDelete
                      label="service"
                      name={service.name}
                      onConfirm={deleteServiceAction.bind(null, service.id)}
                    />
                  </div>
                </Panel>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
