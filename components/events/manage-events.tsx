"use client";

import Image from "next/image";
import {
  CalendarDays,
  MapPin,
  Pencil,
  PlusCircle,
  Trash2,
  Users,
} from "lucide-react";

import EmptyEvents from "@/components/events/empty-events";
import { formatEventDate, getEventId } from "@/lib/events";
import { Event } from "@/lib/types";

interface ManageEventsProps {
  events: Event[];
  onCreate: () => void;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  onSelect: (event: Event) => void;
}

export default function ManageEvents({
  events,
  onCreate,
  onEdit,
  onDelete,
  onSelect,
}: ManageEventsProps) {
  if (!events.length) {
    return (
      <EmptyEvents
        title="No events yet"
        description="Publish your first drive and it will appear here with volunteer counts, edit controls, and a delete option."
        actionLabel="Create your first event"
        onAction={onCreate}
      />
    );
  }

  return (
    <div className="manage-list">
      {events.map((event) => (
        <article className="manage-row" key={getEventId(event)}>
          <div className="manage-thumb">
            <Image src={event.image} alt={event.title} fill sizes="140px" />
          </div>

          <div className="manage-info">
            <div className="manage-meta">
              <span className="event-tag">{event.type}</span>
              <span>
                <CalendarDays /> {formatEventDate(event.date)}
              </span>
            </div>

            <h3>{event.title}</h3>
            <p>{event.description}</p>

            <small>
              <MapPin /> {event.location}
              <span className="dot" />
              <Users /> {event.joinedCount ?? 0} volunteers
            </small>
          </div>

          <div className="manage-actions">
            <button className="ghost-button" onClick={() => onSelect(event)}>
              View
            </button>

            <button className="ghost-button" onClick={() => onEdit(event)}>
              <Pencil />
              Edit
            </button>

            <button
              className="ghost-button danger"
              onClick={() => onDelete(event)}
            >
              <Trash2 />
              Delete
            </button>
          </div>
        </article>
      ))}

      <button className="create-row" onClick={onCreate}>
        <PlusCircle />
        Create another event
      </button>
    </div>
  );
}
