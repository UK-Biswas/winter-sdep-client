"use client";

import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react";

import { Event, EventCardProps } from "@/lib/types";

export default function EventCard({
  event,
  onClick,
}: EventCardProps) {
  return (
    <article className="event-card">
      <div className="event-image">
        <img src={event.image} alt={event.title} />

        <span className="event-tag">
          {event.type}
        </span>

        <span className="event-date">
          <CalendarDays />
          {event.date}
        </span>
      </div>

      <div className="event-content">
        <h3>{event.title}</h3>

        <p className="location">
          <MapPin />
          {event.location}
        </p>

        <p>{event.description}</p>

        <div className="event-card-footer">
          <span>
            <Users />
            {event.host}
          </span>

          <button onClick={onClick}>
            View event <ArrowRight />
          </button>
        </div>
      </div>
    </article>
  );
}