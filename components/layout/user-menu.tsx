"use client";

import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LayoutDashboard, LogOut, Shield, Store, User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { logoutAction } from "@/lib/api/auth-actions";
import type { SessionUser } from "@/lib/api/types";

const itemClass =
  "flex cursor-pointer items-center gap-2.5 rounded-[10px] px-3 py-2 text-sm text-ink-muted outline-none transition-colors data-highlighted:bg-surface-3 data-highlighted:text-ink";

export function UserMenu({ session }: { session: SessionUser }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="rounded-full transition-opacity hover:opacity-80"
          aria-label="Account menu"
        >
          <Avatar src={session.image} name={session.name ?? session.email} className="size-9" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="z-50 min-w-56 rounded-[var(--radius-sm)] border border-line bg-surface-2 p-1.5 shadow-2xl shadow-black/50"
        >
          <div className="px-3 py-2.5">
            <p className="truncate text-sm font-medium text-ink">
              {session.name ?? "Your account"}
            </p>
            <p className="truncate text-xs text-ink-subtle">
              {session.email ?? session.phone}
            </p>
          </div>

          <DropdownMenu.Separator className="my-1 h-px bg-line" />

          <DropdownMenu.Item asChild>
            <Link href="/dashboard" className={itemClass}>
              <LayoutDashboard className="size-4" /> Dashboard
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link href="/dashboard/profile" className={itemClass}>
              <User className="size-4" /> Business profile
            </Link>
          </DropdownMenu.Item>

          {session.profile && (
            <DropdownMenu.Item asChild>
              <Link href={`/profile/${session.profile.slug}`} className={itemClass}>
                <Store className="size-4" /> View public page
              </Link>
            </DropdownMenu.Item>
          )}

          {session.role === "ADMIN" && (
            <DropdownMenu.Item asChild>
              <Link href="/admin" className={itemClass}>
                <Shield className="size-4" /> Admin
              </Link>
            </DropdownMenu.Item>
          )}

          <DropdownMenu.Separator className="my-1 h-px bg-line" />

          <DropdownMenu.Item asChild>
            <form action={logoutAction}>
              <button type="submit" className={`${itemClass} w-full`}>
                <LogOut className="size-4" /> Sign out
              </button>
            </form>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
