"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/primitives";
import { FormError } from "@/components/auth/auth-shell";
import { createCategoryAction } from "@/lib/api/admin-actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending}>
      <Plus /> Add
    </Button>
  );
}

export function CategoryForm() {
  const [state, action] = useActionState(createCategoryAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="mb-6 space-y-3">
      <form ref={formRef} action={action} className="flex gap-2">
        <label htmlFor="category-name" className="sr-only">
          New category name
        </label>
        <Input
          id="category-name"
          name="name"
          required
          minLength={2}
          placeholder="New category name"
          className="flex-1"
        />
        <SubmitButton />
      </form>
      <FormError message={state?.error} />
    </div>
  );
}
