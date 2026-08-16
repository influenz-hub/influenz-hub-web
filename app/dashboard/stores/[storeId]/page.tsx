import { notFound } from "next/navigation";
import { Package } from "lucide-react";
import { BackLink, ConsoleHeader } from "@/components/dashboard/console-shell";
import { ProductDialog } from "@/components/dashboard/entity-dialog";
import { ConfirmDelete } from "@/components/dashboard/confirm-delete";
import { Badge, EmptyState, Panel } from "@/components/ui/primitives";
import { getStoreProducts } from "@/lib/api/business";
import { deleteProductAction } from "@/lib/api/business-actions";
import { getCategories } from "@/lib/api/discovery";
import { ApiError } from "@/lib/api/client";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Products" };

export default async function StoreProductsPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  let data;
  try {
    data = await getStoreProducts(storeId);
  } catch (err) {
    // 403 as well as 404 — someone else's store simply doesn't exist for you.
    if (err instanceof ApiError && (err.status === 404 || err.status === 403)) notFound();
    throw err;
  }

  const categories = await getCategories();
  const lowStock = data.products.filter((p) => p.available && p.stock <= 3).length;

  return (
    <>
      <BackLink href="/dashboard/stores">All stores</BackLink>

      <ConsoleHeader
        title={data.store.name}
        description={
          lowStock > 0
            ? `${lowStock} ${lowStock === 1 ? "product is" : "products are"} low on stock.`
            : "Manage products and stock."
        }
        action={<ProductDialog storeId={storeId} categories={categories} />}
      />

      {data.products.length === 0 ? (
        <EmptyState
          icon={<Package className="size-5" />}
          title="No products in this store"
          description="Add your first product so people have something to browse."
          action={<ProductDialog storeId={storeId} categories={categories} />}
        />
      ) : (
        <ul className="space-y-3">
          {data.products.map((product) => (
            <li key={product.id}>
              <Panel className="flex flex-wrap items-center gap-4 p-5">
                <div className="min-w-40 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium">{product.name}</h2>
                    {product.available ? (
                      product.stock <= 3 ? (
                        <Badge variant="danger">Only {product.stock} left</Badge>
                      ) : (
                        <Badge variant="success">{product.stock} in stock</Badge>
                      )
                    ) : (
                      <Badge variant="outline">Sold out</Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm tabular-nums text-ink-muted">
                    {formatPrice(product.price)}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <ProductDialog storeId={storeId} product={product} categories={categories} />
                  <ConfirmDelete
                    label="product"
                    name={product.name}
                    onConfirm={deleteProductAction.bind(null, product.id, storeId)}
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
