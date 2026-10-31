"use client";

import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react";

import { EventCardProps } from "@/lib/types";
import { formatEventDate } from "@/lib/events";

export default function EventCard({ event, onClick }: EventCardProps) {
  return (
    <article className="event-card">
      <div className="event-image">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 360px"
        />

        <span className="event-tag">{event.type}</span>

        <span className="event-date">
          <CalendarDays />
          {formatEventDate(event.date)}
        </span>
      </div>

      <div className="event-content">
        <h3>{event.title}</h3>

        <p className="location">
          <MapPin />
          {event.location}
        </p>

        <p className="event-description">{event.description}</p>

        <div className="event-card-footer">
          <span className="event-host">
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
