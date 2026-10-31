"use client";

import Image from "next/image";

import {
  ArrowRight,
  HeartHandshake,
  Snowflake,
  Sparkles,
  Users,
} from "lucide-react";

import { HERO_IMAGE } from "@/lib/constants";
import { PageView } from "@/lib/types";

import ImpactStats from "./impact-stats";

interface HeroSectionProps {
  onNavigate: (page: PageView) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
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
            Make winter warmer,
            <br />
            <em>one block at a time.</em>
          </h1>

          <p>
            Discover local drives, gather your people, and turn a little time
            into a lot of comfort for the neighbors who need it most.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() => onNavigate("events")}
            >
              Explore upcoming events
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
            <span className="avatar-stack" aria-hidden="true">
              <i>SR</i>
              <i>NK</i>
              <i>MA</i>
              <i>+</i>
            </span>

            <span>
              <strong>1,450+ neighbors</strong> are already showing up this
              season
            </span>
          </div>
        </div>

        <div className="hero-art">
          <div className="art-glow" />

          <div className="art-card art-card-main">
            <Image
              src={HERO_IMAGE}
              alt="Volunteers helping each other in a snowy winter landscape"
              width={640}
              height={480}
              sizes="(max-width: 1024px) 90vw, 520px"
              loading="eager"
              fetchPriority="high"
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

      <ImpactStats />
    </section>
  );
}
