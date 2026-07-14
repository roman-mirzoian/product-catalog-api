import * as productsRepo from "../repositories/products.repository";
import { ApiError } from "../utils/ApiError";
import { CreateProductInput, ListProductsQuery, UpdateProductInput } from "../schemas/product.schema";

export async function listProducts(query: ListProductsQuery) {
  const { data, total } = await productsRepo.findMany(query);

  return {
    data,
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function getProduct(id: string) {
  const product = await productsRepo.findActiveById(id);
  if (!product) {
    throw ApiError.notFound("Product not found");
  }
  return product;
}

export async function createProduct(input: CreateProductInput) {
  const existing = await productsRepo.findBySku(input.sku);
  if (existing) {
    throw ApiError.conflict(`A product with SKU "${input.sku}" already exists`);
  }

  return productsRepo.create(input);
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  await getProduct(id);

  if (input.sku) {
    const existing = await productsRepo.findBySku(input.sku);
    if (existing && existing.id !== id) {
      throw ApiError.conflict(`A product with SKU "${input.sku}" already exists`);
    }
  }

  return productsRepo.update(id, input);
}

export async function deleteProduct(id: string) {
  await getProduct(id);
  await productsRepo.softDelete(id);
}
