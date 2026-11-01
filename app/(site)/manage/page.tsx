import { redirect } from "next/navigation";

import ManageEventsRoute from "@/components/app/routes/manage-events-route";
import { getServerSessionUser } from "@/lib/session";

export default async function ManageEventsPageRoute() {
  const user = await getServerSessionUser();

  if (!user) {
    redirect("/auth?next=/manage");
  }

  return <ManageEventsRoute />;
}
