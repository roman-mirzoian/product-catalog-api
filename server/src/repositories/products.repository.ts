import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { ListProductsQuery } from "../schemas/product.schema";

function buildWhere(query: ListProductsQuery): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { isActive: true };

  if (query.q) {
    where.OR = [
      { name: { contains: query.q, mode: "insensitive" } },
      { description: { contains: query.q, mode: "insensitive" } },
    ];
  }

  if (query.category) {
    where.category = query.category;
  }

  if (query.inStock !== undefined) {
    where.stock = query.inStock ? { gt: 0 } : 0;
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {
      ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
      ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
    };
  }

  return where;
}

function buildOrderBy(sort: ListProductsQuery["sort"]): Prisma.ProductOrderByWithRelationInput {
  const [field, direction] = sort.split(":") as [string, "asc" | "desc"];
  return { [field]: direction };
}

export async function findMany(query: ListProductsQuery) {
  const where = buildWhere(query);
  const orderBy = buildOrderBy(query.sort);
  const skip = (query.page - 1) * query.limit;

  const [data, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip, take: query.limit }),
    prisma.product.count({ where }),
  ]);

  return { data, total };
}

export function findActiveById(id: string) {
  return prisma.product.findFirst({ where: { id, isActive: true } });
}

export function create(data: Prisma.ProductCreateInput) {
  return prisma.product.create({ data });
}

export function update(id: string, data: Prisma.ProductUpdateInput) {
  return prisma.product.update({ where: { id }, data });
}

export function softDelete(id: string) {
  return prisma.product.update({ where: { id }, data: { isActive: false } });
}

export function findBySku(sku: string) {
  return prisma.product.findUnique({ where: { sku } });
}
