import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "FrostTogether | Winter Community",
  description:
    "Discover local winter relief events, connect with volunteers, and make your community warmer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}