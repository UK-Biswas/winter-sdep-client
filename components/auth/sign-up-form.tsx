"use client";

import { useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";

import { authClient } from "@/lib/auth-client";
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
    { label: "Minimum 8 characters", ok: password.length >= 8 },
  ];
}

export default function SignUpForm({ onSuccess, onLogin }: SignUpFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const checks = passwordChecks(password);
  const passwordValid = checks.every((check) => check.ok);

  return (
    <>
      <form
        className="auth-form"
        aria-busy={pending}
        onSubmit={async (event) => {
          event.preventDefault();

          if (pending) return;

          const data = new FormData(event.currentTarget);
          const name = String(data.get("name") || "").trim();
          const email = String(data.get("email") || "")
            .trim()
            .toLowerCase();
          const photo = String(data.get("photo") || "").trim();

          if (name.length < 2) {
            setError("Tell us your full name.");
            return;
          }

          if (!passwordValid) {
            setError("Your password does not meet every rule yet.");
            return;
          }

          if (password !== confirmPassword) {
            setError("The passwords you entered do not match.");
            return;
          }

          setError("");
          setPending(true);

          try {
            const { data: result, error: authError } =
              await authClient.signUp.email({
                name,
                email,
                password,
                image: photo || undefined,
              });

            if (authError) {
              setError(
                authError.message ||
                  "We could not create your account. Please try again."
              );
              return;
            }

            if (!result?.user) {
              setError(
                "Your account was created, but we could not start a session. Please sign in."
              );
              return;
            }

            onSuccess({
              name: result.user.name || name,
              email: result.user.email,
              photo: result.user.image ?? undefined,
            });
          } catch {
            setError(
              "The registration service is unavailable. Please try again."
            );
          } finally {
            setPending(false);
          }
        }}
      >
        <label>
          Full name
          <input
            name="name"
            autoComplete="name"
            placeholder="Uzzwal Kumar Biswas"
            minLength={2}
            maxLength={80}
            required
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            required
          />
        </label>

        <label>
          Profile photo URL <span className="optional">(optional)</span>
          <input
            name="photo"
            type="url"
            autoComplete="photo"
            placeholder="https://images.unsplash.com/..."
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            minLength={8}
            maxLength={128}
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

        <label>
          Confirm password
          <input
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat your password"
            minLength={8}
            maxLength={128}
            required
          />
        </label>

        {error && (
          <span className="form-error" role="alert">
            {error}
          </span>
        )}

        <button
          className="primary-button full"
          type="submit"
          disabled={pending}
        >
          {pending ? "Creating account…" : "Create account"} <ArrowRight />
        </button>
      </form>

      <p className="switch-auth">
        Already have an account?{" "}
        <button type="button" onClick={onLogin} disabled={pending}>
          Sign in
        </button>
      </p>
    </>
  );
}
