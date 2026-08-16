import { redirect } from "next/navigation";
import { BackLink, ConsoleHeader } from "@/components/dashboard/console-shell";
import { PostComposer } from "@/components/dashboard/post-composer";
import { getMyProfile, getMyStores } from "@/lib/api/business";

export const metadata = { title: "New post" };

export default async function NewPostPage() {
  const profile = await getMyProfile();
  if (!profile) redirect("/dashboard/profile");

  const stores = await getMyStores();

  return (
    <>
      <BackLink href="/dashboard/posts">All posts</BackLink>
      <ConsoleHeader
        title="Publish an update"
        description="Everyone following you will be notified."
      />
      <PostComposer stores={stores} />
    </>
  );
}
