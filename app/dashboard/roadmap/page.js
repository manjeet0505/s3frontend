'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Target, Clock, CheckCircle2, Circle,
  ExternalLink, ChevronDown, ChevronUp, Trophy,
  Zap, BookOpen, Hammer, Send, X, RefreshCw,
  TrendingUp, Calendar, Flame, Award, Bot,
  BarChart2, ArrowRight
} from 'lucide-react';

/* ─── Styles ─────────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

.rm-root { font-family:'DM Sans',sans-serif; background:#04040e; min-height:100vh; color:#e8e8f4; position:relative; overflow-x:hidden; }

.hex-grid {
  background-image: radial-gradient(rgba(99,102,241,0.07) 1px, transparent 1px);
  background-size: 28px 28px;
  position:fixed; inset:0; pointer-events:none; z-index:0;
}

.syne { font-family:'Syne',sans-serif; }
.mono { font-family:'JetBrains Mono',monospace; }

.glass {
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 18px;
  backdrop-filter: blur(12px);
}

.month-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  transition: border-color 0.3s;
  overflow: hidden;
}

.task-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  transition: all 0.2s;
  padding: 12px 14px;
}
.task-card:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.12); }
.task-card.done { background: rgba(16,185,129,0.04); border-color: rgba(16,185,129,0.15); }

.coach-btn {
  background: rgba(99,102,241,0.1);
  border: 1px solid rgba(99,102,241,0.25);
  border-radius: 7px;
  padding: 4px 10px;
  color: #818cf8;
  font-size: 11px;
  cursor: pointer;
  font-family: 'DM Sans';
  transition: all 0.2s;
  display: flex; align-items: center; gap: 5px;
  white-space: nowrap;
}
.coach-btn:hover { background: rgba(99,102,241,0.2); border-color: #818cf8; }

.generate-btn {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border: none;
  border-radius: 14px;
  padding: 16px 36px;
  color: white;
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex; align-items: center; gap: 10px;
  box-shadow: 0 0 32px rgba(99,102,241,0.35);
  transition: all 0.2s;
}
.generate-btn:hover { transform: translateY(-2px); box-shadow: 0 0 48px rgba(99,102,241,0.5); }
.generate-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.drawer-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(6px); z-index:50; }
.drawer-panel {
  position:fixed; top:0; right:0; bottom:0;
  width: min(520px, 92vw);
  background:#0c0c1e;
  border-left: 1px solid rgba(255,255,255,0.08);
  z-index:51;
  display:flex; flex-direction:column;
  overflow:hidden;
}

.week-header {
  display:flex; align-items:center; gap:10px;
  padding: 10px 16px;
  cursor:pointer;
  background: rgba(255,255,255,0.02);
  border-radius: 10px;
  transition: background 0.2s;
}
.week-header:hover { background: rgba(255,255,255,0.04); }

.milestone-banner {
  border-radius: 14px;
  padding: 14px 18px;
  display: flex; align-items: center; gap: 14px;
  margin-top: 16px;
}

.progress-ring-text { font-family: 'JetBrains Mono', monospace; }

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
.shimmer-box {
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.8s infinite;
  border-radius: 12px;
}

@keyframes orbit { 0% { transform: rotate(0deg) translateX(28px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(28px) rotate(-360deg); } }
.orbit-dot { animation: orbit 3s linear infinite; }

@keyframes countUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
`;

/* ─── Constants ──────────────────────────────────────────────────────────────── */
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const CATEGORY_META = {
  learn:   { label: 'Learn',   color: '#6366f1', bg: 'rgba(99,102,241,0.1)',   icon: BookOpen },
  build:   { label: 'Build',   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   icon: Hammer },
  apply:   { label: 'Apply',   color: '#10b981', bg: 'rgba(16,185,129,0.1)',   icon: Send },
  network: { label: 'Network', color: '#ec4899', bg: 'rgba(236,72,153,0.1)',   icon: TrendingUp },
};

const SCAN_STEPS = [
  'Loading your profile & skill gaps…',
  'Fetching live market demand for your role…',
  'Analyzing top job postings…',
  'Sequencing skills by priority…',
  'Building your personalized 3-month plan…',
  'Verifying resources & finalizing…',
];

/* ─── Progress Ring ──────────────────────────────────────────────────────────── */
function ProgressRing({ pct, size = 80, stroke = 7, color = '#6366f1', label }) {
  const [p, setP] = useState(0);
  const R = (size - stroke) / 2;
  const C = 2 * Math.PI * R;

  useEffect(() => {
    const t = setTimeout(() => setP(pct), 300);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        <circle
          cx={size/2} cy={size/2} r={R} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={C} strokeDashoffset={C - (p / 100) * C}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)',
            filter: `drop-shadow(0 0 6px ${color}80)`
          }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div className="mono" style={{ fontSize: size < 70 ? 13 : 16, fontWeight: 700, color: '#f0f0f8' }}>{p}%</div>
        {label && <div style={{ fontSize: 9, color: 'rgba(240,240,248,0.4)', marginTop: 1 }}>{label}</div>}
      </div>
    </div>
  );
}

/* ─── Generating Screen ──────────────────────────────────────────────────────── */
function GeneratingScreen() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep(s => Math.min(s + 1, SCAN_STEPS.length - 1)), 1100);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 48 }}>
      {/* Orbital animation */}
      <div style={{ position: 'relative', width: 90, height: 90 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '1px solid rgba(99,102,241,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Sparkles size={28} color="#6366f1" />
        </div>
        {[0, 120, 240].map((deg, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 8, height: 8, marginTop: -4, marginLeft: -4,
            borderRadius: '50%', background: ['#6366f1','#0ea5e9','#10b981'][i],
            transform: `rotate(${deg}deg) translateX(36px)`,
            animation: `orbit ${2 + i * 0.4}s linear infinite`,
            boxShadow: `0 0 8px ${['#6366f1','#0ea5e9','#10b981'][i]}`
          }} />
        ))}
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 340 }}>
        {SCAN_STEPS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i <= step ? 1 : 0.15, x: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              border: `1.5px solid ${i < step ? '#10b981' : i === step ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
              background: i < step ? 'rgba(16,185,129,0.15)' : i === step ? 'rgba(99,102,241,0.15)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {i < step && <CheckCircle2 size={11} color="#10b981" />}
              {i === step && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1' }} />}
            </div>
            <span className="mono" style={{ fontSize: 12, color: i < step ? '#10b981' : i === step ? '#a5b4fc' : 'rgba(240,240,248,0.2)' }}>
              {s}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── AI Coach Drawer ────────────────────────────────────────────────────────── */
function CoachDrawer({ task, userId, userCtx, onClose }) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: `I'm your AI Coach for this task. Ask me anything — what to build, how to approach it, or where you're stuck.` }
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!question.trim() || loading) return;
    const q = question.trim();
    setQuestion('');
    setMessages(m => [...m, { role: 'user', text: q }]);
    setLoading(true);
    try {
      const res  = await fetch(`${API}/roadmap/coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id:          userId,
          task_title:       task.title,
          task_description: task.description,
          user_question:    q,
        })
      });
      const data = await res.json();
      setMessages(m => [...m, { role: 'ai', text: data.answer || 'Something went wrong.' }]);
    } catch {
      setMessages(m => [...m, { role: 'ai', text: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const QUICK = ['What exactly should I build?', 'I\'m stuck, help me start', 'Why does this matter for my role?'];

  return (
    <>
      <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div className="drawer-panel" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 280 }}>
        {/* Header */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={16} color="#818cf8" />
              </div>
              <div>
                <div className="syne" style={{ fontSize: 14, fontWeight: 700, color: '#e8e8f4' }}>AI Coach</div>
                <div style={{ fontSize: 11, color: 'rgba(240,240,248,0.4)' }}>Context-aware guidance</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}>
              <X size={13} />
            </button>
          </div>
          {/* Task context pill */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 12px' }}>
            <div style={{ fontSize: 11, color: 'rgba(240,240,248,0.4)', marginBottom: 3 }}>Current Task</div>
            <div style={{ fontSize: 13, color: '#e8e8f4', fontWeight: 500 }}>{task.title}</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: m.role === 'user' ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${m.role === 'user' ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                padding: '10px 14px',
                fontSize: 13, lineHeight: 1.6,
                color: m.role === 'user' ? '#c7d2fe' : 'rgba(240,240,248,0.85)'
              }}>
              {m.text}
            </motion.div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 5, padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px 14px 14px 4px' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', animation: 'orbit 1s ease-in-out infinite', animationDelay: `${i*0.2}s`, opacity: 0.7 }} />
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick questions */}
        <div style={{ padding: '0 20px 12px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {QUICK.map((q, i) => (
            <button key={i} onClick={() => { setQuestion(q); }}
              style={{ fontSize: 10, color: 'rgba(240,240,248,0.5)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '4px 10px', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'DM Sans' }}>
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '0 20px 20px', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 14px' }}>
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask anything about this task…"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#e8e8f4', fontSize: 13, fontFamily: 'DM Sans' }}
            />
            <button onClick={send} disabled={!question.trim() || loading}
              style={{ background: question.trim() ? '#6366f1' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: question.trim() ? 'pointer' : 'default', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <Send size={13} />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ─── Task Card ──────────────────────────────────────────────────────────────── */
function TaskCard({ task, userId, onToggle, onCoach }) {
  const cat  = CATEGORY_META[task.category] || CATEGORY_META.learn;
  const Icon = cat.icon;

  return (
    <div className={`task-card ${task.completed ? 'done' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        {/* Checkbox */}
        <button onClick={() => onToggle(task.id, !task.completed)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 1, flexShrink: 0 }}>
          {task.completed
            ? <CheckCircle2 size={18} color="#10b981" />
            : <Circle size={18} color="rgba(240,240,248,0.25)" />
          }
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 5 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: task.completed ? 'rgba(240,240,248,0.4)' : '#e8e8f4', textDecoration: task.completed ? 'line-through' : 'none', lineHeight: 1.4 }}>
              {task.title}
            </span>
            <button className="coach-btn" onClick={() => onCoach(task)}>
              <Bot size={10} /> Ask Coach
            </button>
          </div>

          <p style={{ fontSize: 11.5, color: 'rgba(240,240,248,0.5)', lineHeight: 1.6, margin: '0 0 8px 0' }}>
            {task.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {/* Category */}
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: cat.color, background: cat.bg, border: `1px solid ${cat.color}30`, padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
              <Icon size={9} /> {cat.label}
            </span>
            {/* Hours */}
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'rgba(240,240,248,0.4)' }}>
              <Clock size={9} /> {task.estimated_hours}h
            </span>
            {/* Resource */}
            {task.resource_url && (
              <a href={task.resource_url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'rgba(240,240,248,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#a5b4fc'}
                onMouseLeave={e => e.target.style.color = 'rgba(240,240,248,0.4)'}
              >
                <ExternalLink size={9} /> {task.resource_name}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Month Card ─────────────────────────────────────────────────────────────── */
function MonthCard({ month, userId, onTaskToggle, onCoach, delay = 0 }) {
  const [openWeeks, setOpenWeeks] = useState({ 0: true });
  const pct   = month.progress || 0;
  const color = month.color || '#6366f1';

  const toggleWeek = (i) => setOpenWeeks(w => ({ ...w, [i]: !w[i] }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="month-card"
      style={{ borderTop: `2px solid ${color}` }}
    >
      {/* Month Header */}
      <div style={{ padding: '20px 22px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="mono" style={{ fontSize: 10, color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Month {month.month}
              </span>
              {month.milestone_achieved && (
                <span style={{ fontSize: 9, color: '#f59e0b', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 20, padding: '1px 7px' }}>
                  ✦ Completed
                </span>
              )}
            </div>
            <h3 className="syne" style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#f0f0f8' }}>{month.title}</h3>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(240,240,248,0.4)', fontStyle: 'italic' }}>{month.theme}</p>
          </div>
          <ProgressRing pct={pct} color={color} size={70} stroke={6} />
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {month.weeks.map((w, i) => {
            const done = w.tasks.filter(t => t.completed).length;
            return (
              <div key={i} style={{ fontSize: 10, color: 'rgba(240,240,248,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: done === w.tasks.length ? '#10b981' : 'rgba(255,255,255,0.1)' }} />
                Wk {i + 1 + (month.month - 1) * 4}: {done}/{w.tasks.length}
              </div>
            );
          })}
        </div>
      </div>

      {/* Weeks */}
      <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {month.weeks.map((week, wi) => {
          const isOpen  = openWeeks[wi] !== false;
          const weekDone = week.tasks.filter(t => t.completed).length;

          return (
            <div key={wi} style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, overflow: 'hidden' }}>
              {/* Week header */}
              <div className="week-header" onClick={() => toggleWeek(wi)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                  <span className="mono" style={{ fontSize: 10, color: 'rgba(240,240,248,0.4)', minWidth: 44 }}>
                    WK {wi + 1 + (month.month - 1) * 4}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#e8e8f4' }}>{week.focus}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, color: weekDone === week.tasks.length ? '#10b981' : 'rgba(240,240,248,0.3)' }}>
                    {weekDone}/{week.tasks.length}
                  </span>
                  {isOpen ? <ChevronUp size={13} color="rgba(240,240,248,0.4)" /> : <ChevronDown size={13} color="rgba(240,240,248,0.4)" />}
                </div>
              </div>

              {/* Tasks */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '8px 12px 12px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {week.tasks.map(task => (
                        <TaskCard key={task.id} task={task} userId={userId} onToggle={onTaskToggle} onCoach={onCoach} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Milestone */}
      <div style={{ padding: '0 14px 16px' }}>
        <div className="milestone-banner" style={{
          background: month.milestone_achieved ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.02)',
          border: `1px solid ${month.milestone_achieved ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.07)'}`,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: month.milestone_achieved ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)' }}>
            {month.milestone_achieved ? <Trophy size={18} color="#f59e0b" /> : <Award size={18} color="rgba(240,240,248,0.2)" />}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: month.milestone_achieved ? '#f59e0b' : 'rgba(240,240,248,0.4)', fontFamily: 'Syne' }}>
              {month.milestone_achieved ? '🏆 ' : '🔒 '}{month.milestone_title}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(240,240,248,0.4)', marginTop: 2, lineHeight: 1.5 }}>
              {month.milestone_description}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────────── */
export default function CareerRoadmapPage() {
  const [phase, setPhase]       = useState('idle');   // idle | generating | ready
  const [roadmap, setRoadmap]   = useState(null);
  const [error, setError]       = useState(null);
  const [coachTask, setCoachTask] = useState(null);

  const userId = typeof window !== 'undefined'
    ? (localStorage.getItem('user_id') || 'demo_user')
    : 'demo_user';

  /* Load saved roadmap on mount */
  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    try {
      const res  = await fetch(`${API}/roadmap/${userId}`);
      const data = await res.json();
      if (data?.data) {
        setRoadmap(data.data);
        setPhase('ready');
      }
    } catch { /* no roadmap yet */ }
  };

  const generate = async () => {
    setPhase('generating');
    setError(null);
    try {
      const res  = await fetch(`${API}/roadmap/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.detail || data.error || 'Generation failed');
      setRoadmap(data.data);
      setPhase('ready');
    } catch (e) {
      setError(e.message);
      setPhase('idle');
    }
  };

  const toggleTask = async (taskId, completed) => {
    // Optimistic UI update
    setRoadmap(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      let total = 0, done = 0;
      for (const month of next.months) {
        for (const week of month.weeks) {
          for (const task of week.tasks) {
            if (task.id === taskId) { task.completed = completed; task.completed_at = completed ? new Date().toISOString() : null; }
            total++;
            if (task.completed) done++;
          }
        }
        const mTotal = month.weeks.reduce((s, w) => s + w.tasks.length, 0);
        const mDone  = month.weeks.reduce((s, w) => s + w.tasks.filter(t => t.completed).length, 0);
        month.progress          = mTotal > 0 ? Math.round((mDone / mTotal) * 100) : 0;
        month.milestone_achieved = month.progress === 100;
      }
      next.completed_tasks  = done;
      next.overall_progress = total > 0 ? Math.round((done / total) * 100) : 0;
      return next;
    });

    // Persist to backend
    try {
      await fetch(`${API}/roadmap/complete-task`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, task_id: taskId, completed })
      });
    } catch { /* optimistic is fine */ }
  };

  const r = roadmap;
  const overallPct    = r?.overall_progress || 0;
  const completedTasks = r?.completed_tasks || 0;
  const totalTasks    = r?.total_tasks || 0;
  const hoursLeft     = r ? (totalTasks - completedTasks) * (r.weekly_commitment_hours / 5) : 0;

  return (
    <div className="rm-root">
      <style>{CSS}</style>
      <div className="hex-grid" />

      {/* Ambient glows */}
      <div style={{ position: 'fixed', top: -200, left: -200, width: 500, height: 500, borderRadius: '50%', background: '#6366f1', opacity: 0.06, filter: 'blur(120px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: '#0ea5e9', opacity: 0.05, filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1140, margin: '0 auto', padding: '32px 20px' }}>

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
          <div>
            <h1 className="syne" style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#f0f0f8' }}>
              Career Roadmap
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(240,240,248,0.4)' }}>
              {phase === 'ready' && r ? `${r.target_role} · Powered by live market data` : 'AI-powered 3-month personalized plan'}
            </p>
          </div>
          {phase === 'ready' && (
            <button onClick={generate} disabled={phase === 'generating'}
              style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', color: '#a5b4fc', fontSize: 13, fontFamily: 'DM Sans', fontWeight: 500 }}>
              <RefreshCw size={13} /> Regenerate
            </button>
          )}
        </div>

        {/* ── IDLE ── */}
        {phase === 'idle' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 28 }}>

            {error && (
              <div style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 12, padding: '12px 20px', fontSize: 13, color: '#f43f5e', maxWidth: 460 }}>
                {error}
              </div>
            )}

            <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={32} color="#6366f1" />
            </div>

            <div>
              <h2 className="syne" style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800, color: '#f0f0f8' }}>
                Your 3-Month Career Blueprint
              </h2>
              <p style={{ margin: 0, fontSize: 14, color: 'rgba(240,240,248,0.5)', maxWidth: 480, lineHeight: 1.7 }}>
                AI analyzes your resume, skill gaps, and <strong style={{ color: 'rgba(240,240,248,0.7)' }}>live market data from real job postings</strong> to build a week-by-week plan that actually gets you hired.
              </p>
            </div>

            {/* Feature pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {['Live Market Intelligence', 'Skill-Gap First Approach', 'Prerequisite Sequencing', 'AI Coach Per Task', 'Progress Tracking'].map(f => (
                <span key={f} style={{ fontSize: 11, color: 'rgba(240,240,248,0.5)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '4px 12px', borderRadius: 20 }}>
                  ✦ {f}
                </span>
              ))}
            </div>

            <button className="generate-btn" onClick={generate}>
              <Sparkles size={18} /> Generate My Roadmap
            </button>
          </motion.div>
        )}

        {/* ── GENERATING ── */}
        {phase === 'generating' && <GeneratingScreen />}

        {/* ── READY ── */}
        {phase === 'ready' && r && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* Stats bar */}
            <div className="glass" style={{ padding: '18px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap' }}>
              {/* Overall ring */}
              <div style={{ paddingRight: 28, borderRight: '1px solid rgba(255,255,255,0.07)', marginRight: 28 }}>
                <ProgressRing pct={overallPct} size={80} stroke={7} color="#6366f1" label="Overall" />
              </div>

              {/* Stats */}
              <div style={{ flex: 1, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {[
                  { icon: CheckCircle2, color: '#10b981', val: `${completedTasks}/${totalTasks}`, label: 'Tasks Done' },
                  { icon: Flame,        color: '#f59e0b', val: `${r.weekly_commitment_hours}h`,   label: 'Per Week' },
                  { icon: Calendar,     color: '#0ea5e9', val: '12 weeks',                         label: 'Duration' },
                  { icon: BarChart2,    color: '#a78bfa', val: r.experience_level,                 label: 'Level' },
                ].map(({ icon: Icon, color, val, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color={color} />
                    </div>
                    <div>
                      <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: '#f0f0f8', lineHeight: 1 }}>{val}</div>
                      <div style={{ fontSize: 10, color: 'rgba(240,240,248,0.4)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Success metrics */}
              {r.success_metrics?.length > 0 && (
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.07)', paddingLeft: 24, marginLeft: 8 }}>
                  <div style={{ fontSize: 10, color: 'rgba(240,240,248,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, fontFamily: 'Syne', fontWeight: 700 }}>After 3 months</div>
                  {r.success_metrics.slice(0, 3).map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 5 }}>
                      <ArrowRight size={10} color="#10b981" style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: 'rgba(240,240,248,0.6)', lineHeight: 1.4 }}>{m}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Overall progress bar */}
            <div style={{ marginBottom: 24, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallPct}%` }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #6366f1, #0ea5e9, #10b981)', borderRadius: 4, boxShadow: '0 0 12px rgba(99,102,241,0.5)' }}
              />
            </div>

            {/* Month cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
              {r.months?.map((month, i) => (
                <MonthCard
                  key={month.month}
                  month={month}
                  userId={userId}
                  onTaskToggle={toggleTask}
                  onCoach={setCoachTask}
                  delay={i * 0.1}
                />
              ))}
            </div>

            {/* Market demand section */}
            {r.market_demand && Object.keys(r.market_demand).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass"
                style={{ marginTop: 20, padding: '18px 24px' }}
              >
                <div className="syne" style={{ fontSize: 12, fontWeight: 700, color: 'rgba(240,240,248,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
                  ✦ Live Market Demand · {r.target_role}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {Object.entries(r.market_demand).slice(0, 12).map(([skill, score]) => (
                    <div key={skill} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 8, padding: '5px 10px'
                    }}>
                      <span style={{ fontSize: 11, color: 'rgba(240,240,248,0.7)', fontFamily: 'JetBrains Mono' }}>{skill}</span>
                      <div style={{ width: 40, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${score}%`, height: '100%', background: score > 70 ? '#10b981' : score > 40 ? '#f59e0b' : '#6366f1', borderRadius: 2 }} />
                      </div>
                      <span className="mono" style={{ fontSize: 9, color: score > 70 ? '#10b981' : score > 40 ? '#f59e0b' : '#818cf8' }}>{score}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* ── AI COACH DRAWER ── */}
      <AnimatePresence>
        {coachTask && (
          <CoachDrawer
            task={coachTask}
            userId={userId}
            onClose={() => setCoachTask(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}