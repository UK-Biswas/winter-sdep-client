import {
  ArrowRight,
  Compass,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: HeartHandshake,
    title: "Warmth, made local",
    text: "Turn a simple idea into a coordinated winter drive with people who care about the same streets.",
  },
  {
    icon: Compass,
    title: "Find your next cause",
    text: "Browse trusted initiatives by date, location, or the kind of impact you want to make.",
  },
  {
    icon: ShieldCheck,
    title: "Good work, clearly",
    text: "Every event keeps its own story, organizer, and volunteer trail in one transparent place.",
  },
  {
    icon: Sparkles,
    title: "Small actions, lasting change",
    text: "Build a habit of helping with meaningful opportunities that fit your time and your neighborhood.",
  },
];

export default function FeatureSection() {
  return (
    <section className="section features-section">
      <div className="section-heading centered">
        <div className="eyebrow">Built for good neighbors</div>

        <h2>
          Turn care into <em>momentum.</em>
        </h2>

        <p>
          Everything you need to create, discover, and join meaningful
          winter action in your community.
        </p>
      </div>

      <div className="feature-grid">
        {features.map(({ icon: Icon, title, text }) => (
          <article className="feature-card" key={title}>
            <div className="feature-icon">
              <Icon />
            </div>

            <h3>{title}</h3>
            <p>{text}</p>
            <ArrowRight />
          </article>
        ))}
      </div>
    </section>
  );
}