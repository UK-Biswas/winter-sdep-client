"use client";

import CreateEventForm from "@/components/events/create-event-form";
import { getEventId } from "@/lib/events";

import { useApp, useRequireUser } from "../app-provider";

export default function EditEventRoute({ eventId }: { eventId: string }) {
  const user = useRequireUser("edit");
  const { getEventById, updateEvent, navigate } = useApp();

  const event = getEventById(eventId);
  const isOwner =
    Boolean(user) &&
    event?.organizerEmail?.toLowerCase() === user?.email.toLowerCase();

  if (!user || !event || !isOwner) return null;

  const id = getEventId(event);

  return (
    <CreateEventForm
      key={id}
      mode="edit"
      initialEvent={event}
      organizer={user}
      onBack={() => navigate("manage")}
      onSubmit={(draft) => updateEvent(id, draft)}
    />
  );
}
