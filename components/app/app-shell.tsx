"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";

import DeleteEventModal from "@/components/events/delete-event-modal";
import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";

import { useApp } from "./app-provider";

export default function AppShell({ children }: { children: ReactNode }) {
  const {
    user,
    toast,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    signOut,
    navigate,
    handleCategory,
  } = useApp();

  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="app-shell">
      <SiteHeader
        user={user}
        mobileOpen={mobileOpen}
        onToggleMenu={() => setMobileOpen((value) => !value)}
        onNavigate={navigate}
        onSignOut={signOut}
      />

      {children}

      <SiteFooter onNavigate={navigate} onCategory={handleCategory} />

      {deleteTarget && (
        <DeleteEventModal
          event={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}

      {toast && (
        <div className="toast" role="status" key={toast.id}>
          <Check />
          {toast.text}
        </div>
      )}
    </div>
  );
}
