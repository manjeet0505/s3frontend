'use client';

import { useState, useCallback } from 'react';
import {
  Linkedin, Sparkles, Copy, Check, ChevronDown, ChevronUp,
  ArrowRight, TrendingUp, Zap, Target, Award, Eye,
  Lightbulb, Star, RefreshCw, AlertCircle, CheckCircle2,
  Flame, BarChart3, Tag, BookOpen
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// ── helpers ──────────
function getToken() {
  try { return localStorage.getItem('token') || ''; } catch { return ''; }
}

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

function gradeColor(grade) {
  const map = { 'A+': 'text-emerald-400', A: 'text-emerald-400', B: 'text-blue-400', C: 'text-yellow-400', D: 'text-red-400' };
  return map[grade] || 'text-muted-foreground';
}

function scoreColor(score) {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-blue-400';
  if (score >= 40) return 'text-yellow-400';
  return 'text-red-400';
}

function impactBadge(impact) {
  return impact === 'high'
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
}

// ── CopyButton ─────────────────────────────────────────────────────────────────
function CopyButton({ text, className = '' }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all
        ${copied
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          : 'bg-secondary/40 border-border/40 text-muted-foreground hover:text-foreground hover:border-border'
        } ${className}`}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

// ── ScoreDial ──────────────────────────────────────────────────────────────────
function ScoreDial({ score, label, size = 80 }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? '#34d399' : score >= 60 ? '#60a5fa' : score >= 40 ? '#fbbf24' : '#f87171';
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox="0 0 64 64" className="-rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-border/40" />
        <circle
          cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
      </svg>
      <span className="text-xl font-black -mt-12 rotate-0" style={{ color }}>{score}</span>
      <span className="text-[11px] text-muted-foreground mt-8 font-medium">{label}</span>
    </div>
  );
}

// ── DiffCard ───────────────────────────────────────────────────────────────────
function DiffCard({ original, optimized, label, children }) {
  const [showOrig, setShowOrig] = useState(false);
  return (
    <div className="rounded-2xl border border-border/40 bg-card/40 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/30 bg-card/60">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOrig(v => !v)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showOrig ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {showOrig ? 'Hide original' : 'See original'}
          </button>
          {optimized && <CopyButton text={optimized} />}
        </div>
      </div>

      {showOrig && original && (
        <div className="px-5 py-4 bg-red-500/5 border-b border-red-500/10">
          <p className="text-xs font-medium text-red-400/80 uppercase tracking-wider mb-2">Original</p>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{original}</p>
        </div>
      )}

      <div className="px-5 py-4 bg-emerald-500/5">
        <p className="text-xs font-medium text-emerald-400/80 uppercase tracking-wider mb-2">Optimized</p>
        {children || <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{optimized}</p>}
      </div>
    </div>
  );
}

// ── TextArea ───────────────────────────────────────────────────────────────────
function TextArea({ label, icon: Icon, placeholder, value, onChange, rows = 4, badge }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        <label className="text-sm font-semibold text-foreground">{label}</label>
        {badge && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold">
            {badge}
          </span>
        )}
      </div>
      <textarea
        rows={rows}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border/50 bg-secondary/20 px-4 py-3 text-sm text-foreground
          placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1
          focus:ring-primary/20 resize-none transition-all leading-relaxed"
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function LinkedInOptimizerPage() {
  const [form, setForm] = useState({ headline: '', about: '', experience: '', skills_section: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [result, setResult]   = useState(null);
  const [activeTab, setActiveTab] = useState('headline');

  const update = (field) => (val) => setForm(f => ({ ...f, [field]: val }));

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleOptimize = useCallback(async () => {
    setError('');
    if (!form.headline && !form.about && !form.experience && !form.skills_section) {
      setError('Please fill in at least one section before optimizing.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/linkedin/optimize`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || 'Optimization failed');
      setResult(json.data);
      setActiveTab('headline');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [form]);

  const summary = result?.optimization_summary;

  // ── RESULT TABS ────────────────────────────────────────────────────────────
  const tabs = [
    { id: 'headline',   label: 'Headline',   icon: Zap },
    { id: 'about',      label: 'About',      icon: BookOpen },
    { id: 'experience', label: 'Experience', icon: BarChart3 },
    { id: 'skills',     label: 'Skills',     icon: Tag },
    { id: 'tips',       label: 'Tips',       icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="relative rounded-3xl border border-border/40 bg-card/60 backdrop-blur-sm p-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Linkedin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-foreground tracking-tight">LinkedIn Optimizer</h1>
                  <p className="text-xs text-muted-foreground font-medium">Powered by GPT-4o · Agent v1.0</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                Paste your current LinkedIn sections below. The agent rewrites your headline, about section,
                and experience bullets for recruiter searchability and ATS keyword density.
              </p>
            </div>
            {result && (
              <button
                onClick={() => { setResult(null); setForm({ headline: '', about: '', experience: '', skills_section: '' }); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/50 bg-secondary/30 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Re-optimize
              </button>
            )}
          </div>
        </div>

        {/* ── Score Banner (shown after result) ──────────────────────────── */}
        {result && summary && (
          <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">

              <div className="flex flex-col items-center gap-2">
                <ScoreDial score={summary.original_score} label="Before" />
                <span className={`text-lg font-black ${gradeColor(summary.profile_grade_before)}`}>
                  {summary.profile_grade_before}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center col-span-0 sm:col-span-0">
                <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-black text-lg">+{summary.score_improvement}</span>
                </div>
                <span className="text-[11px] text-muted-foreground mt-1">improvement</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <ScoreDial score={summary.optimized_score} label="After" />
                <span className={`text-lg font-black ${gradeColor(summary.profile_grade_after)}`}>
                  {summary.profile_grade_after}
                </span>
              </div>

              <div className="sm:col-span-1 space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Key Changes</p>
                {summary.key_changes?.slice(0, 4).map((c, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-muted-foreground leading-relaxed">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── INPUT FORM (hidden once result shown) ──────────────────────── */}
        {!result && (
          <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-6 space-y-6">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">Paste your LinkedIn sections</h2>
              <span className="text-xs text-muted-foreground">— fill what you have, skip the rest</span>
            </div>

            <TextArea
              label="Headline"
              icon={Zap}
              badge="High Impact"
              placeholder='e.g. "Full Stack Developer | React • Node.js • AWS | Building scalable products"'
              value={form.headline}
              onChange={update('headline')}
              rows={2}
            />
            <TextArea
              label="About / Summary"
              icon={BookOpen}
              badge="High Impact"
              placeholder="Paste your current About section here..."
              value={form.about}
              onChange={update('about')}
              rows={6}
            />
            <TextArea
              label="Experience Bullets"
              icon={BarChart3}
              placeholder={`Paste all your job descriptions and bullets here.\n\nExample:\nSoftware Engineer @ Acme Corp (2022–Present)\n- Worked on backend APIs\n- Helped maintain React frontend\n\nIntern @ Startup (2021)\n- Assisted with data pipeline`}
              value={form.experience}
              onChange={update('experience')}
              rows={8}
            />
            <TextArea
              label="Skills Section"
              icon={Tag}
              placeholder="e.g. React, Node.js, Python, MongoDB, Docker, AWS, Git, REST APIs..."
              value={form.skills_section}
              onChange={update('skills_section')}
              rows={2}
            />

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              onClick={handleOptimize}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
                bg-primary text-primary-foreground font-bold text-sm
                hover:opacity-90 active:scale-[0.98] transition-all
                disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analysing &amp; Rewriting with GPT-4o...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Optimize My LinkedIn Profile
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* ── RESULTS ────────────────────────────────────────────────────── */}
        {result && (
          <div className="space-y-4">

            {/* Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all
                    ${activeTab === t.id
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'bg-card/60 border border-border/40 text-muted-foreground hover:text-foreground'}`}
                >
                  <t.icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── Headline Tab ───────────────────────────────────────────── */}
            {activeTab === 'headline' && result.headline && (
              <div className="space-y-4">
                <DiffCard
                  label="Headline"
                  original={result.headline.original}
                  optimized={result.headline.optimized}
                />
                <div className="flex items-start gap-3 px-5 py-4 rounded-2xl border border-blue-500/20 bg-blue-500/5">
                  <Eye className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-blue-400 mb-1">Why this works</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{result.headline.why}</p>
                    {result.headline.char_count > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Character count: <span className="text-foreground font-bold">{result.headline.char_count}</span>
                        <span className="text-muted-foreground">/220</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* SEO Keywords */}
                {result.seo_keywords?.length > 0 && (
                  <div className="rounded-2xl border border-border/40 bg-card/40 p-5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">SEO Keywords to Include</p>
                    <div className="flex flex-wrap gap-2">
                      {result.seo_keywords.map((k, i) => (
                        <span
                          key={i}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border
                            ${k.currently_in_profile
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : 'bg-secondary/40 border-border/40 text-muted-foreground'}`}
                        >
                          {k.currently_in_profile ? <Check className="w-2.5 h-2.5" /> : <ArrowRight className="w-2.5 h-2.5" />}
                          {k.keyword}
                          {k.search_volume === 'high' && <Flame className="w-2.5 h-2.5 text-orange-400" />}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      <span className="text-emerald-400">●</span> Already in profile &nbsp;
                      <span className="text-muted-foreground">●</span> Add this keyword
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── About Tab ──────────────────────────────────────────────── */}
            {activeTab === 'about' && result.about && (
              <div className="space-y-4">
                <DiffCard
                  label="About / Summary"
                  original={result.about.original_preview ? result.about.original_preview + '...' : ''}
                  optimized={result.about.optimized}
                />
                <div className="flex items-start gap-3 px-5 py-4 rounded-2xl border border-blue-500/20 bg-blue-500/5">
                  <Eye className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-blue-400 mb-1">Why this works</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{result.about.why}</p>
                  </div>
                </div>
                {result.about.keywords_added?.length > 0 && (
                  <div className="rounded-2xl border border-border/40 bg-card/40 p-5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Keywords Added</p>
                    <div className="flex flex-wrap gap-2">
                      {result.about.keywords_added.map((kw, i) => (
                        <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 border border-primary/20 text-primary">
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Experience Tab ─────────────────────────────────────────── */}
            {activeTab === 'experience' && result.experience?.length > 0 && (
              <div className="space-y-3">
                {result.experience.map((item, i) => (
                  <div key={i} className="rounded-2xl border border-border/40 bg-card/40 overflow-hidden">
                    {item.job_context && (
                      <div className="px-5 py-2.5 border-b border-border/30 bg-card/60 flex items-center gap-2">
                        <Target className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold text-muted-foreground">{item.job_context}</span>
                        <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full border font-bold ${impactBadge('high')}`}>
                          {item.improvement_type?.replace(/_/g, ' ')}
                        </span>
                      </div>
                    )}
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-red-400/70 uppercase tracking-wider">Before</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.original}</p>
                        {item.verb_upgrade?.from && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                            Weak: "{item.verb_upgrade.from}"
                          </span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-wider">After</p>
                          <CopyButton text={item.optimized} />
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{item.optimized}</p>
                        {item.verb_upgrade?.to && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            Strong: "{item.verb_upgrade.to}"
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Skills Tab ─────────────────────────────────────────────── */}
            {activeTab === 'skills' && result.skills_to_add?.length > 0 && (
              <div className="rounded-2xl border border-border/40 bg-card/40 p-5 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recommended Skills to Add</p>
                {result.skills_to_add.map((s, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-border/30 bg-secondary/20">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-sm text-foreground">{s.skill}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${impactBadge(s.priority === 'high' ? 'high' : 'medium')}`}>
                          {s.priority}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/50 border border-border/30 text-muted-foreground">
                          {s.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{s.reason}</p>
                    </div>
                    {s.priority === 'high' && <Star className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />}
                  </div>
                ))}
              </div>
            )}

            {/* ── Tips Tab ───────────────────────────────────────────────── */}
            {activeTab === 'tips' && result.recruiter_tips?.length > 0 && (
              <div className="space-y-3">
                {result.recruiter_tips.map((t, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 rounded-2xl border border-border/40 bg-card/40">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
                      ${t.impact === 'high' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-blue-500/10 border border-blue-500/20'}`}>
                      <Lightbulb className={`w-4 h-4 ${t.impact === 'high' ? 'text-emerald-400' : 'text-blue-400'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.section}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${impactBadge(t.impact)}`}>
                          {t.impact} impact
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/40 border border-border/30 text-muted-foreground">
                          {t.effort} effort
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{t.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ── Empty state (experience/skills tab with no data) ───────────── */}
        {result && activeTab === 'experience' && (!result.experience || result.experience.length === 0) && (
          <div className="rounded-2xl border border-border/40 bg-card/40 p-10 text-center">
            <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No experience bullets were provided to optimize.</p>
            <p className="text-xs text-muted-foreground mt-1">Re-run the optimizer with your experience section pasted in.</p>
          </div>
        )}

      </div>
    </div>
  );
}