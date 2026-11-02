import { getEventId } from "./events";
import { Event, PageView } from "./types";

/**
 * URL for every app view. Views that need an event id build their path with
 * `eventPath` / `eventEditPath` instead.
 */
export const ROUTE_PATHS: Record<PageView, string> = {
  home: "/",
  events: "/events",
  auth: "/auth",
  create: "/events/new",
  edit: "/manage",
  joined: "/joined",
  manage: "/manage",
  profile: "/profile",
  details: "/events",
};

export function pathFor(page: PageView): string {
  return ROUTE_PATHS[page];
}

export function eventPath(event: Event): string {
  return `/events/${encodeURIComponent(getEventId(event))}`;
}

export function eventEditPath(event: Event): string {
  return `${eventPath(event)}/edit`;
}
