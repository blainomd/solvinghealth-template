import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { siteConfig } from "@/site.config";
import { RefTracker } from "@/components/RefTracker";
import "./globals.css";

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-gray-900 antialiased">
        {children}

        {/* Sage Chat Widget */}
        <Script
          src={`https://www.solvinghealth.com/widgets/sage-chat.js?channel=${siteConfig.chatChannel}`}
          strategy="lazyOnload"
        />

        {/* Gemini Voice Widget */}
        <Script
          src={`https://www.solvinghealth.com/widgets/gemini-voice.js?site=${siteConfig.voiceSite}`}
          strategy="lazyOnload"
        />

        {/* Referral invite widget — renders if user is logged in */}
        <Script
          src="https://solvinghealth.com/referral-widget.js"
          strategy="lazyOnload"
          id="sh-referral-widget"
        />

        {/* Tracks ?ref=CODE cookie and fires conversion on checkout */}
        <RefTracker />

        {/* Universal ecosystem footer bar — Surf + legal + presence */}
        <Script
          src="https://harnesshealth.ai/footer.js"
          strategy="lazyOnload"
          id="sh-footer-bar"
        />

        <Analytics />
      </body>
    </html>
  );
}
