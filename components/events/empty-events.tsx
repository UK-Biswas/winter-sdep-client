import { ArrowRight, Snowflake } from "lucide-react";

interface EmptyEventsProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export default function EmptyEvents({
  title = "No upcoming events found",
  description = "There are no drives matching your filter or search term. Try a wider search, or be the first to start one.",
  actionLabel = "Reset filters",
  onAction,
  secondaryLabel = "Create an event",
  onSecondary,
}: EmptyEventsProps) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Snowflake />
      </span>

      <h2>{title}</h2>
      <p>{description}</p>

      {(onAction || onSecondary) && (
        <div className="empty-actions">
          {onAction && (
            <button className="secondary-button" onClick={onAction}>
              {actionLabel}
            </button>
          )}

          {onSecondary && (
            <button className="primary-button" onClick={onSecondary}>
              {secondaryLabel} <ArrowRight />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
