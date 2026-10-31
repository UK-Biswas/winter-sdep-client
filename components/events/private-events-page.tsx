"use client";

import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface PrivateEventsPageProps {
  title: string;
  label: string;
  description: string;
  actionLabel?: string;
  onCreate?: () => void;
  children: ReactNode;
}

export default function PrivateEventsPage({
  title,
  label,
  description,
  actionLabel = "Create event",
  onCreate,
  children,
}: PrivateEventsPageProps) {
  return (
    <main className="page-main">
      <div className="page-title-row">
        <div>
          <div className="eyebrow">{label}</div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        {onCreate && (
          <button className="primary-button" onClick={onCreate}>
            {actionLabel} <ArrowRight />
          </button>
        )}
      </div>

      {children}
    </main>
  );
}
