import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { siteConfig } from "@/site.config";
import { base } from "@/lib/manifest";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(base()),
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    type: "website",
    url: "/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* The machine door: agents find the manifest from any page. */}
        <link rel="alternate" type="application/json" href="/.well-known/agent.json" title="Agent manifest" />
      </head>
      <body className="bg-white text-gray-900 antialiased">
        {children}
        {/* No chat widget, no shared footer script, no referral tracker: a flower loads nothing that sends a visitor's words anywhere. */}
        {siteConfig.analytics ? <Analytics /> : null}
      </body>
    </html>
  );
}
