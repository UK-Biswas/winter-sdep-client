"use client";

import HomePage from "@/components/home/home-page";

import { useApp } from "../app-provider";

export default function HomeRoute() {
  const { upcomingEvents, navigate, openEvent, eventsLoading } = useApp();

  return (
    <HomePage
      events={upcomingEvents}
      loading={eventsLoading}
      onNavigate={navigate}
      onSelectEvent={openEvent}
    />
  );
}
