import type { Event, EventDraft } from "@/lib/types";

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

interface ErrorPayload {
  message?: string;
  errors?: Record<string, string>;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(path, {
      ...init,
      cache: "no-store",
      headers: {
        ...(init.body ? { "content-type": "application/json" } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError(
      "The events service is unavailable. Check your connection and try again.",
      0
    );
  }

  const payload = (await response
    .json()
    .catch(() => null)) as ErrorPayload | T | null;

  if (!response.ok) {
    const error = payload as ErrorPayload | null;

    throw new ApiError(
      error?.message || `Request failed with status ${response.status}.`,
      response.status,
      error?.errors
    );
  }

  return payload as T;
}

function eventPath(id: string) {
  return `/api/events/${encodeURIComponent(id)}`;
}

export async function fetchEvents(): Promise<Event[]> {
  return request<Event[]>("/api/events");
}

export async function fetchJoinedEvents(): Promise<Event[]> {
  return request<Event[]>("/api/events/joined");
}

export async function createEventRequest(draft: EventDraft): Promise<Event> {
  return request<Event>("/api/events", {
    method: "POST",
    body: JSON.stringify(draft),
  });
}

export async function updateEventRequest(
  id: string,
  draft: EventDraft
): Promise<Event> {
  return request<Event>(eventPath(id), {
    method: "PUT",
    body: JSON.stringify(draft),
  });
}

export async function deleteEventRequest(id: string): Promise<void> {
  await request<{ deleted: boolean; id: string }>(eventPath(id), {
    method: "DELETE",
  });
}

export async function joinEventRequest(id: string): Promise<Event> {
  return request<Event>(`${eventPath(id)}/join`, { method: "POST" });
}

export async function leaveEventRequest(id: string): Promise<Event> {
  return request<Event>(`${eventPath(id)}/join`, { method: "DELETE" });
}

export function apiErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError && error.message ? error.message : fallback;
}
