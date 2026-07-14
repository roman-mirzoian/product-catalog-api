import request from "supertest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { resetDb, seedAdmin } from "../helpers/testDb";

const app = createApp();

let authToken: string;

beforeEach(async () => {
  await resetDb();
  await seedAdmin("admin", "admin12345");

  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ username: "admin", password: "admin12345" });
  authToken = loginRes.body.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

function authed(req: request.Test) {
  return req.set("Authorization", `Bearer ${authToken}`);
}

describe("GET /api/products", () => {
  it("rejects requests without a token", async () => {
    const res = await request(app).get("/api/products");

    expect(res.status).toBe(401);
  });

  it("returns paginated results with correct meta", async () => {
    for (let i = 0; i < 25; i++) {
      await prisma.product.create({
        data: { name: `Product ${i}`, price: 10 + i, sku: `SKU-${i}`, category: "misc" },
      });
    }

    const res = await authed(request(app).get("/api/products")).query({ page: 2, limit: 10 });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(10);
    expect(res.body.meta).toMatchObject({ page: 2, limit: 10, total: 25, totalPages: 3 });
  });

  it("filters by search query", async () => {
    await prisma.product.create({
      data: { name: "Wireless Mouse", price: 20, sku: "MOU-1", category: "electronics" },
    });
    await prisma.product.create({
      data: { name: "Coffee Mug", price: 8, sku: "MUG-1", category: "kitchen" },
    });

    const res = await authed(request(app).get("/api/products")).query({ q: "mouse" });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe("Wireless Mouse");
  });

  it("excludes soft-deleted products", async () => {
    const product = await prisma.product.create({
      data: { name: "Old Item", price: 5, sku: "OLD-1", category: "misc" },
    });
    await prisma.product.update({ where: { id: product.id }, data: { isActive: false } });

    const res = await authed(request(app).get("/api/products"));

    expect(res.body.data).toHaveLength(0);
  });
});

describe("POST /api/products", () => {
  it("rejects requests without a token", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({ name: "New Item", price: 10, sku: "NEW-1", category: "misc" });

    expect(res.status).toBe(401);
  });

  it("creates a product when authenticated", async () => {
    const res = await authed(request(app).post("/api/products")).send({
      name: "New Item",
      price: 10,
      sku: "NEW-1",
      category: "misc",
    });

    expect(res.status).toBe(201);
    expect(res.body.sku).toBe("NEW-1");

    const stored = await prisma.product.findUnique({ where: { sku: "NEW-1" } });
    expect(stored).not.toBeNull();
  });

  it("rejects a duplicate sku with 409", async () => {
    await prisma.product.create({
      data: { name: "Existing", price: 10, sku: "DUP-1", category: "misc" },
    });

    const res = await authed(request(app).post("/api/products")).send({
      name: "Another",
      price: 10,
      sku: "DUP-1",
      category: "misc",
    });

    expect(res.status).toBe(409);
  });

  it("rejects invalid input with 400", async () => {
    const res = await authed(request(app).post("/api/products")).send({
      price: -5,
      sku: "BAD-1",
      category: "misc",
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("PATCH /api/products/:id", () => {
  it("updates only the given fields", async () => {
    const product = await prisma.product.create({
      data: { name: "Original", price: 10, sku: "PATCH-1", category: "misc", stock: 5 },
    });

    const res = await authed(request(app).patch(`/api/products/${product.id}`)).send({
      stock: 50,
    });

    expect(res.status).toBe(200);
    expect(res.body.stock).toBe(50);
    expect(res.body.name).toBe("Original");
  });

  it("returns 404 for a non-existent product", async () => {
    const res = await authed(
      request(app).patch("/api/products/00000000-0000-0000-0000-000000000000")
    ).send({ stock: 1 });

    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/products/:id", () => {
  it("soft-deletes the product", async () => {
    const product = await prisma.product.create({
      data: { name: "To Delete", price: 10, sku: "DEL-1", category: "misc" },
    });

    const deleteRes = await authed(request(app).delete(`/api/products/${product.id}`));
    expect(deleteRes.status).toBe(204);

    const getRes = await authed(request(app).get(`/api/products/${product.id}`));
    expect(getRes.status).toBe(404);

    const stored = await prisma.product.findUnique({ where: { id: product.id } });
    expect(stored?.isActive).toBe(false);
  });
});
