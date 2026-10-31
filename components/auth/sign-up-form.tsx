"use client";

import { ArrowRight } from "lucide-react";

interface SignUpFormProps {
  onSuccess: () => void;
  onLogin: () => void;
}

export default function SignUpForm({
  onSuccess,
  onLogin,
}: SignUpFormProps) {
  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();

          const form = event.currentTarget;
          const data = new FormData(form);

          const name = String(data.get("name") || "");
          const email = String(data.get("email") || "");
          const password = String(data.get("password") || "");
          const photo = String(data.get("photo") || "");

          if (
            !/[A-Z]/.test(password) ||
            !/[a-z]/.test(password) ||
            password.length < 6
          ) {
            return;
          }

          console.log({ name, email, password, photo });

          onSuccess();
        }}
      >
        <label>
          Full name
          <input
            name="name"
            placeholder="Your full name"
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
          Photo URL
          <input
            name="photo"
            type="url"
            placeholder="https://example.com/photo.jpg"
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            placeholder="At least 6 characters"
            minLength={6}
            required
          />
        </label>

        <small className="hint">
          Use an uppercase letter, lowercase letter, and 6+ characters.
        </small>

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