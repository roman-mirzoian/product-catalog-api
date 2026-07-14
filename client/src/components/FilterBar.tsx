import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";

export interface FilterValues {
  category: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
  sort: string;
}

interface FilterBarProps {
  initialValue: FilterValues;
  onFilterChange: (value: FilterValues) => void;
  delayMs?: number;
}

const SORT_OPTIONS = [
  { value: "", label: "Newest first" },
  { value: "price:asc", label: "Price: low to high" },
  { value: "price:desc", label: "Price: high to low" },
  { value: "name:asc", label: "Name: A to Z" },
];

export function FilterBar({ initialValue, onFilterChange, delayMs = 300 }: FilterBarProps) {
  const [category, setCategory] = useState(initialValue.category);
  const [minPrice, setMinPrice] = useState(initialValue.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialValue.maxPrice);
  const [inStock, setInStock] = useState(initialValue.inStock);
  const [sort, setSort] = useState(initialValue.sort);

  const textFilters = useMemo(
    () => ({ category, minPrice, maxPrice }),
    [category, minPrice, maxPrice]
  );
  const debouncedText = useDebounce(textFilters, delayMs);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    onFilterChange({ ...debouncedText, inStock, sort });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedText]);

  function handleInStockChange(next: boolean) {
    setInStock(next);
    onFilterChange({ category, minPrice, maxPrice, inStock: next, sort });
  }

  function handleSortChange(next: string) {
    setSort(next);
    onFilterChange({ category, minPrice, maxPrice, inStock, sort: next });
  }

  return (
    <div className="filter-bar">
      <input
        type="text"
        className="filter-bar__category"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Filter by category"
      />
      <input
        type="number"
        className="filter-bar__price"
        placeholder="Min price"
        min={0}
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        aria-label="Minimum price"
      />
      <input
        type="number"
        className="filter-bar__price"
        placeholder="Max price"
        min={0}
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        aria-label="Maximum price"
      />
      <label className="filter-bar__checkbox">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => handleInStockChange(e.target.checked)}
        />
        In stock only
      </label>
      <select
        className="filter-bar__sort"
        value={sort}
        onChange={(e) => handleSortChange(e.target.value)}
        aria-label="Sort by"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
