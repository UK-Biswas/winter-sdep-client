"use client";

import { useEffect, useRef } from "react";

import AuthPage from "@/components/auth/auth-page";

import { useApp } from "../app-provider";

export default function AuthRoute({
  nextPath,
  googleEnabled,
}: {
  nextPath?: string;
  googleEnabled?: boolean;
}) {
  const { user, sessionActive, navigate, handleAuthSuccess, sessionReady } =
    useApp();
  const checked = useRef(false);
  const wasSignedIn = useRef(false);

  useEffect(() => {
    if (!sessionReady) return;

    if (!checked.current) {
      checked.current = true;
      wasSignedIn.current = sessionActive;
    }

    // Only redirect users who arrived here with a real session. After a fresh
    // sign-in/sign-up, `handleAuthSuccess` owns the destination.
    if (wasSignedIn.current && sessionActive && user) {
      navigate("auth");
    }
  }, [navigate, sessionActive, sessionReady, user]);

  return (
    <AuthPage
      onBack={() => navigate("home")}
      onSuccess={(account) => handleAuthSuccess(account, nextPath)}
      googleEnabled={googleEnabled}
      nextPath={nextPath}
    />
  );
}
