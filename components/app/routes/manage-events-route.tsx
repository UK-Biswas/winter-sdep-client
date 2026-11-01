"use client";

import ManageEvents from "@/components/events/manage-events";
import PrivateEventsPage from "@/components/events/private-events-page";

import { useApp, useRequireUser } from "../app-provider";

export default function ManageEventsRoute() {
  const user = useRequireUser("manage");
  const { myEvents, navigate, editEvent, setDeleteTarget, openEvent } = useApp();

  if (!user) return null;

  return (
    <PrivateEventsPage
      title="Manage my events"
      label="Organizer"
      description="View, edit, and manage the social drives you have published. Only you have access to your created initiatives."
      onCreate={() => navigate("create")}
    >
      <ManageEvents
        events={myEvents}
        onCreate={() => navigate("create")}
        onEdit={editEvent}
        onDelete={setDeleteTarget}
        onSelect={openEvent}
      />
    </PrivateEventsPage>
  );
}
