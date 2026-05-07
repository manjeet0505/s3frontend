'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Timer, CheckCircle, XCircle, BarChart2, RefreshCw,
  Send, Loader2, Award, TrendingUp, AlertCircle, BookOpen,
  ChevronRight, Zap, Server, Globe, Code2, Database, Cpu,
  Users, Shuffle, Building2, GraduationCap, Briefcase, Star,
  Clock, Target, Trophy, ArrowRight, Sparkles,
} from 'lucide-react';

// ─── Interview Type Definitions ───────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 'algorithms',
    label: 'Algorithms',
    icon: Zap,
    color: 'cyan',
    types: [
      { id: 'dsa', label: 'DSA', desc: 'Arrays, trees, graphs, DP, complexity', icon: '⚡' },
    ],
  },
  {
    id: 'architecture',
    label: 'Architecture',
    icon: Server,
    color: 'violet',
    types: [
      { id: 'system_design', label: 'System Design', desc: 'Scalability, databases, microservices', icon: '🏗️' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    icon: Globe,
    color: 'blue',
    types: [
      { id: 'frontend_general', label: 'Frontend General', desc: 'HTML, CSS, JS, browser APIs', icon: '🌐' },
      { id: 'react', label: 'React / Next.js', desc: 'Hooks, state, SSR, performance', icon: '⚛️' },
      { id: 'css_ui', label: 'CSS & UI', desc: 'Flexbox, Grid, animations, responsive', icon: '🎨' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    icon: Code2,
    color: 'emerald',
    types: [
      { id: 'backend_general', label: 'Backend General', desc: 'APIs, auth, caching, queues', icon: '⚙️' },
      { id: 'nodejs', label: 'Node.js', desc: 'Event loop, streams, Express, async', icon: '🟢' },
      { id: 'python', label: 'Python / Django', desc: 'FastAPI, Django, async, decorators', icon: '🐍' },
      { id: 'java_spring', label: 'Java / Spring', desc: 'JVM, Spring Boot, concurrency', icon: '☕' },
      { id: 'dotnet', label: '.NET / C#', desc: 'ASP.NET, CLR, LINQ, Entity Framework', icon: '🔷' },
    ],
  },
  {
    id: 'fullstack',
    label: 'Full Stack',
    icon: Shuffle,
    color: 'amber',
    types: [
      { id: 'fullstack', label: 'Full Stack', desc: 'End-to-end: frontend + backend + DB', icon: '🔗' },
    ],
  },
  {
    id: 'core_cs',
    label: 'Core CS',
    icon: Cpu,
    color: 'rose',
    types: [
      { id: 'os', label: 'Operating Systems', desc: 'Processes, memory, scheduling, IPC', icon: '💻' },
      { id: 'dbms', label: 'DBMS & SQL', desc: 'Normalization, indexing, transactions', icon: '🗄️' },
      { id: 'networks', label: 'Computer Networks', desc: 'TCP/IP, HTTP, DNS, sockets', icon: '🌍' },
      { id: 'oops', label: 'OOP Concepts', desc: 'SOLID, design patterns, abstraction', icon: '📐' },
    ],
  },
  {
    id: 'behavioral',
    label: 'Behavioral',
    icon: Users,
    color: 'teal',
    types: [
      { id: 'hr', label: 'HR / Behavioural', desc: 'STAR method, leadership, teamwork', icon: '🤝' },
    ],
  },
  {
    id: 'mixed',
    label: 'Mixed',
    icon: Target,
    color: 'orange',
    types: [
      { id: 'mixed', label: 'Full Loop', desc: 'DSA + System Design + HR', icon: '🎯' },
    ],
  },
];

const ALL_TYPES = CATEGORIES.flatMap(c => c.types.map(t => ({ ...t, category: c.id, color: c.color })));

const COLOR_MAP = {
  cyan:   { bg: 'from-cyan-500/15 to-cyan-600/5',   border: 'border-cyan-500/40',   text: 'text-cyan-400',   badge: 'bg-cyan-500/10 text-cyan-400'   },
  violet: { bg: 'from-violet-500/15 to-violet-600/5', border: 'border-violet-500/40', text: 'text-violet-400', badge: 'bg-violet-500/10 text-violet-400' },
  blue:   { bg: 'from-blue-500/15 to-blue-600/5',   border: 'border-blue-500/40',   text: 'text-blue-400',   badge: 'bg-blue-500/10 text-blue-400'   },
  emerald:{ bg: 'from-emerald-500/15 to-emerald-600/5', border: 'border-emerald-500/40', text: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400' },
  amber:  { bg: 'from-amber-500/15 to-amber-600/5', border: 'border-amber-500/40',  text: 'text-amber-400',  badge: 'bg-amber-500/10 text-amber-400'  },
  rose:   { bg: 'from-rose-500/15 to-rose-600/5',   border: 'border-rose-500/40',   text: 'text-rose-400',   badge: 'bg-rose-500/10 text-rose-400'   },
  teal:   { bg: 'from-teal-500/15 to-teal-600/5',   border: 'border-teal-500/40',   text: 'text-teal-400',   badge: 'bg-teal-500/10 text-teal-400'   },
  orange: { bg: 'from-orange-500/15 to-orange-600/5', border: 'border-orange-500/40', text: 'text-orange-400', badge: 'bg-orange-500/10 text-orange-400' },
};

const EXPERIENCE_LEVELS = [
  { id: 'fresher',  label: 'Fresher',    sub: '0–1 yr',  icon: GraduationCap },
  { id: 'junior',   label: 'Junior',     sub: '1–3 yrs', icon: Star },
  { id: 'mid',      label: 'Mid-Level',  sub: '3–5 yrs', icon: Briefcase },
  { id: 'senior',   label: 'Senior',     sub: '5+ yrs',  icon: Trophy },
];

const COMPANY_TIERS = [
  { id: 'faang',    label: 'FAANG / Big Tech', sub: 'Google, Meta, Amazon…' },
  { id: 'product',  label: 'Product Startup',  sub: 'Series A–D companies' },
  { id: 'service',  label: 'IT Services',      sub: 'TCS, Infosys, Wipro…' },
  { id: 'any',      label: 'Any Company',      sub: 'General preparation' },
];

const QUESTION_OPTIONS = [3, 5, 7, 10];

const GRADE_COLORS = {
  'A+': 'text-emerald-400', A: 'text-emerald-400', 'B+': 'text-cyan-400',
  B: 'text-cyan-400', C: 'text-yellow-400', D: 'text-orange-400', F: 'text-red-400',
};

const VERDICT_CONFIG = {
  'strong hire': { label: 'Strong Hire ✦', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  hire:          { label: 'Hire ✓',        color: 'text-cyan-400',    bg: 'bg-cyan-500/10 border-cyan-500/30'    },
  borderline:    { label: 'Borderline',    color: 'text-yellow-400',  bg: 'bg-yellow-500/10 border-yellow-500/30' },
  'no hire':     { label: 'No Hire',       color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/30'     },
};

// Timer limits per category (seconds)
const TIMER_LIMITS = {
  dsa: 900, system_design: 1200, frontend_general: 600, react: 600,
  css_ui: 480, backend_general: 600, nodejs: 600, python: 600,
  java_spring: 600, dotnet: 600, fullstack: 720, os: 600,
  dbms: 600, networks: 600, oops: 600, hr: 300, mixed: 720,
};

// ─── Utilities ────────────────────────────────────────────────────────────────

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function ScoreBar({ score }) {
  const pct = (score / 10) * 100;
  const color = score >= 8 ? 'bg-emerald-500' : score >= 6 ? 'bg-cyan-500' : score >= 4 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="text-xs font-mono tabular-nums w-10 text-right" style={{ color: 'var(--foreground)' }}>{score}/10</span>
    </div>
  );
}

function DifficultyBadge({ difficulty }) {
  const map = {
    easy:   'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    medium: 'bg-yellow-500/10  text-yellow-400  border border-yellow-500/20',
    hard:   'bg-red-500/10     text-red-400     border border-red-500/20',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${map[difficulty] || map.medium}`}>
      {difficulty}
    </span>
  );
}

// ─── Setup Phase ──────────────────────────────────────────────────────────────

function SetupPhase({ onStart }) {
  const [activeCategory, setActiveCategory] = useState('algorithms');
  const [selectedType, setSelectedType] = useState('dsa');
  const [experience, setExperience] = useState('junior');
  const [companyTier, setCompanyTier] = useState('any');
  const [questionCount, setQuestionCount] = useState(5);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedTypeMeta = ALL_TYPES.find(t => t.id === selectedType);
  const colors = COLOR_MAP[selectedTypeMeta?.color || 'cyan'];

  const handleStart = async () => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          interview_type: selectedType,
          total_questions: questionCount,
          job_description: jd.trim() || null,
          experience_level: experience,
          company_tier: companyTier,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to start interview');
      onStart({ ...data, interview_type: selectedType });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const activeCat = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto space-y-8 pb-12"
    >
      {/* Hero */}
      <div className="text-center space-y-3 pt-2">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium"
          style={{ background: 'var(--primary)10', borderColor: 'var(--primary)30', color: 'var(--primary)' }}
        >
          <Sparkles className="w-3 h-3" />
          GPT-4o Powered · Real-time Evaluation · Adaptive Difficulty
        </motion.div>
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
          Mock Interview
        </h1>
        <p className="text-base" style={{ color: 'var(--muted-foreground)' }}>
          Practice like it's real. Get scored like a pro.
        </p>
      </div>

      {/* ── Step 1: Interview Type ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs flex items-center justify-center font-bold">1</span>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Select interview type</h2>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const c = COLOR_MAP[cat.color];
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedType(cat.types[0].id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150
                  ${isActive ? `${c.badge} ${c.border}` : 'border-border/50 text-muted-foreground hover:border-border hover:text-foreground bg-card/30'}`}
              >
                <Icon className="w-3 h-3" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Type grid for active category */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`grid gap-3 ${activeCat?.types.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'}`}
          >
            {activeCat?.types.map(type => {
              const c = COLOR_MAP[activeCat.color];
              const isSelected = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`relative p-4 rounded-xl border text-left transition-all duration-200 group
                    ${isSelected
                      ? `bg-gradient-to-br ${c.bg} ${c.border} shadow-lg`
                      : 'border-border/40 bg-card/40 hover:border-border hover:bg-card/70'
                    }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="selected-check"
                      className="absolute top-2.5 right-2.5"
                    >
                      <CheckCircle className={`w-4 h-4 ${c.text}`} />
                    </motion.div>
                  )}
                  <span className="text-xl">{type.icon}</span>
                  <p className={`font-semibold text-sm mt-1.5 ${isSelected ? c.text : 'text-foreground'}`}>{type.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{type.desc}</p>
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── Step 2: Experience Level ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs flex items-center justify-center font-bold">2</span>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Your experience level</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {EXPERIENCE_LEVELS.map(lvl => {
            const Icon = lvl.icon;
            const isActive = experience === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => setExperience(lvl.id)}
                className={`p-3 rounded-xl border text-left transition-all duration-150
                  ${isActive
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border/50 bg-card/40 hover:border-border hover:bg-card/60'
                  }`}
              >
                <Icon className={`w-4 h-4 mb-1.5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>{lvl.label}</p>
                <p className="text-xs text-muted-foreground">{lvl.sub}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Step 3: Company Tier ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs flex items-center justify-center font-bold">3</span>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Target company tier</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {COMPANY_TIERS.map(tier => {
            const isActive = companyTier === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => setCompanyTier(tier.id)}
                className={`p-3 rounded-xl border text-left transition-all duration-150
                  ${isActive
                    ? 'border-primary bg-primary/10'
                    : 'border-border/50 bg-card/40 hover:border-border hover:bg-card/60'
                  }`}
              >
                <p className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>{tier.label}</p>
                <p className="text-xs text-muted-foreground">{tier.sub}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Step 4: Question Count ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs flex items-center justify-center font-bold">4</span>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Number of questions</h2>
        </div>
        <div className="flex gap-2">
          {QUESTION_OPTIONS.map(n => (
            <button
              key={n}
              onClick={() => setQuestionCount(n)}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all
                ${questionCount === n
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border/50 bg-card/40 text-muted-foreground hover:border-border hover:text-foreground'
                }`}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          ~{questionCount * 3}–{questionCount * 5} minutes
        </p>
      </section>

      {/* ── Step 5: Job Description ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs flex items-center justify-center font-bold">5</span>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
            Job description <span className="text-muted-foreground font-normal">(optional — improves relevance)</span>
          </h2>
        </div>
        <textarea
          value={jd}
          onChange={e => setJd(e.target.value)}
          placeholder="Paste the job description here to get role-specific questions..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm resize-none transition-all"
          maxLength={3000}
        />
        {jd && <p className="text-xs text-muted-foreground text-right">{jd.length}/3000</p>}
      </section>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Start button */}
      <motion.button
        onClick={handleStart}
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.01 }}
        whileTap={{ scale: loading ? 1 : 0.99 }}
        className="w-full py-4 rounded-xl text-sm font-bold tracking-wide transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
        style={{
          background: 'var(--primary)',
          color: 'var(--primary-foreground)',
          boxShadow: '0 0 24px color-mix(in srgb, var(--primary) 30%, transparent)',
        }}
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Generating first question…</>
        ) : (
          <>
            <Brain className="w-4 h-4" />
            Start {selectedTypeMeta?.label} Interview
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </motion.button>
    </motion.div>
  );
}

// ─── Interview Phase ───────────────────────────────────────────────────────────

function InterviewPhase({ session: initialSession, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(initialSession.question);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions] = useState(initialSession.total_questions);
  const [sessionId] = useState(initialSession.session_id);
  const [interviewType] = useState(initialSession.interview_type || 'dsa');
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [lastEval, setLastEval] = useState(null);
  const [showEval, setShowEval] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [questionElapsed, setQuestionElapsed] = useState(0);
  const [questionStart, setQuestionStart] = useState(Date.now());

  const timerRef = useRef(null);
  const qTimerRef = useRef(null);
  const textareaRef = useRef(null);

  const timeLimit = TIMER_LIMITS[interviewType] || 600;

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    setQuestionElapsed(0);
    setQuestionStart(Date.now());
    clearInterval(qTimerRef.current);
    qTimerRef.current = setInterval(() => setQuestionElapsed(e => e + 1), 1000);
    textareaRef.current?.focus();
    return () => clearInterval(qTimerRef.current);
  }, [currentQuestion]);

  const handleSubmit = async () => {
    if (!answer.trim() || submitting) return;
    setError('');
    setSubmitting(true);
    const timeTaken = Math.floor((Date.now() - questionStart) / 1000);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/interview/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          session_id: sessionId,
          question_id: currentQuestion.question_id,
          answer: answer.trim(),
          time_taken: timeTaken,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submission failed');
      setLastEval(data.evaluation);
      setShowEval(true);
      if (data.is_complete) {
        clearInterval(timerRef.current);
        clearInterval(qTimerRef.current);
        setTimeout(() => onComplete(sessionId), 3000);
      } else {
        setTimeout(() => {
          setShowEval(false);
          setCurrentQuestion(data.next_question);
          setQuestionNumber(data.question_number);
          setAnswer('');
        }, 3000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  const progress = ((questionNumber - 1) / totalQuestions) * 100;
  const qTimeLeft = timeLimit - questionElapsed;
  const qTimePct = (questionElapsed / timeLimit) * 100;
  const isTimeLow = qTimeLeft < 60 && qTimeLeft > 0;
  const typeMeta = ALL_TYPES.find(t => t.id === interviewType);
  const colors = COLOR_MAP[typeMeta?.color || 'cyan'];

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${colors.badge} ${colors.border}`}>
            {typeMeta?.icon} {typeMeta?.label}
          </span>
          <span className="text-sm text-muted-foreground font-mono">
            Q{questionNumber}/{totalQuestions}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Per-question timer */}
          <div className={`flex items-center gap-1.5 text-sm font-mono px-2.5 py-1 rounded-lg border transition-colors
            ${isTimeLow ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-card/50 border-border/50 text-muted-foreground'}`}>
            <Timer className="w-3.5 h-3.5" />
            {formatTime(Math.max(0, qTimeLeft))}
          </div>
          {/* Total elapsed */}
          <span className="text-xs text-muted-foreground font-mono hidden sm:block">{formatTime(elapsed)} total</span>
        </div>
      </div>

      {/* Overall progress */}
      <div className="h-0.5 bg-border/30 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-full"
          style={{ background: 'var(--primary)' }}
        />
      </div>

      {/* Per-question time bar */}
      <div className={`h-0.5 rounded-full overflow-hidden ${isTimeLow ? 'bg-red-500/20' : 'bg-border/20'}`}>
        <motion.div
          animate={{ width: `${Math.min(qTimePct, 100)}%` }}
          className={`h-full rounded-full transition-colors ${isTimeLow ? 'bg-red-500' : 'bg-primary/50'}`}
        />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.question_id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          className="p-6 rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm space-y-4"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <DifficultyBadge difficulty={currentQuestion.difficulty} />
            <span className="text-xs text-muted-foreground capitalize px-2 py-0.5 rounded-md bg-secondary/50">
              {currentQuestion.question_type?.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-foreground leading-relaxed text-[15px]">{currentQuestion.question}</p>
          {currentQuestion.hint && (
            <p className="text-xs text-muted-foreground border-l-2 border-primary/30 pl-3 italic">
              Hint: {currentQuestion.hint}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Evaluation flash */}
      <AnimatePresence>
        {showEval && lastEval && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="p-5 rounded-2xl border border-border/50 bg-card/70 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {lastEval.score >= 7
                  ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                  : lastEval.score >= 5
                  ? <AlertCircle className="w-4 h-4 text-yellow-400" />
                  : <XCircle className="w-4 h-4 text-red-400" />
                }
                <span className="text-sm font-medium text-foreground">Answer evaluated</span>
              </div>
              <span className={`text-xl font-bold font-mono ${lastEval.score >= 7 ? 'text-emerald-400' : lastEval.score >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                {lastEval.score}/10
              </span>
            </div>
            <ScoreBar score={lastEval.score} />
            <p className="text-sm text-muted-foreground leading-relaxed">{lastEval.feedback}</p>
            <p className="text-xs text-muted-foreground/60 text-center">
              {lastEval.score >= 7 ? '✦ Great answer — next question loading…' : 'Next question loading…'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer area */}
      {!showEval && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <textarea
            ref={textareaRef}
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your answer here… (Ctrl+Enter to submit)"
            rows={7}
            disabled={submitting}
            className="w-full px-4 py-3.5 rounded-xl border border-border bg-secondary/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm resize-none transition-all disabled:opacity-50 font-mono leading-relaxed"
          />
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-mono">{answer.length} chars</span>
            <button
              onClick={handleSubmit}
              disabled={!answer.trim() || submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              {submitting
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Evaluating…</>
                : <><Send className="w-3.5 h-3.5" /> Submit Answer</>
              }
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Report Phase ─────────────────────────────────────────────────────────────

function ReportPhase({ sessionId, onRetry }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await fetch(`/api/interview/report/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load report');
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-2 border-primary/20 flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
        </div>
        <p className="text-muted-foreground text-sm">Generating your performance report…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 space-y-3">
        <XCircle className="w-10 h-10 text-red-400 mx-auto" />
        <p className="text-red-400">{error}</p>
        <button onClick={onRetry} className="text-sm text-primary underline">Start new interview</button>
      </div>
    );
  }

  const { report: r, questions } = report || {};
  const verdictConf = VERDICT_CONFIG[r?.verdict?.toLowerCase()] || VERDICT_CONFIG.borderline;
  const avgScore = questions?.length
    ? (questions.reduce((sum, q) => sum + (q.score || 0), 0) / questions.length).toFixed(1)
    : r?.overall_score;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6 pb-12"
    >
      {/* Score hero card */}
      <div className="relative overflow-hidden p-8 rounded-2xl border border-border/50 bg-card/80 text-center space-y-4">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, var(--primary), transparent 70%)' }} />
        <div className="relative">
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs mb-3">
            <Award className="w-3.5 h-3.5" /> Interview Complete
          </div>
          <div className={`text-8xl font-black font-mono tracking-tighter ${GRADE_COLORS[r?.grade] || 'text-foreground'}`}>
            {r?.grade || '—'}
          </div>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--foreground)' }}>
            {avgScore}<span className="text-lg text-muted-foreground font-normal">/10</span>
          </p>
          <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm font-semibold mt-3 ${verdictConf.bg} ${verdictConf.color}`}>
            {verdictConf.label}
          </div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mt-3">{r?.summary}</p>
        </div>
      </div>

      {/* Strengths + improvements */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2.5">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Strengths</p>
          {(r?.top_strengths || []).map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-foreground">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> {s}
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2.5">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Improve</p>
          {(r?.top_improvements || []).map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-foreground">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /> {s}
            </div>
          ))}
        </div>
      </div>

      {/* Next steps */}
      {r?.next_steps && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5">
          <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground leading-relaxed">{r.next_steps}</p>
        </div>
      )}

      {/* Per-question breakdown */}
      <div className="space-y-3">
        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Question breakdown</p>
        {(questions || []).map((q, i) => (
          <motion.div
            key={q.question_id || i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="p-4 rounded-xl border border-border/40 bg-card/50 space-y-2.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">Q{i + 1}</span>
                <DifficultyBadge difficulty={q.difficulty} />
              </div>
              <span className={`text-base font-bold font-mono shrink-0 ${q.score >= 7 ? 'text-emerald-400' : q.score >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                {q.score ?? '—'}/10
              </span>
            </div>
            <p className="text-sm text-foreground">{q.question}</p>
            <ScoreBar score={q.score ?? 0} />
            {q.feedback && <p className="text-xs text-muted-foreground leading-relaxed">{q.feedback}</p>}
            {q.ideal_answer_summary && (
              <details className="group">
                <summary className="text-xs text-primary cursor-pointer select-none hover:underline">
                  Show ideal answer ↓
                </summary>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed pl-3 border-l border-primary/20">
                  {q.ideal_answer_summary}
                </p>
              </details>
            )}
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-card/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border/80 transition-all"
        >
          <RefreshCw className="w-4 h-4" /> New Interview
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-primary/30 bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-all"
        >
          <BarChart2 className="w-4 h-4" /> Save Report
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function InterviewPage() {
  const [phase, setPhase] = useState('setup');
  const [sessionData, setSessionData] = useState(null);
  const [completedSessionId, setCompletedSessionId] = useState(null);

  const handleStart = useCallback((data) => {
    setSessionData(data);
    setPhase('interview');
  }, []);

  const handleComplete = useCallback((sessionId) => {
    setCompletedSessionId(sessionId);
    setPhase('report');
  }, []);

  const handleRetry = useCallback(() => {
    setSessionData(null);
    setCompletedSessionId(null);
    setPhase('setup');
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 md:px-10">
      <AnimatePresence mode="wait">
        {phase === 'setup' && (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>
            <SetupPhase onStart={handleStart} />
          </motion.div>
        )}
        {phase === 'interview' && sessionData && (
          <motion.div key="interview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <InterviewPhase session={sessionData} onComplete={handleComplete} />
          </motion.div>
        )}
        {phase === 'report' && completedSessionId && (
          <motion.div key="report" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <ReportPhase sessionId={completedSessionId} onRetry={handleRetry} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}