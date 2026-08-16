"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/primitives";
import { FormError } from "@/components/auth/auth-shell";
import { createPostAction } from "@/lib/api/business-actions";
import type { MyStore } from "@/lib/api/types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending}>
      Publish
    </Button>
  );
}

export function PostComposer({ stores }: { stores: MyStore[] }) {
  const [state, action] = useActionState(createPostAction, null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      formRef.current?.reset();
      router.push("/dashboard/posts");
    }
  }, [state, router]);

  return (
    <form ref={formRef} action={action} className="max-w-2xl space-y-5">
      <FormError message={state?.error} />

      <Field label="What's new?" htmlFor="text" error={state?.fieldErrors?.text}>
        <Textarea
          id="text"
          name="text"
          rows={5}
          required
          maxLength={2000}
          placeholder="A new product, a restock, an event, something you're proud of…"
        />
      </Field>

      <Field label="Image URL" htmlFor="image" hint="Optional. Uploads aren't wired up yet.">
        <Input id="image" name="image" type="url" placeholder="https://…" />
      </Field>

      {stores.length > 0 && (
        <Field label="Link a store" htmlFor="storeId" hint="Optional.">
          <Select id="storeId" name="storeId" defaultValue="">
            <option value="">None</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </Select>
        </Field>
      )}

      <SubmitButton />
    </form>
  );
}
