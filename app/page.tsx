"use client";

import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";

import AuthPage from "@/components/auth/auth-page";
import CreateEventForm from "@/components/events/create-event-form";
import DeleteEventModal from "@/components/events/delete-event-modal";
import EmptyEvents from "@/components/events/empty-events";
import EventDetails from "@/components/events/event-details";
import EventListPage from "@/components/events/event-list-page";
import JoinedEvents from "@/components/events/joined-events";
import ManageEvents from "@/components/events/manage-events";
import PrivateEventsPage from "@/components/events/private-events-page";
import HomePage from "@/components/home/home-page";
import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";

import { demoEvents } from "@/lib/demo-data";
import {
  getEventId,
  isUpcoming,
  sortByDate,
} from "@/lib/events";
import {
  Event,
  EventDraft,
  JoinedMap,
  PageView,
  SessionUser,
} from "@/lib/types";

const GATED_VIEWS: PageView[] = ["create", "manage", "joined"];

export default function Page() {
  const [view, setView] = useState<PageView>("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [events, setEvents] = useState<Event[]>(demoEvents);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [joined, setJoined] = useState<JoinedMap>({});

  const [selectedId, setSelectedId] = useState<string | null>(
    demoEvents[0] ? getEventId(demoEvents[0]) : null
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const [pendingView, setPendingView] = useState<PageView | null>(null);
  const [pendingJoinId, setPendingJoinId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);

  /* ----------------------------- toast ----------------------------- */

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => setToast(null), 3400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function showToast(text: string) {
    setToast({ id: Date.now(), text });
  }

  /* --------------------------- derived ---------------------------- */

  const upcomingEvents = useMemo(
    () => sortByDate(events.filter((event) => isUpcoming(event.date))),
    [events]
  );

  const visibleEvents = useMemo(() => {
    const term = search.trim().toLowerCase();

    return upcomingEvents.filter((event) => {
      const haystack =
        `${event.title} ${event.type} ${event.location} ${event.host}`.toLowerCase();

      return (
        (!term || haystack.includes(term)) &&
        (category === "All" || event.type === category)
      );
    });
  }, [upcomingEvents, search, category]);

  const selectedEvent = useMemo(
    () => events.find((event) => getEventId(event) === selectedId) ?? null,
    [events, selectedId]
  );

  const editingEvent = useMemo(
    () => events.find((event) => getEventId(event) === editingId) ?? null,
    [events, editingId]
  );

  const myEvents = useMemo(() => {
    if (!user) return [];

    return sortByDate(
      events.filter(
        (event) =>
          event.organizerEmail?.toLowerCase() === user.email.toLowerCase()
      )
    );
  }, [events, user]);

  const joinedEvents = useMemo(
    () => sortByDate(events.filter((event) => joined[getEventId(event)])),
    [events, joined]
  );

  const isOwnerOfSelected =
    Boolean(user && selectedEvent) &&
    selectedEvent?.organizerEmail?.toLowerCase() === user?.email.toLowerCase();

  /* -------------------------- navigation -------------------------- */

  function go(page: PageView) {
    setView(page);
    setMobileOpen(false);
  }

  function navigate(page: PageView) {
    if (page === "auth" && user) {
      go("manage");
      return;
    }

    if (GATED_VIEWS.includes(page) && !user) {
      setPendingView(page);
      showToast("Sign in to continue to your workspace.");
      go("auth");
      return;
    }

    go(page);
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  function handleCategory(nextCategory: string) {
    setCategory(nextCategory);
    setSearch("");
    go("events");
  }

  function resetFilters() {
    setSearch("");
    setCategory("All");
  }

  function handleSelectEvent(event: Event) {
    setSelectedId(getEventId(event));
    go("details");
  }

  /* ------------------------- auth & account ------------------------ */

  function handleAuthSuccess(account: SessionUser) {
    setUser(account);
    showToast(`Welcome, ${account.name.split(" ")[0]}.`);

    if (pendingJoinId) {
      const target = events.find(
        (event) => getEventId(event) === pendingJoinId
      );
      if (target) toggleJoin(target);
      setPendingJoinId(null);
    }

    const destination = pendingView ?? "home";
    setPendingView(null);
    go(destination);
  }

  function handleSignOut() {
    setUser(null);
    setJoined({});
    setPendingView(null);
    showToast("Signed out. See you at the next drive.");
    go("home");
  }

  /* ----------------------------- events --------------------------- */

  function toggleJoin(event: Event) {
    const id = getEventId(event);
    const alreadyJoined = Boolean(joined[id]);

    setJoined((current) => {
      const next = { ...current };
      if (alreadyJoined) delete next[id];
      else next[id] = new Date().toISOString();
      return next;
    });

    setEvents((current) =>
      current.map((item) =>
        getEventId(item) === id
          ? {
              ...item,
              joinedCount: Math.max(
                (item.joinedCount ?? 0) + (alreadyJoined ? -1 : 1),
                0
              ),
            }
          : item
      )
    );

    showToast(
      alreadyJoined
        ? "You left this event. Your spot is open again."
        : "You are on the volunteer list. Thank you."
    );
  }

  function handleJoin(event: Event) {
    if (!user) {
      setSelectedId(getEventId(event));
      setPendingJoinId(getEventId(event));
      setPendingView("details");
      showToast("Sign in to join this drive.");
      go("auth");
      return;
    }

    toggleJoin(event);
  }

  function handleCreate(draft: EventDraft) {
    if (!user) return;

    const newEvent: Event = {
      id: `evt-${Date.now()}`,
      ...draft,
      host: user.name,
      organizerEmail: user.email,
      joinedCount: 0,
      createdAt: new Date().toISOString(),
    };

    setEvents((current) => [newEvent, ...current]);
    showToast("Your winter initiative is live.");
    go("manage");
  }

  function handleUpdate(draft: EventDraft) {
    if (!editingId) return;

    setEvents((current) =>
      current.map((event) =>
        getEventId(event) === editingId ? { ...event, ...draft } : event
      )
    );

    setEditingId(null);
    showToast("Event updated. Volunteers will see the new details.");
    go("manage");
  }

  function startEdit(event: Event) {
    setEditingId(getEventId(event));
    go("edit");
  }

  function confirmDelete() {
    if (!deleteTarget) return;

    const id = getEventId(deleteTarget);

    setEvents((current) =>
      current.filter((event) => getEventId(event) !== id)
    );

    if (selectedId === id) {
      setSelectedId(null);
    }

    setDeleteTarget(null);
    showToast("Event deleted. Volunteer registrations were removed.");
  }

  /* ----------------------------- render --------------------------- */

  return (
    <div className="app-shell">
      <SiteHeader
        user={user}
        mobileOpen={mobileOpen}
        onToggleMenu={() => setMobileOpen((value) => !value)}
        onNavigate={navigate}
        onSignOut={handleSignOut}
      />

      {view === "home" && (
        <HomePage
          events={upcomingEvents}
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
          onReset={resetFilters}
        />
      )}

      {view === "details" &&
        (selectedEvent ? (
          <EventDetails
            event={selectedEvent}
            isJoined={Boolean(joined[getEventId(selectedEvent)])}
            joinedAt={joined[getEventId(selectedEvent)]}
            isOwner={isOwnerOfSelected}
            signedIn={Boolean(user)}
            onJoin={() => handleJoin(selectedEvent)}
            onBack={() => navigate("events")}
            onEdit={() => startEdit(selectedEvent)}
          />
        ) : (
          <main className="page-main">
            <EmptyEvents
              title="This event is no longer available"
              description="It may have been deleted by the organizer. Browse the board for another way to help."
              actionLabel="Browse upcoming events"
              onAction={() => navigate("events")}
            />
          </main>
        ))}

      {view === "auth" && (
        <AuthPage onBack={() => go("home")} onSuccess={handleAuthSuccess} />
      )}

      {view === "create" && user && (
        <CreateEventForm
          key="create-event"
          mode="create"
          organizer={user}
          onBack={() => go("events")}
          onSubmit={handleCreate}
        />
      )}

      {view === "edit" && user && editingEvent && (
        <CreateEventForm
          key={editingId}
          mode="edit"
          initialEvent={editingEvent}
          organizer={user}
          onBack={() => go("manage")}
          onSubmit={handleUpdate}
        />
      )}

      {view === "manage" && user && (
        <PrivateEventsPage
          title="Manage my events"
          label="Organizer"
          description="View, edit, and manage the social drives you have published. Only you have access to your created initiatives."
          onCreate={() => go("create")}
        >
          <ManageEvents
            events={myEvents}
            onCreate={() => go("create")}
            onEdit={startEdit}
            onDelete={setDeleteTarget}
            onSelect={handleSelectEvent}
          />
        </PrivateEventsPage>
      )}

      {view === "joined" && user && (
        <PrivateEventsPage
          title="Joined events"
          label="My volunteer commitments"
          description="Here are all the social development and community service drives you have signed up for, sorted by event date."
        >
          <JoinedEvents
            events={joinedEvents}
            joined={joined}
            onSelect={handleSelectEvent}
            onLeave={toggleJoin}
            onBrowse={() => navigate("events")}
          />
        </PrivateEventsPage>
      )}

      <SiteFooter onNavigate={navigate} onCategory={handleCategory} />

      {deleteTarget && (
        <DeleteEventModal
          event={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}

      {toast && (
        <div className="toast" role="status" key={toast.id}>
          <Check />
          {toast.text}
        </div>
      )}
    </div>
  );
}
