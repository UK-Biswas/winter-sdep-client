import { redirect } from "next/navigation";

import JoinedEventsRoute from "@/components/app/routes/joined-events-route";
import { getServerSessionUser } from "@/lib/session";

export default async function JoinedEventsPageRoute() {
  const user = await getServerSessionUser();

  if (!user) {
    redirect("/auth?next=/joined");
  }

  return <JoinedEventsRoute />;
}
