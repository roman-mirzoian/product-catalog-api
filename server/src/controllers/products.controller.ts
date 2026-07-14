import { Request, Response } from "express";
import * as productsService from "../services/products.service";
import { ListProductsQuery } from "../schemas/product.schema";

export async function listHandler(req: Request, res: Response) {
  const result = await productsService.listProducts(req.query as unknown as ListProductsQuery);
  res.json(result);
}

export async function getHandler(req: Request, res: Response) {
  const product = await productsService.getProduct(req.params.id);
  res.json(product);
}

export async function createHandler(req: Request, res: Response) {
  const product = await productsService.createProduct(req.body);
  res.status(201).json(product);
}

export async function updateHandler(req: Request, res: Response) {
  const product = await productsService.updateProduct(req.params.id, req.body);
  res.json(product);
}

export async function deleteHandler(req: Request, res: Response) {
  await productsService.deleteProduct(req.params.id);
  res.status(204).send();
}
