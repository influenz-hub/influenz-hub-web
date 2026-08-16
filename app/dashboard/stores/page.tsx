import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Store } from "lucide-react";
import { ConsoleHeader } from "@/components/dashboard/console-shell";
import { StoreDialog } from "@/components/dashboard/entity-dialog";
import { ConfirmDelete } from "@/components/dashboard/confirm-delete";
import { EmptyState, Panel } from "@/components/ui/primitives";
import { getMyProfile, getMyStores } from "@/lib/api/business";
import { deleteStoreAction } from "@/lib/api/business-actions";
import { getCategories } from "@/lib/api/discovery";
import { formatCount } from "@/lib/utils";

export const metadata = { title: "Stores" };

export default async function DashboardStoresPage() {
  const profile = await getMyProfile();
  if (!profile) redirect("/dashboard/profile");

  const [stores, categories] = await Promise.all([getMyStores(), getCategories()]);

  return (
    <>
      <ConsoleHeader
        title="Stores"
        description="Each store holds its own products and stock."
        action={<StoreDialog categories={categories} />}
      />

      {stores.length === 0 ? (
        <EmptyState
          icon={<Store className="size-5" />}
          title="No stores yet"
          description="Create your first store, then start adding products to it."
          action={<StoreDialog categories={categories} />}
        />
      ) : (
        <ul className="space-y-3">
          {stores.map((store) => (
            <li key={store.id}>
              <Panel className="flex flex-wrap items-center gap-4 p-5">
                <div className="min-w-40 flex-1">
                  <h2 className="font-display font-semibold">{store.name}</h2>
                  <p className="mt-0.5 text-xs text-ink-subtle">
                    {store.productCount} {store.productCount === 1 ? "product" : "products"} ·{" "}
                    {formatCount(store.followerCount)} followers · {formatCount(store.likeCount)} likes
                  </p>
                </div>

                <Link
                  href={`/dashboard/stores/${store.id}`}
                  className="inline-flex items-center gap-1.5 text-sm text-lavender transition-colors hover:text-ink"
                >
                  Manage products <ArrowRight className="size-3.5" />
                </Link>

                <div className="flex items-center gap-1">
                  <StoreDialog store={store} categories={categories} />
                  <ConfirmDelete
                    label="store"
                    name={store.name}
                    onConfirm={deleteStoreAction.bind(null, store.id)}
                  />
                </div>
              </Panel>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
