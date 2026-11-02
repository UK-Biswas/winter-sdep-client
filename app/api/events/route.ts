import { backendRequest, readJsonBody } from "@/lib/backend-api";

export const dynamic = "force-dynamic";

export async function GET() {
  return backendRequest("/api/events", { optionalAuthenticated: true });
}

export async function POST(request: Request) {
  const parsed = await readJsonBody(request);

  if (!parsed.ok) return parsed.response;

  return backendRequest("/api/events", {
    method: "POST",
    body: parsed.body,
    authenticated: true,
  });
}
