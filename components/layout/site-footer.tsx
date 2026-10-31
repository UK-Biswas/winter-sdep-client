"use client";

import { useState } from "react";
import { ArrowRight, Check, MapPin, Send } from "lucide-react";

import { LogoLockup } from "@/components/brand/logo";
import { ACTIVE_CAUSES } from "@/lib/constants";
import { PageView } from "@/lib/types";

interface SiteFooterProps {
  onNavigate: (page: PageView) => void;
  onCategory: (category: string) => void;
}

export default function SiteFooter({
  onNavigate,
  onCategory,
}: SiteFooterProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <footer className="site-footer" id="footer">
      <div className="footer-grid">
        <div className="footer-brand-column">
          <button
            className="brand footer-brand"
            onClick={() => onNavigate("home")}
          >
            <LogoLockup />
          </button>

          <p>
            A community-powered platform for warmer neighborhoods and stronger
            connections. Create a drive, join a neighbor, and let one morning
            ripple through the whole season.
          </p>

          <span className="footer-place">
            <MapPin />
            Dhaka, Bangladesh · Anywhere kindness lives
          </span>

          <form
            className="footer-subscribe"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
              setEmail("");
            }}
          >
            <label className="visually-hidden" htmlFor="footer-email">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="You@example.com"
              required
            />
            <button type="submit" aria-label="Subscribe to updates">
              <Send />
            </button>
          </form>

          <small className="footer-note">
            {sent
              ? "You are on the list. Watch your inbox for the next drive."
              : "One thoughtful note when new drives open near you."}
          </small>
        </div>

        <div>
          <h4>Explore platform</h4>

          <button onClick={() => onNavigate("events")}>Upcoming events</button>
          <button onClick={() => onNavigate("create")}>Create an event</button>
          <button onClick={() => onNavigate("manage")}>Manage my events</button>
          <button onClick={() => onNavigate("joined")}>My joined events</button>
          <button onClick={() => onNavigate("auth")}>Sign in or register</button>
        </div>

        <div>
          <h4>Active causes</h4>

          {ACTIVE_CAUSES.map((cause) => (
            <button
              key={cause.label}
              onClick={() => onCategory(cause.category)}
            >
              {cause.label}
            </button>
          ))}
        </div>

        <div className="footer-spirit">
          <h4>Community spirit</h4>

          <p>
            Every small action counts. Connect with local volunteers, turn
            compassion into direct community action, and thaw the coldest
            corners of the city.
          </p>

          <span className="footer-pill">
            <Check />
            100% volunteer driven
          </span>

          <button
            className="footer-cta"
            onClick={() => onNavigate("create")}
          >
            Start an initiative <ArrowRight />
          </button>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 FrostTogether. Built for better winters.</span>
        <span>Made with care for every community.</span>
      </div>
    </footer>
  );
}
