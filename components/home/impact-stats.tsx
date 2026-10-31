import { IMPACT_STATS } from "@/lib/constants";

export default function ImpactStats() {
  return (
    <div className="hero-stats" aria-label="Community impact">
      {IMPACT_STATS.map((stat) => (
        <div key={stat.label}>
          <strong>
            {stat.value.toLocaleString("en-US")}
            <span>{stat.suffix}</span>
          </strong>
          <small>{stat.label}</small>
        </div>
      ))}
    </div>
  );
}
