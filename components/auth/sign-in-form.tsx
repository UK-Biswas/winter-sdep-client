"use client";

import { useState } from "react";
import { ArrowRight, Globe } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { SessionUser } from "@/lib/types";

interface SignInFormProps {
  onSuccess: (user: SessionUser) => void;
  onRegister: () => void;
  googleEnabled?: boolean;
  nextPath?: string;
}

export default function SignInForm({
  onSuccess,
  onRegister,
  googleEnabled = false,
  nextPath,
}: SignInFormProps) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);

  async function handleGoogleSignIn() {
    if (!googleEnabled || pending || googlePending) return;

    setError("");
    setGooglePending(true);

    try {
      const { error: authError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: nextPath ?? "/",
        errorCallbackURL: "/auth",
      });

      if (authError) {
        setError(
          authError.message ||
            "Google sign-in could not be started. Please try again."
        );
        setGooglePending(false);
      }
    } catch {
      setError("Google sign-in is unavailable right now. Please try again.");
      setGooglePending(false);
    }
  }

  return (
    <>
      <form
        className="auth-form"
        aria-busy={pending}
        onSubmit={async (event) => {
          event.preventDefault();

          if (pending) return;

          const data = new FormData(event.currentTarget);
          const email = String(data.get("email") || "")
            .trim()
            .toLowerCase();
          const password = String(data.get("password") || "");

          if (!email || !password) {
            setError("Enter your email and password to continue.");
            return;
          }

          setError("");
          setPending(true);

          try {
            const { data: result, error: authError } =
              await authClient.signIn.email({
                email,
                password,
                rememberMe: true,
              });

            if (authError) {
              setError(authError.message || "Invalid email or password.");
              return;
            }

            if (!result?.user) {
              setError("We could not start a session. Please try again.");
              return;
            }

            onSuccess({
              name: result.user.name || email.split("@")[0] || "Friend",
              email: result.user.email,
              photo: result.user.image ?? undefined,
            });
          } catch {
            setError("The sign-in service is unavailable. Please try again.");
          } finally {
            setPending(false);
          }
        }}
      >
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
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
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
          {pending ? "Signing in…" : "Sign in"} <ArrowRight />
        </button>

        <small className="hint">
          Use the email and password you registered with. Accounts are verified
          on our server before a session is created.
        </small>
      </form>

      <div className="or">
        <span />
        or continue with
        <span />
      </div>

      <button
        className="social-button"
        type="button"
        onClick={handleGoogleSignIn}
        disabled={!googleEnabled || pending || googlePending}
        title={
          googleEnabled
            ? undefined
            : "Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env to enable Google sign-in."
        }
      >
        <Globe />
        {googlePending ? "Redirecting to Google…" : "Continue with Google"}
      </button>

      {!googleEnabled && (
        <small className="hint">
          Google sign-in will activate once the OAuth credentials are
          configured.
        </small>
      )}

      <p className="switch-auth">
        New to FrostTogether?{" "}
        <button type="button" onClick={onRegister} disabled={pending}>
          Register here
        </button>
      </p>
    </>
  );
}
