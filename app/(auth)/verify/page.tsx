import Link from "next/link";
import { redirect } from "next/navigation";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { verifyEmailTokenAction } from "@/lib/api/auth-actions";

export const metadata = { title: "Verify" };

/**
 * Lands from a magic-link email. With a token we consume it and sign the user
 * in; without one we're showing the "check your inbox" state instead.
 */
export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (token) {
    let failed = false;
    try {
      await verifyEmailTokenAction(token);
    } catch {
      failed = true;
    }

    // redirect() throws, so it must live outside the try block.
    if (!failed) redirect("/dashboard");

    return (
      <AuthShell
        eyebrow="Sign-in link"
        title="That link didn't work"
        deck="Sign-in links expire after 15 minutes and can only be used once."
      >
        <Button className="w-full" asChild>
          <Link href="/login">Request a new link</Link>
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Almost there"
      title="Check your email"
      deck="We've sent you a sign-in link. It expires in 15 minutes."
    >
      <div className="flex flex-col items-center gap-5 py-4 text-center">
        <span className="flex size-12 items-center justify-center rounded-full border border-line-strong text-lavender">
          <MailCheck className="size-5" aria-hidden />
        </span>
        <p className="text-sm text-ink-muted">
          Didn&apos;t get it? Check spam, or{" "}
          <Link href="/login" className="text-lavender underline-offset-4 hover:underline">
            try again
          </Link>
          .
        </p>
      </div>
    </AuthShell>
  );
}
