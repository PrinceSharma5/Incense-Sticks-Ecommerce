import { useEffect, useRef, useState } from "react";

export default function ClockBuddy() {
  const [timeMessage, setTimeMessage] = useState("");
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem("aura-ember-theme") === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });
  const dismissTimerRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector("meta[name='theme-color']")?.setAttribute(
      "content",
      theme === "dark" ? "#020617" : "#fafaf9"
    );
    try {
      window.localStorage.setItem("aura-ember-theme", theme);
    } catch {
      // Keep the in-memory theme toggle usable when storage is unavailable.
    }
  }, [theme]);

  useEffect(() => () => {
    if (dismissTimerRef.current) window.clearTimeout(dismissTimerRef.current);
  }, []);

  const showLocalTime = () => {
    if (dismissTimerRef.current) window.clearTimeout(dismissTimerRef.current);

    const formattedTime = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(new Date());
    setTimeMessage(formattedTime);
    dismissTimerRef.current = window.setTimeout(() => setTimeMessage(""), 4500);
  };

  const isDark = theme === "dark";
  const toggleTheme = () => {
    showLocalTime();
    setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <div className="rr-clock-buddy">
      <button
        type="button"
        className="rr-clock-buddy-button"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme and show local date and time`}
        aria-pressed={isDark}
        title={`Switch to ${isDark ? "light" : "dark"} theme; show local date and time`}
      >
        <svg viewBox="0 0 48 48" aria-hidden="true" shapeRendering="geometricPrecision">
          <circle className="rr-clock-face" cx="24" cy="24" r="20" />
          <circle className="rr-clock-face-inner" cx="24" cy="24" r="16.2" />
          <path className="rr-clock-ticks" d="M24 5.4v1.5M41.5 24h-3.2M24 41.5v-3.2M6.5 24h3.2" />
          <circle className="rr-clock-dial" cx="24" cy="14" r="6.6" />
          <path className="rr-clock-hand" d="M24 14V10.2M24 14l3.3 1.9" />
          <circle className="rr-clock-pin" cx="24" cy="14" r=".9" />
          <g className="rr-clock-eyes">
            <path className="rr-clock-eye" d="M14.9 27.2c0-1.8.9-2.9 2.1-2.9s2.1 1.1 2.1 2.9-.9 2.9-2.1 2.9-2.1-1.1-2.1-2.9Z" />
            <path className="rr-clock-eye" d="M28.9 27.2c0-1.8.9-2.9 2.1-2.9s2.1 1.1 2.1 2.9-.9 2.9-2.1 2.9-2.1-1.1-2.1-2.9Z" />
            <path className="rr-clock-eye-shine" d="M16.3 25.6h.4M30.3 25.6h.4" />
          </g>
          <path className="rr-clock-smile" d="M16.7 33.1c2.1 3.2 4.6 4.7 7.3 4.7s5.2-1.5 7.3-4.7" />
          <path className="rr-clock-smile-sketch" d="M17.6 34.3c2.1 2.4 4.2 3.5 6.4 3.5s4.3-1.1 6.4-3.5" />
        </svg>
        <span
          className={`rr-clock-theme-indicator ${isDark ? "is-light-target" : "is-dark-target"}`}
          aria-hidden="true"
        >
          {isDark ? (
            <svg viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="2.6" />
              <path d="M8 1.2v1.6M8 13.2v1.6M1.2 8h1.6M13.2 8h1.6M3.2 3.2l1.1 1.1m7.4 7.4 1.1 1.1m0-9.6-1.1 1.1m-7.4 7.4-1.1 1.1" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16">
                <path d="M13.5 10.2A6.3 6.3 0 0 1 5.8 2.5a6.4 6.4 0 1 0 7.7 7.7Z" />
            </svg>
          )}
        </span>
      </button>
      {timeMessage && (
        <span className="rr-clock-buddy-time" role="status" aria-live="polite">
          {timeMessage}
        </span>
      )}
    </div>
  );
}
