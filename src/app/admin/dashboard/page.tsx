import Link from "next/link";
import { ExternalLink, PackagePlus, Tags } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { formatRWF } from "@/lib/utils";
import type { DashboardStats } from "@/types";

export default async function OverviewPage() {
  const supabase = await createClient();
  const [{ data: statsData }, { data: recent }] = await Promise.all([
    supabase.rpc("dashboard_stats"),
    supabase.from("products").select("id, name, product_code, price, image_url, status, created_at").order("created_at", { ascending: false }).limit(5),
  ]);
  const stats = (statsData as unknown as DashboardStats | null) ?? null;

  const cards = [
    { label: "Total products", value: stats?.total_products },
    { label: "Categories", value: stats?.total_categories },
    { label: "Published", value: stats?.published_products },
    { label: "Drafts", value: stats?.draft_products },
    { label: "Out of stock", value: stats?.out_of_stock },
  ];

  return (
    <>
      <PageHeader
        title="Overview"
        description="A quick look at your catalogue."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/dashboard/products/new" className={buttonStyles("primary", "sm")}><PackagePlus className="h-4 w-4" aria-hidden /> Add product</Link>
            <Link href="/admin/dashboard/categories" className={buttonStyles("outline", "sm")}><Tags className="h-4 w-4" aria-hidden /> Categories</Link>
            <Link href="/" target="_blank" className={buttonStyles("outline", "sm")}><ExternalLink className="h-4 w-4" aria-hidden /> View website</Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-line bg-white p-5">
            <p className="text-3xl font-semibold">{c.value ?? "–"}</p>
            <p className="mt-1 text-sm text-charcoal-soft">{c.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-lg border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-semibold">Recently added</h2>
          <Link href="/admin/dashboard/products" className="text-sm text-brand hover:underline">View all</Link>
        </div>
        {recent && recent.length > 0 ? (
          <ul className="divide-y divide-line">
            {recent.map((p) => (
              <li key={p.id} className="flex items-center gap-4 px-5 py-3">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt="" className="h-12 w-12 rounded object-cover" />
                ) : (
                  <span className="h-12 w-12 rounded bg-line" aria-hidden />
                )}
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/dashboard/products/${p.id}/edit`} className="block truncate font-medium hover:text-brand">{p.name}</Link>
                  <p className="text-xs text-charcoal-soft">{p.product_code} · {formatRWF(p.price) ?? "Price on request"}</p>
                </div>
                <Badge tone={p.status === "published" ? "brand" : "muted"}>{p.status === "published" ? "Published" : "Draft"}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-10 text-center text-sm text-charcoal-soft">No products yet. Add your first product to get started.</p>
        )}
      </section>
    </>
  );
}
