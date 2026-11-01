"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import { demoEvents } from "@/lib/demo-data";
import { authClient, useSession } from "@/lib/auth-client";
import { getEventId, isUpcoming, sortByDate } from "@/lib/events";
import { eventEditPath, eventPath, pathFor } from "@/lib/routes";
import {
  Event,
  EventDraft,
  JoinedMap,
  PageView,
  SessionUser,
} from "@/lib/types";

const GATED_VIEWS: PageView[] = ["create", "edit", "manage", "joined"];

interface Toast {
  id: number;
  text: string;
}

interface AppStore {
  events: Event[];
  user: SessionUser | null;
  joined: JoinedMap;
  search: string;
  category: string;
  setSearch: (value: string) => void;
  setCategory: (value: string) => void;
  toast: Toast | null;
  deleteTarget: Event | null;
  setDeleteTarget: (event: Event | null) => void;
  sessionReady: boolean;
  sessionActive: boolean;
  upcomingEvents: Event[];
  visibleEvents: Event[];
  myEvents: Event[];
  joinedEvents: Event[];
  getEventById: (id: string) => Event | null;
  navigate: (page: PageView) => void;
  openEvent: (event: Event) => void;
  editEvent: (event: Event) => void;
  createEvent: (draft: EventDraft) => void;
  updateEvent: (id: string, draft: EventDraft) => void;
  confirmDelete: () => void;
  toggleJoin: (event: Event) => void;
  handleJoin: (event: Event) => void;
  handleAuthSuccess: (account: SessionUser, redirectTo?: string) => void;
  signOut: () => void;
  resetFilters: () => void;
  handleCategory: (category: string) => void;
}

const AppContext = createContext<AppStore | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();

  const [events, setEvents] = useState<Event[]>(demoEvents);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [joined, setJoined] = useState<JoinedMap>({});

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [toast, setToast] = useState<Toast | null>(null);
  const [pendingView, setPendingView] = useState<PageView | null>(null);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [pendingJoinId, setPendingJoinId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);

  /* ---------------------------- session --------------------------- */

  // Derive the session user instead of copying it into state from an effect.
  // The local `user` value covers the instant after sign-in/sign-out while the
  // Better Auth session query catches up.
  const sessionUser = useMemo<SessionUser | null>(() => {
    if (!session?.user) return null;

    return {
      name: session.user.name,
      email: session.user.email,
      photo: session.user.image ?? undefined,
    };
  }, [session]);

  const currentUser = user ?? sessionUser;
  const sessionReady = !sessionPending;
  const sessionActive = Boolean(session?.user);

  /* ----------------------------- toast ----------------------------- */

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => setToast(null), 3400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const showToast = useCallback((text: string) => {
    setToast({ id: Date.now(), text });
  }, []);

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

  const myEvents = useMemo(() => {
    if (!currentUser) return [];

    return sortByDate(
      events.filter(
        (event) =>
          event.organizerEmail?.toLowerCase() ===
          currentUser.email.toLowerCase()
      )
    );
  }, [events, currentUser]);

  const joinedEvents = useMemo(
    () => sortByDate(events.filter((event) => joined[getEventId(event)])),
    [events, joined]
  );

  const getEventById = useCallback(
    (id: string) => events.find((event) => getEventId(event) === id) ?? null,
    [events]
  );

  /* -------------------------- navigation -------------------------- */

  const navigate = useCallback(
    (page: PageView) => {
      if (page === "auth" && currentUser) {
        router.push(pathFor("manage"));
        return;
      }

      if (GATED_VIEWS.includes(page) && !currentUser) {
        setPendingView(page);
        setPendingPath(pathFor(page));
        showToast("Sign in to continue to your workspace.");
        router.push(pathFor("auth"));
        return;
      }

      router.push(pathFor(page));
    },
    [router, showToast, currentUser]
  );

  const openEvent = useCallback(
    (event: Event) => {
      router.push(eventPath(event));
    },
    [router]
  );

  const editEvent = useCallback(
    (event: Event) => {
      router.push(eventEditPath(event));
    },
    [router]
  );

  /* ----------------------------- events --------------------------- */

  const toggleJoin = useCallback(
    (event: Event) => {
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
    },
    [joined, showToast]
  );

  const handleJoin = useCallback(
    (event: Event) => {
      if (!currentUser) {
        setPendingJoinId(getEventId(event));
        setPendingView("details");
        setPendingPath(eventPath(event));
        showToast("Sign in to join this drive.");
        router.push(pathFor("auth"));
        return;
      }

      toggleJoin(event);
    },
    [router, showToast, toggleJoin, currentUser]
  );

  const createEvent = useCallback(
    (draft: EventDraft) => {
      if (!currentUser) return;

      const newEvent: Event = {
        id: `evt-${Date.now()}`,
        ...draft,
        host: currentUser.name,
        organizerEmail: currentUser.email,
        joinedCount: 0,
        createdAt: new Date().toISOString(),
      };

      setEvents((current) => [newEvent, ...current]);
      showToast("Your winter initiative is live.");
      router.push(pathFor("manage"));
    },
    [router, showToast, currentUser]
  );

  const updateEvent = useCallback(
    (id: string, draft: EventDraft) => {
      setEvents((current) =>
        current.map((event) =>
          getEventId(event) === id ? { ...event, ...draft } : event
        )
      );

      showToast("Event updated. Volunteers will see the new details.");
      router.push(pathFor("manage"));
    },
    [router, showToast]
  );

  const confirmDelete = useCallback(() => {
    if (!deleteTarget) return;

    const id = getEventId(deleteTarget);

    setEvents((current) =>
      current.filter((event) => getEventId(event) !== id)
    );

    setDeleteTarget(null);
    showToast("Event deleted. Volunteer registrations were removed.");
  }, [deleteTarget, showToast]);

  /* ------------------------- auth & account ------------------------ */

  const handleAuthSuccess = useCallback(
    (account: SessionUser, redirectTo?: string) => {
      setUser(account);
      showToast(`Welcome, ${account.name.split(" ")[0]}.`);

      if (pendingJoinId) {
        const target = events.find(
          (event) => getEventId(event) === pendingJoinId
        );
        if (target) toggleJoin(target);
        setPendingJoinId(null);
      }

      const destination =
        redirectTo ??
        pendingPath ??
        (pendingView ? pathFor(pendingView) : pathFor("home"));
      setPendingView(null);
      setPendingPath(null);
      router.push(destination);
    },
    [
      events,
      pendingJoinId,
      pendingPath,
      pendingView,
      router,
      showToast,
      toggleJoin,
    ]
  );

  const signOut = useCallback(async () => {
    try {
      await authClient.signOut();
    } catch {
      // Clear the local session even if the network request fails.
    } finally {
      setUser(null);
      setJoined({});
      setPendingView(null);
      setPendingPath(null);
      showToast("Signed out. See you at the next drive.");
      router.push(pathFor("home"));
    }
  }, [router, showToast]);

  /* ---------------------------- filters --------------------------- */

  const handleCategory = useCallback(
    (nextCategory: string) => {
      setCategory(nextCategory);
      setSearch("");
      router.push(pathFor("events"));
    },
    [router]
  );

  const resetFilters = useCallback(() => {
    setSearch("");
    setCategory("All");
  }, []);

  const value = useMemo<AppStore>(
    () => ({
      events,
      user: currentUser,
      joined,
      search,
      category,
      setSearch,
      setCategory,
      toast,
      deleteTarget,
      setDeleteTarget,
      sessionReady,
      sessionActive,
      upcomingEvents,
      visibleEvents,
      myEvents,
      joinedEvents,
      getEventById,
      navigate,
      openEvent,
      editEvent,
      createEvent,
      updateEvent,
      confirmDelete,
      toggleJoin,
      handleJoin,
      handleAuthSuccess,
      signOut,
      resetFilters,
      handleCategory,
    }),
    [
      events,
      currentUser,
      joined,
      search,
      category,
      toast,
      deleteTarget,
      sessionReady,
      sessionActive,
      upcomingEvents,
      visibleEvents,
      myEvents,
      joinedEvents,
      getEventById,
      navigate,
      openEvent,
      editEvent,
      createEvent,
      updateEvent,
      confirmDelete,
      toggleJoin,
      handleJoin,
      handleAuthSuccess,
      signOut,
      resetFilters,
      handleCategory,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppStore {
  const store = useContext(AppContext);

  if (!store) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return store;
}

/**
 * Client-side gate for account-only routes. On first mount, a visitor without
 * a session is sent to the sign-in page (which returns them to `page` after a
 * successful sign-in).
 */
export function useRequireUser(page: PageView): SessionUser | null {
  const { user, navigate, sessionReady } = useApp();
  const checked = useRef(false);

  useEffect(() => {
    if (!sessionReady || checked.current) return;

    checked.current = true;

    if (!user) navigate(page);
  }, [navigate, page, sessionReady, user]);

  return user;
}
