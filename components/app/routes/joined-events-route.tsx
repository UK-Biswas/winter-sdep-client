"use client";

import JoinedEvents from "@/components/events/joined-events";
import PrivateEventsPage from "@/components/events/private-events-page";

import { useApp, useRequireUser } from "../app-provider";

export default function JoinedEventsRoute() {
  const user = useRequireUser("joined");
  const { joinedEvents, joined, openEvent, toggleJoin, navigate } = useApp();

  if (!user) return null;

  return (
    <PrivateEventsPage
      title="Joined events"
      label="My volunteer commitments"
      description="Here are all the social development and community service drives you have signed up for, sorted by event date."
    >
      <JoinedEvents
        events={joinedEvents}
        joined={joined}
        onSelect={openEvent}
        onLeave={toggleJoin}
        onBrowse={() => navigate("events")}
      />
    </PrivateEventsPage>
  );
}
