"use client";

import { CalendarDays, HeartHandshake } from "lucide-react";

import { Event } from "@/lib/types";
import EventGrid from "./event-grid";
import EventFilters from "./event-filters";
import EmptyEvents from "./empty-events";

interface EventListPageProps {
  events: Event[];
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  onSelect: (event: Event) => void;
  onCreate: () => void;
}

export default function EventListPage({
  events,
  search,
  setSearch,
  category,
  setCategory,
  onSelect,
  onCreate,
}: EventListPageProps) {
  return (
    <main className="page-main">
      <div className="page-title-row">
        <div>
          <div className="eyebrow">
            <CalendarDays />
            Future community drives
          </div>

          <h1>Upcoming events</h1>

          <p>
            Discover verified volunteer initiatives scheduled
            for upcoming dates.
          </p>
        </div>

        <button className="primary-button" onClick={onCreate}>
          <HeartHandshake />
          Create event
        </button>
      </div>

      <EventFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      {events.length > 0 ? (
        <EventGrid events={events} onSelect={onSelect} />
      ) : (
        <EmptyEvents />
      )}
    </main>
  );
}