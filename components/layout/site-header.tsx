"use client";

import {
  ChevronDown,
  LogIn,
  Menu,
  Moon,
  Waves,
  Sun,
  X,
} from "lucide-react";

interface SiteHeaderProps {
  dark: boolean;
  mobileOpen: boolean;
  setDark: (value: boolean) => void;
  setMobileOpen: (value: boolean) => void;
  onNavigate: (page: string) => void;
}

export default function SiteHeader({
  dark,
  mobileOpen,
  setDark,
  setMobileOpen,
  onNavigate,
}: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <button
          className="brand"
          onClick={() => onNavigate("home")}
          aria-label="FrostTogether home"
        >
          <span className="brand-mark">
            <Waves />
          </span>

          <span>
            <strong>FrostTogether</strong>
            <small>WINTER COMMUNITY</small>
          </span>
        </button>

        <nav
          className={mobileOpen ? "main-nav is-open" : "main-nav"}
          aria-label="Main navigation"
        >
          <button onClick={() => onNavigate("home")}>
            Home
          </button>

          <button onClick={() => onNavigate("events")}>
            Upcoming events
          </button>

          <button
            onClick={() =>
              document
                .getElementById("stories")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Impact stories
          </button>
        </nav>

        <div className="nav-actions">
          <button
            className="icon-button"
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
          >
            {dark ? <Sun /> : <Moon />}
          </button>

          <button
            className="profile-button"
            onClick={() => onNavigate("manage")}
            aria-label="Open profile"
          >
            <span className="profile-avatar">TA</span>
            <ChevronDown />
          </button>

          <button
            className="login-button"
            onClick={() => onNavigate("auth")}
          >
            <LogIn />
            Sign in
          </button>

          <button
            className="menu-button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}