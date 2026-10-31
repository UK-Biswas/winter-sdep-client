"use client";

import { LogIn, LogOut, Menu, X } from "lucide-react";

import { LogoLockup } from "@/components/brand/logo";
import { PageView, SessionUser } from "@/lib/types";

interface SiteHeaderProps {
  user: SessionUser | null;
  mobileOpen: boolean;
  onToggleMenu: () => void;
  onNavigate: (page: PageView) => void;
  onSignOut: () => void;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function SiteHeader({
  user,
  mobileOpen,
  onToggleMenu,
  onNavigate,
  onSignOut,
}: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <button
          className="brand"
          onClick={() => onNavigate("home")}
          aria-label="FrostTogether home"
        >
          <LogoLockup />
        </button>

        <nav
          className={mobileOpen ? "main-nav is-open" : "main-nav"}
          aria-label="Main navigation"
        >
          <button onClick={() => onNavigate("events")}>Upcoming events</button>
          <button onClick={() => onNavigate("create")}>Create event</button>

          {user && (
            <>
              <button onClick={() => onNavigate("manage")}>
                Manage my events
              </button>
              <button onClick={() => onNavigate("joined")}>
                Joined events
              </button>
            </>
          )}

          <div className="nav-mobile-actions">
            {user ? (
              <button onClick={onSignOut}>
                <LogOut /> Sign out
              </button>
            ) : (
              <button onClick={() => onNavigate("auth")}>
                <LogIn /> Sign in
              </button>
            )}
          </div>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <button
                className="profile-button"
                onClick={() => onNavigate("manage")}
                aria-label="Manage my events"
                title="Manage my events"
              >
                <span className="profile-avatar">
                  {user.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.photo} alt="" />
                  ) : (
                    initials(user.name)
                  )}
                </span>
                <span className="profile-name">{user.name.split(" ")[0]}</span>
              </button>

              <button
                className="icon-button sign-out"
                onClick={onSignOut}
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut />
              </button>
            </>
          ) : (
            <button
              className="login-button"
              onClick={() => onNavigate("auth")}
            >
              <LogIn />
              Sign in
            </button>
          )}

          <button
            className="menu-button"
            onClick={onToggleMenu}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
