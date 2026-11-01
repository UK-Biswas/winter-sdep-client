"use client";

import CreateEventForm from "@/components/events/create-event-form";

import { useApp, useRequireUser } from "../app-provider";

export default function CreateEventRoute() {
  const user = useRequireUser("create");
  const { createEvent, navigate } = useApp();

  if (!user) return null;

  return (
    <CreateEventForm
      key="create-event"
      mode="create"
      organizer={user}
      onBack={() => navigate("events")}
      onSubmit={createEvent}
    />
  );
}
