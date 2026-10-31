"use client";

import {
  ArrowRight,
  HeartHandshake,
  Snowflake,
  Sparkles,
  Users,
} from "lucide-react";

interface HeroSectionProps {
  onNavigate: (page: string) => void;
}

export default function HeroSection({
  onNavigate,
}: HeroSectionProps) {
  return (
    <section className="hero-section">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />

      <div className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles />
            Community-led winter action
          </div>

          <h1>
            Make this winter
            <br />
            <span>warmer for everyone.</span>
          </h1>

          <p>
            Discover local drives, gather your people, and turn a
            little time into a lot of comfort for neighbors who
            need it most.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() => onNavigate("events")}
            >
              Explore winter events
              <ArrowRight />
            </button>

            <button
              className="secondary-button"
              onClick={() => onNavigate("create")}
            >
              <HeartHandshake />
              Start an initiative
            </button>
          </div>

          <div className="trust-line">
            <span className="avatar-stack">
              <i>SR</i>
              <i>NK</i>
              <i>MA</i>
              <i>+</i>
            </span>

            <span>
              <strong>1,450+ people</strong> are already showing
              up this season
            </span>
          </div>
        </div>

        <div className="hero-art">
          <div className="art-glow" />

          <div className="art-card art-card-main">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1.3-FeSOGHGjRQDAym7ahSnVVzlUgUDpZ1.png"
              alt="Friends helping each other in a snowy winter landscape"
            />

            <div className="art-caption">
              <span className="live-dot" />
              24 active drives nearby
              <ArrowRight />
            </div>
          </div>

          <div className="floating-note note-one">
            <Snowflake />

            <span>
              <strong>Winter relief</strong>
              <small>is where it begins</small>
            </span>
          </div>

          <div className="floating-note note-two">
            <Users />

            <span>
              <strong>180+</strong>
              <small>drives completed</small>
            </span>
          </div>
        </div>
      </div>

      <div className="hero-stats">
        <div>
          <strong>1,450<span>+</span></strong>
          <small>Active volunteers</small>
        </div>

        <div>
          <strong>180<span>+</span></strong>
          <small>Events completed</small>
        </div>

        <div>
          <strong>24k<span>+</span></strong>
          <small>Lives touched</small>
        </div>

        <div>
          <strong>100<span>%</span></strong>
          <small>Community driven</small>
        </div>
      </div>
    </section>
  );
}