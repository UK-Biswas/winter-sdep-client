
<!-- src/config/env.js----------------------- -->
import "dotenv/config";

function required(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not set. Add it to the server .env file.`);
  }

  return value;
}

const port = Number(process.env.PORT || 5000);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error("PORT must be a positive integer.");
}

const jwtSecret = required("JWT_SECRET");

if (jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long.");
}

export const config = {
  port,
  dbUser: required("DB_USER"),
  dbPass: required("DB_PASS"),
  dbName: process.env.DB_NAME?.trim() || "winter-sdep",
  jwtSecret,
  jwtIssuer: process.env.JWT_ISSUER?.trim() || "frosttogether-web",
  jwtAudience: process.env.JWT_AUDIENCE?.trim() || "frosttogether-api",
  corsOrigins: (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export function mongoUri() {
  return `mongodb+srv://${config.dbUser}:${config.dbPass}@cluster0.gd33szw.mongodb.net/`;
}


<!-- src/db/mongo.js---------------- -->
import { MongoClient } from "mongodb";

import { config, mongoUri } from "../config/env.js";

let client = null;
let db = null;

export async function connectToMongoDB() {
  if (db) return client;

  client = new MongoClient(mongoUri());
  await client.connect();
  db = client.db(config.dbName);

  await ensureIndexes(db);

  console.log(`Connected to MongoDB database "${config.dbName}".`);
  return client;
}

export async function ensureIndexes(database) {
  const events = database.collection("events");

  await Promise.all([
    events.createIndex({ date: 1 }),
    events.createIndex({ organizerId: 1 }),
    events.createIndex({ "joinedUsers.userId": 1 }),
    events.createIndex(
      { seedKey: 1 },
      { unique: true, sparse: true, name: "seedKey_unique_sparse" }
    ),
  ]);
}

export function getDb() {
  if (!db) {
    throw new Error("MongoDB has not been connected yet.");
  }

  return db;
}

export function getEventsCollection() {
  return getDb().collection("events");
}

export async function closeMongoDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

<!-- src/models/event.js--------------------- -->
import { ObjectId } from "mongodb";

export function parseObjectId(value) {
  if (typeof value !== "string" || !ObjectId.isValid(value)) return null;

  const id = new ObjectId(value);

  // ObjectId.isValid accepts some 12-character strings that are not the
  // canonical 24-character hex form. Reject those so lookups stay predictable.
  if (id.toHexString() !== value.toLowerCase()) return null;

  return id;
}

function toISOString(value) {
  if (!value) return undefined;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value.toISOString();
  }

  if (typeof value === "string") return value;

  return undefined;
}

/**
 * Shapes a MongoDB event document for the frontend. The public shape matches
 * `lib/types.ts` in the Next.js app.
 */
export function serializeEvent(doc, userId) {
  const joinedUsers = Array.isArray(doc.joinedUsers) ? doc.joinedUsers : [];
  const joinedEntry = userId
    ? joinedUsers.find((entry) => entry.userId === userId)
    : null;
  const storedCount = Number.isFinite(doc.joinedCount)
    ? Number(doc.joinedCount)
    : 0;

  return {
    _id: doc._id.toString(),
    id: doc._id.toString(),

    title: doc.title,
    type: doc.type,
    date: doc.date,
    time: doc.time || undefined,
    location: doc.location,
    host: doc.host,
    image: doc.image,
    description: doc.description,

    organizerId: doc.organizerId,
    organizerEmail: doc.organizerEmail,
    joinedCount: Math.max(joinedUsers.length, storedCount),
    capacity: doc.capacity ?? undefined,
    guidelines: Array.isArray(doc.guidelines) ? doc.guidelines : [],
    createdAt: toISOString(doc.createdAt),
    updatedAt: toISOString(doc.updatedAt),

    joinedAt: joinedEntry?.joinedAt,
    isOwner: Boolean(userId && doc.organizerId === userId),
  };
}

<!-- src/utils/validate-event.js------------- -->
export const EVENT_TYPES = [
  "Winter Relief",
  "Donation",
  "Cleanup",
  "Plantation",
  "Food Drive",
  "Health Camp",
  "Education",
];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isISODate(value) {
  if (!DATE_PATTERN.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

export function todayISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function validateGuidelines(value, errors, output, partial) {
  if (value === undefined) return;

  if (!Array.isArray(value)) {
    errors.guidelines = "Guidelines must be a list of short notes.";
    return;
  }

  if (value.length > 20) {
    errors.guidelines = "Add at most 20 guidelines.";
    return;
  }

  const cleaned = value
    .map((item) => text(item))
    .filter(Boolean)
    .slice(0, 20);

  if (cleaned.some((item) => item.length > 500)) {
    errors.guidelines = "Each guideline must be 500 characters or fewer.";
    return;
  }

  output.guidelines = cleaned;
}

/**
 * Validates and sanitises an event payload. Ownership and counters are never
 * taken from the client.
 */
export function validateEventInput(body, { partial = false } = {}) {
  const payload = body && typeof body === "object" ? body : {};
  const errors = {};
  const output = {};

  if (!partial || payload.title !== undefined) {
    const title = text(payload.title);
    if (title.length < 5 || title.length > 120) {
      errors.title = "Title must be between 5 and 120 characters.";
    } else {
      output.title = title;
    }
  }

  if (!partial || payload.type !== undefined) {
    const type = text(payload.type);
    if (!EVENT_TYPES.includes(type)) {
      errors.type = `Type must be one of: ${EVENT_TYPES.join(", ")}.`;
    } else {
      output.type = type;
    }
  }

  if (!partial || payload.date !== undefined) {
    const date = text(payload.date);
    if (!isISODate(date)) {
      errors.date = "Date must use the YYYY-MM-DD format.";
    } else if (!partial && date < todayISO()) {
      errors.date = "Date must be today or later.";
    } else {
      output.date = date;
    }
  }

  if (!partial || payload.location !== undefined) {
    const location = text(payload.location);
    if (location.length < 3 || location.length > 160) {
      errors.location = "Location must be between 3 and 160 characters.";
    } else {
      output.location = location;
    }
  }

  if (!partial || payload.image !== undefined) {
    const image = text(payload.image);
    if (image.length > 2048 || !isHttpUrl(image)) {
      errors.image = "Image must be a valid http(s) URL.";
    } else {
      output.image = image;
    }
  }

  if (!partial || payload.description !== undefined) {
    const description = text(payload.description);
    if (description.length < 20 || description.length > 5000) {
      errors.description = "Description must be between 20 and 5000 characters.";
    } else {
      output.description = description;
    }
  }

  if (payload.time !== undefined) {
    const time = text(payload.time);
    if (time.length > 80) {
      errors.time = "Time must be 80 characters or fewer.";
    } else {
      output.time = time;
    }
  }

  if (payload.capacity !== undefined && payload.capacity !== null && payload.capacity !== "") {
    const capacity = Number(payload.capacity);
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 100000) {
      errors.capacity = "Capacity must be a whole number between 1 and 100000.";
    } else {
      output.capacity = capacity;
    }
  }

  validateGuidelines(payload.guidelines, errors, output, partial);

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    value: output,
  };
}

<!-- src/controllers/events.controller.js------------ -->
import { getEventsCollection } from "../db/mongo.js";
import { parseObjectId, serializeEvent } from "../models/event.js";
import { validateEventInput } from "../utils/validate-event.js";

function sortEvents(a, b) {
  return a.date.localeCompare(b.date);
}

function sendValidationError(res, errors) {
  return res.status(400).json({
    message: "Please correct the highlighted fields.",
    errors,
  });
}

async function findEvent(id) {
  const objectId = parseObjectId(id);

  if (!objectId) return { objectId: null, event: null };

  const event = await getEventsCollection().findOne({ _id: objectId });

  return { objectId, event };
}

export async function listEvents(req, res) {
  const events = await getEventsCollection().find({}).toArray();

  events.sort(sortEvents);

  return res.json(events.map((event) => serializeEvent(event, req.user?.id)));
}

export async function getEvent(req, res) {
  const { event } = await findEvent(req.params.id);

  if (!event) {
    return res.status(404).json({ message: "Event not found." });
  }

  return res.json(serializeEvent(event, req.user?.id));
}

export async function listMyEvents(req, res) {
  const events = await getEventsCollection()
    .find({ organizerId: req.user.id })
    .toArray();

  events.sort(sortEvents);

  return res.json(events.map((event) => serializeEvent(event, req.user.id)));
}

export async function listJoinedEvents(req, res) {
  const events = await getEventsCollection()
    .find({ "joinedUsers.userId": req.user.id })
    .toArray();

  events.sort(sortEvents);

  return res.json(events.map((event) => serializeEvent(event, req.user.id)));
}

export async function createEvent(req, res) {
  const { valid, errors, value } = validateEventInput(req.body);

  if (!valid) return sendValidationError(res, errors);

  if (!req.user.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = new Date().toISOString();
  const document = {
    ...value,
    host: req.user.name || req.user.email.split("@")[0],
    organizerId: req.user.id,
    organizerEmail: req.user.email,
    joinedUsers: [],
    joinedCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const result = await getEventsCollection().insertOne(document);
  document._id = result.insertedId;

  return res.status(201).json(serializeEvent(document, req.user.id));
}

export async function updateEvent(req, res) {
  const { event } = await findEvent(req.params.id);

  if (!event) {
    return res.status(404).json({ message: "Event not found." });
  }

  if (event.organizerId !== req.user.id) {
    return res.status(403).json({
      message: "Only the organizer who created this event can edit it.",
    });
  }

  const { valid, errors, value } = validateEventInput(req.body, {
    partial: true,
  });

  if (!valid) return sendValidationError(res, errors);

  if (Object.keys(value).length === 0) {
    return res.status(400).json({ message: "No valid fields were provided." });
  }

  const updated = await getEventsCollection().findOneAndUpdate(
    { _id: event._id },
    { $set: { ...value, updatedAt: new Date().toISOString() } },
    { returnDocument: "after" }
  );

  return res.json(serializeEvent(updated, req.user.id));
}

export async function deleteEvent(req, res) {
  const { event } = await findEvent(req.params.id);

  if (!event) {
    return res.status(404).json({ message: "Event not found." });
  }

  if (event.organizerId !== req.user.id) {
    return res.status(403).json({
      message: "Only the organizer who created this event can delete it.",
    });
  }

  await getEventsCollection().deleteOne({ _id: event._id });

  return res.json({ deleted: true, id: event._id.toString() });
}

export async function joinEvent(req, res) {
  const { objectId, event } = await findEvent(req.params.id);

  if (!objectId || !event) {
    return res.status(404).json({ message: "Event not found." });
  }

  const alreadyJoined = (event.joinedUsers || []).some(
    (member) => member.userId === req.user.id
  );

  if (alreadyJoined) {
    return res.json(serializeEvent(event, req.user.id));
  }

  const joinedCount = Math.max(
    (event.joinedUsers || []).length,
    Number(event.joinedCount) || 0
  );

  if (event.capacity && joinedCount >= event.capacity) {
    return res.status(409).json({
      message: "This event has reached capacity.",
    });
  }

  const joinedAt = new Date().toISOString();

  await getEventsCollection().updateOne(
    { _id: objectId, "joinedUsers.userId": { $ne: req.user.id } },
    {
      $push: {
        joinedUsers: {
          userId: req.user.id,
          name: req.user.name || req.user.email.split("@")[0],
          email: req.user.email,
          joinedAt,
        },
      },
      $inc: { joinedCount: 1 },
      $set: { updatedAt: joinedAt },
    }
  );

  const updated = await getEventsCollection().findOne({ _id: objectId });

  return res.json(serializeEvent(updated, req.user.id));
}

export async function leaveEvent(req, res) {
  const { objectId, event } = await findEvent(req.params.id);

  if (!objectId || !event) {
    return res.status(404).json({ message: "Event not found." });
  }

  const joined = (event.joinedUsers || []).some(
    (member) => member.userId === req.user.id
  );

  if (!joined) {
    return res.json(serializeEvent(event, req.user.id));
  }

  const updatedAt = new Date().toISOString();

  await getEventsCollection().updateOne(
    { _id: objectId, "joinedUsers.userId": req.user.id },
    [
      {
        $set: {
          joinedUsers: {
            $filter: {
              input: { $ifNull: ["$joinedUsers", []] },
              as: "member",
              cond: { $ne: ["$$member.userId", req.user.id] },
            },
          },
          updatedAt,
        },
      },
      {
        $set: {
          joinedCount: {
            $max: [
              0,
              {
                $subtract: [{ $ifNull: ["$joinedCount", 0] }, 1],
              },
            ],
          },
        },
      },
    ]
  );

  const updated = await getEventsCollection().findOne({ _id: objectId });

  return res.json(serializeEvent(updated, req.user.id));
}

<!-- src/routes/events.routes.js--------------------- -->
import { Router } from "express";

import {
  createEvent,
  deleteEvent,
  getEvent,
  joinEvent,
  leaveEvent,
  listEvents,
  listJoinedEvents,
  listMyEvents,
  updateEvent,
} from "../controllers/events.controller.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", optionalAuth, listEvents);
router.get("/mine", requireAuth, listMyEvents);
router.get("/joined", requireAuth, listJoinedEvents);

router.post("/", requireAuth, createEvent);

router.get("/:id", optionalAuth, getEvent);
router.put("/:id", requireAuth, updateEvent);
router.delete("/:id", requireAuth, deleteEvent);

router.post("/:id/join", requireAuth, joinEvent);
router.delete("/:id/join", requireAuth, leaveEvent);

export default router;

<!-- src/seed/seed-events.js-------------- -->
