import { Event } from "./types";

const eventImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1.2-OwsxZ1nnN1mmIxVe7zUErKeQiS1lKj.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1.3-FeSOGHGjRQDAym7ahSnVVzlUgUDpZ1.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1.1-pJGVQSdJU5zoWd94IT4POn6yUqV6tO.png",
];

export const demoEvents: Event[] = [
  {
    title: "Winter Warmth Distribution",
    type: "Winter Relief",
    date: "Nov 15, 2026",
    location: "Mirpur 10, Dhaka",
    host: "Mirpur Youth Volunteers",
    image: eventImages[0],
    description:
      "Collecting and distributing warm clothes, jackets, sweaters, and shawls to families who need a little extra warmth.",
  },
  {
    title: "Blanket Night for Neighbors",
    type: "Donation",
    date: "Nov 20, 2026",
    location: "Mohammadpur, Dhaka",
    host: "Mohammadpur Care Circle",
    image: eventImages[1],
    description:
      "A thoughtful night-time blanket distribution drive for pavement dwellers, orphans, and senior citizens.",
  },
  {
    title: "Dhanmondi Lake Clean-up",
    type: "Cleanup",
    date: "Nov 25, 2026",
    location: "Dhanmondi Lake, Dhaka",
    host: "Green Dhaka Youth",
    image: eventImages[2],
    description:
      "Join local volunteers with gloves, bags, and tools to clear plastic waste from walkways and the lakeside.",
  },
  {
    title: "Warm Meals, Kind Hearts",
    type: "Food Drive",
    date: "Dec 02, 2026",
    location: "Farmgate, Dhaka",
    host: "Open Table Bangladesh",
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=85",
    description:
      "Share nourishing meals with people experiencing food insecurity this winter.",
  },
  {
    title: "Winter Seedlings Project",
    type: "Plantation",
    date: "Dec 10, 2026",
    location: "Uttara Sector 7, Dhaka",
    host: "Green Roots Collective",
    image:
      "https://images.unsplash.com/photo-1534710961216-75c88202f43e?auto=format&fit=crop&w=900&q=85",
    description:
      "Plant native trees and nurture a greener, healthier neighborhood for every season.",
  },
  {
    title: "Community Health Camp",
    type: "Health Camp",
    date: "Dec 18, 2026",
    location: "Jatrabari, Dhaka",
    host: "CareBridge Foundation",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=85",
    description:
      "Free basic health checks and winter wellness guidance led by volunteer professionals.",
  },
];