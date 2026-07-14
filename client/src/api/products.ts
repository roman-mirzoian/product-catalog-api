import { apiRequest } from "./client";
import type { Product, ProductInput, ProductListResponse } from "../types/product";

export interface ProductQuery {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: string;
}

function toQueryString(query: ProductQuery): string {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchProducts(query: ProductQuery, token: string) {
  return apiRequest<ProductListResponse>(`/products${toQueryString(query)}`, { token });
}

export function fetchProduct(id: string, token: string) {
  return apiRequest<Product>(`/products/${id}`, { token });
}

export function createProduct(input: ProductInput, token: string) {
  return apiRequest<Product>("/products", { method: "POST", body: input, token });
}

export function updateProduct(id: string, input: Partial<ProductInput>, token: string) {
  return apiRequest<Product>(`/products/${id}`, { method: "PATCH", body: input, token });
}

export function deleteProduct(id: string, token: string) {
  return apiRequest<void>(`/products/${id}`, { method: "DELETE", token });
}
