/**
 * GET /api/referral/[code]
 *
 * Looks up a referral code. Used on landing pages to validate
 * the ?ref=CODE parameter and display the referrer's handle.
 *
 * Returns: { valid: boolean, handle?: string, referrer_id?: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  if (!code) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const { data, error } = await getSupabase()
    .from("invite_referrals")
    .select("user_id, handle, uses")
    .eq("code", code)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({
    valid: true,
    handle: data.handle || null,
    referrer_id: data.user_id,
    uses: data.uses,
  });
}
