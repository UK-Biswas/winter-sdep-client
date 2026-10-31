"use client";

import { Search } from "lucide-react";

interface EventFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
}

const categories = [
  "All",
  "Winter Relief",
  "Donation",
  "Cleanup",
  "Plantation",
  "Food Drive",
  "Health Camp",
];

export default function EventFilters({
  search,
  setSearch,
  category,
  setCategory,
}: EventFiltersProps) {
  return (
    <div className="filters">
      <div className="filter-pills">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "active" : ""}
            onClick={() => setCategory(item)}
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
        />
      </label>
    </div>
  );
}