/**
 * Google sign-in is enabled only when both OAuth credentials are present. This
 * keeps the app fully usable before the credentials are configured and lets the
 * UI hide/disable the button instead of sending users to a broken redirect.
 */
export const googleAuthEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID?.trim() &&
    process.env.GOOGLE_CLIENT_SECRET?.trim()
);
