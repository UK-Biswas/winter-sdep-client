import { backendRequest } from "@/lib/backend-api";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  return backendRequest(`/api/events/${encodeURIComponent(id)}/join`, {
    method: "POST",
    authenticated: true,
  });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  return backendRequest(`/api/events/${encodeURIComponent(id)}/join`, {
    method: "DELETE",
    authenticated: true,
  });
}
