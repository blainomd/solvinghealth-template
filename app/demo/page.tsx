"use client";

import { useState } from "react";

/* ─── Types ─── */
interface JourneyStep {
  time: string;
  site: string;
  siteUrl: string;
  agent?: string;
  action: string;
  detail: string;
  revenue?: string;
  savings?: string;
}

interface PatientJourney {
  id: string;
  name: string;
  age: number;
  condition: string;
  avatar: string;
  color: string;
  tagline: string;
  backstory: string;
  steps: JourneyStep[];
  outcome: { revenue: string; savings: string; timespan: string };
}

/* ─── Journey Data ─── */
const JOURNEYS: PatientJourney[] = [
  {
    id: "levonti",
    name: "Dr. Levonti Ohanessian",
    age: 38,
    condition: "Sports medicine surgeon at Stanford",
    avatar: "LO",
    color: "#1B2A4A",
    tagline: "The surgeon who finds $240K in missed revenue using his phone",
    backstory: "Levonti is a sports medicine surgeon who knows he's leaving money on the table but doesn't have time to figure out where. He hears about Wonder Bill from a colleague.",
    steps: [
      { time: "Day 1", site: "surgeonvalue.com", siteUrl: "https://www.surgeonvalue.com", action: "Visits surgeonvalue.com", detail: "Sees '10 agents. One mission: get you paid.' Clicks 'Try Wonder Bill.' Pastes his last complex case: rotator cuff repair + subacromial decompression + biceps tenodesis. Gets 6 billable codes he only billed 3 for.", revenue: "$312" },
      { time: "Day 1", site: "surgeonvalue.com", siteUrl: "https://www.surgeonvalue.com", agent: "NPI Finder", action: "Finds himself in the NPI database", detail: "Searches his own name. Sees his NPI, specialty, practice address. Clicks 'View Revenue' to start the free panel scan." },
      { time: "Day 1", site: "Claude Desktop", siteUrl: "https://claude.ai", agent: "Wonder Bill", action: "Installs the MCP connector", detail: "Copies the connector config into Claude Desktop. Now he can just TALK to Wonder Bill anytime. 'What can I bill for this?' becomes his most-used phrase." },
      { time: "Day 3", site: "Claude Desktop", siteUrl: "https://claude.ai", agent: "Wonder Bill Stage 1", action: "Optimizes an op note before finalizing", detail: "Pastes tomorrow's op note. Wonder Bill: 'You performed a subacromial decompression but didn't document it separately. Add this sentence to capture CPT 29826. That's $108 you would have missed.'", revenue: "$108" },
      { time: "Day 7", site: "Claude Desktop", siteUrl: "https://claude.ai", agent: "Wonder Bill Stage 2", action: "Voice-to-Bill after surgery", detail: "Walks out of OR, opens Claude on phone (Dispatch): 'I did a total knee, released the MCL, removed loose bodies, injected.' Wonder Bill returns 5 CPT codes. Levonti forwards to his biller.", revenue: "$487" },
      { time: "Day 14", site: "Claude Desktop", siteUrl: "https://claude.ai", agent: "Wonder Bill Stage 3", action: "Biller Advocate fights back", detail: "Biller says she can't code the loose body removal. Levonti tells Wonder Bill. AI drafts an email citing the operative note line 14 and CPT 29874 unbundling guidelines. Biller accepts.", revenue: "$142" },
      { time: "Month 1", site: "Claude Desktop", siteUrl: "https://claude.ai", agent: "Wonder Bill Stage 4", action: "Discrepancy Dashboard reveals pattern", detail: "Wonder Bill compares a month of AI-identified codes vs biller submissions. 23 discrepancies. Pattern: biller consistently drops modifier -59 on distinct procedures. $4,800/month in lost revenue from one systematic error.", revenue: "$4,800/mo" },
      { time: "Month 2", site: "Claude Desktop", siteUrl: "https://claude.ai", agent: "Day Prep", action: "Morning briefing becomes habit", detail: "Every morning at 6am, Levonti gets a briefing: today's OR cases with billing opportunities, clinic patients with E/M suggestions, 3 prior auths expiring this week, and yesterday's Wonder Bill discrepancies." },
      { time: "Month 3", site: "surgeonvalue.com", siteUrl: "https://www.surgeonvalue.com", agent: "Practice Analytics", action: "Revenue dashboard shows the impact", detail: "Levonti's dashboard: revenue per encounter up 34%. Denial rate down 18%. RTM enrollment up from 0 to 47 patients ($2,632/mo recurring). Total new revenue captured: $18,400/month.", revenue: "$18,400/mo" },
      { time: "Month 3", site: "surgeonvalue.com", siteUrl: "https://www.surgeonvalue.com", action: "Tells 3 colleagues at Stanford", detail: "Word spreads in the surgeon lounge. Three colleagues install the connector. Each finds $15K-25K/month in missed revenue. The hospital notices." },
    ],
    outcome: { revenue: "$220,800/yr", savings: "0 (revenue, not savings)", timespan: "One year" },
  },
  {
    id: "derek",
    name: "Dr. Derek Amanatullah",
    age: 45,
    condition: "Joint replacement surgeon at Stanford, Epic EMR",
    avatar: "DA",
    color: "#6D28D9",
    tagline: "The academic surgeon who discovers $180K hiding in his Epic panel",
    backstory: "Derek is a high-volume joint replacement surgeon at Stanford. He's on Epic. He knows his billing could be better but has no time to audit his own panel. He tries the free SurgeonValue scan.",
    steps: [
      { time: "Day 1", site: "surgeonvalue.com", siteUrl: "https://www.surgeonvalue.com", agent: "NPI Finder", action: "Finds himself in the NPI database", detail: "Derek searches his own name on surgeonvalue.com. Finds his NPI, Stanford affiliation, specialty. Clicks 'View Revenue' to start the free panel scan." },
      { time: "Day 1", site: "surgeonvalue.com", siteUrl: "https://www.surgeonvalue.com", agent: "Revenue Scanner", action: "Free panel scan reveals $180K in missed revenue", detail: "The Revenue Scanner analyzes Derek's patient panel: 312 patients. Finds 89 RTM-eligible patients (0 enrolled), 134 CCM-eligible patients (12 enrolled), and systematic undercoding on post-op E/M visits. Total missed: $180K/yr." },
      { time: "Day 3", site: "Claude Desktop", siteUrl: "https://claude.ai", agent: "Wonder Bill", action: "Tests Wonder Bill on yesterday's complex case", detail: "Derek had a revision total knee with hardware removal, bone grafting, and a new implant. His biller coded one line item. Wonder Bill identifies 4 additional billable codes: hardware removal (20680), bone graft (20902), complex revision modifier (-22), and separate wound closure.", revenue: "$1,840" },
      { time: "Week 2", site: "Claude Desktop", siteUrl: "https://claude.ai", agent: "Wonder Bill Stage 5", action: "EMR Suggester catches a pattern in clinic", detail: "Derek sees 22 patients in clinic. Wonder Bill watches his documentation: 'You spent 45 minutes with Mrs. Johnson discussing surgical options, risks, and alternatives. Your note says 99213. That documentation supports 99215. $92 more per visit.' Across 22 patients: $2,024 in one day.", revenue: "$2,024" },
      { time: "Month 1", site: "Claude Desktop", siteUrl: "https://claude.ai", agent: "RTM/CCM Agent", action: "Enrolls first 30 patients in RTM", detail: "The RTM agent identifies 30 post-op patients who qualify for remote therapeutic monitoring. Derek approves enrollment. Each patient generates $107/mo in recurring revenue. Monthly RTM: $3,210.", revenue: "$3,210/mo" },
      { time: "Month 1", site: "Claude Desktop", siteUrl: "https://claude.ai", agent: "Prior Auth Agent", action: "Saves 4 hours/week on prior auths", detail: "Derek's MA was spending 4 hours/week writing prior auth letters. Prior Auth Agent: paste the note, get the letter in 60 seconds. 4 hours → 20 minutes. MA reassigned to patient care.", savings: "4 hrs/week" },
      { time: "Month 2", site: "Claude Desktop", siteUrl: "https://claude.ai", agent: "Wonder Bill Stage 4", action: "Discrepancy Dashboard reveals billing department issues", detail: "Two months of data. Wonder Bill shows: Derek's biller consistently drops modifier -22 on complex revisions and doesn't bill 20680 for hardware removal. Pattern = $4,200/month in systematic underbilling. Derek shows this to his department chair.", revenue: "$4,200/mo" },
      { time: "Month 2", site: "Claude Desktop", siteUrl: "https://claude.ai", agent: "Claim Submission Agent", action: "Clean claims submitted automatically", detail: "The Claim Submission Agent validates every charge against payer-specific rules, formats CMS-1500, and submits to the clearinghouse. Derek's clean claim rate jumps from 87% to 97%. Fewer rejections = faster payment.", revenue: "+$8,400/yr (fewer rework cycles)" },
      { time: "Month 2", site: "Claude Desktop", siteUrl: "https://claude.ai", agent: "Denials Fighter", action: "Overturns 3 denied claims in one week", detail: "United denied a biceps tenodesis (CPT 23430) as 'bundled.' The Denials Fighter drafts an appeal citing Derek's op note line 22 and CCI edit guidelines showing it's separately billable with modifier -59. Overturned in 8 days. Also overturns 2 more for systematic modifier issues.", revenue: "$4,200 recovered" },
      { time: "Month 3", site: "Claude Desktop", siteUrl: "https://claude.ai", agent: "Payment Posting + AR Management", action: "Underpayment pattern discovered", detail: "Payment Posting reconciles 3 months of ERAs. AR Management flags a pattern: Aetna consistently pays 12% below contracted rate for revision total knees (CPT 27447). $18,000 in systematic underpayments identified. Derek's office files for contract compliance review.", revenue: "$18,000 recovered" },
      { time: "Month 3", site: "Claude Desktop", siteUrl: "https://claude.ai", agent: "Patient Billing", action: "Patient collection rate up 23%", detail: "Patient Billing generates clear, jargon-free statements with HSA/FSA badges. 'Your total knee costs you $2,400 out of pocket. With HSA, that's $1,536 after tax savings.' Payment plans offered automatically. ComfortCard HSA integration reduces friction.", revenue: "+$34K/yr patient collections" },
      { time: "Month 3", site: "surgeonvalue.com", siteUrl: "https://www.surgeonvalue.com", agent: "Practice Analytics", action: "Stanford orthopedics department adopts SurgeonValue", detail: "Derek's results: revenue per encounter up 41%, denial rate from 11% to 4%, clean claim rate 97%, patient collection rate up 23%, $18K underpayment recovered, 89 RTM patients enrolled. The department chair asks all 12 surgeons to adopt SurgeonValue.", revenue: "$180K/yr × 12 surgeons" },
    ],
    outcome: { revenue: "$244,600/yr (Derek alone), $2.9M potential (department)", savings: "4 hrs/week MA time + $18K underpayment recovery", timespan: "Three months" },
  },
];

/* ─── Components ─── */

function JourneySelector({ journeys, selected, onSelect }: { journeys: PatientJourney[]; selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {journeys.map((j) => (
        <button
          key={j.id}
          onClick={() => onSelect(j.id)}
          className={`px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
            selected === j.id ? "text-white shadow-lg scale-105" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          style={selected === j.id ? { backgroundColor: j.color } : undefined}
        >
          <span className="mr-2">{j.avatar}</span>
          {j.name}
        </button>
      ))}
    </div>
  );
}

function StepCard({ step, index, color }: { step: JourneyStep; index: number; color: string }) {
  return (
    <div className="flex gap-4 mb-6">
      {/* Timeline */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: color }}>
          {index + 1}
        </div>
        <div className="w-px flex-1 bg-gray-200 mt-2" />
      </div>
      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-gray-400 uppercase">{step.time}</span>
          <a href={step.siteUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-mono px-2 py-0.5 rounded-full hover:opacity-80 text-white" style={{ backgroundColor: color }}>
            {step.site}
          </a>
          {step.agent && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{step.agent}</span>}
        </div>
        <h3 className="font-bold text-gray-900 mb-1">{step.action}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{step.detail}</p>
        {(step.revenue || step.savings) && (
          <div className="flex gap-3 mt-2">
            {step.revenue && <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-lg">+{step.revenue} revenue</span>}
            {step.savings && <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">{step.savings} saved</span>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Page ─── */

export default function DemoPage() {
  const [selectedId, setSelectedId] = useState("levonti");
  const journey = JOURNEYS.find((j) => j.id === selectedId) || JOURNEYS[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="https://www.solvinghealth.com" className="font-bold text-gray-900">SolvingHealth</a>
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Patient Journey Demo</span>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
          Watch the ecosystem work.
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-10">
          Real surgeons. Real revenue. See exactly how Wonder Bill finds the money you earned.
        </p>
        <JourneySelector journeys={JOURNEYS} selected={selectedId} onSelect={setSelectedId} />
      </section>

      {/* Journey */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        {/* Patient card */}
        <div className="rounded-2xl p-6 mb-10 border" style={{ borderColor: journey.color + "30", backgroundColor: journey.color + "08" }}>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold" style={{ backgroundColor: journey.color }}>
              {journey.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{journey.name}, {journey.age}</h2>
              <p className="text-sm text-gray-500">{journey.condition}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 italic mb-3">{journey.tagline}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{journey.backstory}</p>
        </div>

        {/* Timeline */}
        {journey.steps.map((step, i) => (
          <StepCard key={i} step={step} index={i} color={journey.color} />
        ))}

        {/* Outcome */}
        <div className="rounded-2xl p-8 text-center text-white mt-8" style={{ backgroundColor: journey.color }}>
          <h3 className="text-xl font-bold mb-6">Outcome after {journey.outcome.timespan}</h3>
          <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto">
            <div>
              <p className="text-3xl font-bold">{journey.outcome.revenue}</p>
              <p className="text-white/60 text-xs mt-1">Revenue generated</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{journey.outcome.savings}</p>
              <p className="text-white/60 text-xs mt-1">Savings for family</p>
            </div>
          </div>
        </div>

        {/* Explore links */}
        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm mb-4">Every site in this journey is live right now.</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {Array.from(new Set(journey.steps.filter(s => s.siteUrl.startsWith("https://www.")).map(s => s.site))).map((site) => {
              const step = journey.steps.find(s => s.site === site);
              return (
                <a key={site} href={step?.siteUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-mono px-3 py-1.5 rounded-full text-white hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: journey.color }}>
                  {site}
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
