import { useEffect, useRef, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";

interface SearchBarProps {
  initialValue?: string;
  onSearchChange: (value: string) => void;
  delayMs?: number;
}

export function SearchBar({ initialValue = "", onSearchChange, delayMs = 300 }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, delayMs);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    onSearchChange(debouncedValue.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <input
      type="search"
      className="search-bar"
      placeholder="Search products…"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      aria-label="Search products"
    />
  );
}
