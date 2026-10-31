import {
  CalendarCheck,
  Compass,
  HeartHandshake,
  ListChecks,
  ShieldCheck,
  Users,
} from "lucide-react";

export const EVENT_CATEGORIES = [
  "All",
  "Winter Relief",
  "Donation",
  "Cleanup",
  "Plantation",
  "Food Drive",
  "Health Camp",
  "Education",
];

/** Form types, i.e. categories without the "All" filter. */
export const EVENT_TYPES = EVENT_CATEGORIES.slice(1);

export const IMPACT_STATS = [
  { value: 1450, suffix: "+", label: "Active volunteers" },
  { value: 180, suffix: "+", label: "Drives completed" },
  { value: 24, suffix: "k+", label: "Lives touched" },
  { value: 100, suffix: "%", label: "Community driven" },
];

export const FEATURES = [
  {
    icon: ListChecks,
    title: "Join in one click",
    text: "Pick a drive, tap join, and get the details you need. No forms, no waiting for approval.",
  },
  {
    icon: Compass,
    title: "Only upcoming drives",
    text: "Past events leave the board automatically, so every listing you see is still open.",
  },
  {
    icon: ShieldCheck,
    title: "Verified organizers",
    text: "Every host carries an organizer profile, a contact email, and a visible volunteer trail.",
  },
  {
    icon: CalendarCheck,
    title: "Your commitments, sorted",
    text: "Joined events collect in one place with the date you signed up and a way to step back.",
  },
  {
    icon: HeartHandshake,
    title: "Create in minutes",
    text: "Publish a drive with a date, venue, capacity, and guidelines — then manage it as it grows.",
  },
  {
    icon: Users,
    title: "Built for your block",
    text: "Filter by cause or neighborhood and find the people already working on what you care about.",
  },
];

export const ACTIVE_CAUSES = [
  { label: "Winter clothes & blanket relief", category: "Winter Relief" },
  { label: "City clean-up & waste segregation", category: "Cleanup" },
  { label: "Urban tree plantation drives", category: "Plantation" },
  { label: "Warm meal sharing", category: "Food Drive" },
  { label: "Free medical & health camps", category: "Health Camp" },
  { label: "Children's books & school kits", category: "Education" },
];

export const HERO_IMAGE =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1.3-FeSOGHGjRQDAym7ahSnVVzlUgUDpZ1.png";

export const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    alt: "Volunteers sorting and packing relief supplies",
    caption: "Warmth for every doorstep",
    featured: true,
  },
  {
    src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
    alt: "Hands sharing a warm community meal",
    caption: "A shared meal, a shared story",
  },
  {
    src: "https://images.unsplash.com/photo-1534710961216-75c88202f43e?auto=format&fit=crop&w=800&q=80",
    alt: "A young tree planted by volunteers",
    caption: "Roots for the next season",
  },
  {
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
    alt: "Children reading together in a classroom",
    caption: "Small hands, big mornings",
  },
];
