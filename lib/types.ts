export interface Event {
  _id?: string;
  id?: string;

  title: string;
  type: string;
  /** ISO date, e.g. 2026-11-15 */
  date: string;
  time?: string;
  location: string;
  host: string;
  image: string;
  description: string;

  organizerId?: string;
  organizerEmail?: string;
  joinedCount?: number;
  capacity?: number;
  guidelines?: string[];
  createdAt?: string;
  updatedAt?: string;
  /** Present when the signed-in visitor has joined this event. */
  joinedAt?: string;
  /** Computed by the API for the signed-in visitor. */
  isOwner?: boolean;
}

export interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export interface SessionUser {
  name: string;
  email: string;
  photo?: string;
}

export interface EventDraft {
  title: string;
  type: string;
  date: string;
  time?: string;
  location: string;
  image: string;
  description: string;
  capacity?: number;
  guidelines?: string[];
}

export interface Feature {
  title: string;
  text: string;
  icon: string;
}

export type PageView =
  | "home"
  | "events"
  | "auth"
  | "create"
  | "edit"
  | "joined"
  | "manage"
  | "profile"
  | "details";

/** eventId -> ISO timestamp of when the visitor joined */
export type JoinedMap = Record<string, string>;
