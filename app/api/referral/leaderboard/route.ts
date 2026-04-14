/**
 * GET /api/referral/leaderboard
 *
 * Returns the top 20 referrers (anonymized) and ecosystem totals.
 * Public endpoint — no auth required.
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export const revalidate = 60; // ISR: re-fetch every 60 seconds

export async function GET() {
  try {
    // Top 20 by uses
    const { data: top, error: topErr } = await getSupabase()
      .from("invite_referrals")
      .select("handle, uses, credits_earned")
      .gt("uses", 0)
      .order("uses", { ascending: false })
      .limit(20);

    if (topErr) throw topErr;

    // Ecosystem totals
    const { data: totals, error: totalsErr } = await getSupabase()
      .from("invite_conversions")
      .select("product", { count: "exact", head: false });

    if (totalsErr) throw totalsErr;

    const totalConversions = totals?.length ?? 0;

    const byProduct = (totals ?? []).reduce(
      (acc: Record<string, number>, row: { product: string }) => {
        acc[row.product] = (acc[row.product] ?? 0) + 1;
        return acc;
      },
      {}
    );

    // Total unique referrers
    const { count: totalReferrers } = await getSupabase()
      .from("invite_referrals")
      .select("id", { count: "exact", head: true })
      .gt("uses", 0);

    return NextResponse.json({
      leaderboard: (top ?? []).map((row, i) => ({
        rank: i + 1,
        handle: row.handle || `neighbor-${i + 1}`,
        uses: row.uses,
        care_hours: row.credits_earned?.care_hours ?? 0,
      })),
      totals: {
        conversions: totalConversions,
        referrers: totalReferrers ?? 0,
        by_product: byProduct,
      },
    });
  } catch (err) {
    console.error("leaderboard error:", err);
    return NextResponse.json({ leaderboard: [], totals: { conversions: 0, referrers: 0, by_product: {} } });
  }
}
