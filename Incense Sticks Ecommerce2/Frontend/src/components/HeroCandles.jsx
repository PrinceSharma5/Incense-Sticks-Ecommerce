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
    <div ref={fieldRef} className="pointer-events-none absolute inset-0 -z-0 overflow-hidden" aria-hidden="true">
      {candles.map((candle, index) => (
        <span
          key={index}
          className="absolute left-[var(--candle-left)] top-[var(--candle-top)] h-28 w-12 origin-[50%_88%] opacity-[var(--candle-opacity)] [transform:translate3d(var(--pointer-x,0px),var(--pointer-y,0px),0)_rotate(calc(var(--candle-tilt,0deg)+var(--pointer-turn,0deg)))_scale(var(--candle-scale,1))] animate-candle-float [will-change:transform]"
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
          <span className="absolute left-1/2 top-0 h-[34px] w-[34px] -translate-x-1/2 rounded-full bg-amber-300/20 animate-glow-pulse" />
          <span className="absolute left-1/2 top-2 z-[2] h-[23px] w-[13px] origin-bottom rounded-[70%_30%_58%_42%/67%_37%_63%_33%] bg-amber-400 shadow-[0_0_13px_4px_rgba(255,177,54,.35)] animate-flame-flicker">
            <span className="absolute bottom-0.5 right-[3px] h-2.5 w-1 rounded-full bg-amber-50/90 blur-[.5px]" />
          </span>
          <span className="absolute left-1/2 top-[27px] z-[2] h-2 w-0.5 -translate-x-1/2 rounded-sm bg-stone-700" />
          <span className={`absolute bottom-3 left-1/2 block h-[72px] w-[34px] -translate-x-1/2 overflow-hidden rounded-t-lg rounded-b-md border shadow-[0_9px_17px_rgba(76,67,47,.15),inset_0_2px_4px_rgba(255,255,255,.7)] ${candle.tone === "clay" ? "border-rose-900/20 bg-rose-400" : candle.tone === "sage" ? "border-orange-900/20 bg-orange-500" : "border-slate-300 bg-slate-100"}`}>
            <span className="absolute left-0.5 top-[-2px] h-2 w-[calc(100%_-_4px)] rounded-full bg-amber-50/80" />
            <span className="absolute left-[5px] top-0 h-[13px] w-[7px] rounded-b-md bg-amber-50/55" />
            <span className="absolute right-1.5 top-0 h-5 w-[7px] rounded-b-md bg-amber-50/55" />
            <span className="absolute inset-x-0 bottom-2 font-serif text-center text-[10px] italic text-stone-800/40">A</span>
          </span>
          <span className="absolute bottom-[3px] left-1/2 h-[9px] w-12 -translate-x-1/2 rounded-[50%] border border-rose-950/25 bg-rose-600 shadow-md shadow-stone-900/10" />
        </span>
      ))}
    </div>
  );
}
