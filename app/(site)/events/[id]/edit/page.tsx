import { redirect } from "next/navigation";

import EditEventRoute from "@/components/app/routes/edit-event-route";
import { getServerSessionUser } from "@/lib/session";

export default async function EditEventPageRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getServerSessionUser();

  if (!user) {
    redirect(`/auth?next=${encodeURIComponent(`/events/${id}/edit`)}`);
  }

  return <EditEventRoute eventId={id} />;
}
