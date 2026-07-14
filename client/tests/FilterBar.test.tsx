import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FilterBar } from "../src/components/FilterBar";

const EMPTY_VALUE = { category: "", minPrice: "", maxPrice: "", inStock: false, sort: "" };

describe("FilterBar", () => {
  it("debounces category and price changes into a single callback", async () => {
    const onFilterChange = vi.fn();
    render(<FilterBar initialValue={EMPTY_VALUE} onFilterChange={onFilterChange} delayMs={50} />);

    fireEvent.change(screen.getByLabelText("Filter by category"), {
      target: { value: "electr" },
    });
    fireEvent.change(screen.getByLabelText("Filter by category"), {
      target: { value: "electronics" },
    });

    expect(onFilterChange).not.toHaveBeenCalled();

    await waitFor(() => expect(onFilterChange).toHaveBeenCalledTimes(1));
    expect(onFilterChange).toHaveBeenCalledWith({ ...EMPTY_VALUE, category: "electronics" });
  });

  it("applies the in-stock toggle and sort change immediately, without debouncing", () => {
    const onFilterChange = vi.fn();
    render(<FilterBar initialValue={EMPTY_VALUE} onFilterChange={onFilterChange} delayMs={50} />);

    fireEvent.click(screen.getByLabelText("In stock only"));
    expect(onFilterChange).toHaveBeenCalledWith({ ...EMPTY_VALUE, inStock: true });

    fireEvent.change(screen.getByLabelText("Sort by"), { target: { value: "price:asc" } });
    expect(onFilterChange).toHaveBeenCalledWith({
      ...EMPTY_VALUE,
      inStock: true,
      sort: "price:asc",
    });
  });
});
