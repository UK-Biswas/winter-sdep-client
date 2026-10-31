"use client";

import { Event } from "@/lib/types";
import { getEventId } from "@/lib/events";

import EventCard from "./event-card";

interface EventGridProps {
  events: Event[];
  onSelect: (event: Event) => void;
  wide?: boolean;
}

export default function EventGrid({
  events,
  onSelect,
  wide = true,
}: EventGridProps) {
  return (
    <div className={wide ? "event-grid event-grid-wide" : "event-grid"}>
      {events.map((event) => (
        <EventCard
          key={getEventId(event)}
          event={event}
          onClick={() => onSelect(event)}
        />
      ))}
    </div>
  );
}
