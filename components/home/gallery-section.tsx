"use client";

import Image from "next/image";

import { GALLERY } from "@/lib/constants";

export default function GallerySection() {
  return (
    <section id="stories" className="section story-section">
      <div className="section-heading centered">
        <div className="eyebrow">Visual stories</div>

        <h2>
          Community in <em>action.</em>
        </h2>

        <p>
          Moments from volunteer drives, relief distributions, and green
          initiatives across Dhaka and beyond.
        </p>
      </div>

      <div className="story-grid">
        {GALLERY.map((image) => (
          <figure
            key={image.src}
            className={image.featured ? "story-large" : undefined}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={
                image.featured
                  ? "(max-width: 768px) 100vw, 58vw"
                  : "(max-width: 768px) 100vw, 30vw"
              }
            />
            <figcaption>{image.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
