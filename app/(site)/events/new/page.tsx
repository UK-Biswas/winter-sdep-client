import { redirect } from "next/navigation";

import CreateEventRoute from "@/components/app/routes/create-event-route";
import { getServerSessionUser } from "@/lib/session";

export default async function CreateEventPageRoute() {
  const user = await getServerSessionUser();

  if (!user) {
    redirect("/auth?next=/events/new");
  }

  return <CreateEventRoute />;
}
