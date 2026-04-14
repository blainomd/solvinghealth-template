/**
 * POST /api/referral/convert
 *
 * Records a conversion and credits the referrer.
 * Called server-side at the moment a paid signup or key action completes.
 *
 * Body:
 *   code           — the referral code from cookie/param
 *   converted_user — uuid of the newly converted user
 *   product        — 'coop_care' | 'hsa_letter' | 'surgeon_value' | 'chanio' | 'general'
 *   site           — hostname of the converting site (e.g. 'co-op.care')
 *
 * Returns: { ok: boolean, credit?: object, conversion_id?: string, error?: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const VALID_PRODUCTS = ["coop_care", "hsa_letter", "surgeon_value", "chanio", "general"] as const;
type Product = (typeof VALID_PRODUCTS)[number];

export async function POST(req: NextRequest) {
  try {
    const { code, converted_user, product, site } = await req.json();

    if (!code || !converted_user || !product || !site) {
      return NextResponse.json(
        { ok: false, error: "code, converted_user, product, and site are required" },
        { status: 400 }
      );
    }

    if (!VALID_PRODUCTS.includes(product as Product)) {
      return NextResponse.json(
        { ok: false, error: `product must be one of: ${VALID_PRODUCTS.join(", ")}` },
        { status: 400 }
      );
    }

    const { data, error } = await getSupabase().rpc("record_invite_conversion", {
      p_code: code,
      p_converted_user: converted_user,
      p_product: product,
      p_site: site,
    });

    if (error) {
      console.error("convert rpc error:", error);
      return NextResponse.json({ ok: false, error: "Conversion failed" }, { status: 500 });
    }

    // data is the jsonb returned by the function
    return NextResponse.json(data);
  } catch (err) {
    console.error("referral/convert error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
