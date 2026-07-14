import * as productsRepo from "../../src/repositories/products.repository";
import * as productsService from "../../src/services/products.service";
import { ApiError } from "../../src/utils/ApiError";

jest.mock("../../src/repositories/products.repository");

const mockedRepo = productsRepo as jest.Mocked<typeof productsRepo>;

describe("products.service", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("createProduct", () => {
    it("throws a conflict error when the sku already exists", async () => {
      mockedRepo.findBySku.mockResolvedValue({ id: "existing-id" } as never);

      await expect(
        productsService.createProduct({
          name: "Item",
          price: 10,
          currency: "USD",
          sku: "DUP-1",
          category: "misc",
          stock: 0,
        })
      ).rejects.toThrow(ApiError);

      expect(mockedRepo.create).not.toHaveBeenCalled();
    });

    it("creates the product when the sku is unique", async () => {
      mockedRepo.findBySku.mockResolvedValue(null);
      mockedRepo.create.mockResolvedValue({ id: "new-id", sku: "NEW-1" } as never);

      const input = {
        name: "Item",
        price: 10,
        currency: "USD",
        sku: "NEW-1",
        category: "misc",
        stock: 0,
      };
      const result = await productsService.createProduct(input);

      expect(mockedRepo.create).toHaveBeenCalledWith(input);
      expect(result).toMatchObject({ id: "new-id" });
    });
  });

  describe("getProduct", () => {
    it("throws a not-found error when the product does not exist", async () => {
      mockedRepo.findActiveById.mockResolvedValue(null);

      await expect(productsService.getProduct("missing-id")).rejects.toThrow(ApiError);
    });
  });
});
