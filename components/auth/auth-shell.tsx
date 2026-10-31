"use client";

import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

import { LogoLockup } from "@/components/brand/logo";

interface AuthShellProps {
  title: string;
  description: string;
  onBack: () => void;
  children: ReactNode;
}

export default function AuthShell({
  title,
  description,
  onBack,
  children,
}: AuthShellProps) {
  return (
    <main className="auth-main">
      <div className="auth-card">
        <div className="auth-card-top">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft /> Back home
          </button>

          <LogoLockup />
        </div>

        <h1>{title}</h1>
        <p>{description}</p>

        {children}
      </div>
    </main>
  );
}
