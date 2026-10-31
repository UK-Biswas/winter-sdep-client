export interface Event {
  _id?: string;
  id?: string;

  title: string;
  type: string;
  date: string;
  location: string;
  host: string;
  image: string;
  description: string;

  organizerEmail?: string;
  joinedCount?: number;
  createdAt?: string;
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
  | "joined"
  | "manage"
  | "details";