"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/primitives";
import { FormError } from "@/components/auth/auth-shell";
import {
  saveStoreAction,
  saveProductAction,
  saveServiceAction,
  type FormState,
} from "@/lib/api/business-actions";
import type { Category, MyStore, ProductCard, ServiceCard } from "@/lib/api/types";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} className="w-full">
      {label}
    </Button>
  );
}

/** Closes on success and surfaces a toast, so the list behind updates in place. */
function useDialogForm(
  action: (prev: FormState, form: FormData) => Promise<FormState>,
  onDone: () => void
) {
  const [state, formAction] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      onDone();
    }
  }, [state, onDone]);

  return [state, formAction] as const;
}

function TriggerButton({ editing, label }: { editing: boolean; label: string }) {
  return editing ? (
    <Button variant="quiet" size="icon" aria-label={`Edit ${label}`}>
      <Pencil />
    </Button>
  ) : (
    <Button>
      <Plus /> {label}
    </Button>
  );
}

/* ---------------------------------- Store ---------------------------------- */

export function StoreDialog({ store, categories }: { store?: MyStore; categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useDialogForm(saveStoreAction, () => setOpen(false));
  const errors = state?.fieldErrors ?? {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TriggerButton editing={Boolean(store)} label={store ? store.name : "New store"} />
      </DialogTrigger>

      <DialogContent title={store ? "Edit store" : "Create a store"}>
        <form action={action} className="space-y-5">
          {store && <input type="hidden" name="id" value={store.id} />}
          <FormError message={state?.error} />

          <Field label="Store name" htmlFor="store-name" error={errors.name}>
            <Input id="store-name" name="name" defaultValue={store?.name ?? ""} required />
          </Field>

          <Field label="Description" htmlFor="store-description" error={errors.description}>
            <Textarea
              id="store-description"
              name="description"
              defaultValue={store?.description ?? ""}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category" htmlFor="store-category">
              <Select id="store-category" name="categoryId" defaultValue={store?.categoryId ?? ""}>
                <option value="">Choose</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Location" htmlFor="store-location">
              <Input id="store-location" name="location" defaultValue={store?.location ?? ""} />
            </Field>
          </div>

          <Field label="Contact info" htmlFor="store-contact">
            <Input id="store-contact" name="contactInfo" defaultValue={store?.contactInfo ?? ""} />
          </Field>

          <Field label="Image URL" htmlFor="store-image" hint="Uploads aren't wired up yet.">
            <Input
              id="store-image"
              name="image"
              type="url"
              defaultValue={store?.images?.[0] ?? ""}
              placeholder="https://…"
            />
          </Field>

          <SubmitButton label={store ? "Save changes" : "Create store"} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* --------------------------------- Product --------------------------------- */

export function ProductDialog({
  storeId,
  product,
  categories,
}: {
  storeId: string;
  product?: ProductCard;
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const [state, action] = useDialogForm(saveProductAction, () => setOpen(false));
  const errors = state?.fieldErrors ?? {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TriggerButton editing={Boolean(product)} label={product ? product.name : "New product"} />
      </DialogTrigger>

      <DialogContent title={product ? "Edit product" : "Add a product"}>
        <form action={action} className="space-y-5">
          <input type="hidden" name="storeId" value={storeId} />
          {product && <input type="hidden" name="id" value={product.id} />}
          <FormError message={state?.error} />

          <Field label="Product name" htmlFor="product-name" error={errors.name}>
            <Input id="product-name" name="name" defaultValue={product?.name ?? ""} required />
          </Field>

          <Field label="Description" htmlFor="product-description">
            <Textarea
              id="product-description"
              name="description"
              defaultValue={product?.description ?? ""}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Price (USD)" htmlFor="product-price" error={errors.price}>
              <Input
                id="product-price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.price ?? ""}
                required
              />
            </Field>

            <Field label="Stock" htmlFor="product-stock">
              <Input
                id="product-stock"
                name="stock"
                type="number"
                min="0"
                defaultValue={product?.stock ?? 0}
              />
            </Field>

            <Field label="Category" htmlFor="product-category">
              <Select
                id="product-category"
                name="categoryId"
                defaultValue={product?.category?.id ?? ""}
              >
                <option value="">Choose</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Image URL" htmlFor="product-image">
            <Input
              id="product-image"
              name="image"
              type="url"
              defaultValue={product?.images?.[0] ?? ""}
              placeholder="https://…"
            />
          </Field>

          <label className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-line p-4">
            <input
              type="checkbox"
              name="available"
              defaultChecked={product?.available ?? true}
              className="size-4 accent-[var(--color-purple)]"
            />
            <span className="text-sm text-ink">Available for sale</span>
          </label>

          <SubmitButton label={product ? "Save changes" : "Add product"} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* --------------------------------- Service --------------------------------- */

export function ServiceDialog({
  service,
  categories,
}: {
  service?: ServiceCard;
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const [state, action] = useDialogForm(saveServiceAction, () => setOpen(false));
  const errors = state?.fieldErrors ?? {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TriggerButton editing={Boolean(service)} label={service ? service.name : "New service"} />
      </DialogTrigger>

      <DialogContent title={service ? "Edit service" : "Add a service"}>
        <form action={action} className="space-y-5">
          {service && <input type="hidden" name="id" value={service.id} />}
          <FormError message={state?.error} />

          <Field label="Service name" htmlFor="service-name" error={errors.name}>
            <Input id="service-name" name="name" defaultValue={service?.name ?? ""} required />
          </Field>

          <Field label="Description" htmlFor="service-description">
            <Textarea
              id="service-description"
              name="description"
              defaultValue={service?.description ?? ""}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="From (USD)" htmlFor="service-min">
              <Input
                id="service-min"
                name="priceMin"
                type="number"
                min="0"
                defaultValue={service?.priceMin ?? ""}
              />
            </Field>

            <Field label="To (USD)" htmlFor="service-max" error={errors.priceMax}>
              <Input
                id="service-max"
                name="priceMax"
                type="number"
                min="0"
                defaultValue={service?.priceMax ?? ""}
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category" htmlFor="service-category">
              <Select
                id="service-category"
                name="categoryId"
                defaultValue={service?.category?.id ?? ""}
              >
                <option value="">Choose</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="How to reach you" htmlFor="service-contact">
              <Input
                id="service-contact"
                name="contactMethod"
                defaultValue={service?.contactMethod ?? ""}
              />
            </Field>
          </div>

          <Field label="Image URL" htmlFor="service-image">
            <Input
              id="service-image"
              name="image"
              type="url"
              defaultValue={service?.images?.[0] ?? ""}
              placeholder="https://…"
            />
          </Field>

          <SubmitButton label={service ? "Save changes" : "Add service"} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
