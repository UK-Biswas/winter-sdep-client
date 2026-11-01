import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

import { googleAuthEnabled } from "@/lib/auth-providers";

const databaseUrl = process.env.BETTER_AUTH_DB_URL?.trim();
const secret = process.env.BETTER_AUTH_SECRET?.trim();
const appUrl = (process.env.BETTER_AUTH_URL ?? "http://localhost:3000").trim();
const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

if (!databaseUrl) {
  throw new Error("BETTER_AUTH_DB_URL is not set.");
}

if (!secret) {
  throw new Error("BETTER_AUTH_SECRET is not set.");
}


const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

const client = globalForMongo.mongoClient ?? new MongoClient(databaseUrl);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

const db = client.db("winter-sdep");

export const auth = betterAuth({
  appName: "FrostTogether",
  baseURL: appUrl,
  secret,
  trustedOrigins: Array.from(
    new Set([appUrl, "http://localhost:3000", "http://127.0.0.1:3000"])
  ),

  ...(googleAuthEnabled && googleClientId && googleClientSecret
    ? {
        socialProviders: {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            prompt: "select_account" as const,
          },
        },
      }
    : {}),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 20,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 5 },
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),
});
