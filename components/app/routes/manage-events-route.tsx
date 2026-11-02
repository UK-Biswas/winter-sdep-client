"use client";

import EmptyEvents from "@/components/events/empty-events";
import ManageEvents from "@/components/events/manage-events";
import PrivateEventsPage from "@/components/events/private-events-page";
import LoadingSkeleton from "@/components/ui/loading-skeleton";

import { useApp, useRequireUser } from "../app-provider";

export default function ManageEventsRoute() {
  const user = useRequireUser("manage");
  const {
    myEvents,
    navigate,
    editEvent,
    setDeleteTarget,
    openEvent,
    eventsLoading,
    eventsError,
    reloadEvents,
  } = useApp();

  if (!user) return null;

  return (
    <PrivateEventsPage
      title="Manage my events"
      label="Organizer"
      description="View, edit, and manage the social drives you have published. Only you have access to your created initiatives."
      onCreate={() => navigate("create")}
    >
      {eventsLoading ? (
        <LoadingSkeleton count={3} />
      ) : eventsError ? (
        <EmptyEvents
          title="Could not load your events"
          description={eventsError}
          actionLabel="Try again"
          onAction={reloadEvents}
        />
      ) : (
        <ManageEvents
          events={myEvents}
          onCreate={() => navigate("create")}
          onEdit={editEvent}
          onDelete={setDeleteTarget}
          onSelect={openEvent}
        />
      )}
    </PrivateEventsPage>
  );
}
