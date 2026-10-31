"use client";

import { ArrowRight } from "lucide-react";

interface SignInFormProps {
  onSuccess: () => void;
  onRegister: () => void;
}

export default function SignInForm({
  onSuccess,
  onRegister,
}: SignInFormProps) {
  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSuccess();
        }}
      >
        <label>
          Email
          <input
            type="email"
            placeholder="name@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            placeholder="Your password"
            required
          />
        </label>

        <button className="primary-button full" type="submit">
          Sign in <ArrowRight />
        </button>
      </form>

      <div className="or">
        <span />
        or continue with
        <span />
      </div>

      <button className="social-button" type="button">
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