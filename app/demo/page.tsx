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
    id: "dorothy",
    name: "Dorothy Warkentine",
    age: 78,
    condition: "Bilateral knee OA + A-fib + Hypertension",
    avatar: "DW",
    color: "#0D7377",
    tagline: "The grandmother who brings her whole family into the ecosystem",
    backstory: "Dorothy's hip has been hurting for months. Her daughter Sarah searches online and finds hippain.help. What happens next brings three generations into co-op.care.",
    steps: [
      { time: "Day 1", site: "hippain.help", siteUrl: "https://www.hippain.help", action: "Sarah searches 'hip pain help' for her mom", detail: "Finds hippain.help. Talks to Sage about Dorothy's symptoms. Sage asks smart questions about duration, severity, morning stiffness. Recommends seeing an orthopedic specialist." },
      { time: "Day 1", site: "hippain.help", siteUrl: "https://www.hippain.help", agent: "Doctor Visit Companion", action: "Prepares doctor visit card", detail: "Sarah fills out the symptom picker: bilateral knee OA, 6+ months, severity 7/10. Generates a printable card with questions to ask the orthopedic surgeon." },
      { time: "Day 1", site: "hippain.help", siteUrl: "https://www.hippain.help", agent: "NPI Specialist Finder", action: "Finds Dr. Chen in Boulder", detail: "Searches NPI database for orthopedic surgeons in Boulder, CO. Finds Dr. Lisa Chen, MD at Boulder Orthopedics. Click to call." },
      { time: "Day 3", site: "hippain.help", siteUrl: "https://www.hippain.help", action: "Buys a TENS unit from product recommendations", detail: "The site recommended a TENS unit ($35, HSA-eligible). Sarah buys it on Amazon. Sees 'Save 28-36% with HSA via ComfortCard' badge.", savings: "$10.50" },
      { time: "Day 7", site: "comfortcard.org", siteUrl: "https://www.comfortcard.org", action: "Creates Dorothy's ComfortCard", detail: "Sarah creates a ComfortCard for Dorothy. Connects via MyChart (FHIR pull): meds, allergies, conditions auto-populate. Then Sage asks the human questions: 'What makes Dorothy feel safe? Who speaks for her?'", },
      { time: "Day 7", site: "comfortcard.org", siteUrl: "https://www.comfortcard.org", action: "Records the doctor visit", detail: "After seeing Dr. Chen: diagnosis is bilateral knee OA, grade 3. PT 2x/week recommended. Sarah records this in the Doctor Visit Companion. Saved to Dorothy's ComfortCard." },
      { time: "Day 10", site: "co-op.care", siteUrl: "https://www.co-op.care", action: "Sarah discovers co-op.care membership", detail: "The ComfortCard footer links to co-op.care. Sarah sees: $59/mo includes companion care, HSA savings, caregiver matching. The HSA calculator shows $936/yr in savings. The membership pays for itself.", savings: "$936/yr" },
      { time: "Day 14", site: "co-op.care", siteUrl: "https://www.co-op.care", agent: "LMN Generator", action: "Josh Emdur DO generates an LMN", detail: "Josh reviews Dorothy's conditions (knee OA + A-fib + HTN) and signs a Letter of Medical Necessity. Dorothy's companion care, PT exercises, and TENS unit are now HSA-eligible.", revenue: "$199", savings: "$936/yr" },
      { time: "Day 21", site: "co-op.care", siteUrl: "https://www.co-op.care", agent: "Caregiver Match", action: "Maria Santos assigned as caregiver", detail: "Maria is a W-2 caregiver-owner earning $28/hr + equity. She starts 3x/week: medication management, PT exercises, walks with Biscuit. She teaches Tuesday yoga too." },
      { time: "Day 30", site: "comfortcard.org", siteUrl: "https://www.comfortcard.org", action: "Dorothy's ComfortCard saves her in the ER", detail: "Dorothy falls at home. Paramedic scans her ComfortCard QR code from Apple Wallet. Sees allergies (Penicillin - anaphylaxis), meds (Eliquis - blood thinner), emergency contact (Sarah). 2-second access. No login needed." },
      { time: "Month 3", site: "surgeonvalue.com", siteUrl: "https://www.surgeonvalue.com", agent: "Wonder Bill", action: "Dr. Chen captures $4,200 in missed revenue", detail: "Dr. Chen installs the SurgeonValue connector. Wonder Bill scans her panel: Dorothy qualifies for RTM ($56/mo), CCM ($64/mo), and PCM. Three codes she wasn't billing. Across her panel of 250 patients: $240K/yr in missed revenue.", revenue: "$4,200/yr" },
      { time: "Christmas", site: "comfortcard.org", siteUrl: "https://www.comfortcard.org", action: "Sarah gives the grandkids ComfortCard gifts", detail: "Sarah buys ComfortCard Christmas gifts for Dorothy's grandkids. Each gift opens a Trump Account ($500) + a ComfortCard with allergies and emergency info + a recorded story from Dorothy via Sage. The $500 grows to $12,000 by the time they need hip surgery.", savings: "$12,000+" },
    ],
    outcome: { revenue: "$4,399+", savings: "$13,946+", timespan: "One year" },
  },
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
    id: "jamie",
    name: "Jamie Morrison",
    age: 29,
    condition: "Concertgoer in Boulder, CO",
    avatar: "JM",
    color: "#8B5CF6",
    tagline: "The fan who never pays scalper prices again",
    backstory: "Jamie loves live music but is tired of paying 2-3x face value on StubHub. She discovers opusocial.com and connects her Spotify.",
    steps: [
      { time: "Day 1", site: "opusocial.com", siteUrl: "https://www.opusocial.com", action: "Connects Spotify", detail: "Jamie clicks 'Connect Spotify' on opusocial.com. Her top artists populate: Khruangbin, Tame Impala, LCD Soundsystem, Adrianne Lenker, Japanese Breakfast. Taste Score: 94." },
      { time: "Day 1", site: "opusocial.com", siteUrl: "https://www.opusocial.com", action: "Concert feed appears", detail: "5 upcoming shows near Boulder, ranked by affinity score. Khruangbin at Red Rocks (98 affinity, $65 face value). She would have paid $180 on StubHub.", savings: "$115" },
      { time: "Day 7", site: "opusocial.com", siteUrl: "https://www.opusocial.com", agent: "Ticket Copilot", action: "Copilot secures Red Rocks tickets", detail: "T-1 hour before on-sale. The browser copilot opens the queue on Jamie's machine, her IP, her session. She approves. Tickets secured at face value. $65 instead of $180.", savings: "$115" },
      { time: "Show Day", site: "opusocial.com", siteUrl: "https://www.opusocial.com", agent: "Vibe Mode", action: "Sets Vibe Mode to 'Open' at Red Rocks", detail: "Jamie sets her Vibe Mode to Open. She can see 42 other opusocial fans at Red Rocks. Taps phones with someone nearby via NFC. Instant connection — shared artists, crew invite, photos." },
      { time: "After Show", site: "opusocial.com", siteUrl: "https://www.opusocial.com", action: "Crew preserved permanently", detail: "The 4 people she met are now her permanent crew. Photos tagged to the event. When Khruangbin announces their next tour, everyone gets notified: 'Your crew from Red Rocks — want to go again?'" },
    ],
    outcome: { revenue: "$9.99/mo subscription", savings: "$500+/yr on tickets", timespan: "One year" },
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
  const [selectedId, setSelectedId] = useState("dorothy");
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
          Three digital twins. Three journeys. Every site, every agent, every dollar — connected.
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
