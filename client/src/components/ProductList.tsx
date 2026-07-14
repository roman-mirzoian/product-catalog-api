import type { Product } from "../types/product";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  isAuthenticated: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductList({
  products,
  isLoading,
  isError,
  errorMessage,
  isAuthenticated,
  onEdit,
  onDelete,
}: ProductListProps) {
  if (isLoading) {
    return <p role="status">Loading products…</p>;
  }

  if (isError) {
    return <p role="alert">{errorMessage ?? "Failed to load products."}</p>;
  }

  if (products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isAuthenticated={isAuthenticated}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
