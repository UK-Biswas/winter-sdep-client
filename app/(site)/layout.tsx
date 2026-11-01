import type { ReactNode } from "react";

import AppShell from "@/components/app/app-shell";
import { AppProvider } from "@/components/app/app-provider";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <AppShell>{children}</AppShell>
    </AppProvider>
  );
}
