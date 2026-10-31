"use client";

import { Snowflake } from "lucide-react";
import { ReactNode } from "react";

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
        <button className="back-button" onClick={onBack}>
          ← Back home
        </button>

        <span className="auth-mark">
          <Snowflake />
        </span>

        <h1>{title}</h1>
        <p>{description}</p>

        {children}
      </div>
    </main>
  );
}