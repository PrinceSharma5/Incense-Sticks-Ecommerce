import { useEffect, useRef } from "react";

const createStars = (count) =>
  Array.from({ length: count }, (_, index) => {
    const random = (seed) => {
      const value = Math.sin(seed * 127.1 + index * 311.7) * 43758.5453;
      return value - Math.floor(value);
    };

    return {
      radius: Math.sqrt(random(1)) * 0.86,
      angle: random(2) * Math.PI * 2,
      arm: index % 4,
      size: 0.45 + random(3) * 1.35,
      depth: 0.25 + random(4) * 0.75,
      phase: random(5) * Math.PI * 2,
      color: random(6) > 0.74 ? "#f4c47b" : "#d9e3ff",
    };
  });

export default function GalaxyCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const surface = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !surface || !context) return undefined;

    const stars = createStars(390);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;

    const resize = () => {
      const bounds = surface.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const onPointerMove = (event) => {
      const bounds = surface.getBoundingClientRect();
      targetX = (event.clientX - bounds.left) / bounds.width - 0.5;
      targetY = (event.clientY - bounds.top) / bounds.height - 0.5;
    };
    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const draw = (time = 0) => {
      pointerX += (targetX - pointerX) * 0.035;
      pointerY += (targetY - pointerY) * 0.035;
      context.clearRect(0, 0, width, height);

      const centerX = width * 0.64 + pointerX * 30;
      const centerY = height * 0.48 + pointerY * 20;
      const elapsed = reducedMotion ? 0 : time * 0.000018;

      stars.forEach((star) => {
        const spiral = star.radius * 3.4;
        const angle = star.angle + star.arm * (Math.PI / 2) + spiral + elapsed * (0.55 + star.depth);
        const orbit = star.radius * (0.7 + star.depth * 0.3);
        const x = centerX + Math.cos(angle) * width * orbit * 0.48 + pointerX * star.depth * 18;
        const y = centerY + Math.sin(angle) * height * orbit * 0.7 + pointerY * star.depth * 12;
        if (x < -3 || y < -3 || x > width + 3 || y > height + 3) return;

        const twinkle = reducedMotion ? 0.8 : 0.6 + Math.sin(time * 0.0012 + star.phase) * 0.28;
        context.globalAlpha = twinkle * (0.5 + star.depth * 0.5);
        context.fillStyle = star.color;
        context.beginPath();
        context.arc(x, y, star.size, 0, Math.PI * 2);
        context.fill();
      });

      context.globalAlpha = 1;
      if (!reducedMotion) animationFrame = window.requestAnimationFrame(draw);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(animationFrame);
      } else if (!reducedMotion) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    resize();
    draw();
    if (!reducedMotion) animationFrame = window.requestAnimationFrame(draw);
    const observer = new ResizeObserver(() => {
      resize();
      if (reducedMotion) draw();
    });
    observer.observe(surface);
    surface.addEventListener("pointermove", onPointerMove, { passive: true });
    surface.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      surface.removeEventListener("pointermove", onPointerMove);
      surface.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-80" aria-hidden="true" />;
}
