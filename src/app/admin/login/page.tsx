import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF9F7] px-4">
      <div className="w-full max-w-sm rounded-lg border border-line bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="text-2xl font-bold tracking-wide">APEX</p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-charcoal-soft">{BUSINESS.name}</p>
          <h1 className="mt-6 text-lg font-semibold">Administrator sign in</h1>
        </div>
        <LoginForm next={next ?? ""} />
        <Link href="/" className="mt-6 block text-center text-sm text-charcoal-soft hover:text-brand">← Back to website</Link>
      </div>
    </main>
  );
}
