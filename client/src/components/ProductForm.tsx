import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Product, ProductInput } from "../types/product";

interface ProductFormProps {
  mode: "create" | "edit";
  initialProduct?: Product;
  onSubmit: (input: ProductInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  submitError?: string;
}

interface FormState {
  name: string;
  description: string;
  price: string;
  currency: string;
  sku: string;
  category: string;
  stock: string;
  imageUrl: string;
}

function toFormState(product?: Product): FormState {
  return {
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    currency: product?.currency ?? "USD",
    sku: product?.sku ?? "",
    category: product?.category ?? "",
    stock: product ? String(product.stock) : "0",
    imageUrl: product?.imageUrl ?? "",
  };
}

export function ProductForm({
  mode,
  initialProduct,
  onSubmit,
  onCancel,
  isSubmitting,
  submitError,
}: ProductFormProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(initialProduct));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const update =
    (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.sku.trim()) errors.sku = "SKU is required";
    if (!form.category.trim()) errors.category = "Category is required";
    if (!form.price || Number(form.price) <= 0) errors.price = "Price must be greater than 0";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      price: Number(form.price),
      currency: form.currency.trim() || "USD",
      sku: form.sku.trim(),
      category: form.category.trim(),
      stock: form.stock ? Number(form.stock) : 0,
      imageUrl: form.imageUrl.trim() || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>{mode === "create" ? "Add product" : "Edit product"}</h2>

      <label>
        Name
        <input value={form.name} onChange={update("name")} />
        {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
      </label>

      <label>
        Description
        <textarea value={form.description} onChange={update("description")} />
      </label>

      <label>
        Price
        <input value={form.price} onChange={update("price")} inputMode="decimal" />
        {fieldErrors.price && <span className="field-error">{fieldErrors.price}</span>}
      </label>

      <label>
        Currency
        <input value={form.currency} onChange={update("currency")} maxLength={3} />
      </label>

      <label>
        SKU
        <input value={form.sku} onChange={update("sku")} disabled={mode === "edit"} />
        {fieldErrors.sku && <span className="field-error">{fieldErrors.sku}</span>}
      </label>

      <label>
        Category
        <input value={form.category} onChange={update("category")} />
        {fieldErrors.category && <span className="field-error">{fieldErrors.category}</span>}
      </label>

      <label>
        Stock
        <input value={form.stock} onChange={update("stock")} inputMode="numeric" />
      </label>

      <label>
        Image URL
        <input value={form.imageUrl} onChange={update("imageUrl")} />
      </label>

      {submitError && <p role="alert">{submitError}</p>}

      <div className="product-form__actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}
