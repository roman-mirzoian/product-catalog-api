import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductList } from "../src/components/ProductList";
import type { Product } from "../src/types/product";

const sampleProduct: Product = {
  id: "1",
  name: "Desk Lamp",
  description: "A bright lamp",
  price: "39.99",
  currency: "USD",
  sku: "LAMP-001",
  category: "furniture",
  stock: 10,
  imageUrl: null,
  isActive: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function renderList(overrides: Partial<Parameters<typeof ProductList>[0]> = {}) {
  return render(
    <ProductList
      products={[]}
      isLoading={false}
      isError={false}
      isAuthenticated={false}
      onEdit={vi.fn()}
      onDelete={vi.fn()}
      {...overrides}
    />
  );
}

describe("ProductList", () => {
  it("shows a loading state", () => {
    renderList({ isLoading: true });
    expect(screen.getByRole("status")).toHaveTextContent(/loading/i);
  });

  it("shows an error state", () => {
    renderList({ isError: true, errorMessage: "Network error" });
    expect(screen.getByRole("alert")).toHaveTextContent("Network error");
  });

  it("shows an empty state when there are no products", () => {
    renderList({ products: [] });
    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });

  it("renders each product once loaded", () => {
    renderList({ products: [sampleProduct] });
    expect(screen.getByText("Desk Lamp")).toBeInTheDocument();
    expect(screen.getByText("USD 39.99")).toBeInTheDocument();
  });
});
