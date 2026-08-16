"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/primitives";
import { FormError, FormSuccess } from "@/components/auth/auth-shell";
import { saveProfileAction } from "@/lib/api/business-actions";
import type { Category, MyProfile } from "@/lib/api/types";

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending}>
      {isNew ? "Create profile" : "Save changes"}
    </Button>
  );
}

export function ProfileForm({
  profile,
  categories,
}: {
  profile: MyProfile | null;
  categories: Category[];
}) {
  const [state, action] = useActionState(saveProfileAction, null);
  const errors = state?.fieldErrors ?? {};

  return (
    <form action={action} className="max-w-2xl space-y-6">
      <FormError message={state?.error} />
      <FormSuccess message={state?.success} />

      <Field label="Business name" htmlFor="businessName" error={errors.businessName}>
        <Input
          id="businessName"
          name="businessName"
          defaultValue={profile?.businessName ?? ""}
          required
        />
      </Field>

      <Field
        label="Your story"
        htmlFor="description"
        hint="A short paragraph about what you make and why. This is the first thing visitors read."
        error={errors.description}
      >
        <Textarea
          id="description"
          name="description"
          defaultValue={profile?.description ?? ""}
          rows={4}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Category" htmlFor="categoryId">
          <Select id="categoryId" name="categoryId" defaultValue={profile?.categoryId ?? ""}>
            <option value="">Choose a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Location" htmlFor="location" error={errors.location}>
          <Input
            id="location"
            name="location"
            defaultValue={profile?.location ?? ""}
            placeholder="City, Country"
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Contact email" htmlFor="contactEmail" error={errors.contactEmail}>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            defaultValue={profile?.contactEmail ?? ""}
          />
        </Field>

        <Field label="Contact phone" htmlFor="contactPhone" error={errors.contactPhone}>
          <Input id="contactPhone" name="contactPhone" defaultValue={profile?.contactPhone ?? ""} />
        </Field>
      </div>

      <fieldset className="space-y-6 border-t border-line pt-6">
        <legend className="sr-only">Images</legend>
        <p className="text-xs text-ink-subtle">
          File uploads aren&apos;t wired up yet — paste an image URL for now.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Logo URL" htmlFor="logo" error={errors.logo}>
            <Input
              id="logo"
              name="logo"
              type="url"
              defaultValue={profile?.logo ?? ""}
              placeholder="https://…"
            />
          </Field>

          <Field label="Banner URL" htmlFor="banner" error={errors.banner}>
            <Input
              id="banner"
              name="banner"
              type="url"
              defaultValue={profile?.banner ?? ""}
              placeholder="https://…"
            />
          </Field>
        </div>
      </fieldset>

      <SubmitButton isNew={!profile} />
    </form>
  );
}
