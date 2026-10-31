"use client";

import { ArrowRight } from "lucide-react";
import { Event } from "@/lib/types";
import EventCard from "@/components/events/event-card";

interface FeaturedEventsProps {
  events: Event[];
  onSelect: (event: Event) => void;
  onViewAll: () => void;
}

export default function FeaturedEvents({
  events,
  onSelect,
  onViewAll,
}: FeaturedEventsProps) {
  return (
    <section className="section events-section">
      <div className="section-heading row-heading">
        <div>
          <div className="eyebrow">A little closer to home</div>
          <h2>Upcoming winter events</h2>
          <p>
            Find a cause that feels like yours and show up for it.
          </p>
        </div>

        <button className="text-button" onClick={onViewAll}>
          View all events <ArrowRight />
        </button>
      </div>

      <div className="event-grid">
        {events.slice(0, 3).map((event) => (
          <EventCard
            key={event._id || event.id || event.title}
            event={event}
            onClick={() => onSelect(event)}
          />
        ))}
      </div>
    </section>
  );
}