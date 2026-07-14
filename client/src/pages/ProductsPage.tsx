import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  useCreateProduct,
  useDeleteProduct,
  useProductsQuery,
  useUpdateProduct,
} from "../hooks/useProducts";
import { SearchBar } from "../components/SearchBar";
import { FilterBar } from "../components/FilterBar";
import type { FilterValues } from "../components/FilterBar";
import { Pagination } from "../components/Pagination";
import { ProductList } from "../components/ProductList";
import { ProductForm } from "../components/ProductForm";
import type { Product, ProductInput } from "../types/product";
import { ApiClientError } from "../api/client";

const PAGE_SIZE = 12;

export function ProductsPage() {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();

  const page = Number(searchParams.get("page") ?? "1");
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const inStock = searchParams.get("inStock") === "true";
  const sort = searchParams.get("sort") ?? "";

  const query = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      q: q || undefined,
      category: category || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStock: inStock || undefined,
      sort: sort || undefined,
    }),
    [page, q, category, minPrice, maxPrice, inStock, sort]
  );
  const { data, isLoading, isError } = useProductsQuery(query);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  function setPage(nextPage: number) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  }

  function setSearch(value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("q", value);
    else next.delete("q");
    next.set("page", "1");
    setSearchParams(next);
  }

  function setFilters(values: FilterValues) {
    const next = new URLSearchParams(searchParams);
    const entries: [string, string][] = [
      ["category", values.category],
      ["minPrice", values.minPrice],
      ["maxPrice", values.maxPrice],
      ["inStock", values.inStock ? "true" : ""],
      ["sort", values.sort],
    ];
    for (const [key, value] of entries) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.set("page", "1");
    setSearchParams(next);
  }

  async function handleCreate(input: ProductInput) {
    setFormError(undefined);
    try {
      await createProduct.mutateAsync(input);
      setIsCreating(false);
    } catch (err) {
      setFormError(err instanceof ApiClientError ? err.message : "Failed to save product");
    }
  }

  async function handleUpdate(input: ProductInput) {
    if (!editingProduct) return;
    setFormError(undefined);
    try {
      await updateProduct.mutateAsync({ id: editingProduct.id, input });
      setEditingProduct(null);
    } catch (err) {
      setFormError(err instanceof ApiClientError ? err.message : "Failed to save product");
    }
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    await deleteProduct.mutateAsync(product.id);
  }

  return (
    <div className="products-page">
      <header className="products-page__header">
        <h1>Products</h1>
        <SearchBar initialValue={q} onSearchChange={setSearch} />
        <FilterBar
          initialValue={{ category, minPrice, maxPrice, inStock, sort }}
          onFilterChange={setFilters}
        />
        {isAuthenticated && <button onClick={() => setIsCreating(true)}>Add product</button>}
      </header>

      <ProductList
        products={data?.data ?? []}
        isLoading={isLoading}
        isError={isError}
        isAuthenticated={isAuthenticated}
        onEdit={setEditingProduct}
        onDelete={handleDelete}
      />

      {data && (
        <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />
      )}

      {isCreating && (
        <div className="modal">
          <ProductForm
            mode="create"
            onSubmit={handleCreate}
            onCancel={() => setIsCreating(false)}
            isSubmitting={createProduct.isPending}
            submitError={formError}
          />
        </div>
      )}

      {editingProduct && (
        <div className="modal">
          <ProductForm
            mode="edit"
            initialProduct={editingProduct}
            onSubmit={handleUpdate}
            onCancel={() => setEditingProduct(null)}
            isSubmitting={updateProduct.isPending}
            submitError={formError}
          />
        </div>
      )}
    </div>
  );
}
