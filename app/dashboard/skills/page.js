'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Sparkles, RefreshCw, AlertCircle, CheckCircle2,
  Clock, BookOpen, ExternalLink, ChevronDown, ChevronUp,
  Zap, Target, BarChart3, Brain, Flame, Lock, Unlock,
  ArrowRight, Star, Activity,
} from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG = {
  critical: {
    label: 'Critical',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/25',
    dot: 'bg-red-500',
    bar: 'bg-red-500',
  },
  high: {
    label: 'High',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    dot: 'bg-amber-500',
    bar: 'bg-amber-500',
  },
  medium: {
    label: 'Medium',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/25',
    dot: 'bg-blue-500',
    bar: 'bg-blue-400',
  },
};

const READINESS_CONFIG = {
  'Not Ready': { color: 'text-red-400', bg: 'from-red-500/20 to-red-600/10', ring: 'stroke-red-500' },
  'Partially Ready': { color: 'text-amber-400', bg: 'from-amber-500/20 to-amber-600/10', ring: 'stroke-amber-500' },
  'Almost Ready': { color: 'text-cyan-400', bg: 'from-cyan-500/20 to-cyan-600/10', ring: 'stroke-cyan-500' },
  'Job Ready': { color: 'text-emerald-400', bg: 'from-emerald-500/20 to-emerald-600/10', ring: 'stroke-emerald-500' },
};

const TYPE_COLORS = {
  free: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  free_audit: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  paid: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

function ReadinessRing({ score, label }) {
  const cfg = READINESS_CONFIG[label] || READINESS_CONFIG['Partially Ready'];
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-border/30" />
        <motion.circle
          cx="64" cy="64" r={r} fill="none" strokeWidth="8"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeLinecap="round"
          className={cfg.ring}
        />
      </svg>
      <div className="text-center z-10">
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className={`text-3xl font-bold font-mono ${cfg.color}`}
        >
          {score}%
        </motion.p>
        <p className="text-xs text-muted-foreground mt-0.5">ready</p>
      </div>
    </div>
  );
}

function DemandBar({ score }) {
  const color = score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-blue-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="text-xs font-mono text-muted-foreground w-7 text-right">{score}%</span>
    </div>
  );
}

function GapCard({ gap, index }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = PRIORITY_CONFIG[gap.priority] || PRIORITY_CONFIG.medium;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`rounded-xl border ${cfg.border} ${cfg.bg} overflow-hidden`}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start justify-between gap-3 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Priority indicator */}
          <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
            <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            <span className="text-xs text-muted-foreground font-mono">{String(index + 1).padStart(2, '0')}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground capitalize">{gap.skill}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                {cfg.label}
              </span>
              {gap.time_to_learn && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />{gap.time_to_learn}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{gap.reason}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground">Market demand</p>
            <div className="w-24 mt-1">
              <DemandBar score={gap.demand_score || 50} />
            </div>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <p className="text-xs text-muted-foreground">Current level</p>
                  <p className="text-sm font-medium text-foreground capitalize mt-0.5">{gap.current_level || 'None'}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <p className="text-xs text-muted-foreground">Time needed</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{gap.time_to_learn || '—'}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <p className="text-xs text-muted-foreground">Market demand</p>
                  <p className={`text-sm font-medium mt-0.5 capitalize ${cfg.color}`}>{gap.market_demand || '—'}</p>
                </div>
              </div>

              {/* Resources */}
              {gap.resources && gap.resources.length > 0 ? (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Free Learning Resources
                  </p>
                  <div className="space-y-2">
                    {gap.resources.map((r, i) => (
                      <a
                        key={i}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`text-xs px-1.5 py-0.5 rounded border shrink-0 ${TYPE_COLORS[r.type] || TYPE_COLORS.free}`}>
                            {r.type === 'free_audit' ? 'Free' : r.type}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm text-foreground group-hover:text-primary transition-colors truncate">{r.title}</p>
                            <p className="text-xs text-muted-foreground">{r.platform}</p>
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary shrink-0 ml-2 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 rounded-lg bg-white/5">
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  Search "{gap.skill} tutorial" on YouTube or the official docs.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SkillPill({ skill, index }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04 }}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400"
    >
      <CheckCircle2 className="w-3 h-3" />
      {skill}
    </motion.span>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function SkillsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const userId = typeof window !== 'undefined'
    ? (() => {
        try {
          const token = localStorage.getItem('authToken');
          if (!token) return null;
          return JSON.parse(atob(token.split('.')[1])).userId;
        } catch { return null; }
      })()
    : null;

  const fetchResult = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills/gap/result?user_id=${userId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) setData(json.data);
      }
    } catch { /* no cached result — fine */ }
    finally { setFetching(false); }
  }, [userId]);

  useEffect(() => { fetchResult(); }, [fetchResult]);

  const runAnalysis = async () => {
    if (!userId) {
      setError('Please log in to run skill gap analysis.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills/gap?user_id=${userId}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || json.detail || 'Analysis failed');
      setData(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const gaps = data?.gaps || [];
  const filteredGaps = filterPriority === 'all'
    ? gaps
    : gaps.filter(g => g.priority === filterPriority);
  const visibleGaps = showAll ? filteredGaps : filteredGaps.slice(0, 5);
  const readinessCfg = READINESS_CONFIG[data?.readiness_label] || READINESS_CONFIG['Partially Ready'];

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 max-w-3xl mx-auto space-y-8">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-2">
            <Brain className="w-3 h-3" /> AI-Powered Skill Analysis
          </div>
          <h1 className="text-2xl font-bold text-foreground">Skill Gap Analysis</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {data?.market_data_available
              ? `Analysed against ${data.jobs_analysed}+ live job postings`
              : 'Personalized gap analysis based on your resume'}
          </p>
        </div>

        <button
          onClick={runAnalysis}
          disabled={loading || fetching}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 shrink-0"
        >
          {loading ? (
            <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analysing...</>
          ) : (
            <><Sparkles className="w-3.5 h-3.5" /> {data ? 'Refresh' : 'Run Analysis'}</>
          )}
        </button>
      </div>

      {/* ── Error ──────────────────────────────────────────────────────────── */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
        >
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </motion.div>
      )}

      {/* ── Loading skeleton ───────────────────────────────────────────────── */}
      {(loading || fetching) && !data && (
        <div className="space-y-4">
          <div className="h-36 rounded-2xl bg-secondary/30 animate-pulse" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-secondary/30 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      )}

      {/* ── Empty state ────────────────────────────────────────────────────── */}
      {!loading && !fetching && !data && !error && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">No analysis yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Upload your resume first, then run the analysis to see your gaps.
            </p>
          </div>
          <button
            onClick={runAnalysis}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all"
          >
            <Sparkles className="w-4 h-4" /> Run Analysis
          </button>
        </div>
      )}

      {/* ── Data loaded ────────────────────────────────────────────────────── */}
      {data && !fetching && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

          {/* Hero card */}
          <div className={`p-6 rounded-2xl border border-border/60 bg-gradient-to-br ${readinessCfg.bg} backdrop-blur-sm`}>
            <div className="flex items-center gap-6 flex-wrap">
              <ReadinessRing score={data.overall_readiness || 0} label={data.readiness_label} />
              <div className="flex-1 min-w-[200px] space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Target role</p>
                  <p className="text-lg font-bold text-foreground capitalize mt-0.5">{data.target_role || 'Software Developer'}</p>
                  <span className={`text-sm font-medium ${readinessCfg.color}`}>{data.readiness_label}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <p className={`text-xl font-bold ${data.critical_count > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{data.critical_count || 0}</p>
                    <p className="text-xs text-muted-foreground">Critical</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <p className="text-xl font-bold text-foreground">{data.total_gaps || 0}</p>
                    <p className="text-xs text-muted-foreground">Gaps found</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <p className="text-xl font-bold text-emerald-400">{(data.strong_skills || []).length}</p>
                    <p className="text-xs text-muted-foreground">Strong</p>
                  </div>
                </div>
              </div>
            </div>

            {data.market_insight && (
              <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                <Activity className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{data.market_insight}</p>
              </div>
            )}
          </div>

          {/* Strong skills */}
          {data.strong_skills?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Already strong
              </p>
              <div className="flex flex-wrap gap-2">
                {data.strong_skills.map((s, i) => <SkillPill key={s} skill={s} index={i} />)}
              </div>
            </div>
          )}

          {/* Gaps section */}
          {gaps.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Skill gaps — sorted by learning roadmap
                </p>

                {/* Priority filter */}
                <div className="flex gap-1.5">
                  {['all', 'critical', 'high', 'medium'].map(p => (
                    <button
                      key={p}
                      onClick={() => setFilterPriority(p)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all capitalize
                        ${filterPriority === p
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {visibleGaps.map((gap, i) => (
                  <GapCard key={gap.skill + i} gap={gap} index={i} />
                ))}
              </div>

              {filteredGaps.length > 5 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full mt-3 py-2.5 rounded-xl border border-border bg-card/50 text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 transition-colors"
                >
                  {showAll ? <><ChevronUp className="w-4 h-4" /> Show less</> : <><ChevronDown className="w-4 h-4" /> Show {filteredGaps.length - 5} more gaps</>}
                </button>
              )}
            </div>
          )}

          {/* Re-run hint */}
          <p className="text-xs text-muted-foreground text-center">
            Results based on live job market data. Refresh monthly for updated insights.
          </p>
        </motion.div>
      )}
    </div>
  );
}