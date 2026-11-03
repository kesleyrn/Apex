import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Returns the signed-in administrator, or null. A valid login alone is not enough: the user must have an admin_profiles row. */
export async function getAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  return profile ? { user, profile } : null;
}

/** Call at the top of every admin page layout and every admin Server Action. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
