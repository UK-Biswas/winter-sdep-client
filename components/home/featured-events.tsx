"use client";

import { ArrowRight } from "lucide-react";

import EventCard from "@/components/events/event-card";
import LoadingSkeleton from "@/components/ui/loading-skeleton";
import { Event } from "@/lib/types";
import { getEventId, sortByDate } from "@/lib/events";

interface FeaturedEventsProps {
  events: Event[];
  loading?: boolean;
  onSelect: (event: Event) => void;
  onViewAll: () => void;
}

export default function FeaturedEvents({
  events,
  loading = false,
  onSelect,
  onViewAll,
}: FeaturedEventsProps) {
  return (
    <section className="section events-section" id="events">
      <div className="section-heading row-heading">
        <div>
          <div className="eyebrow">A little closer to home</div>
          <h2>Recent upcoming events</h2>
          <p>
            Latest community drives scheduled in your city. Get involved
            today — every one of them is still open.
          </p>
        </div>

        <button className="text-button" onClick={onViewAll}>
          View all events <ArrowRight />
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : (
        <div className="event-grid">
          {sortByDate(events)
            .slice(0, 6)
            .map((event) => (
              <EventCard
                key={getEventId(event)}
                event={event}
                onClick={() => onSelect(event)}
              />
            ))}
        </div>
      )}
    </section>
  );
}
