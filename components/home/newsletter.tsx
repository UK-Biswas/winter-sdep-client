"use client";

import { Send } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="newsletter">
      <div className="newsletter-inner">
        <div className="eyebrow">Stay connected</div>

        <h2>
          Bring more warmth
          <br />
          to your inbox.
        </h2>

        <p>
          Get a thoughtful note when new winter drives and
          community initiatives open near you.
        </p>

        <form onSubmit={(event) => event.preventDefault()}>
          <input
            aria-label="Email address"
            type="email"
            placeholder="Enter your email address"
            required
          />

          <button className="primary-button" type="submit">
            Subscribe <Send />
          </button>
        </form>

        <small>No spam. Just good news and ways to help.</small>
      </div>
    </section>
  );
}