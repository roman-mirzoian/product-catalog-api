import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "../src/components/SearchBar";

describe("SearchBar", () => {
  it("only fires onSearchChange once after the debounce delay", async () => {
    const onSearchChange = vi.fn();
    render(<SearchBar onSearchChange={onSearchChange} delayMs={50} />);
    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "l" } });
    fireEvent.change(input, { target: { value: "la" } });
    fireEvent.change(input, { target: { value: "lam" } });
    fireEvent.change(input, { target: { value: "lamp" } });

    expect(onSearchChange).not.toHaveBeenCalled();

    await waitFor(() => expect(onSearchChange).toHaveBeenCalledTimes(1));
    expect(onSearchChange).toHaveBeenCalledWith("lamp");
  });

  it("resets the debounce timer on every keystroke", async () => {
    const onSearchChange = vi.fn();
    render(<SearchBar onSearchChange={onSearchChange} delayMs={80} />);
    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "la" } });
    await new Promise((resolve) => setTimeout(resolve, 40));
    fireEvent.change(input, { target: { value: "lamp" } });

    await new Promise((resolve) => setTimeout(resolve, 40));
    expect(onSearchChange).not.toHaveBeenCalled();

    await waitFor(() => expect(onSearchChange).toHaveBeenCalledTimes(1));
    expect(onSearchChange).toHaveBeenCalledWith("lamp");
  });
});
