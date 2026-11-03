"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LayoutDashboard, LogOut, Menu, Package, PlusCircle, Settings, Tags, X } from "lucide-react";
import { signOut } from "@/actions/auth";
import { BUSINESS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const BASE = "/admin/dashboard";
const NAV = [
  { label: "Overview", href: BASE, icon: LayoutDashboard, active: (p: string) => p === BASE },
  { label: "Products", href: `${BASE}/products`, icon: Package, active: (p: string) => p.startsWith(`${BASE}/products`) && !p.endsWith("/new") },
  { label: "Categories", href: `${BASE}/categories`, icon: Tags, active: (p: string) => p.startsWith(`${BASE}/categories`) },
  { label: "Add New Product", href: `${BASE}/products/new`, icon: PlusCircle, active: (p: string) => p.endsWith("/products/new") },
  { label: "Settings", href: `${BASE}/settings`, icon: Settings, active: (p: string) => p.startsWith(`${BASE}/settings`) },
];

type Props = { name: string; email: string; role: string; children: React.ReactNode };

export function AdminShell({ name, email, role, children }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const link = "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors";

  const sidebar = (
    <nav aria-label="Admin" className="flex h-full flex-col gap-1 p-4">
      <div className="mb-6 px-3">
        <p className="text-lg font-bold tracking-wide">APEX</p>
        <p className="text-[10px] uppercase tracking-[0.3em] text-charcoal-soft">Admin</p>
      </div>
      {NAV.map(({ label, href, icon: Icon, active }) => (
        <Link
          key={href}
          href={href}
          aria-current={active(pathname) ? "page" : undefined}
          className={cn(link, active(pathname) ? "bg-brand text-white" : "text-charcoal hover:bg-brand-soft hover:text-brand")}
        >
          <Icon className="h-4 w-4" aria-hidden /> {label}
        </Link>
      ))}
      <form action={signOut} className="mt-auto">
        <button type="submit" className={cn(link, "w-full text-charcoal hover:bg-brand-soft hover:text-brand")}>
          <LogOut className="h-4 w-4" aria-hidden /> Logout
        </button>
      </form>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-white lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-charcoal/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white px-4 sm:px-6">
          <button type="button" className="rounded-md p-2 hover:bg-brand-soft lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <p className="hidden text-sm font-medium text-charcoal-soft lg:block">{BUSINESS.name}</p>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="hidden items-center gap-1.5 text-sm text-charcoal-soft hover:text-brand sm:inline-flex">
              View website <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand-dark" aria-hidden>
                {name.charAt(0).toUpperCase()}
              </span>
              <div className="hidden text-left leading-tight sm:block">
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-charcoal-soft">{email || role.replace("_", " ")}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
