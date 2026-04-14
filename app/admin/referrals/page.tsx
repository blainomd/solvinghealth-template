"use client";

export const dynamic = "force-dynamic";

/**
 * /admin/referrals
 *
 * Password-protected admin view. All sensitive operations (approve, deny)
 * go through the Supabase service-role API routes, not direct client calls.
 *
 * Access: set NEXT_PUBLIC_ADMIN_PASSWORD in env. The password check is
 * client-side only — this is a lightweight internal tool, not a hardened
 * admin panel. For production, add Supabase Auth + RBAC.
 */

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

interface Referral {
  id: string;
  code: string;
  handle: string | null;
  uses: number;
  credits_earned: Record<string, number>;
  created_at: string;
  last_used_at: string | null;
}

interface Conversion {
  id: string;
  referral_id: string;
  product: string;
  site: string;
  credit_given: Record<string, number>;
  approved: boolean;
  created_at: string;
}

const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "sh-admin-2026";

const PRODUCT_LABELS: Record<string, string> = {
  coop_care: "co-op.care",
  hsa_letter: "HSA Letter",
  surgeon_value: "SurgeonValue",
  chanio: "chanio",
  general: "General",
};

function CreditBadge({ credits }: { credits: Record<string, number> }) {
  const parts: string[] = [];
  if (credits.care_hours) parts.push(`${credits.care_hours} Care Hrs`);
  if (credits.hsa_credit) parts.push(`$${credits.hsa_credit} HSA`);
  if (credits.sv_months) parts.push(`${credits.sv_months}mo SV`);
  if (credits.chanio_months) parts.push(`${credits.chanio_months}mo chanio`);
  if (!parts.length) return <span style={{ color: "#9ca3af" }}>—</span>;
  return (
    <span
      style={{
        fontSize: "11px",
        background: "#f0fafa",
        color: "#0D7377",
        padding: "2px 8px",
        borderRadius: "10px",
        fontWeight: 600,
      }}
    >
      {parts.join(", ")}
    </span>
  );
}

export default function AdminReferrals() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"referrals" | "conversions">("conversions");
  const [approving, setApproving] = useState<string | null>(null);

  function checkPw() {
    if (pw === ADMIN_PASS) {
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  }

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    Promise.all([
      sb
        .from("invite_referrals")
        .select("*")
        .order("uses", { ascending: false })
        .limit(100),
      sb
        .from("invite_conversions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
    ]).then(([r, c]) => {
      setReferrals((r.data as Referral[]) ?? []);
      setConversions((c.data as Conversion[]) ?? []);
      setLoading(false);
    });
  }, [authed]);

  function getSb() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  async function approveConversion(id: string) {
    setApproving(id);
    await getSb()
      .from("invite_conversions")
      .update({ approved: true })
      .eq("id", id);
    setConversions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, approved: true } : c))
    );
    setApproving(null);
  }

  async function denyConversion(id: string) {
    setApproving(id);
    await getSb()
      .from("invite_conversions")
      .delete()
      .eq("id", id);
    setConversions((prev) => prev.filter((c) => c.id !== id));
    setApproving(null);
  }

  const pendingConversions = conversions.filter((c) => !c.approved);
  const approvedConversions = conversions.filter((c) => c.approved);

  if (!authed) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, system-ui, sans-serif",
          background: "#f9fafb",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "36px 32px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            width: "320px",
          }}
        >
          <h1 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: 700, color: "#1B2A4A" }}>
            Admin — Referrals
          </h1>
          <input
            type="password"
            placeholder="Admin password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkPw()}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: pwError ? "1px solid #ef4444" : "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              boxSizing: "border-box",
              marginBottom: "12px",
              outline: "none",
            }}
          />
          {pwError && (
            <p style={{ margin: "0 0 12px", fontSize: "12px", color: "#ef4444" }}>
              Incorrect password
            </p>
          )}
          <button
            onClick={checkPw}
            style={{
              width: "100%",
              padding: "10px",
              background: "#1B2A4A",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "Inter, system-ui, sans-serif",
        background: "#f9fafb",
        padding: "0 0 80px",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#1B2A4A",
          color: "#fff",
          padding: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>Referral Admin</h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#94a3b8" }}>
            {referrals.length} referrers · {pendingConversions.length} pending approvals
          </p>
        </div>
        <a
          href="/referrals"
          style={{ color: "#0D7377", fontSize: "13px", textDecoration: "none", fontWeight: 500 }}
        >
          Public leaderboard
        </a>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 16px 0" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
          {(["conversions", "referrals"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 18px",
                borderRadius: "6px",
                border: "none",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                background: activeTab === tab ? "#1B2A4A" : "#fff",
                color: activeTab === tab ? "#fff" : "#6b7280",
                boxShadow: activeTab === tab ? "none" : "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              {tab === "conversions"
                ? `Conversions (${conversions.length})`
                : `Referrers (${referrals.length})`}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
            Loading...
          </div>
        )}

        {/* CONVERSIONS TAB */}
        {!loading && activeTab === "conversions" && (
          <div>
            {pendingConversions.length > 0 && (
              <div style={{ marginBottom: "28px" }}>
                <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#B45309", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Pending approval ({pendingConversions.length})
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {pendingConversions.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        background: "#fffbeb",
                        border: "1px solid #FDE68A",
                        borderRadius: "8px",
                        padding: "14px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: "200px" }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#1B2A4A" }}>
                          {PRODUCT_LABELS[c.product] ?? c.product}
                          <span style={{ fontWeight: 400, color: "#9ca3af", marginLeft: "6px" }}>
                            via {c.site}
                          </span>
                        </div>
                        <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "3px" }}>
                          {new Date(c.created_at).toLocaleDateString()} ·{" "}
                          <CreditBadge credits={c.credit_given} />
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => approveConversion(c.id)}
                          disabled={approving === c.id}
                          style={{
                            padding: "6px 14px",
                            background: "#0D7377",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            opacity: approving === c.id ? 0.6 : 1,
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => denyConversion(c.id)}
                          disabled={approving === c.id}
                          style={{
                            padding: "6px 14px",
                            background: "#fff",
                            color: "#ef4444",
                            border: "1px solid #fca5a5",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            opacity: approving === c.id ? 0.6 : 1,
                          }}
                        >
                          Deny
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {approvedConversions.length > 0 && (
              <div>
                <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#374151", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Approved ({approvedConversions.length})
                </h2>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                  }}
                >
                  {approvedConversions.map((c, i) => (
                    <div
                      key={c.id}
                      style={{
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        borderBottom: i < approvedConversions.length - 1 ? "1px solid #f3f4f6" : "none",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: "160px" }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#1B2A4A" }}>
                          {PRODUCT_LABELS[c.product] ?? c.product}
                          <span style={{ fontWeight: 400, color: "#9ca3af", marginLeft: "6px" }}>
                            via {c.site}
                          </span>
                        </div>
                        <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>
                          {new Date(c.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <CreditBadge credits={c.credit_given} />
                      <span
                        style={{
                          fontSize: "11px",
                          background: "#f0fdf4",
                          color: "#16a34a",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          fontWeight: 600,
                        }}
                      >
                        approved
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {conversions.length === 0 && !loading && (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af", fontSize: "14px" }}>
                No conversions yet.
              </div>
            )}
          </div>
        )}

        {/* REFERRERS TAB */}
        {!loading && activeTab === "referrals" && (
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            }}
          >
            {referrals.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af", fontSize: "14px" }}>
                No referrers yet.
              </div>
            )}
            {referrals.map((r, i) => (
              <div
                key={r.id}
                style={{
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  borderBottom: i < referrals.length - 1 ? "1px solid #f3f4f6" : "none",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: "180px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#1B2A4A" }}>
                    {r.handle || <span style={{ color: "#9ca3af", fontStyle: "italic" }}>anonymous</span>}
                  </div>
                  <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px", fontFamily: "monospace" }}>
                    {r.code}
                  </div>
                </div>
                <div style={{ fontSize: "13px", color: "#374151" }}>
                  {r.uses} {r.uses === 1 ? "use" : "uses"}
                </div>
                <CreditBadge credits={r.credits_earned} />
                <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                  {r.last_used_at ? `Last: ${new Date(r.last_used_at).toLocaleDateString()}` : "unused"}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
