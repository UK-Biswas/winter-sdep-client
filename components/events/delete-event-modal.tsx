"use client";

import { useEffect } from "react";
import { Trash2, X } from "lucide-react";

import { Event } from "@/lib/types";

interface DeleteEventModalProps {
  event: Event;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteEventModal({
  event,
  onCancel,
  onConfirm,
}: DeleteEventModalProps) {
  useEffect(() => {
    function onKeyDown(keyEvent: KeyboardEvent) {
      if (keyEvent.key === "Escape") {
        onCancel();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onCancel]);

  return (
    <div
      className="modal-backdrop"
      onClick={(clickEvent) => {
        if (clickEvent.target === clickEvent.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
      >
        <button
          className="icon-button modal-close"
          onClick={onCancel}
          aria-label="Close dialog"
        >
          <X />
        </button>

        <span className="modal-icon">
          <Trash2 />
        </span>

        <h2 id="delete-title">Delete event?</h2>

        <p id="delete-description">
          <strong>{event.title}</strong> will be removed from the board. This
          action cannot be undone and will also remove all volunteer
          registrations.
        </p>

        <div className="modal-actions">
          <button className="secondary-button" onClick={onCancel}>
            Keep event
          </button>

          <button className="danger-button" onClick={onConfirm}>
            <Trash2 />
            Delete event
          </button>
        </div>
      </div>
    </div>
  );
}
