'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Timer, ChevronRight, CheckCircle, XCircle,
  BarChart2, RefreshCw, Send, Loader2, Award,
  TrendingUp, AlertCircle, BookOpen, Mic,
} from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────

const INTERVIEW_TYPES = [
  {
    id: 'dsa',
    label: 'DSA',
    full: 'Data Structures & Algorithms',
    icon: '⚡',
    desc: 'Arrays, trees, graphs, DP, complexity',
    color: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/40',
    badge: 'bg-cyan-500/10 text-cyan-400',
  },
  {
    id: 'system_design',
    label: 'System Design',
    full: 'System Design',
    icon: '🏗️',
    desc: 'Scalability, databases, architecture',
    color: 'from-violet-500/20 to-purple-500/20',
    border: 'border-violet-500/40',
    badge: 'bg-violet-500/10 text-violet-400',
  },
  {
    id: 'hr',
    label: 'HR / Behavioural',
    full: 'HR & Behavioural',
    icon: '🤝',
    desc: 'STAR method, leadership, teamwork',
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/40',
    badge: 'bg-emerald-500/10 text-emerald-400',
  },
  {
    id: 'mixed',
    label: 'Mixed',
    full: 'Mixed Interview',
    icon: '🎯',
    desc: 'Full loop: DSA + Design + HR',
    color: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/40',
    badge: 'bg-amber-500/10 text-amber-400',
  },
];

const QUESTION_OPTIONS = [3, 5, 7, 10];

const GRADE_COLORS = {
  'A+': 'text-emerald-400', A: 'text-emerald-400', 'B+': 'text-cyan-400',
  B: 'text-cyan-400', C: 'text-yellow-400', D: 'text-orange-400', F: 'text-red-400',
};

const VERDICT_CONFIG = {
  'strong hire': { label: 'Strong Hire', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  'hire': { label: 'Hire', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
  'borderline': { label: 'Borderline', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  'no hire': { label: 'No Hire', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
};

// ── Utilities ──────────────────────────────────────────────────────────────────

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function ScoreBar({ score }) {
  const pct = (score / 10) * 100;
  const color =
    score >= 8 ? 'bg-emerald-500' :
    score >= 6 ? 'bg-cyan-500' :
    score >= 4 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="text-xs font-mono text-foreground w-8 text-right">{score}/10</span>
    </div>
  );
}

function DifficultyBadge({ difficulty }) {
  const map = {
    easy: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    medium: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    hard: 'bg-red-500/10 text-red-400 border border-red-500/20',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${map[difficulty] || map.medium}`}>
      {difficulty}
    </span>
  );
}

// ── Phase: Setup ──────────────────────────────────────────────────────────────

function SetupPhase({ onStart }) {
  const [selectedType, setSelectedType] = useState('dsa');
  const [questionCount, setQuestionCount] = useState(5);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to start interview');
      onStart(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selected = INTERVIEW_TYPES.find(t => t.id === selectedType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-2">
          <Brain className="w-3 h-3" /> AI-Powered Mock Interviews
        </div>
        <h1 className="text-3xl font-bold text-foreground">Mock Interview</h1>
        <p className="text-muted-foreground">Practice with GPT-4o. Get scored. Improve fast.</p>
      </div>

      {/* Type selector */}
      <div>
        <p className="text-sm font-medium text-foreground mb-3">Choose interview type</p>
        <div className="grid grid-cols-2 gap-3">
          {INTERVIEW_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`relative p-4 rounded-xl border text-left transition-all duration-200
                ${selectedType === type.id
                  ? `bg-gradient-to-br ${type.color} ${type.border} scale-[1.02]`
                  : 'border-border/50 bg-card/50 hover:border-border hover:bg-card'
                }`}
            >
              {selectedType === type.id && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
              )}
              <span className="text-2xl">{type.icon}</span>
              <p className="font-semibold text-foreground mt-1 text-sm">{type.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{type.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Question count */}
      <div>
        <p className="text-sm font-medium text-foreground mb-3">Number of questions</p>
        <div className="flex gap-2">
          {QUESTION_OPTIONS.map(n => (
            <button
              key={n}
              onClick={() => setQuestionCount(n)}
              className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition-all
                ${questionCount === n
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card/50 text-muted-foreground hover:border-border/80 hover:text-foreground'
                }`}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          ~{questionCount * 3}–{questionCount * 5} minutes
        </p>
      </div>

      {/* Optional JD */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">
          Job description <span className="text-muted-foreground font-normal">(optional — improves relevance)</span>
        </p>
        <textarea
          value={jd}
          onChange={e => setJd(e.target.value)}
          placeholder="Paste the job description here..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm resize-none"
          maxLength={3000}
        />
        {jd && (
          <p className="text-xs text-muted-foreground mt-1">{jd.length}/3000</p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Start button */}
      <button
        onClick={handleStart}
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:scale-100 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Generating first question...</>
        ) : (
          <><Brain className="w-4 h-4" /> Start {selected?.full} Interview ({questionCount} Qs)</>
        )}
      </button>
    </motion.div>
  );
}

// ── Phase: Interview ───────────────────────────────────────────────────────────

function InterviewPhase({ session: initialSession, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(initialSession.question);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions] = useState(initialSession.total_questions);
  const [sessionId] = useState(initialSession.session_id);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [lastEval, setLastEval] = useState(null);
  const [showEval, setShowEval] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [questionStart, setQuestionStart] = useState(Date.now());

  const timerRef = useRef(null);
  const textareaRef = useRef(null);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Reset question timer when question changes
  useEffect(() => {
    setQuestionStart(Date.now());
    textareaRef.current?.focus();
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
        setTimeout(() => onComplete(sessionId), 2800);
      } else {
        setTimeout(() => {
          setShowEval(false);
          setCurrentQuestion(data.next_question);
          setQuestionNumber(data.question_number);
          setAnswer('');
        }, 2800);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  const progress = ((questionNumber - 1) / totalQuestions) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Brain className="w-4 h-4 text-primary" />
          <span>Q{questionNumber} of {totalQuestions}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-mono text-muted-foreground">
          <Timer className="w-3.5 h-3.5" />
          {formatTime(elapsed)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-border/50 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
          className="h-full bg-primary rounded-full"
        />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.question_id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="p-6 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm space-y-3"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <DifficultyBadge difficulty={currentQuestion.difficulty} />
            <span className="text-xs text-muted-foreground capitalize">{currentQuestion.question_type?.replace('_', ' ')}</span>
          </div>
          <p className="text-foreground font-medium leading-relaxed">{currentQuestion.question}</p>
        </motion.div>
      </AnimatePresence>

      {/* Evaluation flash */}
      <AnimatePresence>
        {showEval && lastEval && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="p-4 rounded-xl border border-border/60 bg-card/60 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Answer scored</span>
              <span className={`text-lg font-bold font-mono ${lastEval.score >= 7 ? 'text-emerald-400' : lastEval.score >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                {lastEval.score}/10
              </span>
            </div>
            <ScoreBar score={lastEval.score} />
            <p className="text-xs text-muted-foreground">{lastEval.feedback}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer textarea */}
      {!showEval && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <textarea
            ref={textareaRef}
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer here... (Ctrl+Enter to submit)"
            rows={6}
            disabled={submitting}
            className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm resize-none transition-all disabled:opacity-50"
          />

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{answer.length} chars</span>
            <button
              onClick={handleSubmit}
              disabled={!answer.trim() || submitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:scale-100"
            >
              {submitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Evaluating...</> : <><Send className="w-3.5 h-3.5" /> Submit Answer</>}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ── Phase: Report ──────────────────────────────────────────────────────────────

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
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Generating your report...</p>
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Score hero */}
      <div className="p-8 rounded-2xl border border-border/60 bg-card/80 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-1">
          <Award className="w-4 h-4" /> Interview Complete
        </div>
        <div className={`text-7xl font-bold font-mono ${GRADE_COLORS[r?.grade] || 'text-foreground'}`}>
          {r?.grade || '—'}
        </div>
        <p className="text-2xl font-semibold text-foreground">{r?.overall_score}/10</p>
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium ${verdictConf.bg} ${verdictConf.color}`}>
          {verdictConf.label}
        </div>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">{r?.summary}</p>
      </div>

      {/* Strengths + improvements */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
          <p className="text-xs font-medium text-emerald-400 uppercase tracking-wide">Strengths</p>
          {(r?.top_strengths || []).map((s, i) => (
            <div key={i} className="flex items-start gap-1.5 text-sm text-foreground">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              {s}
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
          <p className="text-xs font-medium text-amber-400 uppercase tracking-wide">Improve</p>
          {(r?.top_improvements || []).map((s, i) => (
            <div key={i} className="flex items-start gap-1.5 text-sm text-foreground">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Next steps */}
      {r?.next_steps && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5">
          <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">{r.next_steps}</p>
        </div>
      )}

      {/* Per-question breakdown */}
      <div>
        <p className="text-sm font-medium text-foreground mb-3">Question breakdown</p>
        <div className="space-y-3">
          {(questions || []).map((q, i) => (
            <div key={q.question_id || i} className="p-4 rounded-xl border border-border/50 bg-card/50 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-muted-foreground">Q{i + 1}</span>
                  <DifficultyBadge difficulty={q.difficulty} />
                </div>
                <span className={`text-sm font-bold font-mono shrink-0 ${q.score >= 7 ? 'text-emerald-400' : q.score >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {q.score ?? '—'}/10
                </span>
              </div>
              <p className="text-sm text-foreground">{q.question}</p>
              <ScoreBar score={q.score ?? 0} />
              {q.feedback && <p className="text-xs text-muted-foreground">{q.feedback}</p>}
              {q.ideal_answer_summary && (
                <details className="group">
                  <summary className="text-xs text-primary cursor-pointer select-none">Show ideal answer</summary>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{q.ideal_answer_summary}</p>
                </details>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Retry */}
      <button
        onClick={onRetry}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-card/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border/80 transition-all"
      >
        <RefreshCw className="w-4 h-4" /> Start new interview
      </button>
    </motion.div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function InterviewPage() {
  const [phase, setPhase] = useState('setup'); // setup | interview | report
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
    <div className="min-h-screen px-4 py-8 md:px-8">
      <AnimatePresence mode="wait">
        {phase === 'setup' && (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SetupPhase onStart={handleStart} />
          </motion.div>
        )}
        {phase === 'interview' && sessionData && (
          <motion.div key="interview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <InterviewPhase session={sessionData} onComplete={handleComplete} />
          </motion.div>
        )}
        {phase === 'report' && completedSessionId && (
          <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ReportPhase sessionId={completedSessionId} onRetry={handleRetry} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}