import { backendRequest, readJsonBody } from "@/lib/backend-api";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  return backendRequest(`/api/events/${encodeURIComponent(id)}`, {
    optionalAuthenticated: true,
  });
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const parsed = await readJsonBody(request);

  if (!parsed.ok) return parsed.response;

  return backendRequest(`/api/events/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: parsed.body,
    authenticated: true,
  });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  return backendRequest(`/api/events/${encodeURIComponent(id)}`, {
    method: "DELETE",
    authenticated: true,
  });
}
