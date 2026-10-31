"use client";

import { useState } from "react";

import { SessionUser } from "@/lib/types";

import AuthShell from "./auth-shell";
import SignInForm from "./sign-in-form";
import SignUpForm from "./sign-up-form";

interface AuthPageProps {
  onBack: () => void;
  onSuccess: (user: SessionUser) => void;
}

export default function AuthPage({ onBack, onSuccess }: AuthPageProps) {
  const [register, setRegister] = useState(false);

  return (
    <AuthShell
      title={register ? "Create your account" : "Welcome back"}
      description={
        register
          ? "Join a kinder winter, one action at a time."
          : "Sign in to organize and join community drives."
      }
      onBack={onBack}
    >
      {register ? (
        <SignUpForm
          onSuccess={onSuccess}
          onLogin={() => setRegister(false)}
        />
      ) : (
        <SignInForm
          onSuccess={onSuccess}
          onRegister={() => setRegister(true)}
        />
      )}
    </AuthShell>
  );
}
