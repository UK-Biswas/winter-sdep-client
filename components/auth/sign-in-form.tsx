"use client";

import { useState } from "react";
import { ArrowRight, Globe } from "lucide-react";

import { SessionUser } from "@/lib/types";

interface SignInFormProps {
  onSuccess: (user: SessionUser) => void;
  onRegister: () => void;
}

function nameFromEmail(email: string) {
  const local = email.split("@")[0] || "Friend";
  return local
    .replace(/[._-]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export default function SignInForm({ onSuccess, onRegister }: SignInFormProps) {
  const [error, setError] = useState("");

  return (
    <>
      <form
        className="auth-form"
        onSubmit={(event) => {
          event.preventDefault();

          const data = new FormData(event.currentTarget);
          const email = String(data.get("email") || "").trim();
          const password = String(data.get("password") || "");

          if (!email || !password) {
            setError("Enter your email and password to continue.");
            return;
          }

          setError("");
          onSuccess({ name: nameFromEmail(email), email });
        }}
      >
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
          Password
          <input
            name="password"
            type="password"
            placeholder="Your password"
            minLength={6}
            required
          />
        </label>

        {error && (
          <span className="form-error" role="alert">
            {error}
          </span>
        )}

        <button className="primary-button full" type="submit">
          Sign in <ArrowRight />
        </button>

        <small className="hint">
          Demo workspace: any email and a 6+ character password works. Use
          tanvir@frosttogether.org to manage the sample drives.
        </small>
      </form>

      <div className="or">
        <span />
        or continue with
        <span />
      </div>

      <button className="social-button" type="button">
        <Globe />
        Continue with Google
      </button>

      <p className="switch-auth">
        New to FrostTogether?{" "}
        <button type="button" onClick={onRegister}>
          Register here
        </button>
      </p>
    </>
  );
}
