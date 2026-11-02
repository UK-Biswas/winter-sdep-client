"use client";

import { useState } from "react";
import { ArrowRight, TriangleAlert, UserRound } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { SessionUser } from "@/lib/types";

interface ProfileFormProps {
  user: SessionUser;
  onBack: () => void;
  onSaved: () => Promise<void>;
}

type FieldErrors = Partial<Record<"name" | "image" | "form", string>>;

function isImageUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function ProfileForm({
  user,
  onBack,
  onSaved,
}: ProfileFormProps) {
  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(user.photo ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  function validate(): FieldErrors {
    const next: FieldErrors = {};

    if (name.trim().length < 2) {
      next.name = "Enter the name volunteers should see.";
    }

    if (image.trim() && !isImageUrl(image.trim())) {
      next.image = "Enter a valid http(s) image URL.";
    }

    return next;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
      });

      if (error) {
        setErrors({
          form: error.message || "Could not update your profile.",
        });
        return;
      }

      await onSaved();
    } catch {
      setErrors({ form: "Could not update your profile. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="form-main">
      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <button type="button" className="back-button" onClick={onBack}>
          ← Back to my events
        </button>

        <div className="eyebrow">
          <UserRound />
          Your account
        </div>

        <h1>Edit profile</h1>

        <p>
          Update the name and photo volunteers see when you organize a drive.
          Your email stays the same.
        </p>

        <div className="form-grid">
          <label className="span-2">
            Display name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && (
              <span className="form-error" role="alert">
                <TriangleAlert /> {errors.name}
              </span>
            )}
          </label>

          <label className="span-2">
            Profile image URL
            <input
              value={image}
              type="url"
              onChange={(event) => setImage(event.target.value)}
              placeholder="https://example.com/photo.jpg"
              aria-invalid={Boolean(errors.image)}
            />
            {errors.image && (
              <span className="form-error" role="alert">
                <TriangleAlert /> {errors.image}
              </span>
            )}
          </label>

          <label className="span-2">
            Email
            <input value={user.email} readOnly disabled />
          </label>
        </div>

        {errors.form && (
          <span className="form-error" role="alert">
            <TriangleAlert /> {errors.form}
          </span>
        )}

        <button className="primary-button full" type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save profile"} <ArrowRight />
        </button>
      </form>
    </main>
  );
}
