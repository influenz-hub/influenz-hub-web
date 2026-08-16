"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/primitives";
import { Divider, FormError, FormSuccess } from "./auth-shell";
import {
  loginAction,
  requestEmailLinkAction,
  requestPhoneCodeAction,
  verifyPhoneCodeAction,
} from "@/lib/api/auth-actions";
import { cn } from "@/lib/utils";

type Method = "password" | "email" | "phone";

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" loading={pending}>
      {children}
    </Button>
  );
}

function MethodTabs({ value, onChange }: { value: Method; onChange: (m: Method) => void }) {
  const options: { id: Method; label: string }[] = [
    { id: "password", label: "Password" },
    { id: "email", label: "Email link" },
    { id: "phone", label: "Phone" },
  ];

  return (
    <div role="tablist" aria-label="Sign-in method" className="flex gap-1 rounded-full bg-surface-2 p-1">
      {options.map((option) => (
        <button
          key={option.id}
          role="tab"
          type="button"
          aria-selected={value === option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            "flex-1 rounded-full px-3 py-2 text-xs font-medium transition-colors",
            value === option.id ? "bg-surface-3 text-ink" : "text-ink-subtle hover:text-ink-muted"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [method, setMethod] = useState<Method>("password");
  const [loginState, login] = useActionState(loginAction, null);
  const [emailState, requestLink] = useActionState(requestEmailLinkAction, null);
  const [phoneState, requestCode] = useActionState(requestPhoneCodeAction, null);
  const [verifyState, verifyCode] = useActionState(verifyPhoneCodeAction, null);
  const [phone, setPhone] = useState("");

  const codeSent = Boolean(phoneState?.success);

  return (
    <div className="space-y-6">
      <Button variant="secondary" className="w-full" asChild>
        <a href={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/auth/google`}>
          Continue with Google
        </a>
      </Button>

      <Divider label="or" />

      <MethodTabs value={method} onChange={setMethod} />

      {method === "password" && (
        <form action={login} className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <FormError message={loginState?.error} />

          <Field label="Email" htmlFor="email">
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </Field>

          <Field label="Password" htmlFor="password">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </Field>

          <SubmitButton>Sign in</SubmitButton>
        </form>
      )}

      {method === "email" && (
        <form action={requestLink} className="space-y-4">
          <FormError message={emailState?.error} />
          <FormSuccess message={emailState?.success} />

          <Field
            label="Email"
            htmlFor="magic-email"
            hint="We'll send a link that signs you in — no password needed."
          >
            <Input id="magic-email" name="email" type="email" autoComplete="email" required />
          </Field>

          <SubmitButton>Send sign-in link</SubmitButton>
        </form>
      )}

      {method === "phone" && (
        <div className="space-y-4">
          {!codeSent ? (
            <form action={requestCode} className="space-y-4">
              <FormError message={phoneState?.error} />

              <Field label="Phone number" htmlFor="phone">
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+1 555 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Field>

              <SubmitButton>Send code</SubmitButton>
            </form>
          ) : (
            <form action={verifyCode} className="space-y-4">
              <input type="hidden" name="next" value={next} />
              <input type="hidden" name="phone" value={phone} />
              <FormSuccess message={phoneState?.success} />
              <FormError message={verifyState?.error} />

              <Field
                label="Verification code"
                htmlFor="code"
                hint="In development the code is printed in the API server log."
              >
                <Input
                  id="code"
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="123456"
                  required
                />
              </Field>

              <SubmitButton>Verify and continue</SubmitButton>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
