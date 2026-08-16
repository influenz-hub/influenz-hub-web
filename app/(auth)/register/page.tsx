import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { getSession } from "@/lib/api/session";

export const metadata = { title: "Become an Indie" };

function safeNext(value?: string) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const session = await getSession();
  if (session) redirect(safeNext(next));

  return (
    <AuthShell
      eyebrow="Become an Indie"
      title="Put your work in the spotlight"
      deck="Create an account, then set up your business profile, stores, and services."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-lavender underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm next={safeNext(next)} />
    </AuthShell>
  );
}
