import { SignJWT } from "jose";

export interface BackendUser {
  id: string;
  email: string;
  name: string;
}

function getSigningKey() {
  const value = process.env.EVENTS_JWT_SECRET?.trim();

  if (!value || value.length < 32) {
    throw new Error(
      "EVENTS_JWT_SECRET must be set to the same value as JWT_SECRET on the API server."
    );
  }

  return new TextEncoder().encode(value);
}

/**
 * Mints a short-lived JWT for the Express API. The Better Auth session cookie
 * authenticates the browser; this token authenticates the Next.js server to
 * the API. It never reaches the browser.
 */
export async function createBackendToken(user: BackendUser): Promise<string> {
  const issuer = process.env.EVENTS_JWT_ISSUER?.trim() || "frosttogether-web";
  const audience =
    process.env.EVENTS_JWT_AUDIENCE?.trim() || "frosttogether-api";

  return new SignJWT({ email: user.email, name: user.name })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(user.id)
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(getSigningKey());
}
