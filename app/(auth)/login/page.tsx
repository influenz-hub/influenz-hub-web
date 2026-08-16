import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getSession } from "@/lib/api/session";

export const metadata = { title: "Log in" };

function safeNext(value?: string) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const session = await getSession();
  if (session) redirect(safeNext(next));

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to Influenz Hub"
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="text-lavender underline-offset-4 hover:underline">
            Become an Indie
          </Link>
        </>
      }
    >
      <LoginForm next={safeNext(next)} />
    </AuthShell>
  );
}
