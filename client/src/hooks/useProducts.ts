import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, deleteProduct, fetchProducts, updateProduct } from "../api/products";
import type { ProductQuery } from "../api/products";
import type { ProductInput } from "../types/product";
import { useAuth } from "../context/AuthContext";

export function useProductsQuery(query: ProductQuery) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["products", query],
    queryFn: () => fetchProducts(query, token!),
    enabled: Boolean(token),
    placeholderData: (previous) => previous,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (input: ProductInput) => createProduct(input, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ProductInput> }) =>
      updateProduct(id, input, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}
