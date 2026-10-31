"use client";

import Image from "next/image";
import {
  CalendarDays,
  Mail,
  MapPin,
  Pencil,
  ShieldCheck,
  Users,
} from "lucide-react";

import { formatEventDate, formatJoinDate } from "@/lib/events";
import { Event } from "@/lib/types";

interface EventDetailsProps {
  event: Event;
  isJoined: boolean;
  joinedAt?: string;
  isOwner?: boolean;
  signedIn: boolean;
  onJoin: () => void;
  onBack: () => void;
  onEdit?: () => void;
}

export default function EventDetails({
  event,
  isJoined,
  joinedAt,
  isOwner = false,
  signedIn,
  onJoin,
  onBack,
  onEdit,
}: EventDetailsProps) {
  const joined = event.joinedCount ?? 0;
  const guidelines = event.guidelines ?? [];

  return (
    <main className="page-main detail-main">
      <button className="back-button" onClick={onBack}>
        ← Back to upcoming events
      </button>

      <div className="detail-hero">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
        />

        <div className="detail-overlay">
          <span className="event-tag">{event.type}</span>

          <h1>{event.title}</h1>

          <div className="detail-meta">
            <span>
              <CalendarDays />
              {formatEventDate(event.date)}
            </span>

            <span>
              <MapPin />
              {event.location}
            </span>

            <span>
              <Users />
              {joined} volunteers joined
            </span>
          </div>
        </div>
      </div>

      <div className="detail-body">
        <div className="join-bar">
          <div className="join-info">
            <span className="feature-icon small">
              <Users />
            </span>

            <span>
              <strong>
                {isJoined
                  ? "You are confirmed for this initiative"
                  : `${joined} volunteers joined so far`}
              </strong>

              <small>
                {isJoined
                  ? `Joined on ${formatJoinDate(joinedAt || "")}. Thank you for showing up.`
                  : "Be the first to show up for this cause."}
              </small>
            </span>
          </div>

          <div className="join-actions">
            {isOwner && onEdit && (
              <button className="secondary-button" onClick={onEdit}>
                <Pencil />
                Edit event
              </button>
            )}

            <button
              className={isJoined ? "secondary-button" : "primary-button"}
              onClick={onJoin}
            >
              {!signedIn
                ? "Sign in to join this drive"
                : isJoined
                  ? "Joined · click to leave"
                  : "Join event"}
            </button>
          </div>
        </div>

        <div className="detail-columns">
          <div className="detail-copy">
            <h2>About this social initiative</h2>
            <p>{event.description}</p>

            {guidelines.length > 0 && (
              <>
                <h3>Organizer note</h3>

                <ul className="guideline-list">
                  {guidelines.map((guideline) => (
                    <li key={guideline}>{guideline}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="detail-aside">
            <div className="organizer-card">
              <span className="eyebrow">Initiative organizer</span>

              <div className="organizer-head">
                <span className="organizer-avatar">
                  {event.host
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase())
                    .join("")}
                </span>

                <div>
                  <h3>{event.host}</h3>
                  <small>Verified platform member</small>
                </div>
              </div>

              <a
                className="organizer-email"
                href={`mailto:${event.organizerEmail || "hello@frosttogether.org"}`}
              >
                <Mail />
                {event.organizerEmail || "hello@frosttogether.org"}
              </a>

              <span className="footer-pill">
                <ShieldCheck />
                Organizer verified
              </span>
            </div>

            <div className="detail-facts">
              <div>
                <CalendarDays />
                <span>
                  <small>Date</small>
                  <strong>{formatEventDate(event.date)}</strong>
                </span>
              </div>

              <div>
                <MapPin />
                <span>
                  <small>Venue</small>
                  <strong>{event.location}</strong>
                </span>
              </div>

              <div>
                <Users />
                <span>
                  <small>Volunteers</small>
                  <strong>{joined} joined</strong>
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
