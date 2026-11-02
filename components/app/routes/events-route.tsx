"use client";

import EmptyEvents from "@/components/events/empty-events";
import EventListPage from "@/components/events/event-list-page";
import LoadingSkeleton from "@/components/ui/loading-skeleton";

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
    eventsLoading,
    eventsError,
    reloadEvents,
  } = useApp();

  if (eventsLoading) {
    return (
      <main className="page-main" aria-busy="true" aria-live="polite">
        <span className="visually-hidden">Loading community events…</span>
        <LoadingSkeleton count={6} />
      </main>
    );
  }

  if (eventsError) {
    return (
      <main className="page-main">
        <EmptyEvents
          title="Could not load events"
          description={eventsError}
          actionLabel="Try again"
          onAction={reloadEvents}
        />
      </main>
    );
  }

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
