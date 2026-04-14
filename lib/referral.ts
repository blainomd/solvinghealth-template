/**
 * lib/referral.ts
 *
 * Shared referral utilities. Import on the client side.
 *
 * Key patterns:
 *
 *   // On conversion (e.g. after Stripe success page):
 *   import { recordConversion } from "@/lib/referral";
 *   await recordConversion("coop_care", userId);
 *
 *   // Create/fetch a user's own invite code:
 *   import { getOrCreateReferral } from "@/lib/referral";
 *   const { code, url, uses, credits_earned } = await getOrCreateReferral(userId);
 *
 *   // Sage prompt text to show after login when user has referral credits:
 *   import { sageReferralPrompt } from "@/lib/referral";
 *   const msg = sageReferralPrompt(credits_earned);
 *   if (msg) showSageMessage(msg); // show once per session
 */

const API_BASE = "/api/referral";
const COOKIE_NAME = "sh_ref";

// ── Cookie helpers ────────────────────────────────────────────────────────────

export function getRefCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearRefCookie() {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// ── API calls ─────────────────────────────────────────────────────────────────

export interface ReferralData {
  code: string;
  url: string;
  uses: number;
  credits_earned: {
    care_hours: number;
    hsa_credit: number;
    sv_months: number;
    chanio_months: number;
  };
  existing: boolean;
}

export async function getOrCreateReferral(
  userId: string,
  handle?: string
): Promise<ReferralData | null> {
  try {
    const res = await fetch(`${API_BASE}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, handle }),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function validateCode(
  code: string
): Promise<{ valid: boolean; handle?: string | null; referrer_id?: string } | null> {
  try {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(code)}`);
    return res.json();
  } catch {
    return null;
  }
}

export type Product =
  | "coop_care"
  | "hsa_letter"
  | "surgeon_value"
  | "chanio"
  | "general";

export async function recordConversion(
  product: Product,
  convertedUserId: string
): Promise<{ ok: boolean; credit?: Record<string, number> }> {
  const code = getRefCookie();
  if (!code) return { ok: false };

  try {
    const res = await fetch(`${API_BASE}/convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        converted_user: convertedUserId,
        product,
        site:
          typeof window !== "undefined"
            ? window.location.hostname.replace(/^www\./, "")
            : "unknown",
      }),
    });
    const data = await res.json();
    if (data.ok) clearRefCookie(); // prevent double-attribution
    return data;
  } catch {
    return { ok: false };
  }
}

// ── Sage integration ──────────────────────────────────────────────────────────

const SAGE_SESSION_KEY = "sh_sage_ref_shown";

/**
 * Returns a one-time Sage message to show when a logged-in user has
 * referral credits. Returns null if already shown this session or no credits.
 */
export function sageReferralPrompt(
  credits: ReferralData["credits_earned"]
): string | null {
  if (typeof sessionStorage === "undefined") return null;
  if (sessionStorage.getItem(SAGE_SESSION_KEY)) return null;

  const careHours = credits?.care_hours ?? 0;
  const hsaCredit = credits?.hsa_credit ?? 0;
  const svMonths = credits?.sv_months ?? 0;

  if (!careHours && !hsaCredit && !svMonths) return null;

  sessionStorage.setItem(SAGE_SESSION_KEY, "1");

  const parts: string[] = [];
  if (careHours)
    parts.push(`${careHours} Care Hour${careHours !== 1 ? "s" : ""} (worth $${careHours * 10})`);
  if (hsaCredit) parts.push(`$${hsaCredit} toward your next HSA letter`);
  if (svMonths) parts.push(`${svMonths} month${svMonths !== 1 ? "s" : ""} of SurgeonValue`);

  return `You have ${parts.join(" and ")} from people you helped find this. Want to use them?`;
}

/**
 * Reward structure (for display in UI).
 * Keeping this in one place so copy stays consistent across all sites.
 */
export const REWARD_STRUCTURE = [
  {
    product: "coop_care" as Product,
    label: "Someone joins co-op.care",
    credit: "5 Care Hours (worth $50)",
  },
  {
    product: "hsa_letter" as Product,
    label: "Someone gets an HSA letter",
    credit: "$25 toward your own letter",
  },
  {
    product: "surgeon_value" as Product,
    label: "A practice joins SurgeonValue",
    credit: "1 month free subscription",
  },
  {
    product: "chanio" as Product,
    label: "Someone subscribes to chanio Pro",
    credit: "1 month chanio Pro free",
  },
  {
    product: "general" as Product,
    label: "Any other signup",
    credit: "1 Care Hour",
  },
] as const;
