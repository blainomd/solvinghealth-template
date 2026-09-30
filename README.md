# SolvingHealth flower template

A forkable Next.js site for a health condition that is a complete **flower** in the SolvingHealth network: a person, or an agent acting for one, can walk in, do one real thing on the device, and leave knowing where to go next. The standard it follows is public: https://solvinghealth.com/build#flower

## Three steps

1. **Fork this repo.**
2. **Edit `site.config.ts`**: name, domain, job, publisher, colors, warning signs, the visit questions, sources, where a visitor goes next. That is the entire customization surface; the page, `/.well-known/agent.json`, `/llms.txt`, `/sitemap.xml` and `/robots.txt` all read from it.
3. **Deploy** (Vercel or any Node host), then check it from your machine:
   ```bash
   curl -O https://solvinghealth.com/sdk/flower-check.mjs
   node flower-check.mjs yourdomain.com     # zero dependencies, Node 18+, public GETs only
   ```
   Exit 0 means the shape is right. Then walk through it yourself on a phone: a good path, a bad path, and an empty submit that must not show success.

## What you get

- A condition page: warning signs first, with 911 and 988 at the top; what to know; sources.
- **The nectar:** a "questions to bring to your visit" list the visitor ticks, adds to, prints or copies. Built in the browser; nothing is stored or sent.
- **The machine door:** `/.well-known/agent.json` (validates against https://solvinghealth.com/schemas/agent-manifest-v1), `/llms.txt`, `/sitemap.xml`, `/robots.txt`, all generated from `site.config.ts`.
- **Pollen** (optional): declare `sends` / `accepts` in `site.config.ts` using only kinds from https://solvinghealth.com/schemas/pollen-kinds-v1.json, once your site actually hands a result on or takes one in.
- No chat widget, no shared footer script, no referral tracker, and no analytics unless you set `analytics: true`.

## What is deliberately not here

- No AI endpoint. The earlier version sent uploaded reports to a model with no gate in front of it; that is gone. If you add a model behind a page, put a fail-closed gate between it and any action: https://github.com/blainomd/harness-gate (Apache-2.0).
- No referral or invite program, no credits, no leaderboard. A flower earns its place by what a visitor can do there, not by who it sends where.
- No prices, no "free", no claims about physicians, coverage or money that are not true on your own page.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000. `npm run build` must pass before you deploy.

## Stack

Next.js 16 · React 19 · Tailwind CSS 4 · TypeScript

## License

Apache License 2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE): the license covers the code, not the SolvingHealth name; a site built from this template carries its own name.
