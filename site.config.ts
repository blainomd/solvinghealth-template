// ============================================================
// site.config.ts — THE ONLY FILE YOU NEED TO EDIT
// ============================================================
// Fork this repo, change the values below, deploy to Vercel.
// Everything on the site reads from this single file.
// ============================================================

export const siteConfig = {
  // ── Basic ──────────────────────────────────────────────────
  name: "Your Health Condition",
  domain: "yourdomain.com",
  tagline: "One line about what this site does",
  description:
    "Longer description for SEO. Explain what condition this site covers and how it helps patients.",

  // ── Branding ───────────────────────────────────────────────
  primaryColor: "#0D7377", // teal — used for buttons, accents, links
  accentColor: "#1B2A4A", // navy — used for hero bg, headings, footer

  // ── Sage Chat Configuration ────────────────────────────────
  chatChannel: "yourcondition", // Sage chat channel identifier
  voiceSite: "yourcondition", // Gemini voice site identifier

  // ── Hero Section ───────────────────────────────────────────
  heroTitle: "Does something hurt?\nLet's figure it out.",
  heroSubtitle:
    "Free AI-powered assessment. No login. No paywall. Just answers.",

  // ── Risk Factors / Key Information ─────────────────────────
  // Each item becomes a card in the info grid.
  sections: [
    {
      title: "Risk Factor 1",
      description:
        "Describe this risk factor. What should someone know about it?",
    },
    {
      title: "Risk Factor 2",
      description:
        "Describe this risk factor. What should someone know about it?",
    },
    {
      title: "Risk Factor 3",
      description:
        "Describe this risk factor. What should someone know about it?",
    },
    {
      title: "Risk Factor 4",
      description:
        "Describe this risk factor. What should someone know about it?",
    },
    {
      title: "Risk Factor 5",
      description:
        "Describe this risk factor. What should someone know about it?",
    },
    {
      title: "Risk Factor 6",
      description:
        "Describe this risk factor. What should someone know about it?",
    },
  ],

  // ── Conversation Starters ──────────────────────────────────
  // Shown as quick-action buttons near the chat widget.
  conversationStarters: [
    "What are my risk factors?",
    "Should I see a specialist?",
    "What can I do at home?",
    "Is this covered by insurance?",
  ],

  // ── Warning Signs ──────────────────────────────────────────
  // Displayed as a prominent list so patients know when to seek help.
  warningSigns: [
    "Sudden severe pain that doesn't improve with rest",
    "Numbness or tingling that persists",
    "Swelling that worsens over 48 hours",
    "Fever accompanying your symptoms",
    "Inability to perform daily activities",
  ],

  // ── Ecosystem Links ────────────────────────────────────────
  ecosystemLinks: {
    surgeonvalue: "https://surgeonvalue.com",
    coopccare: "https://co-op.care",
    solvinghealth: "https://solvinghealth.com",
  },

  // ── MCP Connector ──────────────────────────────────────────
  // The key used in the Claude Desktop MCP configuration snippet.
  connectorKey: "yourcondition",
};
