import Link from "next/link";
import { PackagePlus, Search } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductRowActions } from "@/components/admin/ProductRowActions";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonStyles } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { Pagination } from "@/components/ui/Pagination";
import { createClient } from "@/lib/supabase/server";
import { escapeLike, formatRWF } from "@/lib/utils";
import type { Availability, ProductStatus } from "@/types";

const PER_PAGE = 10;

type Row = {
  id: string; name: string; product_code: string; price: number | null; image_url: string | null;
  status: ProductStatus; availability: Availability; category: { name: string } | null;
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; page?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 100);
  const category = /^[0-9a-f-]{36}$/i.test(sp.category ?? "") ? sp.category : undefined;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("id, name, product_code, price, image_url, status, availability, category:categories(name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
  if (q) query = query.ilike("name", `%${escapeLike(q)}%`);
  if (category) query = query.eq("category_id", category);

  const [{ data, count, error }, { data: categories }] = await Promise.all([
    query,
    supabase.from("categories").select("id, name").order("name"),
  ]);
  const rows = (data ?? []) as unknown as Row[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PER_PAGE));

  const hrefFor = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return `/admin/dashboard/products${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader
        title="Products"
        description={`${count ?? 0} product${count === 1 ? "" : "s"}`}
        actions={<Link href="/admin/dashboard/products/new" className={buttonStyles("primary", "sm")}><PackagePlus className="h-4 w-4" aria-hidden /> Add product</Link>}
      />

      <form method="get" className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-soft" aria-hidden />
          <Input name="q" defaultValue={q} placeholder="Search by name" aria-label="Search products" className="pl-9" />
        </div>
        <Select name="category" defaultValue={category ?? ""} aria-label="Filter by category" className="w-auto min-w-44">
          <option value="">All categories</option>
          {(categories ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
        <Button type="submit" variant="outline">Filter</Button>
        {(q || category) && <Link href="/admin/dashboard/products" className={buttonStyles("ghost")}>Clear</Link>}
      </form>

      {error && <p role="alert" className="mb-4 rounded-md bg-brand-soft px-4 py-3 text-sm text-brand-dark">Could not load products. Please refresh the page.</p>}

      <div className="overflow-x-auto rounded-lg border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-charcoal-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt="" loading="lazy" className="h-11 w-11 rounded object-cover" />
                    ) : (
                      <span className="h-11 w-11 rounded bg-line" aria-hidden />
                    )}
                    <div className="min-w-0">
                      <Link href={`/admin/dashboard/products/${p.id}/edit`} className="block max-w-64 truncate font-medium hover:text-brand">{p.name}</Link>
                      <p className="text-xs text-charcoal-soft">{p.product_code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-charcoal-soft">{p.category?.name ?? "–"}</td>
                <td className="whitespace-nowrap px-4 py-3">{formatRWF(p.price) ?? <span className="text-charcoal-soft">On request</span>}</td>
                <td className="px-4 py-3"><Badge tone={p.status === "published" ? "brand" : "muted"}>{p.status === "published" ? "Published" : "Draft"}</Badge></td>
                <td className="px-4 py-3"><Badge tone={p.availability === "in_stock" ? "neutral" : "muted"}>{p.availability === "in_stock" ? "In stock" : "Out of stock"}</Badge></td>
                <td className="px-4 py-3"><ProductRowActions id={p.id} name={p.name} status={p.status} /></td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-charcoal-soft">{q || category ? "No products match your filters." : "No products yet."}</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} hrefFor={hrefFor} />
    </>
  );
}
