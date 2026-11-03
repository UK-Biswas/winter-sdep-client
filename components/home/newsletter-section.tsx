"use client";

import { useState, type FormEvent } from "react";
import {
  BellRing,
  CalendarCheck,
  MailCheck,
  Send,
  ShieldCheck,
  Snowflake,
} from "lucide-react";

/**
 * Newsletter CTA shown on the landing page, directly above the footer.
 *
 * Inspired by a "Subscribe to Local Cause Alerts" reference. The client asked
 * for a polished section that matches the FrostTogether theme, so it reuses the
 * design language of the hero / footer: a deep-pine gradient card, aurora-like
 * glows, a frosted watermark snowflake, marigold accents, and pill inputs.
 *
 * The form is front-end only for now (same behaviour as the footer subscribe
 * box): it validates with the browser's email input rules and swaps to a
 * success state. When a newsletter endpoint exists, connect it in
 * `handleSubmit` and keep the optimistic success state.
 */
export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribed(true);
  }

  return (
    <section className="newsletter-section" id="newsletter">
      <div className="newsletter-card">
        {/* Decorative layers */}
        <span className="newsletter-glow" aria-hidden="true" />
        <span className="newsletter-aurora" aria-hidden="true" />
        <Snowflake className="newsletter-watermark" aria-hidden="true" />

        <div className="eyebrow newsletter-eyebrow">
          <BellRing />
          Stay connected
        </div>

        <h2>
          Never miss a chance to <em>warm your block.</em>
        </h2>

        <p>
          Get a short note when new winter drives, blanket distributions, or
          emergency clean-ups are organized in your neighborhood.
        </p>

        {subscribed ? (
          <div className="newsletter-success" role="status">
            <MailCheck />
            <span>
              <strong>You&rsquo;re on the list.</strong>
              Watch your inbox — the next drive near you is coming soon.
            </span>
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <label className="visually-hidden" htmlFor="newsletter-email">
              Email address
            </label>

            <input
              id="newsletter-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
            />

            <button type="submit" className="newsletter-submit">
              <Send />
              Subscribe
            </button>
          </form>
        )}

        <ul className="newsletter-perks" aria-label="Newsletter promise">
          <li>
            <CalendarCheck />
            Weekly round-up of new drives
          </li>
          <li>
            <ShieldCheck />
            No spam, ever
          </li>
          <li>
            <MailCheck />
            Unsubscribe anytime
          </li>
        </ul>
      </div>
    </section>
  );
}
