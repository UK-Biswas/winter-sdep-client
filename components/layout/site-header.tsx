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

    //  <header className="site-header sticky top-0 z-50 w-full">
    //   <div className="relative mx-auto flex min-h-[72px] w-full max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

    //     {/* Logo */}
    //     <button
    //       className="brand shrink-0"
    //       onClick={() => navigate("home")}
    //       aria-label="FrostTogether home"
    //     >
    //       <LogoLockup />
    //     </button>

    //     {/* Desktop Navigation */}
    //     <nav
    //       className="hidden items-center gap-5 xl:gap-7 lg:flex"
    //       aria-label="Main navigation"
    //     >
    //       <button
    //         className="whitespace-nowrap"
    //         onClick={() => navigate("events")}
    //       >
    //         Upcoming events
    //       </button>

    //       <button
    //         className="whitespace-nowrap"
    //         onClick={() => navigate("create")}
    //       >
    //         Create event
    //       </button>

    //       {user && (
    //         <>
    //           <button
    //             className="whitespace-nowrap"
    //             onClick={() => navigate("manage")}
    //           >
    //             Manage my events
    //           </button>

    //           <button
    //             className="whitespace-nowrap"
    //             onClick={() => navigate("joined")}
    //           >
    //             Joined events
    //           </button>
    //         </>
    //       )}
    //     </nav>

    //     {/* Right Actions */}
    //     <div className="flex shrink-0 items-center gap-2 sm:gap-3">

    //       {user ? (
    //         <>
    //           {/* Profile */}
    //           <button
    //             className="profile-button flex items-center gap-2"
    //             onClick={() => navigate("manage")}
    //             aria-label="Manage my events"
    //             title="Manage my events"
    //           >
    //             <span className="profile-avatar grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full">
    //               {user.photo ? (
    //                 // eslint-disable-next-line @next/next/no-img-element
    //                 <img
    //                   src={user.photo}
    //                   alt=""
    //                   className="h-full w-full object-cover"
    //                 />
    //               ) : (
    //                 initials(user.name)
    //               )}
    //             </span>

    //             <span className="profile-name hidden whitespace-nowrap sm:inline">
    //               {user.name.split(" ")[0]}
    //             </span>
    //           </button>

    //           {/* Desktop Sign out */}
    //           <button
    //             className="icon-button sign-out hidden lg:grid"
    //             onClick={onSignOut}
    //             aria-label="Sign out"
    //             title="Sign out"
    //           >
    //             <LogOut size={18} />
    //           </button>
    //         </>
    //       ) : (
    //         <button
    //           className="login-button flex shrink-0 items-center justify-center gap-2"
    //           onClick={() => navigate("auth")}
    //         >
    //           <LogIn size={18} />
    //           <span>Sign in</span>
    //         </button>
    //       )}

    //       {/* Hamburger - Mobile and Tablet */}
    //       <button
    //         className="menu-button grid h-10 w-10 shrink-0 place-items-center rounded-full lg:hidden"
    //         onClick={onToggleMenu}
    //         aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
    //         aria-expanded={mobileOpen}
    //         aria-controls="mobile-navigation"
    //       >
    //         {mobileOpen ? <X size={21} /> : <Menu size={21} />}
    //       </button>
    //     </div>
    //   </div>

    //   {/* Mobile / Tablet Dropdown */}
    //   <div
    //     id="mobile-navigation"
    //     className={`absolute left-0 top-full w-full border-t border-black/5 bg-white shadow-xl transition-all duration-200 lg:hidden ${
    //       mobileOpen
    //         ? "visible translate-y-0 opacity-100"
    //         : "invisible -translate-y-2 opacity-0 pointer-events-none"
    //     }`}
    //   >
    //     <nav
    //       className="mx-auto flex max-w-[1200px] flex-col px-5 py-4 sm:px-8"
    //       aria-label="Mobile navigation"
    //     >
    //       <button
    //         className="border-b border-gray-100 py-3 text-left"
    //         onClick={() => navigate("events")}
    //       >
    //         Upcoming events
    //       </button>

    //       <button
    //         className="border-b border-gray-100 py-3 text-left"
    //         onClick={() => navigate("create")}
    //       >
    //         Create event
    //       </button>

    //       {user && (
    //         <>
    //           <button
    //             className="border-b border-gray-100 py-3 text-left"
    //             onClick={() => navigate("manage")}
    //           >
    //             Manage my events
    //           </button>

    //           <button
    //             className="border-b border-gray-100 py-3 text-left"
    //             onClick={() => navigate("joined")}
    //           >
    //             Joined events
    //           </button>

    //           <button
    //             className="flex items-center gap-2 py-3 text-left"
    //             onClick={onSignOut}
    //           >
    //             <LogOut size={18} />
    //             Sign out
    //           </button>
    //         </>
    //       )}
    //     </nav>
    //   </div>
    // </header>
  );
}
