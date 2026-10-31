"use client";

import { Event, PageView } from "@/lib/types";

import FeatureSection from "./feature-section";
import FeaturedEvents from "./featured-events";
import GallerySection from "./gallery-section";
import HeroSection from "./hero-section";

interface HomePageProps {
  events: Event[];
  onNavigate: (page: PageView) => void;
  onSelectEvent: (event: Event) => void;
}

export default function HomePage({
  events,
  onNavigate,
  onSelectEvent,
}: HomePageProps) {
  return (
    <main>
      <HeroSection onNavigate={onNavigate} />

      <FeatureSection />

      <FeaturedEvents
        events={events}
        onSelect={onSelectEvent}
        onViewAll={() => onNavigate("events")}
      />

      <GallerySection />
    </main>
  );
}
