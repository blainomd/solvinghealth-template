"use client";

import { useState, useRef } from "react";
import { siteConfig } from "@/site.config";

export default function InterpretPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!file && !text.trim()) return;

    setLoading(true);
    setError("");
    setInterpretation("");

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (text.trim()) formData.append("text", text.trim());

      const res = await fetch("/api/interpret", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setInterpretation(data.interpretation);
      }
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const formatInterpretation = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("## ") || line.startsWith("**") && line.endsWith("**")) {
        return (
          <h3 key={i} className="text-lg font-bold mt-6 mb-2" style={{ color: siteConfig.accentColor }}>
            {line.replace(/^##\s*/, "").replace(/\*\*/g, "")}
          </h3>
        );
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={i} className="ml-4 text-gray-700 leading-relaxed">
            {line.replace(/^[-*]\s*/, "").replace(/\*\*/g, "")}
          </li>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        return (
          <li key={i} className="ml-4 text-gray-700 leading-relaxed list-decimal">
            {line.replace(/^\d+\.\s*/, "").replace(/\*\*/g, "")}
          </li>
        );
      }
      if (line.trim() === "") return <br key={i} />;
      return (
        <p key={i} className="text-gray-700 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 6C12.5 6 10 8.5 8 12c-2-1-4 0-4 2s1.5 3.5 3 4c1 3 4 6 9 8 5-2 8-5 9-8 1.5-.5 3-2 3-4s-2-3-4-2c-2-3.5-4.5-6-8-6z"
                fill={siteConfig.primaryColor}
                opacity="0.9"
              />
              <path d="M8 17h4l2-3 2 5 2-4 2 2h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-lg font-bold" style={{ color: siteConfig.accentColor }}>
              {siteConfig.name}
            </span>
          </a>
          <span className="text-sm font-medium" style={{ color: siteConfig.primaryColor }}>
            Document Interpreter
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: siteConfig.accentColor }}>
            Upload anything. Get your best opinion.
          </h1>
          <p className="mt-3 text-gray-500 text-lg">
            MRI reports, lab results, pathology, discharge summaries — drop it here and get a plain-language interpretation.
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {/* File Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
              ${dragActive ? "border-teal-400 bg-teal-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}
              ${file ? "bg-teal-50/50 border-teal-300" : ""}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.txt,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />

            {file ? (
              <div className="flex flex-col items-center gap-2">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke={siteConfig.primaryColor} strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-semibold text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="text-sm text-red-500 hover:text-red-700 mt-1"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="font-semibold text-gray-700">Drop your document here</p>
                <p className="text-sm text-gray-400">Images, PDFs, or text files. Photos of reports work too.</p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400 font-medium">or paste text</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Text Input */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your report text here — radiology findings, lab values, discharge notes..."
            className="w-full h-40 p-4 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:border-transparent text-sm leading-relaxed"
            style={{ focusRingColor: siteConfig.primaryColor } as React.CSSProperties}
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || (!file && !text.trim())}
            className="mt-6 w-full py-4 rounded-xl text-white font-bold text-lg transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
            style={{ backgroundColor: siteConfig.primaryColor }}
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Interpreting...
              </>
            ) : (
              "Get Interpretation"
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {interpretation && (
          <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: siteConfig.primaryColor }}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: siteConfig.accentColor }}>
                  Your Interpretation
                </h2>
                <p className="text-sm text-gray-500">Powered by SolvingHealth AI</p>
              </div>
            </div>

            <div className="prose prose-gray max-w-none">
              {formatInterpretation(interpretation)}
            </div>

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm text-amber-800">
                  This interpretation is for educational purposes only and does not constitute medical advice.
                  Always discuss your results with your healthcare provider before making any medical decisions.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={siteConfig.ecosystemLinks.surgeonvalue}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl text-white font-semibold text-center transition-all hover:opacity-90"
                style={{ backgroundColor: siteConfig.primaryColor }}
              >
                Find a specialist
              </a>
              <a
                href={siteConfig.ecosystemLinks.coopccare}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl font-semibold text-center border-2 transition-all hover:opacity-90"
                style={{ borderColor: siteConfig.primaryColor, color: siteConfig.primaryColor }}
              >
                Get care coordination
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
