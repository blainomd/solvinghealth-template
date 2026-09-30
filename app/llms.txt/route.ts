// GET /llms.txt — what an AI agent may do here, built from site.config.ts (see lib/manifest.ts).
import { llmsTxt } from "@/lib/manifest";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=300" },
  });
}
