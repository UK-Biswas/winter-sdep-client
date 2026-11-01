import EventDetailsRoute from "@/components/app/routes/event-details-route";

export default async function EventDetailsPageRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EventDetailsRoute eventId={id} />;
}
