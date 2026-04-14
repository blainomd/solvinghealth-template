"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";

interface LeaderboardEntry {
  rank: number;
  handle: string;
  uses: number;
  care_hours: number;
}

interface Totals {
  conversions: number;
  referrers: number;
  by_product: Record<string, number>;
}

const PRODUCT_LABELS: Record<string, string> = {
  coop_care: "co-op.care members",
  hsa_letter: "HSA letters",
  surgeon_value: "SurgeonValue practices",
  chanio: "chanio subscribers",
  general: "general signups",
};

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B7791F" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  if (rank === 2)
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  if (rank === 3)
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  return <span style={{ color: "#9CA3AF", fontSize: "13px", fontWeight: 500 }}>{rank}</span>;
}

export default function ReferralsPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/referral/leaderboard")
      .then((r) => r.json())
      .then((d) => {
        setLeaderboard(d.leaderboard ?? []);
        setTotals(d.totals ?? null);
      })
      .finally(() => setLoading(false));
  }, []);

  const productRows = totals
    ? Object.entries(totals.by_product)
        .sort((a, b) => b[1] - a[1])
        .filter(([, v]) => v > 0)
    : [];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "0 0 80px",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#1B2A4A",
          color: "#fff",
          padding: "40px 24px 36px",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: "0 0 8px", fontSize: "26px", fontWeight: 700 }}>
          Neighbors helping neighbors find care
        </h1>
        <p style={{ margin: 0, fontSize: "15px", color: "#94a3b8", maxWidth: "480px", marginLeft: "auto", marginRight: "auto" }}>
          Every person here found their way through someone who cared enough to share a link.
        </p>
      </div>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 16px" }}>

        {/* Live totals */}
        {totals && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              margin: "28px 0 24px",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "10px",
                padding: "20px",
                textAlign: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              }}
            >
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#0D7377" }}>
                {loading ? "—" : totals.conversions.toLocaleString()}
              </div>
              <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
                people found through a neighbor&rsquo;s referral
              </div>
            </div>
            <div
              style={{
                background: "#fff",
                borderRadius: "10px",
                padding: "20px",
                textAlign: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              }}
            >
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#1B2A4A" }}>
                {loading ? "—" : totals.referrers.toLocaleString()}
              </div>
              <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
                neighbors who have shared a link
              </div>
            </div>
          </div>
        )}

        {/* Breakdown by product */}
        {productRows.length > 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "24px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            }}
          >
            <h2 style={{ margin: "0 0 14px", fontSize: "14px", fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Where they landed
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {productRows.map(([product, count]) => (
                <div
                  key={product}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span style={{ fontSize: "14px", color: "#374151" }}>
                    {PRODUCT_LABELS[product] ?? product}
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#0D7377",
                      background: "#f0fafa",
                      padding: "2px 10px",
                      borderRadius: "12px",
                    }}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
          }}
        >
          <h2 style={{ margin: "0 0 4px", fontSize: "17px", fontWeight: 700, color: "#1B2A4A" }}>
            Top connectors
          </h2>
          <p style={{ margin: "0 0 18px", fontSize: "13px", color: "#9ca3af" }}>
            Handles are anonymized. Care Hours shown are accumulated lifetime credit.
          </p>

          {loading && (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af", fontSize: "14px" }}>
              Loading...
            </div>
          )}

          {!loading && leaderboard.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af", fontSize: "14px" }}>
              No referrals yet. Be the first to share.
            </div>
          )}

          {!loading && leaderboard.length > 0 && (
            <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {leaderboard.map((entry) => (
                <li
                  key={entry.rank}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 0",
                    borderBottom: entry.rank < leaderboard.length ? "1px solid #f3f4f6" : "none",
                  }}
                >
                  <div style={{ width: "24px", textAlign: "center", flexShrink: 0 }}>
                    <RankIcon rank={entry.rank} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#1B2A4A" }}>
                      {entry.handle}
                    </div>
                    <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
                      {entry.uses} {entry.uses === 1 ? "person" : "people"} reached
                    </div>
                  </div>
                  {entry.care_hours > 0 && (
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#0D7377",
                        background: "#f0fafa",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        flexShrink: 0,
                      }}
                    >
                      {entry.care_hours} Care {entry.care_hours === 1 ? "Hour" : "Hours"}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* How it works */}
        <div style={{ marginTop: "28px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#374151", marginBottom: "14px" }}>
            How it works
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: "co-op.care member joins", credit: "5 Care Hours (worth $50)" },
              { label: "HSA letter purchased", credit: "$25 credit toward your own letter" },
              { label: "SurgeonValue practice signs up", credit: "1 month free subscription" },
              { label: "chanio Pro subscription", credit: "1 month chanio Pro free" },
              { label: "Any other signup", credit: "1 Care Hour" },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px",
                  fontSize: "13px",
                }}
              >
                <span style={{ color: "#374151" }}>{row.label}</span>
                <span style={{ color: "#0D7377", fontWeight: 600, textAlign: "right", flexShrink: 0 }}>
                  {row.credit}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
