"use client";

/**
 * RefTracker
 *
 * Invisible component mounted in the root layout on every site.
 * Responsibilities:
 *
 *   1. On mount, reads ?ref=CODE from the URL and stores it in a cookie
 *      (sh_ref, 30 days). This persists the referral code through the
 *      user's browsing session until they convert.
 *
 *   2. Exposes a global helper `window.shRecordConversion(product)` that
 *      sites call at the moment of a paid signup / key action:
 *
 *        window.shRecordConversion('coop_care')
 *        window.shRecordConversion('hsa_letter')
 *        window.shRecordConversion('surgeon_value')
 *        window.shRecordConversion('chanio')
 *        window.shRecordConversion('general')
 *
 *   3. If the user has a Supabase session (sh_uid cookie or localStorage),
 *      the conversion is attributed server-side via /api/referral/convert.
 *
 * Usage — call window.shRecordConversion(product) anywhere on the page
 * when a conversion completes (e.g. after Stripe webhook or inline confirm).
 */

import { useEffect } from "react";

const COOKIE_NAME = "sh_ref";
const COOKIE_DAYS = 30;

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function RefTracker() {
  useEffect(() => {
    // Step 1: capture ?ref=CODE
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setCookie(COOKIE_NAME, ref, COOKIE_DAYS);
    }

    // Step 2: expose global conversion helper
    (window as Window & { shRecordConversion?: (product: string) => void }).shRecordConversion =
      async function (product: string) {
        const code = getCookie(COOKIE_NAME);
        if (!code) return; // no referral in this session

        // Try to get user id from localStorage (Supabase SSO)
        let userId: string | null = null;
        try {
          const raw = localStorage.getItem(
            `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0]}-auth-token`
          );
          if (raw) {
            const parsed = JSON.parse(raw);
            userId = parsed?.user?.id ?? null;
          }
        } catch {
          // not logged in or no Supabase session — that's fine
        }

        if (!userId) return; // can't attribute without a user id

        try {
          await fetch("/api/referral/convert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code,
              converted_user: userId,
              product,
              site: window.location.hostname.replace(/^www\./, ""),
            }),
          });
        } catch (e) {
          console.warn("[sh-referral] conversion error", e);
        }
      };

    return () => {
      delete (window as Window & { shRecordConversion?: unknown }).shRecordConversion;
    };
  }, []);

  return null;
}
