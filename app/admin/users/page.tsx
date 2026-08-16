import { Search } from "lucide-react";
import { ConsoleHeader } from "@/components/dashboard/console-shell";
import { RoleSelect } from "@/components/admin/controls";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState, Input, Panel } from "@/components/ui/primitives";
import { listAdminUsers } from "@/lib/api/admin";

export const metadata = { title: "Users" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const users = await listAdminUsers(q);

  return (
    <>
      <ConsoleHeader title="Users" description="Everyone with an Influenz Hub account." />

      <form action="/admin/users" className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <label htmlFor="user-search" className="sr-only">
            Search users
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-subtle"
            aria-hidden
          />
          <Input
            id="user-search"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search by name or email…"
            className="pl-10"
          />
        </div>
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      {users.length === 0 ? (
        <EmptyState title="No users found" description="Try a different search." />
      ) : (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id}>
              <Panel className="flex flex-wrap items-center gap-4 p-4">
                <Avatar src={user.image} name={user.name ?? user.email} className="size-9" />

                <div className="min-w-40 flex-1">
                  <p className="text-sm font-medium text-ink">
                    {user.name ?? user.email ?? user.phone}
                  </p>
                  <p className="truncate text-xs text-ink-subtle">
                    {user.email ?? user.phone}
                    {user.profile && ` · ${user.profile.businessName}`}
                  </p>
                </div>

                <RoleSelect userId={user.id} role={user.role} />
              </Panel>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
