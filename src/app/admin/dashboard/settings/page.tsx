import { PageHeader } from "@/components/admin/PageHeader";
import { PasswordForm } from "@/components/admin/PasswordForm";
import { requireAdmin } from "@/lib/auth";
import { BUSINESS } from "@/lib/constants";

export default async function SettingsPage() {
  const { user, profile } = await requireAdmin();
  return (
    <>
      <PageHeader title="Settings" />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-line bg-white p-6">
          <h2 className="mb-4 font-semibold">Your account</h2>
          <dl className="space-y-3 text-sm">
            <div><dt className="text-charcoal-soft">Name</dt><dd className="font-medium">{profile.full_name || "–"}</dd></div>
            <div><dt className="text-charcoal-soft">Email</dt><dd className="font-medium">{user.email}</dd></div>
            <div><dt className="text-charcoal-soft">Role</dt><dd className="font-medium capitalize">{profile.role.replace("_", " ")}</dd></div>
          </dl>
        </section>
        <section className="rounded-lg border border-line bg-white p-6">
          <h2 className="mb-4 font-semibold">Change password</h2>
          <PasswordForm />
        </section>
        <section className="rounded-lg border border-line bg-white p-6 lg:col-span-2">
          <h2 className="mb-1 font-semibold">Business details</h2>
          <p className="mb-4 text-sm text-charcoal-soft">These appear on the website. To change them, edit <code>src/lib/constants.ts</code>.</p>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-charcoal-soft">WhatsApp</dt><dd className="font-medium">{BUSINESS.phoneDisplay}</dd></div>
            <div><dt className="text-charcoal-soft">Email</dt><dd className="font-medium">{BUSINESS.email}</dd></div>
            <div><dt className="text-charcoal-soft">Hours</dt><dd className="font-medium">{BUSINESS.hours.days}, {BUSINESS.hours.open} to {BUSINESS.hours.close}</dd></div>
            <div><dt className="text-charcoal-soft">Address</dt><dd className="font-medium">{BUSINESS.address}</dd></div>
          </dl>
        </section>
      </div>
    </>
  );
}
