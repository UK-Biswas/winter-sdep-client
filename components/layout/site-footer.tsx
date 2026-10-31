"use client";

import { Check, MapPin, Waves } from "lucide-react";

interface SiteFooterProps {
  onNavigate: (page: string) => void;
}

export default function SiteFooter({
  onNavigate,
}: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <button
            className="brand footer-brand"
            onClick={() => onNavigate("home")}
          >
            <span className="brand-mark">
              <Waves />
            </span>

            <span>
              <strong>FrostTogether</strong>
              <small>WINTER COMMUNITY</small>
            </span>
          </button>

          <p>
            A community-powered platform for warmer neighborhoods
            and stronger connections.
          </p>

          <span className="footer-place">
            <MapPin />
            Dhaka, Bangladesh · Anywhere kindness lives
          </span>
        </div>

        <div>
          <h4>Explore</h4>

          <button onClick={() => onNavigate("events")}>
            Upcoming events
          </button>

          <button onClick={() => onNavigate("create")}>
            Create an initiative
          </button>

          <button onClick={() => onNavigate("joined")}>
            My joined events
          </button>
        </div>

        <div>
          <h4>Winter causes</h4>
          <button>Clothes & blanket relief</button>
          <button>Community clean-ups</button>
          <button>Warm meal sharing</button>
        </div>

        <div>
          <h4>Why FrostTogether?</h4>

          <p>
            Because every small act matters. Connect with neighbors,
            share your time, and make the season brighter.
          </p>

          <span className="footer-pill">
            <Check />
            100% volunteer driven
          </span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 FrostTogether. Built for better winters.</span>
        <span>Made with care for every community.</span>
      </div>
    </footer>
  );
}