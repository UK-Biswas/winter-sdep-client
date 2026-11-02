"use client";

import ProfileForm from "@/components/profile/profile-form";

import { useApp, useRequireUser } from "../app-provider";

export default function ProfileRoute() {
  const user = useRequireUser("profile");
  const { refreshSession, showToast, navigate } = useApp();

  if (!user) return null;

  return (
    <ProfileForm
      user={user}
      onBack={() => navigate("manage")}
      onSaved={async () => {
        await refreshSession();
        showToast("Profile updated. Your new details are live.");
      }}
    />
  );
}
