import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProductForm } from "../src/components/ProductForm";

describe("ProductForm", () => {
  it("shows a field error and does not submit when required fields are empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <ProductForm mode="create" onSubmit={onSubmit} onCancel={vi.fn()} isSubmitting={false} />
    );

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("SKU is required")).toBeInTheDocument();
    expect(screen.getByText("Category is required")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with the expected payload when valid", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <ProductForm mode="create" onSubmit={onSubmit} onCancel={vi.fn()} isSubmitting={false} />
    );

    await user.type(screen.getByLabelText("Name"), "Desk Lamp");
    await user.type(screen.getByLabelText("Price"), "39.99");
    await user.type(screen.getByLabelText("SKU"), "LAMP-001");
    await user.type(screen.getByLabelText("Category"), "furniture");

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Desk Lamp",
      description: undefined,
      price: 39.99,
      currency: "USD",
      sku: "LAMP-001",
      category: "furniture",
      stock: 0,
      imageUrl: undefined,
    });
  });
});
