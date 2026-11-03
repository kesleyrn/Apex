import { CategoryManager, type CategoryRow } from "@/components/admin/CategoryManager";
import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/server";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*, products(count)").order("name");

  const rows: CategoryRow[] = ((data ?? []) as unknown as (Omit<CategoryRow, "product_count"> & { products: { count: number }[] })[]).map(
    ({ products, ...c }) => ({ ...c, product_count: products?.[0]?.count ?? 0 }),
  );

  return (
    <>
      <PageHeader title="Categories" description="Categories with products cannot be deleted. Hide them instead." />
      <CategoryManager categories={rows} />
    </>
  );
}
