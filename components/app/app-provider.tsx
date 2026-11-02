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

import {
  apiErrorMessage,
  createEventRequest,
  deleteEventRequest,
  fetchEvents,
  joinEventRequest,
  leaveEventRequest,
  updateEventRequest,
} from "@/lib/api";
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

const GATED_VIEWS: PageView[] = [
  "create",
  "edit",
  "manage",
  "joined",
  "profile",
];

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
  eventsLoading: boolean;
  eventsError: string | null;
  upcomingEvents: Event[];
  visibleEvents: Event[];
  myEvents: Event[];
  joinedEvents: Event[];
  getEventById: (id: string) => Event | null;
  navigate: (page: PageView) => void;
  openEvent: (event: Event) => void;
  editEvent: (event: Event) => void;
  createEvent: (draft: EventDraft) => Promise<boolean>;
  updateEvent: (id: string, draft: EventDraft) => Promise<boolean>;
  confirmDelete: () => Promise<void>;
  toggleJoin: (event: Event) => Promise<void>;
  handleJoin: (event: Event) => void;
  handleAuthSuccess: (account: SessionUser, redirectTo?: string) => void;
  signOut: () => void;
  resetFilters: () => void;
  handleCategory: (category: string) => void;
  reloadEvents: () => Promise<void>;
  refreshSession: () => Promise<void>;
  showToast: (text: string) => void;
}

const AppContext = createContext<AppStore | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const {
    data: session,
    isPending: sessionPending,
    refetch: refetchSession,
  } = useSession();

  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [toast, setToast] = useState<Toast | null>(null);
  const [pendingView, setPendingView] = useState<PageView | null>(null);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [pendingJoinId, setPendingJoinId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const hasLoadedEvents = useRef(false);

  
  const sessionUser = useMemo<SessionUser | null>(() => {
    if (!session?.user) return null;

    return {
      name: session.user.name,
      email: session.user.email,
      photo: session.user.image ?? undefined,
    };
  }, [session]);

  const currentUser = sessionUser ?? user;
  const sessionReady = !sessionPending;
  const sessionActive = Boolean(session?.user);



  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => setToast(null), 3400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const showToast = useCallback((text: string) => {
    setToast({ id: Date.now(), text });
  }, []);

  
  useEffect(() => {
    let active = true;

    fetchEvents()
      .then((data) => {
        if (!active) return;

        setEvents(data);
        setEventsError(null);
        hasLoadedEvents.current = true;
      })
      .catch((error) => {
        if (!active) return;

        const message = apiErrorMessage(
          error,
          "Could not load events. Please try again."
        );

        setEventsError(message);

        if (!hasLoadedEvents.current) showToast(message);
      })
      .finally(() => {
        if (active) setEventsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [sessionActive, showToast]);

  const reloadEvents = useCallback(async () => {
    setEventsLoading(true);

    try {
      const data = await fetchEvents();
      setEvents(data);
      setEventsError(null);
      hasLoadedEvents.current = true;
    } catch (error) {
      setEventsError(
        apiErrorMessage(error, "Could not load events. Please try again.")
      );
    } finally {
      setEventsLoading(false);
    }
  }, []);

 
  const joined = useMemo<JoinedMap>(() => {
    const map: JoinedMap = {};

    for (const event of events) {
      if (event.joinedAt) {
        map[getEventId(event)] = event.joinedAt;
      }
    }

    return map;
  }, [events]);

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


  const toggleJoin = useCallback(
    async (event: Event) => {
      const id = getEventId(event);
      const alreadyJoined = Boolean(joined[id]);

      try {
        const updated = alreadyJoined
          ? await leaveEventRequest(id)
          : await joinEventRequest(id);

        setEvents((current) =>
          current.map((item) => (getEventId(item) === id ? updated : item))
        );

        showToast(
          alreadyJoined
            ? "You left this event. Your spot is open again."
            : "You are on the volunteer list. Thank you."
        );
      } catch (error) {
        showToast(
          apiErrorMessage(
            error,
            alreadyJoined
              ? "Could not leave this event. Please try again."
              : "Could not join this event. Please try again."
          )
        );
      }
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
    async (draft: EventDraft): Promise<boolean> => {
      if (!currentUser) return false;

      try {
        const created = await createEventRequest(draft);

        setEvents((current) => [created, ...current]);
        showToast("Your winter initiative is live.");
        router.push(pathFor("manage"));
        return true;
      } catch (error) {
        showToast(
          apiErrorMessage(
            error,
            "Could not publish your event. Please try again."
          )
        );
        return false;
      }
    },
    [router, showToast, currentUser]
  );

  const updateEvent = useCallback(
    async (id: string, draft: EventDraft): Promise<boolean> => {
      try {
        const updated = await updateEventRequest(id, draft);

        setEvents((current) =>
          current.map((event) => (getEventId(event) === id ? updated : event))
        );

        showToast("Event updated. Volunteers will see the new details.");
        router.push(pathFor("manage"));
        return true;
      } catch (error) {
        showToast(
          apiErrorMessage(
            error,
            "Could not update this event. Please try again."
          )
        );
        return false;
      }
    },
    [router, showToast]
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;

    const id = getEventId(deleteTarget);

    try {
      await deleteEventRequest(id);

      setEvents((current) =>
        current.filter((event) => getEventId(event) !== id)
      );

      setDeleteTarget(null);
      showToast("Event deleted. Volunteer registrations were removed.");
    } catch (error) {
      showToast(
        apiErrorMessage(error, "Could not delete this event. Please try again.")
      );
    }
  }, [deleteTarget, showToast]);



  const handleAuthSuccess = useCallback(
    (account: SessionUser, redirectTo?: string) => {
      setUser(account);
      showToast(`Welcome, ${account.name.split(" ")[0]}.`);

      if (pendingJoinId) {
        const target = events.find(
          (event) => getEventId(event) === pendingJoinId
        );
        if (target) void toggleJoin(target);
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
      setPendingView(null);
      setPendingPath(null);
      showToast("Signed out. See you at the next drive.");
      router.push(pathFor("home"));
    }
  }, [router, showToast]);



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

  const refreshSession = useCallback(async () => {
    await refetchSession();
  }, [refetchSession]);

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
      eventsLoading,
      eventsError,
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
      reloadEvents,
      refreshSession,
      showToast,
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
      eventsLoading,
      eventsError,
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
      reloadEvents,
      refreshSession,
      showToast,
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
