import { BarChart3, Bell, LayoutDashboard, Newspaper, Store, User, Wrench } from "lucide-react";
import { ConsoleShell } from "@/components/dashboard/console-shell";

const iconClass = "size-4";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: <LayoutDashboard className={iconClass} /> },
  { href: "/dashboard/profile", label: "Profile", icon: <User className={iconClass} /> },
  { href: "/dashboard/stores", label: "Stores", icon: <Store className={iconClass} /> },
  { href: "/dashboard/services", label: "Services", icon: <Wrench className={iconClass} /> },
  { href: "/dashboard/posts", label: "Posts", icon: <Newspaper className={iconClass} /> },
  { href: "/dashboard/statistics", label: "Statistics", icon: <BarChart3 className={iconClass} /> },
  { href: "/dashboard/notifications", label: "Notifications", icon: <Bell className={iconClass} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConsoleShell title="Your business" items={NAV}>
      {children}
    </ConsoleShell>
  );
}
