"use client";

import { useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";

import { SessionUser } from "@/lib/types";

interface SignUpFormProps {
  onSuccess: (user: SessionUser) => void;
  onLogin: () => void;
}

function passwordChecks(password: string) {
  return [
    { label: "At least one uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "At least one lowercase letter", ok: /[a-z]/.test(password) },
    { label: "At least one number", ok: /\d/.test(password) },
    { label: "Minimum 6 characters", ok: password.length >= 6 },
  ];
}

export default function SignUpForm({ onSuccess, onLogin }: SignUpFormProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const checks = passwordChecks(password);
  const passwordValid = checks.every((check) => check.ok);

  return (
    <>
      <form
        className="auth-form"
        onSubmit={(event) => {
          event.preventDefault();

          const data = new FormData(event.currentTarget);
          const name = String(data.get("name") || "").trim();
          const email = String(data.get("email") || "").trim();
          const photo = String(data.get("photo") || "").trim();

          if (name.length < 2) {
            setError("Tell us your full name.");
            return;
          }

          if (!passwordValid) {
            setError("Your password does not meet every rule yet.");
            return;
          }

          setError("");
          onSuccess({ name, email, photo: photo || undefined });
        }}
      >
        <label>
          Full name
          <input
            name="name"
            placeholder="Tanvir Ahmed"
            minLength={2}
            required
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            placeholder="name@example.com"
            required
          />
        </label>

        <label>
          Profile photo URL <span className="optional">(optional)</span>
          <input
            name="photo"
            type="url"
            placeholder="https://images.unsplash.com/..."
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            minLength={6}
            required
          />
        </label>

        <ul className="password-rules">
          {checks.map((check) => (
            <li key={check.label} className={check.ok ? "ok" : ""}>
              {check.ok ? <Check /> : <X />}
              {check.label}
            </li>
          ))}
        </ul>

        {error && (
          <span className="form-error" role="alert">
            {error}
          </span>
        )}

        <button className="primary-button full" type="submit">
          Create account <ArrowRight />
        </button>
      </form>

      <p className="switch-auth">
        Already have an account?{" "}
        <button type="button" onClick={onLogin}>
          Sign in
        </button>
      </p>
    </>
  );
}
