import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { createBackendToken } from "@/lib/backend-token";

const backendUrl = (
  process.env.BACKEND_API_URL?.trim() || "http://localhost:5000"
).replace(/\/+$/, "");

export async function getSessionUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user ?? null;
}

interface BackendRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  /** When true, the request requires a Better Auth session and a backend JWT. */
  authenticated?: boolean;
  /** When true, attach a JWT if a session exists but allow anonymous callers. */
  optionalAuthenticated?: boolean;
}

/**
 * Forwards a request from the Next.js app to the Express API, attaching a
 * signed JWT so the API can authenticate and authorise the caller.
 */
export async function backendRequest(
  path: string,
  {
    method = "GET",
    body,
    authenticated = false,
    optionalAuthenticated = false,
  }: BackendRequestOptions = {}
): Promise<Response> {
  const user =
    authenticated || optionalAuthenticated ? await getSessionUser() : null;

  if (authenticated && !user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = user
    ? await createBackendToken({
        id: user.id,
        email: user.email,
        name: user.name,
      })
    : null;

  try {
    const response = await fetch(`${backendUrl}${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { "content-type": "application/json" } : {}),
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    const payload = await response.text();

    return new Response(payload, {
      status: response.status,
      headers: {
        "content-type":
          response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error("Events API request failed:", error);

    return Response.json(
      { message: "The events service is unavailable right now." },
      { status: 502 }
    );
  }
}

export async function readJsonBody(
  request: Request
): Promise<{ ok: true; body: unknown } | { ok: false; response: Response }> {
  try {
    return { ok: true, body: await request.json() };
  } catch {
    return {
      ok: false,
      response: Response.json(
        { message: "Request body must be valid JSON." },
        { status: 400 }
      ),
    };
  }
}
