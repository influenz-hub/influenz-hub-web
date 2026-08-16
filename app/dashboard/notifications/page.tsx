import { BellOff } from "lucide-react";
import { ConsoleHeader } from "@/components/dashboard/console-shell";
import { EmptyState, Panel } from "@/components/ui/primitives";
import { getMyNotifications, markNotificationsRead } from "@/lib/api/business";
import { timeAgo } from "@/lib/utils";
import type { Notification } from "@/lib/api/types";

export const metadata = { title: "Notifications" };

/** Renders the payload the API attached when the notification was created. */
function describe(notification: Notification) {
  const payload = notification.payload ?? {};
  const actor = (payload.actorName as string) ?? "Someone";
  const label = (payload.targetLabel as string) ?? "your listing";

  switch (notification.type) {
    case "LIKE":
      return `${actor} liked ${label}`;
    case "COMMENT":
      return `${actor} commented on ${label}`;
    case "FOLLOW":
      return `${actor} started following you`;
    case "REVIEW":
      return `${actor} reviewed ${label}${payload.rating ? ` — ${payload.rating}★` : ""}`;
    case "NEW_PRODUCT":
      return `New product listed: ${label}`;
    case "NEW_POST":
      return `${actor} posted an update`;
    case "VERIFIED":
      return "Your business is now verified";
    case "FEATURED":
      return "Your business is featured on Influenz Hub";
    default:
      return "You have a new notification";
  }
}

export default async function NotificationsPage() {
  const { data: notifications } = await getMyNotifications();

  // Opening the page is the read receipt.
  await markNotificationsRead();

  return (
    <>
      <ConsoleHeader title="Notifications" description="Activity on your profile and listings." />

      {notifications.length === 0 ? (
        <EmptyState
          icon={<BellOff className="size-5" />}
          title="Nothing yet"
          description="Follows, likes, comments, and reviews will show up here."
        />
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <Panel className="flex items-center justify-between gap-4 p-4">
                <p className="text-sm text-ink-muted">{describe(notification)}</p>
                <time
                  className="shrink-0 text-xs text-ink-subtle"
                  dateTime={notification.createdAt}
                >
                  {timeAgo(notification.createdAt)}
                </time>
              </Panel>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
