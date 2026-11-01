"use client";

import HomePage from "@/components/home/home-page";

import { useApp } from "../app-provider";

export default function HomeRoute() {
  const { upcomingEvents, navigate, openEvent } = useApp();

  return (
    <HomePage
      events={upcomingEvents}
      onNavigate={navigate}
      onSelectEvent={openEvent}
    />
  );
}
