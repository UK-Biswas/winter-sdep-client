import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { SessionUser } from "@/lib/types";

/**
 * Reads the signed session from the request. Use this in Server Components to
 * protect account-only routes; never rely on client state for authorization.
 */
export async function getServerSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  return {
    name: session.user.name,
    email: session.user.email,
    photo: session.user.image ?? undefined,
  };
}
