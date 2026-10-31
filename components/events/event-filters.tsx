"use client";

import { RotateCcw, Search } from "lucide-react";

import { EVENT_CATEGORIES } from "@/lib/constants";

interface EventFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  count: number;
  onReset: () => void;
}

export default function EventFilters({
  search,
  setSearch,
  category,
  setCategory,
  count,
  onReset,
}: EventFiltersProps) {
  return (
    <div className="filters">
      <div className="filters-row">
        <div className="filter-pills">
          {EVENT_CATEGORIES.map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="search-box">
          <Search />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search events or areas..."
            aria-label="Search events or areas"
          />
        </label>
      </div>

      <div className="filters-meta">
        <span>
          <strong>{count}</strong> upcoming{" "}
          {count === 1 ? "drive" : "drives"} found
        </span>

        <button onClick={onReset} className="text-button">
          <RotateCcw /> Reset filters
        </button>
      </div>
    </div>
  );
}
