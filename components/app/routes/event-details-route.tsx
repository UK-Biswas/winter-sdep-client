"use client";

import EmptyEvents from "@/components/events/empty-events";
import EventDetails from "@/components/events/event-details";
import { getEventId } from "@/lib/events";

import { useApp } from "../app-provider";

export default function EventDetailsRoute({ eventId }: { eventId: string }) {
  const { user, joined, getEventById, handleJoin, navigate, editEvent } =
    useApp();

  const event = getEventById(eventId);

  if (!event) {
    return (
      <main className="page-main">
        <EmptyEvents
          title="This event is no longer available"
          description="It may have been deleted by the organizer. Browse the board for another way to help."
          actionLabel="Browse upcoming events"
          onAction={() => navigate("events")}
        />
      </main>
    );
  }

  const id = getEventId(event);
  const isOwner =
    Boolean(user) &&
    event.organizerEmail?.toLowerCase() === user?.email.toLowerCase();

  return (
    <EventDetails
      event={event}
      isJoined={Boolean(joined[id])}
      joinedAt={joined[id]}
      isOwner={isOwner}
      signedIn={Boolean(user)}
      onJoin={() => handleJoin(event)}
      onBack={() => navigate("events")}
      onEdit={() => editEvent(event)}
    />
  );
}
