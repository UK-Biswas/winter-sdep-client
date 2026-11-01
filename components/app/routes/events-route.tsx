"use client";

import EventListPage from "@/components/events/event-list-page";

import { useApp } from "../app-provider";

export default function EventsRoute() {
  const {
    visibleEvents,
    search,
    setSearch,
    category,
    setCategory,
    openEvent,
    navigate,
    resetFilters,
  } = useApp();

  return (
    <EventListPage
      events={visibleEvents}
      search={search}
      setSearch={setSearch}
      category={category}
      setCategory={setCategory}
      onSelect={openEvent}
      onCreate={() => navigate("create")}
      onReset={resetFilters}
    />
  );
}
