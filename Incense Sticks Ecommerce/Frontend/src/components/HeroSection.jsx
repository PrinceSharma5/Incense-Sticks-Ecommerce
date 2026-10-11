import { useNavigate } from "react-router";
import { ArrowDownIcon, ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import HeroCandles from "./HeroCandles";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="rr-hero" id="home-hero" data-voice-section="home introduction">
      <HeroCandles />
      <div className="rr-hero-nebula rr-hero-nebula-one" aria-hidden="true" />
      <div className="rr-hero-nebula rr-hero-nebula-two" aria-hidden="true" />
      <div className="rr-hero-nebula rr-hero-nebula-three" aria-hidden="true" />

      <div className="rr-hero-inner">
        <div className="rr-hero-copy">
          <p className="rr-hero-kicker"><SparklesIcon aria-hidden="true" /> A softer ritual for every day</p>
          <h1>
            Let your day
            <span>unwind with</span>
            <em>intention.</em>
          </h1>
          <p className="rr-hero-description">
            From the first light of morning to the last quiet hour, find thoughtfully made incense for moments that feel like yours.
          </p>

          <div className="rr-hero-actions">
            <button type="button" className="rr-button-primary" onClick={() => navigate("/fetch-products")}>
              Explore incense <ArrowRightIcon aria-hidden="true" />
            </button>
            <button type="button" className="rr-button-quiet" onClick={() => navigate("/cart")}>
              Visit your bag
            </button>
          </div>

          <div className="rr-hero-signature">
            <span className="rr-signature-line" />
            <p>Made with intention <span>·</span> Delivered across India</p>
          </div>
        </div>

        <div className="rr-hero-art" aria-label="Incense and a softly lit ritual space">
          <div className="rr-orbit rr-orbit-one" aria-hidden="true" />
          <div className="rr-orbit rr-orbit-two" aria-hidden="true" />
          <div className="rr-orbit-dot rr-orbit-dot-one" aria-hidden="true" />
          <div className="rr-orbit-dot rr-orbit-dot-two" aria-hidden="true" />
          <div className="rr-hero-image-frame">
            <img
              src="/incense-ritual.jpg"
              alt="Incense sticks smoldering in a lotus-shaped holder, with smoke curling above"
              fetchPriority="high"
            />
            <div className="rr-image-shade" />
            <div className="rr-image-caption">
              <span className="rr-image-caption-mark"><SparklesIcon aria-hidden="true" /></span>
              <span><small>THE EVERYDAY RITUAL</small><strong>Light a little calm.</strong></span>
            </div>
          </div>
          <div className="rr-floating-note rr-floating-note-top">
            <span className="rr-note-spark">✿</span>
            <span><small>A SLOWER MOMENT</small><strong>Find your pause</strong></span>
          </div>
          <div className="rr-floating-note rr-floating-note-bottom">
            <span className="rr-note-number">01</span>
            <span><small>MADE FOR EVERY DAY</small><strong>Small rituals, softly done</strong></span>
          </div>
          <div className="rr-hero-art-caption"><span>BOTANICAL BLENDS</span><span>·</span><span>EVERYDAY CALM</span></div>
        </div>
      </div>

      <div className="rr-hero-bottom">
        <span>AURA &amp; EMBER · DAILY INCENSE</span>
        <button type="button" onClick={() => navigate("/fetch-products")} aria-label="Browse the incense collection">
          <ArrowDownIcon aria-hidden="true" />
        </button>
        <span>01 / MAKE SPACE FOR YOU</span>
      </div>
    </section>
  );
};

export default HeroSection;
