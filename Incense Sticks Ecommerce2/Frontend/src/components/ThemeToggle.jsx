import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = window.localStorage.getItem("aura-ember-theme");
      return savedTheme === "dark" ? "dark" : "light";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector("meta[name='theme-color']")?.setAttribute(
      "content",
      theme === "dark" ? "#0b1020" : "#fafaf9"
    );
    try {
      window.localStorage.setItem("aura-ember-theme", theme);
    } catch {
      // Keep the theme toggle usable if browser storage is unavailable.
    }
  }, [theme]);

  const isDark = theme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      className="grid h-10 w-10 place-items-center rounded-full border border-slate-300 bg-white text-orange-600 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-400 hover:bg-rose-50 focus-visible:outline-rose-500 dark:border-slate-700 dark:bg-slate-800 dark:text-orange-300 dark:hover:border-rose-700 dark:hover:bg-slate-700"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={isDark}
      title={`Switch to ${nextTheme} mode`}
    >
      {isDark ? (
        <SunIcon className="h-5 w-5 animate-theme-vibrate" aria-hidden="true" />
      ) : (
        <MoonIcon className="h-5 w-5 animate-theme-vibrate" aria-hidden="true" />
      )}
    </button>
  );
}
