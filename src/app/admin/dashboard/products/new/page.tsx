import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("id, name").order("name");

  return (
    <>
      <PageHeader title="Add new product" description="Fill in the details. Drafts stay hidden until you publish them." />
      {categories && categories.length > 0 ? (
        <ProductForm categories={categories} />
      ) : (
        <p className="rounded-lg border border-line bg-white p-6 text-sm">
          You need at least one category first. <Link href="/admin/dashboard/categories" className="text-brand underline">Add a category</Link>.
        </p>
      )}
    </>
  );
}
