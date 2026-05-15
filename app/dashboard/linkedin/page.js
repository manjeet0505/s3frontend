"use client";
import { useState, useRef } from "react";

// ── helpers ──────────────────────────────────────────────────────────────────
const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

async function callOptimize(profileText, targetRole) {
  const res = await fetch(`${API}/api/linkedin/optimize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ profile_text: profileText, target_role: targetRole }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Optimization failed");
  }
  return res.json();
}

// ── Score ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score, label, size = 80 }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color =
    score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1f2937" strokeWidth={6} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={6}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <span className="text-sm font-bold" style={{ color }}>{score}</span>
      <span className="text-xs text-gray-400 text-center leading-tight max-w-[72px]">{label}</span>
    </div>
  );
}

// ── Diff pill ─────────────────────────────────────────────────────────────────
function DiffView({ original, optimized, label }) {
  const [showing, setShowing] = useState("optimized");
  return (
    <div className="rounded-xl border border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/60 border-b border-gray-700">
        <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">{label}</span>
        <div className="flex gap-1">
          {["original", "optimized"].map((v) => (
            <button
              key={v}
              onClick={() => setShowing(v)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                showing === v
                  ? v === "optimized"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {v === "optimized" ? "✨ Optimized" : "📋 Original"}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 text-sm text-gray-200 leading-relaxed whitespace-pre-wrap min-h-[80px]">
        {showing === "optimized" ? optimized : original || "Not provided"}
      </div>
    </div>
  );
}

// ── Copy button ───────────────────────────────────────────────────────────────
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition"
    >
      {copied ? "✅ Copied" : "📋 Copy"}
    </button>
  );
}

// ── Tag pill ──────────────────────────────────────────────────────────────────
function Tag({ children, color = "blue" }) {
  const colors = {
    blue: "bg-blue-900/50 text-blue-300 border-blue-700",
    green: "bg-green-900/50 text-green-300 border-green-700",
    red: "bg-red-900/50 text-red-300 border-red-700",
    yellow: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
    purple: "bg-purple-900/50 text-purple-300 border-purple-700",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LinkedInOptimizerPage() {
  const [profileText, setProfileText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("scores");
  const resultsRef = useRef(null);

  const charCount = profileText.length;
  const charOk = charCount > 50 && charCount <= 15000;

  async function handleSubmit() {
    if (!charOk || !targetRole.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await callOptimize(profileText, targetRole);
      setResult(data);
      setActiveTab("scores");
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { id: "scores", label: "📊 Scores" },
    { id: "keywords", label: "🔍 Keywords" },
    { id: "rewrites", label: "✨ Rewrites" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ── Header ── */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-lg font-bold">
            in
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">LinkedIn Optimizer</h1>
            <p className="text-xs text-gray-400">
              AI-powered 3-pass analysis — scores, keywords & full rewrite
            </p>
          </div>
          <div className="ml-auto flex gap-2 text-xs text-gray-500">
            <span className="bg-gray-800 px-2 py-1 rounded">GPT-4o</span>
            <span className="bg-gray-800 px-2 py-1 rounded">3-Pass</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* ── Input card ── */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-xs flex items-center justify-center font-bold">1</span>
            <span className="font-semibold text-gray-200">Paste Your LinkedIn Profile</span>
          </div>
          <p className="text-xs text-gray-500">
            Copy everything from your LinkedIn profile — headline, about section, experience bullets, skills. The more you paste, the better the analysis.
          </p>

          <div className="relative">
            <textarea
              value={profileText}
              onChange={(e) => setProfileText(e.target.value)}
              placeholder={`Paste your LinkedIn profile here...

Example:
Headline: Software Engineer at Startup | Building AI Products

About:
I am a software engineer with 3 years of experience...

Experience:
Software Engineer @ XYZ Company (2022–Present)
- Worked on backend services
- Helped with database optimization
- Responsible for API development

Skills: Python, React, Node.js, SQL`}
              rows={12}
              className={`w-full bg-gray-800 border rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 transition-all ${
                charCount > 15000
                  ? "border-red-600 focus:ring-red-600"
                  : charCount > 50
                  ? "border-green-600 focus:ring-green-600"
                  : "border-gray-700 focus:ring-blue-600"
              }`}
            />
            <div className={`absolute bottom-3 right-3 text-xs ${charCount > 15000 ? "text-red-400" : "text-gray-500"}`}>
              {charCount.toLocaleString()} / 15,000
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-xs flex items-center justify-center font-bold">2</span>
            <span className="font-semibold text-gray-200">Target Role</span>
          </div>
          <input
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Software Engineer at FAANG, Data Scientist, Product Manager"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-3">
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!charOk || !targetRole.trim() || loading}
            className="w-full py-4 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden"
            style={{
              background: loading
                ? "linear-gradient(90deg,#1d4ed8,#2563eb)"
                : "linear-gradient(90deg,#2563eb,#7c3aed)",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="animate-pulse">Running 3-Pass AI Analysis…</span>
              </span>
            ) : (
              "⚡ Optimize My LinkedIn Profile"
            )}
          </button>

          {loading && (
            <div className="space-y-1">
              {[
                { label: "Pass 1: Scoring all sections…", delay: "0s" },
                { label: "Pass 2: Keyword gap analysis…", delay: "2s" },
                { label: "Pass 3: AI rewriting your profile…", delay: "4s" },
              ].map(({ label, delay }) => (
                <div
                  key={label}
                  className="text-xs text-gray-400 flex items-center gap-2 animate-pulse"
                  style={{ animationDelay: delay }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Results ── */}
        {result && (
          <div ref={resultsRef} className="space-y-6">
            {/* Tab nav */}
            <div className="flex gap-1 bg-gray-900 border border-gray-800 p-1 rounded-xl">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    activeTab === t.id
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── TAB: Scores ── */}
            {activeTab === "scores" && result.scores && (
              <div className="space-y-5">
                {/* Overall score hero */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center gap-6">
                  <ScoreRing score={result.scores.overall_score} label="Overall" size={100} />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-1">
                      {result.scores.overall_score >= 80
                        ? "🟢 Strong Profile"
                        : result.scores.overall_score >= 60
                        ? "🟡 Needs Work"
                        : "🔴 Weak Profile"}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {result.scores.overall_score >= 80
                        ? "Your profile is well-optimized. Focus on the gaps below."
                        : result.scores.overall_score >= 60
                        ? "Good foundation. Apply the rewrites to jump 20+ points."
                        : "Significant room for improvement. Apply all rewrites."}
                    </p>
                  </div>
                </div>

                {/* Section scores grid */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-5 uppercase tracking-widest">
                    Section Breakdown
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {[
                      { key: "headline_score", label: "Headline" },
                      { key: "about_score", label: "About" },
                      { key: "experience_score", label: "Experience" },
                      { key: "skills_score", label: "Skills" },
                      { key: "recruiter_searchability", label: "Searchability" },
                    ].map(({ key, label }) => (
                      <ScoreRing key={key} score={result.scores[key] ?? 0} label={label} size={76} />
                    ))}
                  </div>
                </div>

                {/* 3-column cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      title: "✅ Strengths",
                      items: result.scores.strengths,
                      color: "green",
                      bg: "bg-green-900/20 border-green-800",
                    },
                    {
                      title: "🚨 Critical Gaps",
                      items: result.scores.critical_gaps,
                      color: "red",
                      bg: "bg-red-900/20 border-red-800",
                    },
                    {
                      title: "⚡ Quick Wins",
                      items: result.scores.quick_wins,
                      color: "yellow",
                      bg: "bg-yellow-900/20 border-yellow-800",
                    },
                  ].map(({ title, items, bg }) => (
                    <div key={title} className={`border rounded-xl p-4 ${bg}`}>
                      <p className="text-xs font-bold text-gray-200 uppercase tracking-widest mb-3">
                        {title}
                      </p>
                      <ul className="space-y-2">
                        {(items || []).map((item, i) => (
                          <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                            <span className="mt-0.5 shrink-0">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB: Keywords ── */}
            {activeTab === "keywords" && result.keywords && (
              <div className="space-y-4">
                {/* Keyword density score */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center gap-6">
                  <ScoreRing score={result.keywords.keyword_density_score ?? 0} label="Keyword Score" size={90} />
                  <div>
                    <p className="text-sm font-semibold text-gray-200 mb-1">
                      Target: <span className="text-blue-400">{result.keywords.target_role}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      {result.keywords.present_keywords?.length ?? 0} keywords found ·{" "}
                      {result.keywords.missing_keywords?.length ?? 0} missing
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Missing keywords */}
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">
                      🚨 Missing Keywords
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(result.keywords.missing_keywords || []).map((kw) => (
                        <Tag key={kw} color="red">{kw}</Tag>
                      ))}
                    </div>
                  </div>

                  {/* Present keywords */}
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">
                      ✅ Present Keywords
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(result.keywords.present_keywords || []).map((kw) => (
                        <Tag key={kw} color="green">{kw}</Tag>
                      ))}
                    </div>
                  </div>

                  {/* Top recruiter searches */}
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
                      🔍 Top Recruiter Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(result.keywords.top_recruiter_searches || []).map((s) => (
                        <Tag key={s} color="blue">{s}</Tag>
                      ))}
                    </div>
                  </div>

                  {/* Recommended skills */}
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">
                      ➕ Add These Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(result.keywords.recommended_skills_to_add || []).map((s) => (
                        <Tag key={s} color="purple">{s}</Tag>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: Rewrites ── */}
            {activeTab === "rewrites" && result.rewrites && (
              <div className="space-y-4">
                {/* Headline */}
                {result.rewrites.headline && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-gray-200 uppercase tracking-widest">
                        💼 Headline
                      </h3>
                      <CopyBtn text={result.rewrites.headline.optimized} />
                    </div>
                    <DiffView
                      original={result.rewrites.headline.original}
                      optimized={result.rewrites.headline.optimized}
                      label="Headline"
                    />
                    {result.rewrites.headline.explanation && (
                      <p className="text-xs text-gray-500 italic">
                        💡 {result.rewrites.headline.explanation}
                      </p>
                    )}
                  </div>
                )}

                {/* About */}
                {result.rewrites.about && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-gray-200 uppercase tracking-widest">
                        📝 About / Summary
                      </h3>
                      <CopyBtn text={result.rewrites.about.optimized} />
                    </div>
                    <DiffView
                      original={result.rewrites.about.original}
                      optimized={result.rewrites.about.optimized}
                      label="About"
                    />
                    {result.rewrites.about.explanation && (
                      <p className="text-xs text-gray-500 italic">
                        💡 {result.rewrites.about.explanation}
                      </p>
                    )}
                  </div>
                )}

                {/* Experience bullets */}
                {result.rewrites.experience_bullets?.length > 0 && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
                    <h3 className="text-sm font-bold text-gray-200 uppercase tracking-widest">
                      🚀 Experience Bullets
                    </h3>
                    <div className="space-y-3">
                      {result.rewrites.experience_bullets.map((b, i) => (
                        <div key={i} className="border border-gray-700 rounded-xl p-4 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-500">Bullet {i + 1}</span>
                            <CopyBtn text={b.optimized} />
                          </div>
                          <div className="text-xs text-red-400 line-through opacity-70">{b.original}</div>
                          <div className="text-sm text-green-300">{b.optimized}</div>
                          {b.improvement && (
                            <p className="text-xs text-gray-500 italic">💡 {b.improvement}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills + banner + connection message */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.rewrites.skills_to_highlight?.length > 0 && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
                        🏆 Top Skills to Highlight
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {result.rewrites.skills_to_highlight.map((s) => (
                          <Tag key={s} color="blue">{s}</Tag>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.rewrites.banner_suggestion && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                      <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">
                        🖼 Banner Suggestion
                      </p>
                      <p className="text-xs text-gray-300">{result.rewrites.banner_suggestion}</p>
                    </div>
                  )}
                </div>

                {result.rewrites.connection_message_template && (
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                        🤝 Connection Request Template
                      </p>
                      <CopyBtn text={result.rewrites.connection_message_template} />
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {result.rewrites.connection_message_template}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
