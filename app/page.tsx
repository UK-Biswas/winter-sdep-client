"use client";

import { useMemo, useState } from "react";

import { Check } from "lucide-react";

import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";

import HomePage from "@/components/home/home-page";

import EventListPage from "@/components/events/event-list-page";
import EventDetails from "@/components/events/event-details";
import CreateEventForm from "@/components/events/create-event-form";

import AuthPage from "@/components/auth/auth-page";

import PrivateEventsPage from "@/components/dashboard/private-events-page";

import { demoEvents } from "@/lib/demo-data";

import { Event, PageView } from "@/lib/types";

export default function Page() {
  const [dark, setDark] = useState(false);

  const [view, setView] = useState<PageView>("home");

  const [mobileOpen, setMobileOpen] = useState(false);

  const [selected, setSelected] = useState<Event>(
    demoEvents[0]
  );

  const [joined, setJoined] = useState<string[]>([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [toast, setToast] = useState("");

  const visibleEvents = useMemo(() => {
    return demoEvents.filter((event) => {
      const searchMatch = `${event.title} ${event.type} ${event.location}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const categoryMatch =
        category === "All" || event.type === category;

      return searchMatch && categoryMatch;
    });
  }, [search, category]);

  function navigate(page: string) {
    setView(page as PageView);
    setMobileOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function showToast(message: string) {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 3000);
  }

  function handleSelectEvent(event: Event) {
    setSelected(event);
    navigate("details");
  }

  function handleJoinEvent() {
    const eventId = selected._id || selected.id || selected.title;

    const alreadyJoined = joined.includes(eventId);

    setJoined((current) =>
      alreadyJoined
        ? current.filter((id) => id !== eventId)
        : [...current, eventId]
    );

    showToast(
      alreadyJoined
        ? "You left this event."
        : "You are on the volunteer list. Thank you."
    );
  }

  const joinedEvents = demoEvents.filter((event) => {
    const id = event._id || event.id || event.title;
    return joined.includes(id);
  });

  const myEvents = demoEvents.slice(0, 2);

  return (
    <div className={dark ? "app-shell dark-mode" : "app-shell"}>
      <SiteHeader
        dark={dark}
        mobileOpen={mobileOpen}
        setDark={setDark}
        setMobileOpen={setMobileOpen}
        onNavigate={navigate}
      />

      {view === "home" && (
        <HomePage
          events={demoEvents}
          onNavigate={navigate}
          onSelectEvent={handleSelectEvent}
        />
      )}

      {view === "events" && (
        <EventListPage
          events={visibleEvents}
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          onSelect={handleSelectEvent}
          onCreate={() => navigate("create")}
        />
      )}

      {view === "details" && (
        <EventDetails
          event={selected}
          isJoined={joined.includes(
            selected._id || selected.id || selected.title
          )}
          onJoin={handleJoinEvent}
          onBack={() => navigate("events")}
        />
      )}

      {view === "auth" && (
        <AuthPage
          onBack={() => navigate("home")}
          onSuccess={() => {
            showToast("Welcome to FrostTogether!");
            navigate("home");
          }}
        />
      )}

      {view === "create" && (
        <CreateEventForm
          onBack={() => navigate("events")}
          onSuccess={() => {
            showToast("Your winter initiative is ready to be discovered.");
            navigate("events");
          }}
        />
      )}

      {view === "manage" && (
        <PrivateEventsPage
          title="Manage my events"
          label="Organizer dashboard"
          description="Keep your winter initiatives moving, all in one calm workspace."
          events={myEvents}
          onCreate={() => navigate("create")}
          onSelect={handleSelectEvent}
        />
      )}

      {view === "joined" && (
        <PrivateEventsPage
          title="Joined events"
          label="My volunteer commitments"
          description="The good work you have already said yes to."
          events={joinedEvents}
          onSelect={handleSelectEvent}
        />
      )}

      <SiteFooter onNavigate={navigate} />

      {toast && (
        <div className="toast">
          <Check />
          {toast}
        </div>
      )}
    </div>
  );
}