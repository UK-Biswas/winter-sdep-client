import { redirect } from "next/navigation";

import ProfileRoute from "@/components/app/routes/profile-route";
import { getServerSessionUser } from "@/lib/session";

export default async function ProfilePageRoute() {
  const user = await getServerSessionUser();

  if (!user) {
    redirect("/auth?next=/profile");
  }

  return <ProfileRoute />;
}
