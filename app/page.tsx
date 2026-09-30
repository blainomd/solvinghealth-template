"use client";

import { useState } from "react";
import { siteConfig } from "@/site.config";

/* ─── Icons ───────────────────────────────────────────────────────── */

function HeartPulseIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M16 6C12.5 6 10 8.5 8 12c-2-1-4 0-4 2s1.5 3.5 3 4c1 3 4 6 9 8 5-2 8-5 9-8 1.5-.5 3-2 3-4s-2-3-4-2c-2-3.5-4.5-6-8-6z"
        fill={siteConfig.primaryColor}
        opacity="0.9"
      />
      <path d="M8 17h4l2-3 2 5 2-4 2 2h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  );
}

/* ─── Page ────────────────────────────────────────────────────────── */

export default function Home() {
  // The nectar: a visit list built on the device. State lives in this tab only; nothing is stored or sent.
  const [picked, setPicked] = useState<boolean[]>(() => siteConfig.visitQuestions.map(() => true));
  const [own, setOwn] = useState("");
  const [copied, setCopied] = useState(false);
  const chosen = siteConfig.visitQuestions.filter((_, i) => picked[i]);
  const ownLines = own.split("\n").map((s) => s.trim()).filter(Boolean);
  const listText = [...chosen, ...ownLines].map((q, i) => `${i + 1}. ${q}`).join("\n");
  const nothingPicked = chosen.length + ownLines.length === 0;

  const copy = async () => {
    if (nothingPicked) return;
    try {
      await navigator.clipboard.writeText(`Questions for my visit — ${siteConfig.name}\n\n${listText}\n`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the list is still on screen to copy by hand */
    }
  };

  return (
    <div className="min-h-screen">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 print:hidden">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/icon.svg" alt="" className="w-9 h-9 rounded-md" />
            <span className="text-lg font-bold" style={{ color: siteConfig.accentColor }}>
              {siteConfig.name}
            </span>
          </a>
          <nav className="flex items-center gap-4" aria-label="Page">
            <a href="#warning-signs" className="hidden sm:inline text-sm font-medium hover:opacity-80" style={{ color: siteConfig.primaryColor }}>
              Warning signs
            </a>
            <a
              href="#visit"
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90"
              style={{ backgroundColor: siteConfig.primaryColor }}
            >
              Build my visit list
            </a>
          </nav>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 print:hidden" style={{ backgroundColor: siteConfig.accentColor }}>
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full opacity-10" style={{ backgroundColor: siteConfig.primaryColor }} />
          <div className="absolute -bottom-1/3 -left-1/4 w-[600px] h-[600px] rounded-full opacity-5" style={{ backgroundColor: siteConfig.primaryColor }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight whitespace-pre-line">{siteConfig.heroTitle}</h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">{siteConfig.heroSubtitle}</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#visit"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-bold text-white shadow-lg hover:opacity-90"
              style={{ backgroundColor: siteConfig.primaryColor }}
            >
              Build my visit list
            </a>
            <a href="#warning-signs" className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-bold border-2 border-white/30 text-white hover:bg-white/10">
              When to seek help
            </a>
          </div>
        </div>
      </section>

      {/* ── Warning signs (first, with 911 / 988) ───────────────── */}
      <section id="warning-signs" className="py-16 bg-amber-50/50 scroll-mt-20 print:hidden">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <AlertIcon />
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: siteConfig.accentColor }}>
              When to seek help
            </h2>
          </div>
          <p className="text-center text-gray-700 font-semibold mb-2">
            If someone may be in danger right now, call <a href="tel:911" className="underline">911</a>.
          </p>
          <p className="text-center text-gray-600 text-sm mb-8">
            If you or someone you love is thinking about suicide or is in crisis, call or text <a href="tel:988" className="underline">988</a> (Suicide &amp; Crisis Lifeline, US).
          </p>
          <p className="text-center text-gray-500 mb-8">See a clinician promptly if you notice any of these.</p>
          <ul className="space-y-4">
            {siteConfig.warningSigns.map((sign, i) => (
              <li key={i} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-amber-100">
                <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-amber-700 text-xs font-bold">{i + 1}</span>
                <p className="text-gray-700 leading-relaxed">{sign}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── What you should know ───────────────────────────────── */}
      <section className="py-20 print:hidden">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3" style={{ color: siteConfig.accentColor }}>
            What you should know
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">Key facts about {siteConfig.name.toLowerCase()}, from the sources listed below.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteConfig.sections.map((section, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-gray-100">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-4" style={{ backgroundColor: siteConfig.primaryColor }}>
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: siteConfig.accentColor }}>
                  {section.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">{section.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The nectar: build a visit list on the device ──────── */}
      <section id="visit" className="py-20 bg-surface scroll-mt-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3" style={{ color: siteConfig.accentColor }}>
            Questions to bring to your visit
          </h2>
          <p className="text-center text-gray-500 mb-8 print:hidden">
            Tick the ones that fit, add your own, then print or copy. This list is built here in your browser; nothing is stored or sent.
          </p>
          <ul className="space-y-3 print:hidden">
            {siteConfig.visitQuestions.map((q, i) => (
              <li key={i}>
                <label className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-5 h-5"
                    checked={picked[i]}
                    onChange={() => setPicked((p) => p.map((v, j) => (j === i ? !v : v)))}
                    style={{ accentColor: siteConfig.primaryColor }}
                  />
                  <span className="text-gray-800 leading-relaxed">{q}</span>
                </label>
              </li>
            ))}
          </ul>
          <label className="block mt-6 print:hidden">
            <span className="block text-sm font-semibold text-gray-700 mb-2">Your own questions, one per line</span>
            <textarea
              value={own}
              onChange={(e) => setOwn(e.target.value)}
              rows={3}
              maxLength={1200}
              placeholder="e.g. Could this be related to the fall in March?"
              className="w-full p-4 rounded-xl border border-gray-200 bg-white text-gray-800"
            />
          </label>

          {/* The list as it prints */}
          <div className="mt-8 p-6 bg-white rounded-2xl border border-gray-200" id="visit-list" aria-live="polite">
            <h3 className="font-bold mb-3" style={{ color: siteConfig.accentColor }}>
              Questions for my visit — {siteConfig.name}
            </h3>
            {nothingPicked ? (
              <p className="text-gray-500 text-sm">Nothing picked yet. Tick a question above or write your own.</p>
            ) : (
              <ol className="list-decimal pl-6 space-y-2 text-gray-800">
                {[...chosen, ...ownLines].map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ol>
            )}
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 print:hidden">
            <button
              type="button"
              onClick={() => !nothingPicked && window.print()}
              disabled={nothingPicked}
              className="px-6 py-3 rounded-xl text-white font-bold disabled:opacity-50"
              style={{ backgroundColor: siteConfig.primaryColor }}
            >
              Print this list
            </button>
            <button type="button" onClick={copy} disabled={nothingPicked} className="px-6 py-3 rounded-xl font-bold border-2 disabled:opacity-50" style={{ borderColor: siteConfig.primaryColor, color: siteConfig.primaryColor }}>
              {copied ? "Copied" : "Copy as text"}
            </button>
          </div>
          <p className="mt-4 text-xs text-gray-500 print:hidden">General information, not medical advice. A licensed clinician decides what applies to you.</p>
        </div>
      </section>

      {/* ── Sources and where to go next ───────────────────────── */}
      <section className="py-16 print:hidden">
        <div className="max-w-3xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-bold mb-3" style={{ color: siteConfig.accentColor }}>
              Sources
            </h2>
            {siteConfig.sources.length ? (
              <ul className="space-y-2 text-sm">
                {siteConfig.sources.map((s, i) => (
                  <li key={i}>
                    <a href={s.url} rel="noopener noreferrer" className="underline" style={{ color: siteConfig.primaryColor }}>
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No sources listed yet.</p>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold mb-3" style={{ color: siteConfig.accentColor }}>
              Where to go next
            </h2>
            <ul className="space-y-2 text-sm">
              {siteConfig.next.map((n, i) => (
                <li key={i}>
                  <a href={n.url} rel="noopener noreferrer" className="underline" style={{ color: siteConfig.primaryColor }}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="py-12 border-t border-gray-100 print:hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <HeartPulseIcon className="w-6 h-6" />
              <span className="font-bold text-gray-900">{siteConfig.name}</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="/llms.txt" className="hover:text-gray-900">llms.txt</a>
              <a href="/.well-known/agent.json" className="hover:text-gray-900">agent.json</a>
              <a href={siteConfig.publisher.url} rel="noopener noreferrer" className="hover:text-gray-900">
                {siteConfig.publisher.name}
              </a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-xs text-gray-400">This site gives general information, not medical advice. A licensed clinician decides what applies to you.</p>
            <p className="text-xs text-gray-400 mt-2">
              Built from the open{" "}
              <a href="https://solvinghealth.com/build#flower" rel="noopener noreferrer" className="hover:text-gray-600" style={{ color: siteConfig.primaryColor }}>
                flower template
              </a>
              . Updated {siteConfig.updated}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
