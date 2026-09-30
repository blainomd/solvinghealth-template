// lib/manifest.ts — builds the machine door from site.config.ts: the agent manifest, llms.txt and the sitemap.
// One source (site.config.ts), three outputs, so they cannot drift from each other or from the page.
import { siteConfig } from "@/site.config";

export const SCHEMA = "https://solvinghealth.com/schemas/agent-manifest-v1";
export const base = () => `https://${siteConfig.domain.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "")}`;

export function agentManifest() {
  const b = base();
  return {
    schema: SCHEMA,
    name: siteConfig.name,
    url: `${b}/`,
    updated: siteConfig.updated,
    summary: siteConfig.description,
    job: siteConfig.job,
    care: true,
    publisher: siteConfig.publisher,
    audience: siteConfig.audience,
    jobs_to_be_done: [
      `Understand what ${siteConfig.name.toLowerCase()} is and which warning signs need care today`,
      "Build and print a list of questions for my next clinic visit, on my own device",
    ],
    actions: [
      {
        id: "visit_questions",
        label: `Pick and print the questions to bring to a visit about ${siteConfig.name.toLowerCase()} (built on the device; nothing stored or sent)`,
        url: `${b}/#visit`,
        method: "GET",
        auth: "none",
        uploads_data: false,
        phi_allowed: false,
        safe_to_hand_to_user: true,
      },
      {
        id: "warning_signs",
        label: `Read the warning signs for ${siteConfig.name.toLowerCase()} and when to seek care (911 and 988 are at the top)`,
        url: `${b}/#warning-signs`,
        method: "GET",
        auth: "none",
        uploads_data: false,
        phi_allowed: false,
        safe_to_hand_to_user: true,
      },
    ],
    facts: {
      sources: siteConfig.sources,
      not_medical_advice: "General information from the named sources. Not a diagnosis and not medical advice; a licensed clinician decides.",
    },
    pollen: { sends: siteConfig.pollen.sends, accepts: siteConfig.pollen.accepts },
    attestation_model:
      "Nothing on this site is signed by a physician. It gives general information and a visit list; a licensed clinician decides. Nothing is billed, diagnosed, or sent from here.",
    llms_txt: `${b}/llms.txt`,
    machine_readable_claims: "none",
  };
}

export function llmsTxt() {
  const b = base();
  const next = siteConfig.next.map((n) => `- ${n.label}: ${n.url}`).join("\n");
  const src = siteConfig.sources.map((s) => `- ${s.name}: ${s.url}`).join("\n") || "- (none listed yet)";
  return `# ${siteConfig.name} — ${siteConfig.tagline}

> ${siteConfig.description}
> Updated ${siteConfig.updated}. Published by ${siteConfig.publisher.name} (${siteConfig.publisher.url}).

## What this site does
${siteConfig.job}

## What a person or an agent can do here (no login, nothing uploaded)
- Warning signs first, with 911 and 988 at the top: ${b}/#warning-signs
- Pick and print questions for the next clinic visit, built on the device: ${b}/#visit
- Machine door: ${b}/.well-known/agent.json (schema ${SCHEMA})

## Where to go next
${next}

## Sources
${src}

## Honest edges
- General information from the sources above. Not a diagnosis and not medical advice; a licensed clinician decides.
- Nothing typed here is stored or sent. The site loads no chat widget and ${siteConfig.analytics ? "one analytics script" : "no analytics script"}.
- If someone may be in danger right now, call 911. If you or someone you love is thinking about suicide or is in crisis, call or text 988 (US).
`;
}

export function sitemapUrls() {
  const b = base();
  return [`${b}/`];
}
