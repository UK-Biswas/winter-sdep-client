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
  
    <footer className="site-footer w-full" id="footer">
      <div className="container mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-2 sm:gap-12 sm:text-left lg:grid-cols-4 lg:gap-8">

          {/* Brand Column */}
          <div className="footer-brand-column flex flex-col items-center sm:items-start">
            <button
              className="brand footer-brand"
              onClick={() => onNavigate("home")}
            >
              <LogoLockup />
            </button>

            <p className="mt-5 max-w-sm">
              A community-powered platform for warmer neighborhoods and stronger
              connections. Create a drive, join a neighbor, and let one morning
              ripple through the whole season.
            </p>

            <span className="footer-place mt-5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <MapPin />
              Dhaka, Bangladesh · Anywhere kindness lives
            </span>

            <form
              className="footer-subscribe mt-6 flex w-full max-w-sm"
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
                setEmail("");
              }}
            >
              <label
                className="visually-hidden"
                htmlFor="footer-email"
              >
                Email address
              </label>

              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="You@example.com"
                required
                className="min-w-0 flex-1"
              />

              <button
                type="submit"
                aria-label="Subscribe to updates"
                className="shrink-0"
              >
                <Send />
              </button>
            </form>

            <small className="footer-note mt-3 max-w-sm">
              {sent
                ? "You are on the list. Watch your inbox for the next drive."
                : "One thoughtful note when new drives open near you."}
            </small>
          </div>

          {/* Explore Platform */}
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-white">Explore platform</h4>

            <button className="text-[12px] py-[2px]" onClick={() => onNavigate("events")}>
              Upcoming events
            </button>

            <button className="text-[12px] py-[2px]" onClick={() => onNavigate("create")}>
              Create an event
            </button>

            <button className="text-[12px] py-[2px]" onClick={() => onNavigate("manage")}>
              Manage my events
            </button>

            <button className="text-[12px] py-[2px]" onClick={() => onNavigate("joined")}>
              My joined events
            </button>

            <button className="text-[12px] py-[2px]" onClick={() => onNavigate("auth")}>
              Sign in or register
            </button>
          </div>

          {/* Active Causes */}
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-white">Active causes</h4>

            {ACTIVE_CAUSES.map((cause) => (
              <button className="text-[12px] py-[2px]"
                key={cause.label}
                onClick={() => onCategory(cause.category)}
              >
                {cause.label}
              </button>
            ))}
          </div>

          {/* Community Spirit */}

          <div className="footer-spirit flex w-full flex-col items-center text-center sm:items-start sm:text-left">
            <h4 className="text-white">Community spirit</h4>

            <p className="max-w-sm">
              Every small action counts. Connect with local volunteers, turn
              compassion into direct community action, and thaw the coldest
              corners of the city.
            </p>

            <div className="items-center justify-center gap-2 self-center sm:self-start">
              <span className="footer-pill mt-5 inline-flex w-fit ">
                <Check />
                100% volunteer driven
              </span>

              <button
                className="footer-cta mt-5"
                onClick={() => onNavigate("create")}
              >
                Start an initiative <ArrowRight />
              </button>
            </div>
          </div>



        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom mt-12 flex flex-col items-center justify-between gap-3 border-t border-current/10 pt-6 text-center sm:flex-row sm:text-left">
          <span>
            © 2026 FrostTogether. Built for better winters.
          </span>

          <span>
            Made with care for every community.
          </span>
        </div>
      </div>
    </footer>



  );
}
