import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/primitives";
import type { Category } from "@/lib/api/types";

/**
 * A plain GET form: filters live in the URL, so results are shareable,
 * bookmarkable, and work without JavaScript.
 */
export function FilterBar({
  action,
  categories,
  placeholder = "Search…",
  values,
  showSort = true,
}: {
  action: string;
  categories: Category[];
  placeholder?: string;
  values: { q?: string; categoryId?: string; sort?: string };
  showSort?: boolean;
}) {
  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <div className="relative min-w-56 flex-1">
        <label htmlFor="filter-q" className="sr-only">
          Search
        </label>
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-subtle"
          aria-hidden
        />
        <Input
          id="filter-q"
          name="q"
          type="search"
          defaultValue={values.q}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>

      <div>
        <label htmlFor="filter-category" className="sr-only">
          Category
        </label>
        <Select
          id="filter-category"
          name="categoryId"
          defaultValue={values.categoryId ?? ""}
          className="w-44"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>

      {showSort && (
        <div>
          <label htmlFor="filter-sort" className="sr-only">
            Sort by
          </label>
          <Select id="filter-sort" name="sort" defaultValue={values.sort ?? "popular"} className="w-40">
            <option value="popular">Most followed</option>
            <option value="newest">Newest</option>
            <option value="featured">Featured</option>
          </Select>
        </div>
      )}

      <Button type="submit" variant="secondary">
        Apply
      </Button>
    </form>
  );
}
