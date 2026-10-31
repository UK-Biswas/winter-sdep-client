"use client";

import Image from "next/image";
import { ArrowRight, CalendarDays, MapPin, UserMinus } from "lucide-react";

import EmptyEvents from "@/components/events/empty-events";
import { formatEventDate, formatJoinDate, getEventId } from "@/lib/events";
import { Event, JoinedMap } from "@/lib/types";

interface JoinedEventsProps {
  events: Event[];
  joined: JoinedMap;
  onSelect: (event: Event) => void;
  onLeave: (event: Event) => void;
  onBrowse: () => void;
}

export default function JoinedEvents({
  events,
  joined,
  onSelect,
  onLeave,
  onBrowse,
}: JoinedEventsProps) {
  if (!events.length) {
    return (
      <EmptyEvents
        title="No joined events yet"
        description="Here are all the social development and community service drives you have signed up for. Join a drive and it will appear here."
        actionLabel="Browse upcoming events"
        onAction={onBrowse}
      />
    );
  }

  return (
    <div className="manage-list">
      {events.map((event) => {
        const id = getEventId(event);

        return (
          <article className="manage-row joined-row" key={id}>
            <div className="manage-thumb">
              <Image src={event.image} alt={event.title} fill sizes="140px" />
            </div>

            <div className="manage-info">
              <div className="manage-meta">
                <span className="event-tag">{event.type}</span>
                <span>
                  <CalendarDays /> {formatEventDate(event.date)}
                </span>

                {joined[id] && (
                  <span className="joined-stamp">
                    Joined {formatJoinDate(joined[id])}
                  </span>
                )}
              </div>

              <h3>{event.title}</h3>
              <p>{event.description}</p>

              <small>
                <MapPin /> {event.location}
                <span className="dot" />
                <strong>{event.host}</strong>
              </small>
            </div>

            <div className="manage-actions">
              <button className="ghost-button" onClick={() => onSelect(event)}>
                View event <ArrowRight />
              </button>

              <button
                className="ghost-button danger"
                onClick={() => onLeave(event)}
              >
                <UserMinus />
                Leave
              </button>
            </div>
          </article>
        );
      })}

      <button className="create-row" onClick={onBrowse}>
        <ArrowRight />
        Find another way to help
      </button>
    </div>
  );
}
