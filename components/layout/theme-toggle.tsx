"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "frosttogether-theme";

/**
 * The inline script in the root layout applies the saved theme before paint.
 * This effect only keeps the page in sync when the OS preference changes and
 * the visitor has not picked a theme explicitly.
 */
export default function ThemeToggle() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const onChange = (event: MediaQueryListEvent) => {
      if (window.localStorage.getItem(STORAGE_KEY)) return;

      document.documentElement.dataset.theme = event.matches
        ? "dark"
        : "light";
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function toggleTheme() {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = next;

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing can block storage; the theme still applies for the
      // current page.
    }
  }

  return (
    <button
      type="button"
      className="icon-button theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle light and dark mode"
      title="Toggle light and dark mode"
    >
      <Sun className="theme-icon-sun" />
      <Moon className="theme-icon-moon" />
    </button>
  );
}
