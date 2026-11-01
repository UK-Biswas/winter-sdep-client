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


      {/* <div className="hero-grid grid grid-cols-1 items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
        <div className="hero-copy w-full text-center lg:text-left">
          <div className="eyebrow flex items-center justify-center gap-2 lg:justify-start">
            <Sparkles />
            Community-led winter action
          </div>

          <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Make winter warmer,
            <br />
            <em>one block at a time.</em>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg lg:mx-0">
            Discover local drives, gather your people, and turn a little time
            into a lot of comfort for the neighbors who need it most.
          </p>

          <div className="hero-actions mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
            <button
              className="primary-button flex items-center justify-center gap-2"
              onClick={() => onNavigate("events")}
            >
              Explore upcoming events
              <ArrowRight />
            </button>

            <button
              className="secondary-button flex items-center justify-center gap-2"
              onClick={() => onNavigate("create")}
            >
              <HeartHandshake />
              Start an initiative
            </button>
          </div>

          <div className="trust-line mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <span className="avatar-stack shrink-0" aria-hidden="true">
              <i>SR</i>
              <i>NK</i>
              <i>MA</i>
              <i>+</i>
            </span>

            <span className="text-center sm:text-left">
              <strong>1,450+ neighbors</strong> are already showing up this
              season
            </span>
          </div>
        </div>

        <div className="hero-art relative mx-auto w-full max-w-[580px] min-w-0">
          <div className="art-glow" />

          <div className="art-card art-card-main w-full overflow-hidden">
            <Image
              src={HERO_IMAGE}
              alt="Volunteers helping each other in a snowy winter landscape"
              width={640}
              height={480}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 85vw, 520px"
              className="h-auto w-full object-cover"
              loading="eager"
              fetchPriority="high"
            />

            <div className="art-caption flex items-center gap-2">
              <span className="live-dot shrink-0" />
              <span className="min-w-0 flex-1">24 active drives nearby</span>
              <ArrowRight className="shrink-0" />
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
      </div> */}



      <div className="hero-grid grid grid-cols-1 items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">

        {/* LEFT: HERO TEXT */}
        <div className="hero-copy mx-auto flex w-full max-w-2xl flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">

          <div className="eyebrow flex items-center justify-center gap-2 text-center lg:justify-start">
            <Sparkles />
            Community-led winter action
          </div>

          <h1 className="mt-5 w-full text-center text-4xl font-bold leading-tight sm:text-5xl lg:text-left lg:text-6xl xl:text-7xl">
            Make winter warmer,
            <br />
            <em>one block at a time.</em>
          </h1>

          <p className="mx-auto mt-5 w-full max-w-xl text-center text-base leading-relaxed sm:text-lg lg:mx-0 lg:text-left">
            Discover local drives, gather your people, and turn a little time
            into a lot of comfort for the neighbors who need it most.
          </p>

          <div className="hero-actions mt-7 flex w-full flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">

            <button
              className="primary-button flex items-center justify-center gap-2"
              onClick={() => onNavigate("events")}
            >
              Explore upcoming events
              <ArrowRight />
            </button>

            <button
              className="secondary-button flex items-center justify-center gap-2"
              onClick={() => onNavigate("create")}
            >
              <HeartHandshake />
              Start an initiative
            </button>

          </div>

          <div className="trust-line mt-8 flex w-full flex-col items-center justify-center gap-3 text-center sm:flex-row lg:justify-start lg:text-left">

            <span className="avatar-stack shrink-0" aria-hidden="true">
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

        {/* RIGHT: HERO IMAGE */}
        <div className="hero-art relative mx-auto w-full max-w-[580px] min-w-0">

          <div className="art-glow" />

          <div className="art-card art-card-main w-full overflow-hidden">

            <Image
              src={HERO_IMAGE}
              alt="Volunteers helping each other in a snowy winter landscape"
              width={640}
              height={480}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 85vw, 520px"
              className="block h-auto w-full object-cover"
              priority
            />

            <div className="art-caption flex items-center gap-2">
              <span className="live-dot shrink-0" />
              <span className="min-w-0 flex-1">
                24 active drives nearby
              </span>
              <ArrowRight />
            </div>

          </div>

          {/* FLOATING NOTE 1 */}
          <div className="floating-note note-one">
            <Snowflake />

            <span>
              <strong>Winter relief</strong>
              <small>is where it begins</small>
            </span>
          </div>

          {/* FLOATING NOTE 2 */}
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
