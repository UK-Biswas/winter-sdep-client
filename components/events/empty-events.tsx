import { Snowflake } from "lucide-react";

interface EmptyEventsProps {
  title?: string;
  description?: string;
}

export default function EmptyEvents({
  title = "No upcoming events found",
  description = "Try another search or be the first to start a winter initiative.",
}: EmptyEventsProps) {
  return (
    <div className="empty-state">
      <Snowflake />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}