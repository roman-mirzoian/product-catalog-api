import { Router } from "express";
import {
  createHandler,
  deleteHandler,
  getHandler,
  listHandler,
  updateHandler,
} from "../controllers/products.controller";
import { validate } from "../middleware/validate.middleware";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createProductSchema,
  listProductsQuerySchema,
  productIdParamsSchema,
  updateProductSchema,
} from "../schemas/product.schema";

export const productsRouter = Router();

/**
 * @openapi
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: List products with pagination, search and filters
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: inStock
 *         schema: { type: boolean }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [price:asc, price:desc, createdAt:desc, name:asc] }
 *     responses:
 *       200:
 *         description: Paginated product list
 */
productsRouter.get(
  "/",
  requireAuth,
  validate({ query: listProductsQuerySchema }),
  asyncHandler(listHandler)
);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get a single product by id
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: The product
 *       404:
 *         description: Product not found
 */
productsRouter.get(
  "/:id",
  requireAuth,
  validate({ params: productIdParamsSchema }),
  asyncHandler(getHandler)
);

/**
 * @openapi
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Product created
 *       409:
 *         description: SKU already exists
 */
productsRouter.post(
  "/",
  requireAuth,
  validate({ body: createProductSchema }),
  asyncHandler(createHandler)
);

/**
 * @openapi
 * /products/{id}:
 *   patch:
 *     tags: [Products]
 *     summary: Partially update a product
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
productsRouter.patch(
  "/:id",
  requireAuth,
  validate({ params: productIdParamsSchema, body: updateProductSchema }),
  asyncHandler(updateHandler)
);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Soft-delete a product
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
productsRouter.delete(
  "/:id",
  requireAuth,
  validate({ params: productIdParamsSchema }),
  asyncHandler(deleteHandler)
);
