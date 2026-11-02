"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  CircleUserRound,
  HeartHandshake,
  TriangleAlert,
} from "lucide-react";

import { EVENT_TYPES } from "@/lib/constants";
import { todayISO } from "@/lib/events";
import { Event, EventDraft, SessionUser } from "@/lib/types";

interface CreateEventFormProps {
  mode: "create" | "edit";
  initialEvent?: Event | null;
  organizer: SessionUser;
  onBack: () => void;
  onSubmit: (draft: EventDraft) => Promise<boolean> | boolean | void;
}

type FieldErrors = Partial<Record<"title" | "date" | "location" | "image" | "description", string>>;

function isImageUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function CreateEventForm({
  mode,
  initialEvent,
  organizer,
  onBack,
  onSubmit,
}: CreateEventFormProps) {
  const [title, setTitle] = useState(initialEvent?.title ?? "");
  const [type, setType] = useState(initialEvent?.type ?? EVENT_TYPES[0]);
  const [date, setDate] = useState(initialEvent?.date ?? "");
  const [location, setLocation] = useState(initialEvent?.location ?? "");
  const [image, setImage] = useState(initialEvent?.image ?? "");
  const [description, setDescription] = useState(
    initialEvent?.description ?? ""
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const minDate = todayISO();

  function validate(): FieldErrors {
    const next: FieldErrors = {};

    if (title.trim().length < 5) {
      next.title = "Give the drive a name of at least 5 characters.";
    }

    if (!date) {
      next.date = "Pick a date for the drive.";
    } else if (date < minDate) {
      next.date = `Value must be ${minDate} or later.`;
    }

    if (location.trim().length < 3) {
      next.location = "Tell volunteers where to meet.";
    }

    if (!image.trim()) {
      next.image = "Add a thumbnail image URL.";
    } else if (!isImageUrl(image.trim())) {
      next.image = "Enter a valid http(s) image URL.";
    }

    if (description.trim().length < 20) {
      next.description = "Add at least 20 characters so people know the plan.";
    }

    return next;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const saved = await onSubmit({
        title: title.trim(),
        type,
        date,
        location: location.trim(),
        image: image.trim(),
        description: description.trim(),
      });

      if (saved === false) return;

      if (mode === "create") {
        setTitle("");
        setDate("");
        setLocation("");
        setImage("");
        setDescription("");
        setType(EVENT_TYPES[0]);
      }
    } catch {
      // The provider surfaces the API error through a toast; keep the values.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="form-main">
      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <button type="button" className="back-button" onClick={onBack}>
          ← Back to {mode === "edit" ? "my events" : "upcoming events"}
        </button>

        <div className="eyebrow">
          <HeartHandshake />
          {mode === "edit" ? "Update the plan" : "Social service drive"}
        </div>

        <h1>
          {mode === "edit"
            ? "Update event"
            : "Create a community event"}
        </h1>

        <p>
          {mode === "edit"
            ? "Adjust the details and save. Everyone registered will see the updated plan."
            : "Organize a local relief effort, environmental cleanup, or community support drive."}
        </p>

        <div className="form-grid">
          <label className="span-2">
            Event title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Winter clothes distribution"
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && (
              <span className="form-error" role="alert">
                <TriangleAlert /> {errors.title}
              </span>
            )}
          </label>

          <div className="span-2 field">
            <span className="field-label">Event type</span>

            <div className="type-pills">
              {EVENT_TYPES.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={option === type ? "type-pill active" : "type-pill"}
                  onClick={() => setType(option)}
                  aria-pressed={option === type}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <label>
            Event date
            <input
              value={date}
              type="date"
              min={minDate}
              onChange={(event) => setDate(event.target.value)}
              aria-invalid={Boolean(errors.date)}
            />
            {errors.date && (
              <span className="form-error" role="alert">
                <TriangleAlert /> {errors.date}
              </span>
            )}
          </label>

          <label>
            Location / venue
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Mirpur 10, Dhaka"
              aria-invalid={Boolean(errors.location)}
            />
            {errors.location && (
              <span className="form-error" role="alert">
                <TriangleAlert /> {errors.location}
              </span>
            )}
          </label>

          <div className="span-2 field">
            <span className="field-label">Thumbnail image URL</span>
            <input
              value={image}
              onChange={(event) => setImage(event.target.value)}
              type="url"
              placeholder="https://example.com/image.jpg"
              aria-invalid={Boolean(errors.image)}
            />
            {errors.image && (
              <span className="form-error" role="alert">
                <TriangleAlert /> {errors.image}
              </span>
            )}

            {image && isImageUrl(image) && (
              <div className="image-preview">
                <Image
                  src={image}
                  alt="Event thumbnail preview"
                  fill
                  sizes="(max-width: 760px) 100vw, 720px"
                />
              </div>
            )}

          </div>

          <label className="span-2">
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Explain the purpose of the drive, who it helps, what volunteers will do, and what to bring."
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description && (
              <span className="form-error" role="alert">
                <TriangleAlert /> {errors.description}
              </span>
            )}
          </label>
        </div>

        <div className="organizer-note">
          <CircleUserRound />

          <span>
            Organizer <strong>{organizer.name}</strong> (
            {organizer.email}) will be attached automatically. You can edit or
            delete this drive from Manage my events at any time.
          </span>
        </div>

        <button
          className="primary-button full"
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? mode === "edit"
              ? "Updating…"
              : "Publishing…"
            : mode === "edit"
              ? "Update event"
              : "Publish event"}{" "}
          <ArrowRight />
        </button>
      </form>
    </main>
  );
}
