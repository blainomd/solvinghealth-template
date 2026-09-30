// ============================================================
// site.config.ts — THE ONLY FILE YOU NEED TO EDIT
// ============================================================
// Fork this repo, change the values below, deploy. Everything on the site,
// including the machine door (/.well-known/agent.json, /llms.txt, /sitemap.xml),
// reads from this one file. The Flower Standard this template follows is at
// https://solvinghealth.com/build#flower — check your live site with
//   node flower-check.mjs yourdomain.com   (https://solvinghealth.com/sdk/flower-check.mjs)
// ============================================================

export const siteConfig = {
  // ── Basic ──────────────────────────────────────────────────
  name: "Your Health Condition",
  domain: "yourdomain.com", // no https://, no www.
  tagline: "One line about what this site does",
  description:
    "Longer description for search engines and agents. Say what condition this site covers, who it is for, and what a visitor can do here. No claim you cannot defend today.",

  // ── Job (one sentence: what the site does, for whom, and the business it supports) ──
  job: "Helps people with [condition] understand what they are dealing with and bring the right questions to their clinician.",

  // ── Who publishes this site. Your own name or organization, never SolvingHealth. ──
  publisher: { name: "Your Name or Organization", url: "https://yourdomain.com" },

  // ── Audience, kebab-case roles (agents read these) ──
  audience: ["patient", "family-caregiver"],

  // ── Branding ───────────────────────────────────────────────
  primaryColor: "#0D7377", // buttons, accents, links
  accentColor: "#1B2A4A", // hero background, headings, footer

  // ── Hero ───────────────────────────────────────────────────
  heroTitle: "Does something hurt?\nLet's sort out what to ask.",
  heroSubtitle:
    "Plain information, warning signs first, and a visit list you build here on your device. Nothing you type is sent anywhere.",

  // ── What you should know: each item becomes a card ─────────
  sections: [
    { title: "Risk factor 1", description: "Describe this risk factor. What should someone know about it?" },
    { title: "Risk factor 2", description: "Describe this risk factor. What should someone know about it?" },
    { title: "Risk factor 3", description: "Describe this risk factor. What should someone know about it?" },
    { title: "Risk factor 4", description: "Describe this risk factor. What should someone know about it?" },
    { title: "Risk factor 5", description: "Describe this risk factor. What should someone know about it?" },
    { title: "Risk factor 6", description: "Describe this risk factor. What should someone know about it?" },
  ],

  // ── Warning signs: shown first, with 911 / 988 above them ──
  warningSigns: [
    "Sudden severe pain that does not improve with rest",
    "Numbness or tingling that persists",
    "Swelling that worsens over 48 hours",
    "Fever accompanying your symptoms",
    "Inability to perform daily activities",
  ],

  // ── The nectar: questions a visitor picks and prints for their next visit.
  //    Built on the device; nothing is stored or sent. Edit freely; keep each one a real question.
  visitQuestions: [
    "What do you think is causing this, and what else could it be?",
    "What can I do at home before we try anything else?",
    "Which warning signs mean I should come back sooner?",
    "Do I need imaging or tests, and what would change if we did them?",
    "If this does not improve in a few weeks, what is the next step?",
    "Is there anything in my history or medications that matters here?",
  ],

  // ── Sources: name the pages your content comes from (a public health body, a society, a journal).
  //    Shown on the page; agents read them from the manifest. Leave empty only if you have none yet.
  sources: [
    { name: "Example public health page", url: "https://www.example.org/condition" },
  ],

  // ── Where a visitor goes next (siblings in the network, by need). Keep the ones that are true for your condition.
  next: [
    { label: "Not sure where to start? Tell us your situation", url: "https://solvinghealth.com/doors" },
  ],

  // ── Pollen (optional). Declare only kinds from https://solvinghealth.com/schemas/pollen-kinds-v1.json.
  //    Leave both empty until your site actually hands a result on or takes one in.
  pollen: { sends: [] as string[], accepts: [] as string[] },

  // ── Analytics. false = the page loads no analytics script at all (the default).
  analytics: false,

  // ── The date you last changed this file (YYYY-MM-DD). Agents use it; bump it when the site changes.
  updated: "2026-09-30",
};

export type SiteConfig = typeof siteConfig;
