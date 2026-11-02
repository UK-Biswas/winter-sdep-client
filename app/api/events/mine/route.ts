import { backendRequest } from "@/lib/backend-api";

export const dynamic = "force-dynamic";

export async function GET() {
  return backendRequest("/api/events/mine", { authenticated: true });
}
