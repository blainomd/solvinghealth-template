// GET /.well-known/agent.json — the machine door, built from site.config.ts (see lib/manifest.ts).
import { agentManifest } from "@/lib/manifest";

export const dynamic = "force-static";

export function GET() {
  return new Response(JSON.stringify(agentManifest(), null, 2) + "\n", {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "cache-control": "public, max-age=300",
    },
  });
}
