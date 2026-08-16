"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/primitives";
import { Divider, FormError } from "./auth-shell";
import { registerAction } from "@/lib/api/auth-actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" loading={pending}>
      Create account
    </Button>
  );
}

export function RegisterForm({ next }: { next: string }) {
  const [state, action] = useActionState(registerAction, null);

  return (
    <div className="space-y-6">
      <Button variant="secondary" className="w-full" asChild>
        <a href={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/auth/google`}>
          Continue with Google
        </a>
      </Button>

      <Divider label="or" />

      <form action={action} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <FormError message={state?.error} />

        <Field label="Your name" htmlFor="name">
          <Input id="name" name="name" autoComplete="name" required />
        </Field>

        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>

        <Field label="Password" htmlFor="password" hint="At least 8 characters.">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </Field>

        <SubmitButton />
      </form>
    </div>
  );
}
