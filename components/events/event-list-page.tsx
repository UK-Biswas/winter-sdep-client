"use client";

import { CalendarDays, HeartHandshake } from "lucide-react";

import { Event } from "@/lib/types";

import EmptyEvents from "./empty-events";
import EventFilters from "./event-filters";
import EventGrid from "./event-grid";

interface EventListPageProps {
  events: Event[];
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  onSelect: (event: Event) => void;
  onCreate: () => void;
  onReset: () => void;
}

export default function EventListPage({
  events,
  search,
  setSearch,
  category,
  setCategory,
  onSelect,
  onCreate,
  onReset,
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
            Discover verified volunteer initiatives scheduled for upcoming
            dates. Past drives leave the board automatically, so every card here
            still needs you.
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
        count={events.length}
        onReset={onReset}
      />

      {events.length > 0 ? (
        <EventGrid events={events} onSelect={onSelect} />
      ) : (
        <EmptyEvents onAction={onReset} onSecondary={onCreate} />
      )}
    </main>
  );
}
