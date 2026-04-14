/**
 * POST /api/referral/create
 *
 * Generates a unique invite code for a user.
 * If the user already has a code, returns the existing one.
 *
 * Body: { user_id: string, handle?: string }
 * Returns: { code: string, url: string, credits_earned: object, uses: number }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function generateCode(userId: string): string {
  // 8-char alphanumeric — short enough to share, unique enough not to collide
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  const seed = userId.replace(/-/g, "").slice(0, 8);
  let code = "";
  for (let i = 0; i < 8; i++) {
    const idx = parseInt(seed[i] || "0", 16) % chars.length;
    code += chars[idx];
  }
  // Append random suffix to avoid deterministic collisions
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(req: NextRequest) {
  try {
    const { user_id, handle } = await req.json();

    if (!user_id) {
      return NextResponse.json({ error: "user_id required" }, { status: 400 });
    }

    // Check if user already has a code
    const { data: existing } = await getSupabase()
      .from("invite_referrals")
      .select("code, uses, credits_earned")
      .eq("user_id", user_id)
      .maybeSingle();

    if (existing) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://solvinghealth.com";
      return NextResponse.json({
        code: existing.code,
        url: `${baseUrl}?ref=${existing.code}`,
        credits_earned: existing.credits_earned,
        uses: existing.uses,
        existing: true,
      });
    }

    // Create a new code — retry on collision (extremely rare)
    let code = generateCode(user_id);
    let attempts = 0;
    while (attempts < 5) {
      const { data: collision } = await getSupabase()
        .from("invite_referrals")
        .select("id")
        .eq("code", code)
        .maybeSingle();
      if (!collision) break;
      code = generateCode(user_id + attempts);
      attempts++;
    }

    const { data, error } = await getSupabase()
      .from("invite_referrals")
      .insert({
        user_id,
        code,
        handle: handle || null,
      })
      .select("code, uses, credits_earned")
      .single();

    if (error) {
      console.error("create referral error:", error);
      return NextResponse.json({ error: "Could not create referral" }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://solvinghealth.com";
    return NextResponse.json({
      code: data.code,
      url: `${baseUrl}?ref=${data.code}`,
      credits_earned: data.credits_earned,
      uses: data.uses,
      existing: false,
    });
  } catch (err) {
    console.error("referral/create error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
