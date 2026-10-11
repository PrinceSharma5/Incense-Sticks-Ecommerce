import { useEffect, useRef } from "react";

const candles = [
  { left: 4, top: 59, scale: 0.82, tilt: -8, opacity: 0.72, depth: 0.9, tone: "clay", delay: -1.5 },
  { left: 34, top: 8, scale: 0.65, tilt: 7, opacity: 0.62, depth: 0.42, tone: "cream", delay: -4 },
  { left: 58, top: 4, scale: 0.53, tilt: -5, opacity: 0.45, depth: 0.28, tone: "sage", delay: -2 },
  { left: 91, top: 31, scale: 0.78, tilt: 8, opacity: 0.72, depth: 0.78, tone: "sage", delay: -5 },
  { left: 79, top: 78, scale: 0.72, tilt: -7, opacity: 0.65, depth: 0.58, tone: "clay", delay: -3 },
  { left: 15, top: 86, scale: 0.56, tilt: 5, opacity: 0.52, depth: 0.34, tone: "cream", delay: -6 },
];

export default function HeroCandles() {
  const fieldRef = useRef(null);

  useEffect(() => {
    const field = fieldRef.current;
    const surface = field?.parentElement;
    if (!field || !surface) return undefined;

    const candles = Array.from(field.querySelectorAll("[data-candle-depth]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let animationFrame = 0;

    const applyParallax = () => {
      candles.forEach((candle) => {
        const depth = Number(candle.dataset.candleDepth) || 0;
        candle.style.setProperty("--pointer-x", `${(pointerX * depth * 34).toFixed(2)}px`);
        candle.style.setProperty("--pointer-y", `${(pointerY * depth * 22).toFixed(2)}px`);
        candle.style.setProperty("--pointer-turn", `${(pointerX * depth * 5).toFixed(2)}deg`);
      });
    };

    const settle = () => {
      pointerX += (targetX - pointerX) * 0.075;
      pointerY += (targetY - pointerY) * 0.075;
      applyParallax();

      if (Math.abs(targetX - pointerX) + Math.abs(targetY - pointerY) > 0.002) {
        animationFrame = window.requestAnimationFrame(settle);
      } else {
        animationFrame = 0;
      }
    };

    const onPointerMove = (event) => {
      const bounds = surface.getBoundingClientRect();
      targetX = (event.clientX - bounds.left) / bounds.width - 0.5;
      targetY = (event.clientY - bounds.top) / bounds.height - 0.5;

      if (reducedMotion) {
        pointerX = targetX;
        pointerY = targetY;
        applyParallax();
      } else if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(settle);
      }
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
      if (reducedMotion) {
        pointerX = 0;
        pointerY = 0;
        applyParallax();
      } else if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(settle);
      }
    };

    surface.addEventListener("pointermove", onPointerMove, { passive: true });
    surface.addEventListener("pointerleave", onPointerLeave, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      surface.removeEventListener("pointermove", onPointerMove);
      surface.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div ref={fieldRef} className="ae-candle-field" aria-hidden="true">
      {candles.map((candle, index) => (
        <span
          key={index}
          className={`ae-candle ae-candle--${candle.tone}`}
          data-candle-depth={candle.depth}
          style={{
            "--candle-left": `${candle.left}%`,
            "--candle-top": `${candle.top}%`,
            "--candle-scale": candle.scale,
            "--candle-tilt": `${candle.tilt}deg`,
            "--candle-opacity": candle.opacity,
            "--candle-delay": `${candle.delay}s`,
          }}
        >
          <span className="ae-candle-glow" />
          <span className="ae-candle-flame"><span /></span>
          <span className="ae-candle-wick" />
          <span className="ae-candle-body">
            <span className="ae-candle-drip ae-candle-drip--one" />
            <span className="ae-candle-drip ae-candle-drip--two" />
            <span className="ae-candle-stamp">A</span>
          </span>
          <span className="ae-candle-holder" />
        </span>
      ))}
    </div>
  );
}
