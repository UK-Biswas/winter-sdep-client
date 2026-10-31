import Image from "next/image";

export default function GallerySection() {
  return (
    <section id="stories" className="section story-section">
      <div className="section-heading centered">
        <div className="eyebrow">Visual stories</div>

        <h2>
          Good things look like <em>this.</em>
        </h2>

        <p>
          Moments from volunteers making the colder months feel
          a little more human.
        </p>
      </div>

      <div className="story-grid">
        <div className="story-large">
          <Image
            src="https://images.unsplash.com/photo-1609139003551-ee40f5f73ec0?auto=format&fit=crop&w=1200&q=90"
            alt="Volunteers packing winter supplies"
          />
          <span>Warmth for every doorstep</span>
        </div>

        <div>
          <Image
            src="https://images.unsplash.com/photo-1609139003551-ee40f5f73ec0?auto=format&fit=crop&w=800&q=90"
            alt="Hands sharing a warm meal"
          />
          <span>Share a little more</span>
        </div>

        <div>
          <Image
            src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=90"
            alt="Young tree planted by volunteers"
          />
          <span>Grow something lasting</span>
        </div>
      </div>
    </section>
  );
}