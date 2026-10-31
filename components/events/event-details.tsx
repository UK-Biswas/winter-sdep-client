"use client";

import {
  CalendarDays,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Event } from "@/lib/types";

interface EventDetailsProps {
  event: Event;
  isJoined: boolean;
  onJoin: () => void;
  onBack: () => void;
}

export default function EventDetails({
  event,
  isJoined,
  onJoin,
  onBack,
}: EventDetailsProps) {
  return (
    <main className="page-main detail-main">
      <button className="back-button" onClick={onBack}>
        ← Back to upcoming events
      </button>

      <div className="detail-hero">
        <img src={event.image} alt={event.title} />

        <div className="detail-overlay">
          <span className="event-tag">{event.type}</span>

          <h1>{event.title}</h1>

          <div>
            <MapPin />
            {event.location}
            <CalendarDays />
            {event.date}
          </div>
        </div>
      </div>

      <div className="detail-body">
        <div className="join-bar">
          <div>
            <span className="feature-icon small">
              <Users />
            </span>

            <span>
              <strong>
                {isJoined
                  ? "You joined this drive"
                  : `${event.joinedCount || 0} volunteers joined`}
              </strong>

              <small>
                {isJoined
                  ? "Thank you for showing up."
                  : "Be the first to show up for this cause."}
              </small>
            </span>
          </div>

          <button className="primary-button" onClick={onJoin}>
            {isJoined ? "Joined · Click to leave" : "Join event"}
          </button>
        </div>

        <div className="detail-columns">
          <div>
            <h2>About this social initiative</h2>
            <p>{event.description}</p>

            <h3>Volunteer guidelines</h3>

            <ul>
              <li>
                Please arrive 15 minutes before the scheduled time.
              </li>
              <li>
                Wear comfortable clothing suitable for outdoor winter work.
              </li>
              <li>
                Bring any pre-coordinated relief packages or supplies.
              </li>
            </ul>
          </div>

          <aside>
            <span className="eyebrow">Initiative organizer</span>
            <h3>{event.host}</h3>
            <p>Verified platform member</p>

            <span className="footer-pill">
              <ShieldCheck />
              Organizer verified
            </span>
          </aside>
        </div>
      </div>
    </main>
  );
}