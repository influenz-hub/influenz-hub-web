import { redirect } from "next/navigation";
import { Flag, LayoutDashboard, ShieldCheck, Tags, Users } from "lucide-react";
import { ConsoleShell } from "@/components/dashboard/console-shell";
import { getSession } from "@/lib/api/session";

const iconClass = "size-4";

const NAV = [
  { href: "/admin", label: "Overview", icon: <LayoutDashboard className={iconClass} /> },
  { href: "/admin/users", label: "Users", icon: <Users className={iconClass} /> },
  { href: "/admin/businesses", label: "Businesses", icon: <ShieldCheck className={iconClass} /> },
  { href: "/admin/categories", label: "Categories", icon: <Tags className={iconClass} /> },
  { href: "/admin/reports", label: "Reports", icon: <Flag className={iconClass} /> },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // proxy.ts blocks signed-out users; this is the role check, and the API
  // independently enforces ADMIN on every one of these endpoints.
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  if (session.role !== "ADMIN") redirect("/");

  return (
    <ConsoleShell title="Administration" items={NAV}>
      {children}
    </ConsoleShell>
  );
}
