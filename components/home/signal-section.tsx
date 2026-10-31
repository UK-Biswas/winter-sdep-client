import { Waves } from "lucide-react";

export default function SignalSection() {
  return (
    <section className="signal-section">
      <div className="signal-inner">
        <div>
          <div className="eyebrow">
            <Waves />
            The neighborhood signal
          </div>

          <h2>Kindness is already moving.</h2>

          <p>
            From a shared blanket to a cleaner lake, every local
            action creates a visible ripple. Follow the signal,
            then add your own.
          </p>
        </div>

        <div className="signal-orbit">
          <span className="orbit-core">24</span>
          <span className="orbit-label orbit-label-one">drives</span>
          <span className="orbit-label orbit-label-two">areas</span>
          <span className="orbit-label orbit-label-three">causes</span>
        </div>

        <div className="signal-list">
          <div>
            <strong>01</strong>
            <span>Choose a nearby need</span>
          </div>

          <div>
            <strong>02</strong>
            <span>Show up with your people</span>
          </div>

          <div>
            <strong>03</strong>
            <span>Leave the place warmer</span>
          </div>
        </div>
      </div>
    </section>
  );
}