"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Select } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { setBusinessFlagAction, setReportStatusAction, setUserRoleAction } from "@/lib/api/admin-actions";
import type { ReportStatus, Role } from "@/lib/api/types";

export function RoleSelect({ userId, role }: { userId: string; role: Role }) {
  const [pending, startTransition] = useTransition();

  return (
    <>
      <label htmlFor={`role-${userId}`} className="sr-only">
        Role
      </label>
      <Select
        id={`role-${userId}`}
        defaultValue={role}
        disabled={pending}
        className="h-9 w-32 text-xs"
        onChange={(event) => {
          const next = event.target.value as Role;
          startTransition(async () => {
            try {
              await setUserRoleAction(userId, next);
              toast.success(`Role set to ${next.toLowerCase()}.`);
            } catch {
              toast.error("Couldn't change that role.");
            }
          });
        }}
      >
        <option value="USER">User</option>
        <option value="BUSINESS">Business</option>
        <option value="ADMIN">Admin</option>
      </Select>
    </>
  );
}

/** A switch rather than a checkbox — these are immediate, consequential toggles. */
export function FlagToggle({
  profileId,
  flag,
  value,
  label,
}: {
  profileId: string;
  flag: "verified" | "featured";
  value: boolean;
  label: string;
}) {
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      try {
        await setBusinessFlagAction(profileId, flag, !value);
        toast.success(`${label} ${!value ? "enabled" : "removed"}.`);
      } catch {
        toast.error(`Couldn't update ${label.toLowerCase()}.`);
      }
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      onClick={handleToggle}
      disabled={pending}
      className="flex items-center gap-2 text-xs text-ink-muted disabled:opacity-50"
    >
      <span
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors",
          value ? "gradient-brand" : "bg-surface-3"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-4 rounded-full bg-white transition-transform",
            value ? "translate-x-4.5" : "translate-x-0.5"
          )}
        />
      </span>
      {label}
    </button>
  );
}

export function ReportStatusSelect({ id, status }: { id: string; status: ReportStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <>
      <label htmlFor={`status-${id}`} className="sr-only">
        Report status
      </label>
      <Select
        id={`status-${id}`}
        defaultValue={status}
        disabled={pending}
        className="h-9 w-36 text-xs"
        onChange={(event) => {
          const next = event.target.value as ReportStatus;
          startTransition(async () => {
            try {
              await setReportStatusAction(id, next);
              toast.success("Report updated.");
            } catch {
              toast.error("Couldn't update that report.");
            }
          });
        }}
      >
        <option value="OPEN">Open</option>
        <option value="RESOLVED">Resolved</option>
        <option value="DISMISSED">Dismissed</option>
      </Select>
    </>
  );
}
