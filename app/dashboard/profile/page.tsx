import { ConsoleHeader } from "@/components/dashboard/console-shell";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { getMyProfile } from "@/lib/api/business";
import { getCategories } from "@/lib/api/discovery";

export const metadata = { title: "Business profile" };

export default async function DashboardProfilePage() {
  const [profile, categories] = await Promise.all([getMyProfile(), getCategories()]);

  return (
    <>
      <ConsoleHeader
        title="Business profile"
        description={
          profile
            ? "This is what visitors see on your public page."
            : "Set this up to start listing stores, products, and services."
        }
      />
      <ProfileForm profile={profile} categories={categories} />
    </>
  );
}
