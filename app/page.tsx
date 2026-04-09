"use client";

import { useState } from "react";
import { siteConfig } from "@/site.config";

/* ─── Icon Components ─────────────────────────────────────────────── */

function HeartPulseIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 6C12.5 6 10 8.5 8 12c-2-1-4 0-4 2s1.5 3.5 3 4c1 3 4 6 9 8 5-2 8-5 9-8 1.5-.5 3-2 3-4s-2-3-4-2c-2-3.5-4.5-6-8-6z"
        fill={siteConfig.primaryColor}
        opacity="0.9"
      />
      <path
        d="M8 17h4l2-3 2 5 2-4 2 2h4"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke={siteConfig.primaryColor} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

/* ─── Differentiator Data ─────────────────────────────────────────── */

const differentiators = [
  {
    title: "Free assessment",
    description: "No paywall, no login required. Start a conversation and get answers immediately.",
    icon: "gift",
  },
  {
    title: "AI-powered",
    description: "Built on Claude, the most capable AI for healthcare reasoning. Evidence-based, not guesswork.",
    icon: "brain",
  },
  {
    title: "Voice-enabled",
    description: "Talk naturally with Gemini voice. Describe your symptoms like you would to a doctor.",
    icon: "mic",
  },
  {
    title: "Claude connector",
    description: "Install the MCP connector in Claude Desktop for persistent, personalized health intelligence.",
    icon: "plug",
  },
  {
    title: "Path to real care",
    description: "When you need a specialist, we connect you to physicians who actually practice evidence-based care.",
    icon: "path",
  },
  {
    title: "HSA/FSA eligible",
    description: "Many services qualify for pre-tax health spending. Your care can pay for itself.",
    icon: "dollar",
  },
];

function DifferentiatorIcon({ icon }: { icon: string }) {
  const color = siteConfig.primaryColor;
  const common = "w-8 h-8";
  switch (icon) {
    case "gift":
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 19.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18" /></svg>;
    case "brain":
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-1.591 1.591a2.25 2.25 0 01-1.591.659H8.182a2.25 2.25 0 01-1.591-.659L5 14.5m14 0V19a2 2 0 01-2 2H7a2 2 0 01-2-2v-4.5" /></svg>;
    case "mic":
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>;
    case "plug":
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>;
    case "path":
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>;
    case "dollar":
      return <svg className={common} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    default:
      return null;
  }
}

/* ─── Page Component ──────────────────────────────────────────────── */

export default function Home() {
  // No email capture — all CTAs are direct actions

  const mcpSnippet = `{
  "mcpServers": {
    "${siteConfig.connectorKey}": {
      "command": "npx",
      "args": [
        "-y",
        "@solvinghealth/${siteConfig.connectorKey}-connector"
      ]
    }
  }
}`;

  return (
    <div className="min-h-screen">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/icon.svg" alt={siteConfig.name} className="w-9 h-9 rounded-md" />
            <span className="text-lg font-bold" style={{ color: siteConfig.accentColor }}>
              {siteConfig.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/interpret"
              className="hidden sm:inline-flex items-center text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: siteConfig.primaryColor }}
            >
              Upload a report
              <ArrowIcon />
            </a>
            <a
              href="#chat"
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: siteConfig.primaryColor }}
            >
              Start assessment
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        className="relative pt-32 pb-24 md:pt-44 md:pb-36"
        style={{ backgroundColor: siteConfig.accentColor }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full opacity-10"
            style={{ backgroundColor: siteConfig.primaryColor }}
          />
          <div
            className="absolute -bottom-1/3 -left-1/4 w-[600px] h-[600px] rounded-full opacity-5"
            style={{ backgroundColor: siteConfig.primaryColor }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight whitespace-pre-line">
            {siteConfig.heroTitle}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {siteConfig.heroSubtitle}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#chat"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-bold text-white transition-all hover:scale-105 shadow-lg"
              style={{ backgroundColor: siteConfig.primaryColor }}
            >
              Talk to Sage
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </a>
            <a
              href="#connector"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-bold border-2 border-white/30 text-white transition-all hover:bg-white/10"
            >
              Get the connector
              <ArrowIcon />
            </a>
          </div>
        </div>
      </section>

      {/* ── Conversation Starters ──────────────────────────────── */}
      <section id="chat" className="py-16 bg-surface">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2" style={{ color: siteConfig.accentColor }}>
            Start a conversation
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Ask Sage anything about {siteConfig.name.toLowerCase()}. Pick a question or type your own.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {siteConfig.conversationStarters.map((starter, i) => (
              <button
                key={i}
                className="text-left px-5 py-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium transition-all hover:border-primary hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                {starter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Risk Factors / Key Info Grid ───────────────────────── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3" style={{ color: siteConfig.accentColor }}>
            What you should know
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            Key risk factors and information about {siteConfig.name.toLowerCase()}.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteConfig.sections.map((section, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-white border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-4"
                  style={{ backgroundColor: siteConfig.primaryColor }}
                >
                  {i + 1}
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: siteConfig.accentColor }}
                >
                  {section.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {section.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Warning Signs ──────────────────────────────────────── */}
      <section className="py-20 bg-amber-50/50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <AlertIcon />
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: siteConfig.accentColor }}>
              When to seek help
            </h2>
          </div>
          <p className="text-center text-gray-500 mb-10">
            See a healthcare provider if you experience any of these warning signs.
          </p>
          <div className="space-y-4">
            {siteConfig.warningSigns.map((sign, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-amber-100"
              >
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-700 text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{sign}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why This Is Different ──────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3" style={{ color: siteConfig.accentColor }}>
            Why this is different
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            Not another symptom checker. A new way to understand and manage your health.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {differentiators.map((diff, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <DifferentiatorIcon icon={diff.icon} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{diff.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{diff.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Connector CTA ──────────────────────────────────────── */}
      <section
        id="connector"
        className="py-20"
        style={{ backgroundColor: siteConfig.accentColor }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Install the Claude connector
          </h2>
          <p className="text-gray-300 mb-10 max-w-xl mx-auto">
            Add this to your Claude Desktop configuration. Get persistent, personalized {siteConfig.name.toLowerCase()} intelligence that remembers your history and learns your needs.
          </p>
          <div className="bg-gray-900 rounded-2xl p-6 text-left max-w-lg mx-auto shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-gray-500 text-xs font-mono">claude_desktop_config.json</span>
            </div>
            <pre className="text-green-400 text-sm font-mono overflow-x-auto leading-relaxed">
              {mcpSnippet}
            </pre>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(mcpSnippet)}
            className="mt-6 inline-flex items-center px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105 text-white"
            style={{ backgroundColor: siteConfig.primaryColor }}
          >
            Copy to clipboard
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </section>

      {/* ── Evidence-Based Care ─────────────────────────────────── */}
      <section className="py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: siteConfig.accentColor }}>
            Part of something bigger
          </h2>
          <p className="text-gray-500 mb-10 max-w-xl mx-auto">
            This site is one connector in a physician-governed health intelligence ecosystem.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <a
              href={siteConfig.ecosystemLinks.surgeonvalue}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-white border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-1 text-left"
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckIcon />
                <h3 className="font-bold" style={{ color: siteConfig.accentColor }}>
                  SurgeonValue
                </h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                For physicians. Revenue intelligence, code capture, and patient engagement tools that make your practice run better.
              </p>
            </a>
            <a
              href={siteConfig.ecosystemLinks.coopccare}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-white border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-1 text-left"
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckIcon />
                <h3 className="font-bold" style={{ color: siteConfig.accentColor }}>
                  co-op.care
                </h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                For families. Worker-owned companion care, HSA/FSA savings, and AI-powered care coordination that grows with you.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* ── Explore the Ecosystem ──────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: siteConfig.accentColor }}>
            Explore the ecosystem
          </h2>
          <p className="text-gray-500 mb-8">
            25 sites. One health system. Built entirely with AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://www.co-op.care" className="px-8 py-4 rounded-xl text-white font-bold transition-all hover:opacity-90 hover:scale-105" style={{ backgroundColor: siteConfig.primaryColor }}>
              For Families
            </a>
            <a href="https://www.surgeonvalue.com" className="px-8 py-4 rounded-xl font-bold border-2 transition-all hover:opacity-90" style={{ borderColor: siteConfig.primaryColor, color: siteConfig.primaryColor }}>
              For Surgeons
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <HeartPulseIcon className="w-6 h-6" />
              <span className="font-bold text-gray-900">{siteConfig.name}</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a
                href={siteConfig.ecosystemLinks.solvinghealth}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition-colors"
              >
                SolvingHealth
              </a>
              <a
                href={siteConfig.ecosystemLinks.surgeonvalue}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition-colors"
              >
                SurgeonValue
              </a>
              <a
                href={siteConfig.ecosystemLinks.coopccare}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition-colors"
              >
                co-op.care
              </a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-xs text-gray-400">
              This site provides health information, not medical advice. Always consult a qualified healthcare provider for diagnosis and treatment.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Powered by{" "}
              <a
                href={siteConfig.ecosystemLinks.solvinghealth}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-600 transition-colors"
                style={{ color: siteConfig.primaryColor }}
              >
                SolvingHealth
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
