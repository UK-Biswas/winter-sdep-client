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


  const handleNavigate = (page: PageView) => {
    onNavigate(page);

    if (mobileOpen) {
      onToggleMenu();
    }
  };
  return (

    <header className="site-header sticky top-0 z-50 w-full">
      <div className="nav-wrap mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <button
          className="brand shrink-0"
          onClick={() => handleNavigate("home")}
          aria-label="FrostTogether home"
        >
          <LogoLockup />
        </button>

       
        <nav
          className="hidden items-center gap-5 lg:flex xl:gap-7"
          aria-label="Main navigation"
        >
          <button
            className="whitespace-nowrap text-sm font-medium transition-opacity hover:opacity-70"
            onClick={() => handleNavigate("events")}
          >
            Upcoming events
          </button>

          <button
            className="whitespace-nowrap text-sm font-medium transition-opacity hover:opacity-70"
            onClick={() => handleNavigate("create")}
          >
            Create event
          </button>

          {user && (
            <>
              <button
                className="whitespace-nowrap text-sm font-medium transition-opacity hover:opacity-70"
                onClick={() => handleNavigate("manage")}
              >
                Manage my events
              </button>

              <button
                className="whitespace-nowrap text-sm font-medium transition-opacity hover:opacity-70"
                onClick={() => handleNavigate("joined")}
              >
                Joined events
              </button>
            </>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          {user ? (
            <>
              <button
                className="profile-button flex items-center gap-2"
                onClick={() => handleNavigate("manage")}
                aria-label="Manage my events"
                title="Manage my events"
              >
                <span className="profile-avatar flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full">
                  {user.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.photo}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials(user.name)
                  )}
                </span>

                <span className="profile-name max-w-28 truncate text-sm font-medium">
                  {user.name.split(" ")[0]}
                </span>
              </button>

              <button
                className="icon-button sign-out flex h-9 w-9 items-center justify-center"
                onClick={onSignOut}
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <button
              className="login-button flex items-center justify-center gap-2 whitespace-nowrap"
              onClick={() => handleNavigate("auth")}
            >
              <LogIn size={18} />
              Sign in
            </button>
          )}
        </div>

        {/* Mobile / Tablet Menu Button */}
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          {user && (
            <button
              className="profile-button flex items-center"
              onClick={() => handleNavigate("manage")}
              aria-label="Manage my events"
              title="Manage my events"
            >
              <span className="profile-avatar flex h-9 w-9 items-center justify-center overflow-hidden rounded-full">
                {user.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photo}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials(user.name)
                )}
              </span>
            </button>
          )}

          <button
            className="menu-button flex h-10 w-10 items-center justify-center rounded-lg"
            onClick={onToggleMenu}
            aria-label={
              mobileOpen ? "Close navigation" : "Open navigation"
            }
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Dropdown */}
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${mobileOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
          }`}
      >
        <div className="min-h-0">
          <nav
            className="flex flex-col gap-1 border-t border-gray-200/20 px-4 py-3 sm:px-6"
            aria-label="Mobile navigation"
          >
            <button
              className="w-full rounded-lg px-3 py-3 text-left text-sm font-medium transition-colors hover:bg-black/5"
              onClick={() => handleNavigate("events")}
            >
              Upcoming events
            </button>

            <button
              className="w-full rounded-lg px-3 py-3 text-left text-sm font-medium transition-colors hover:bg-black/5"
              onClick={() => handleNavigate("create")}
            >
              Create event
            </button>

            {user && (
              <>
                <button
                  className="w-full rounded-lg px-3 py-3 text-left text-sm font-medium transition-colors hover:bg-black/5"
                  onClick={() => handleNavigate("manage")}
                >
                  Manage my events
                </button>

                <button
                  className="w-full rounded-lg px-3 py-3 text-left text-sm font-medium transition-colors hover:bg-black/5"
                  onClick={() => handleNavigate("joined")}
                >
                  Joined events
                </button>
              </>
            )}

            <div className="my-2 border-t border-gray-200/20" />

            {user ? (
              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-medium transition-colors hover:bg-black/5"
                onClick={() => {
                  onSignOut();
                  if (mobileOpen) onToggleMenu();
                }}
              >
                <LogOut size={18} />
                Sign out
              </button>
            ) : (
              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-medium transition-colors hover:bg-black/5"
                onClick={() => handleNavigate("auth")}
              >
                <LogIn size={18} />
                Sign in
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>

  );
}
