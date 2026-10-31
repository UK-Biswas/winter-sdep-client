import { ArrowRight } from "lucide-react";

import { FEATURES } from "@/lib/constants";

export default function FeatureSection() {
  return (
    <section className="section features-section" id="features">
      <div className="section-heading centered">
        <div className="eyebrow">Built for good neighbors</div>

        <h2>
          Everything you need to <em>turn care into momentum.</em>
        </h2>

        <p>
          A focused toolkit for people who would rather organize a drive than
          scroll past one.
        </p>
      </div>

      <div className="feature-grid">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <article className="feature-card" key={title}>
            <div className="feature-icon">
              <Icon />
            </div>

            <h3>{title}</h3>
            <p>{text}</p>

            <ArrowRight className="feature-arrow" aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  );
}
