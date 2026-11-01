import AuthRoute from "@/components/app/routes/auth-route";
import { googleAuthEnabled } from "@/lib/auth-providers";

export default async function AuthPageRoute({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const value = (await searchParams).next;
  const raw = Array.isArray(value) ? value[0] : value;
  const nextPath =
    raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : undefined;

  return <AuthRoute nextPath={nextPath} googleEnabled={googleAuthEnabled} />;
}
