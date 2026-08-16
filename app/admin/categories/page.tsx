import { ConsoleHeader } from "@/components/dashboard/console-shell";
import { CategoryForm } from "@/components/admin/category-form";
import { ConfirmDelete } from "@/components/dashboard/confirm-delete";
import { Panel } from "@/components/ui/primitives";
import { listAdminCategories } from "@/lib/api/admin";
import { deleteCategoryAction } from "@/lib/api/admin-actions";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const categories = await listAdminCategories();

  return (
    <>
      <ConsoleHeader
        title="Categories"
        description="How everything on Influenz Hub is organised. A category in use can't be deleted."
      />

      <CategoryForm />

      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id}>
            <Panel className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-medium text-ink">{category.name}</p>
                <p className="text-xs text-ink-subtle">
                  {category.usage === 0
                    ? "Not used yet"
                    : `Used by ${category.usage} ${category.usage === 1 ? "listing" : "listings"}`}
                </p>
              </div>

              {category.usage === 0 && (
                <ConfirmDelete
                  label="category"
                  name={category.name}
                  onConfirm={deleteCategoryAction.bind(null, category.id)}
                />
              )}
            </Panel>
          </li>
        ))}
      </ul>
    </>
  );
}
