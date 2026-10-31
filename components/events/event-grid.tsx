"use client";

import { Event } from "@/lib/types";
import EventCard from "./event-card";

interface EventGridProps {
  events: Event[];
  onSelect: (event: Event) => void;
}

export default function EventGrid({
  events,
  onSelect,
}: EventGridProps) {
  return (
    <div className="event-grid event-grid-wide">
      {events.map((event) => (
        <EventCard
          key={event._id || event.id || event.title}
          event={event}
          onClick={() => onSelect(event)}
        />
      ))}
    </div>
  );
}