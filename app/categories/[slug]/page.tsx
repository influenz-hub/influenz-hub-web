import { notFound, redirect } from "next/navigation";
import { getCategories } from "@/lib/api/discovery";

/** Pretty category URLs resolve to a filtered discover view. */
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) notFound();
  redirect(`/discover?categoryId=${category.id}`);
}
