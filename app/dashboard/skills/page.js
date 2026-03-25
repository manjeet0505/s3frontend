'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Sparkles, RefreshCw, AlertCircle,
  CheckCircle2, Clock, BookOpen, ExternalLink,
  ChevronRight, Loader2, RotateCcw, Play,
  Target, Zap, Award
} from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { skillsApi, progressApi } from '@/lib/api';

const STATUS_CONFIG = {
  not_started: {
    label: 'Not Started',
    color: 'text-muted-foreground',
    bg: 'bg-secondary/40',
    border: 'border-border/40',
    dot: 'bg-muted-foreground',
  },
  learning: {
    label: 'Learning',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    dot: 'bg-blue-400',
  },
  completed: {
    label: 'Completed',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
};

const PRIORITY_COLORS = {
  1: 'text-red-400 bg-red-500/10 border-red-500/30',
  2: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  3: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  4: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
};

function SkeletonCard() {
  return (
    <div className="p-5 rounded-2xl border border-border/50 bg-card/60 animate-pulse space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-secondary/60" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-secondary/60 rounded w-32" />
          <div className="h-3 bg-secondary/60 rounded w-24" />
        </div>
        <div className="w-20 h-7 bg-secondary/60 rounded-full" />
      </div>
      <div className="h-12 bg-secondary/60 rounded-xl" />
      <div className="flex gap-2">
        <div className="h-8 flex-1 bg-secondary/60 rounded-xl" />
        <div className="h-8 flex-1 bg-secondary/60 rounded-xl" />
      </div>
    </div>
  );
}

function CompletionRing({ percent }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="112" height="112">
        <circle
          cx="56" cy="56" r={radius}
          stroke="hsl(var(--border))"
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          cx="56" cy="56" r={radius}
          stroke="hsl(var(--primary))"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="text-center">
        <div className="font-display text-2xl font-bold text-foreground">{percent}%</div>
        <div className="text-xs text-muted-foreground">done</div>
      </div>
    </div>
  );
}

function SkillCard({ skill, index, onStatusChange, updating }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[skill.status] || STATUS_CONFIG.not_started;
  const priorityColor = PRIORITY_COLORS[skill.priority] || PRIORITY_COLORS[4];
  const statuses = ['not_started', 'learning', 'completed'];

  function cycleStatus() {
    const current = statuses.indexOf(skill.status || 'not_started');
    const next = statuses[(current + 1) % statuses.length];
    onStatusChange(skill.skill, next);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={`relative rounded-2xl border transition-all overflow-hidden ${
        skill.status === 'completed'
          ? 'border-emerald-500/30 bg-emerald-500/5'
          : skill.status === 'learning'
          ? 'border-blue-500/20 bg-blue-500/5'
          : 'border-border/50 bg-card/60'
      }`}
    >
      {/* Top shimmer */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${
        skill.status === 'completed' ? 'via-emerald-500/50'
        : skill.status === 'learning' ? 'via-blue-500/50'
        : 'via-border'
      } to-transparent`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Priority badge */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold ${priorityColor}`}>
            {skill.priority}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display text-base font-bold text-foreground">{skill.skill}</h3>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              ~{skill.estimated_days} days to learn
            </div>
          </div>

          {/* Status badge — clickable to cycle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={cycleStatus}
            disabled={updating}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${status.color} ${status.bg} ${status.border} disabled:opacity-50`}
          >
            {updating
              ? <Loader2 className="w-3 h-3 animate-spin" />
              : <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            }
            {status.label}
          </motion.button>
        </div>

        {/* Reason */}
        {skill.reason && (
          <p className="text-xs text-muted-foreground leading-relaxed mb-3 pl-11">
            {skill.reason}
          </p>
        )}

        {/* Resources toggle */}
        {skill.resources?.length > 0 && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors pl-11 mb-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              {expanded ? 'Hide resources' : `View ${skill.resources.length} learning resources`}
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pl-11 pt-2 space-y-2">
                    {skill.resources.map((r, i) => (
                      <motion.a
                        key={i}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-secondary/30 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {r.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{r.platform}</p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-3" />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Quick action buttons */}
        <div className="flex gap-2 mt-3 pl-11">
          {skill.status !== 'learning' && skill.status !== 'completed' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onStatusChange(skill.skill, 'learning')}
              disabled={updating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold hover:bg-blue-500/20 transition-all disabled:opacity-50"
            >
              <Play className="w-3 h-3" />
              Start Learning
            </motion.button>
          )}
          {skill.status === 'learning' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onStatusChange(skill.skill, 'completed')}
              disabled={updating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-3 h-3" />
              Mark Complete
            </motion.button>
          )}
          {skill.status === 'completed' && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <Award className="w-3.5 h-3.5" />
              Skill mastered!
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function SkillsPage() {
  const { getUserId } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [updatingSkill, setUpdatingSkill] = useState(null);
  const [resetConfirm, setResetConfirm] = useState(false);

  const userId = getUserId();

  useEffect(() => {
    if (userId) loadProgress();
  }, [userId]);

  async function loadProgress() {
    setLoading(true);
    setError('');
    try {
      const res = await progressApi.get(userId);
      setData(res.data);
    } catch (err) {
      if (err?.response?.status === 404) {
        setData(null);
      } else {
        setError('Failed to load progress. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function runAnalysis() {
    setAnalyzing(true);
    setError('');
    try {
      await skillsApi.getGap(userId);
      await loadProgress();
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        'Analysis failed. Make sure your resume is uploaded first.'
      );
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleStatusChange(skill, status) {
    setUpdatingSkill(skill);
    try {
      await progressApi.update(userId, skill, status);
      setData(prev => {
        const updatedSkills = prev.skills.map(s =>
          s.skill === skill ? { ...s, status } : s
        );
        const completed = updatedSkills.filter(s => s.status === 'completed').length;
        const learning = updatedSkills.filter(s => s.status === 'learning').length;
        const not_started = updatedSkills.filter(s => s.status === 'not_started').length;
        const total = updatedSkills.length;
        return {
          ...prev,
          skills: updatedSkills,
          summary: {
            ...prev.summary,
            completed,
            learning,
            not_started,
            completion_percent: total > 0 ? Math.round((completed / total) * 100) : 0,
          }
        };
      });
    } catch {
      setError('Failed to update skill status. Try again.');
    } finally {
      setUpdatingSkill(null);
    }
  }

  async function handleReset() {
    try {
      await progressApi.reset(userId);
      setResetConfirm(false);
      await loadProgress();
    } catch {
      setError('Failed to reset progress.');
    }
  }

  const summary = data?.summary;
  const skills = data?.skills || [];

  // ai_summary is the GPT text — data.summary is the stats object
  // They are different fields intentionally
  const aiSummaryText = typeof data?.ai_summary === 'string' ? data.ai_summary : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-muted-foreground font-medium">AI Skill Analysis</span>
          </div>
          <h2 className="font-display text-2xl font-bold">Skill Gap Tracker</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Know exactly what to learn next to land your target role
          </p>
        </div>

        <div className="flex items-center gap-2">
          {data && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setResetConfirm(true)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border/60 bg-card/40 text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={runAnalysis}
            disabled={analyzing || loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/25"
          >
            {analyzing
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
              : <><Zap className="w-4 h-4" /> {data ? 'Re-analyze' : 'Run Analysis'}</>
            }
          </motion.button>
        </div>
      </motion.div>

      {/* Reset confirm */}
      <AnimatePresence>
        {resetConfirm && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-between px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/30"
          >
            <p className="text-sm text-red-400 font-medium">
              Reset all progress back to not started?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setResetConfirm(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-border/60 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-colors"
              >
                Yes, Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Analyzing state */}
      {analyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="relative w-16 h-16 mb-5">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <div className="absolute inset-3 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
          </div>
          <h3 className="font-display text-lg font-bold mb-2">Analyzing your skill gaps...</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            GPT-4o is comparing your resume skills against job requirements. This takes ~15 seconds.
          </p>
        </motion.div>
      )}

      {/* No data yet */}
      {!loading && !analyzing && !data && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-28 text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-orange-500/10 flex items-center justify-center mb-5">
            <Target className="w-9 h-9 text-orange-400" />
          </div>
          <h3 className="font-display text-xl font-bold mb-2">No analysis yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">
            Run an AI analysis to identify exactly which skills you need to land your
            target role, with resources and timelines for each.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={runAnalysis}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 hover:opacity-90 transition-all"
          >
            <Zap className="w-4 h-4" />
            Run Skill Gap Analysis
          </motion.button>
        </motion.div>
      )}

      {/* Results */}
      {!loading && !analyzing && data && skills.length > 0 && (
        <>
          {/* Summary row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            {/* Completion ring */}
            <div className="md:col-span-1 flex flex-col items-center justify-center p-5 rounded-2xl border border-border/50 bg-card/60">
              <CompletionRing percent={summary?.completion_percent || 0} />
              <p className="text-xs text-muted-foreground mt-3 text-center">Overall Progress</p>
            </div>

            {/* Stats */}
            <div className="md:col-span-3 grid grid-cols-3 gap-3">
              {[
                { label: 'Not Started', value: summary?.not_started || 0, color: 'text-muted-foreground', bg: 'bg-secondary/40', border: 'border-border/40' },
                { label: 'Learning', value: summary?.learning || 0, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                { label: 'Completed', value: summary?.completed || 0, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className={`flex flex-col items-center justify-center py-5 rounded-2xl border ${s.bg} ${s.border}`}
                >
                  <span className={`text-3xl font-bold font-display ${s.color}`}>{s.value}</span>
                  <span className="text-xs text-muted-foreground mt-1">{s.label}</span>
                </motion.div>
              ))}

              {/* Time estimate */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="col-span-3 flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-orange-500/20 bg-orange-500/5"
              >
                <Clock className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    ~{summary?.total_estimated_days || 0} days to bridge all gaps
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {data.target_role
                      ? `Based on requirements for ${data.target_role}`
                      : 'Based on your matched job requirements'}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* AI Summary — only render if it's a string */}
          {aiSummaryText && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/15"
            >
              <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-primary mb-1">AI Summary</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{aiSummaryText}</p>
              </div>
            </motion.div>
          )}

          {/* Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <Zap className="w-3.5 h-3.5" />
            Click a status badge or use the buttons below each skill to track your progress
          </motion.div>

          {/* Skill cards */}
          <div className="space-y-4">
            {skills.map((skill, i) => (
              <SkillCard
                key={skill.skill}
                skill={skill}
                index={i}
                onStatusChange={handleStatusChange}
                updating={updatingSkill === skill.skill}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}