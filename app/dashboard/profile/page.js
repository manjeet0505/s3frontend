'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, FileText,
  Briefcase, GraduationCap, Star,
  Calendar, AlertCircle, Clock,
  Loader2, Sparkles, ChevronRight,
  Send, MessageCircle, ExternalLink,
  CheckCircle2, Code, ArrowRight,
  Activity, Filter, Video, XCircle, Zap,
  TrendingUp, Award, Globe, ChevronUp
} from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { resumeApi, mentorApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

// ── CSS injected once ─────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .profile-root {
    font-family: 'DM Sans', sans-serif;
    --accent: #6ee7b7;
    --accent2: #38bdf8;
    --accent3: #a78bfa;
    --gold: #fbbf24;
    --surface: rgba(255,255,255,0.03);
    --border: rgba(255,255,255,0.07);
    --border-bright: rgba(255,255,255,0.13);
    --text-primary: rgba(255,255,255,0.95);
    --text-secondary: rgba(255,255,255,0.45);
    --text-muted: rgba(255,255,255,0.25);
  }

  .profile-root * { box-sizing: border-box; }

  .font-display { font-family: 'Syne', sans-serif; }

  .glass-card {
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
  }

  .glass-card-bright {
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(32px);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 20px;
  }

  .noise-overlay::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    border-radius: inherit;
    pointer-events: none;
    z-index: 0;
  }

  .skill-chip {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.01em;
    cursor: default;
    transition: all 0.2s;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.7);
  }
  .skill-chip:hover {
    background: rgba(110,231,183,0.1);
    border-color: rgba(110,231,183,0.3);
    color: #6ee7b7;
    transform: translateY(-1px);
  }

  .tab-pill {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 8px 18px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s;
    border: 1px solid transparent;
    color: rgba(255,255,255,0.4);
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }
  .tab-pill:hover { color: rgba(255,255,255,0.75); }
  .tab-pill.active {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.95);
  }

  .score-glow { filter: drop-shadow(0 0 20px rgba(110,231,183,0.4)); }

  .timeline-line {
    position: absolute;
    left: 19px;
    top: 44px;
    bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, rgba(110,231,183,0.2), transparent);
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    background: linear-gradient(135deg, #6ee7b7, #38bdf8);
    color: #0a0a12;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.01em;
  }
  .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(110,231,183,0.25); }

  .btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.6);
    border: 1px solid rgba(255,255,255,0.08);
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover { background: rgba(255,255,255,0.09); color: rgba(255,255,255,0.9); }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    border: 1px solid;
  }

  .scrollbar-hide { scrollbar-width: none; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }

  @keyframes pulse-ring {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
  }
  .pulse-ring { animation: pulse-ring 3s ease-in-out infinite; }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  .float { animation: float 6s ease-in-out infinite; }

  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .shimmer {
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%);
    background-size: 200% auto;
    animation: shimmer 3s linear infinite;
  }

  .section-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    font-family: 'Syne', sans-serif;
  }
`;

function StyleInjector() {
  useEffect(() => {
    const id = 'profile-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = GLOBAL_STYLES;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

// ── Subtle ambient glow (relative, doesn't break layout) ─────────────────────
function AmbientGlow() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0, borderRadius: 24 }}>
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', top: -150, right: -100, background: 'radial-gradient(circle, rgba(110,231,183,0.07) 0%, transparent 65%)' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', bottom: -80, left: -80, background: 'radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 65%)' }} />
    </div>
  );
}

// ── Score Arc ─────────────────────────────────────────
function ScoreArc({ score }) {
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const arc = circ * 0.75;
  const offset = arc - (score / 100) * arc;
  const color = score >= 80 ? '#6ee7b7' : score >= 60 ? '#38bdf8' : '#fbbf24';

  return (
    <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={140} height={140} style={{ position: 'absolute', inset: 0, transform: 'rotate(135deg)' }}>
        <circle cx={70} cy={70} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" strokeDasharray={`${arc} ${circ}`} strokeLinecap="round" />
        <motion.circle
          cx={70} cy={70} r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${arc} ${circ}`}
          initial={{ strokeDashoffset: arc }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 14px ${color}88)` }}
        />
      </svg>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: 'spring', bounce: 0.5 }}
          style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 36, color, lineHeight: 1 }}
        >
          {score}
        </motion.div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4, letterSpacing: '0.1em', fontFamily: 'Syne, sans-serif' }}>AI SCORE</div>
      </div>
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────
function Avatar({ name, size = 80 }) {
  const letter = name?.[0]?.toUpperCase() || 'S';
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div className="pulse-ring" style={{
        position: 'absolute', inset: -3, borderRadius: 20,
        background: 'linear-gradient(135deg, rgba(110,231,183,0.4), rgba(56,189,248,0.4))',
      }} />
      <div style={{
        position: 'relative', width: size, height: size, borderRadius: 18,
        background: 'linear-gradient(135deg, #1a2a40, #0f1a2e)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: size * 0.4,
        color: '#6ee7b7', border: '1px solid rgba(110,231,183,0.2)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)'
      }}>
        {letter}
      </div>
      {/* Online dot */}
      <div style={{
        position: 'absolute', bottom: 2, right: 2, width: 12, height: 12,
        borderRadius: '50%', background: '#6ee7b7',
        border: '2px solid #080810', boxShadow: '0 0 8px #6ee7b7'
      }} />
    </div>
  );
}

// ── Stat Pill ─────────────────────────────────────────
function StatPill({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        padding: '16px 20px', borderRadius: 16, flex: 1, minWidth: 80,
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)', textAlign: 'center'
      }}
    >
      <Icon size={14} style={{ color }} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2 }}
        style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 26, color, lineHeight: 1 }}
      >
        {value}
      </motion.div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', fontFamily: 'Syne, sans-serif', textTransform: 'uppercase' }}>{label}</div>
    </motion.div>
  );
}

// ── Skill Chip ────────────────────────────────────────
function SkillChip({ skill, index }) {
  const colors = [
    { bg: 'rgba(110,231,183,0.08)', border: 'rgba(110,231,183,0.2)', text: '#6ee7b7' },
    { bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.2)', text: '#38bdf8' },
    { bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)', text: '#a78bfa' },
    { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', text: '#fbbf24' },
    { bg: 'rgba(251,113,133,0.08)', border: 'rgba(251,113,133,0.2)', text: '#fb7185' },
  ];
  const c = colors[index % colors.length];
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.025, type: 'spring', bounce: 0.3 }}
      whileHover={{ scale: 1.06, y: -2 }}
      style={{
        display: 'inline-flex', alignItems: 'center',
        padding: '5px 13px', borderRadius: 100,
        fontSize: 12, fontWeight: 500,
        background: c.bg, border: `1px solid ${c.border}`, color: c.text,
        cursor: 'default', transition: 'all 0.18s', whiteSpace: 'nowrap'
      }}
    >
      {skill}
    </motion.span>
  );
}

// ── Timeline Entry ────────────────────────────────────
function TimelineEntry({ icon: Icon, title, subtitle, meta, description, index, isLast, accentColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.08 + index * 0.1 }}
      style={{ display: 'flex', gap: 16, position: 'relative', paddingBottom: isLast ? 0 : 28 }}
    >
      {!isLast && <div className="timeline-line" />}
      {/* Icon node */}
      <div style={{
        width: 38, height: 38, borderRadius: 12, flexShrink: 0,
        background: `${accentColor}15`, border: `1px solid ${accentColor}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 4px 16px ${accentColor}20`
      }}>
        <Icon size={15} style={{ color: accentColor }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 1.3 }}>{title}</div>
            <div style={{ fontSize: 12, color: accentColor, fontWeight: 500, marginTop: 2 }}>{subtitle}</div>
          </div>
          {meta && (
            <span style={{
              display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
              fontSize: 11, color: 'rgba(255,255,255,0.3)',
              padding: '4px 10px', borderRadius: 100,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <Clock size={10} />
              {meta}
            </span>
          )}
        </div>
        {description && (
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 6, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ── Session Card ──────────────────────────────────────
function SessionCard({ session, onCancel, cancelling, index }) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const canCancel = session.status === 'pending' || session.status === 'accepted';

  const statusCfg = {
    pending: { label: 'Pending', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)' },
    accepted: { label: 'Confirmed', color: '#6ee7b7', bg: 'rgba(110,231,183,0.08)', border: 'rgba(110,231,183,0.2)' },
    declined: { label: 'Declined', color: '#fb7185', bg: 'rgba(251,113,133,0.08)', border: 'rgba(251,113,133,0.2)' },
    cancelled: { label: 'Cancelled', color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.06)' },
  };
  const s = statusCfg[session.status] || statusCfg.pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index }}
      style={{
        padding: '16px 20px', borderRadius: 16,
        background: session.status === 'accepted' ? 'rgba(110,231,183,0.04)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${session.status === 'accepted' ? 'rgba(110,231,183,0.12)' : 'rgba(255,255,255,0.07)'}`,
        opacity: (session.status === 'cancelled' || session.status === 'declined') ? 0.5 : 1,
        transition: 'all 0.2s'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        {/* Avatar */}
        <div style={{
          width: 42, height: 42, borderRadius: 12, flexShrink: 0,
          background: 'linear-gradient(135deg, #1e3a5f, #0f2133)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16, color: '#38bdf8',
          border: '1px solid rgba(56,189,248,0.2)'
        }}>
          {session.mentor_name?.[0]?.toUpperCase() || 'M'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.9)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {session.mentor_name}
            </div>
            <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, color: s.color, background: s.bg, border: `1px solid ${s.border}`, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
              {s.label}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: session.topic ? 8 : 0 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}><Calendar size={10} />{session.day}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}><Clock size={10} />{session.time_slot}</span>
          </div>
          {session.topic && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', padding: '7px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 8 }}>
              <MessageCircle size={10} style={{ color: 'rgba(255,255,255,0.25)', marginTop: 1, flexShrink: 0 }} />
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>"{session.topic}"</p>
            </div>
          )}
          {session.status === 'accepted' && session.meeting_link && (
            <a href={session.meeting_link} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 100, fontSize: 11, fontWeight: 600,
              background: 'rgba(110,231,183,0.1)', border: '1px solid rgba(110,231,183,0.25)',
              color: '#6ee7b7', textDecoration: 'none', transition: 'all 0.15s'
            }}>
              <Video size={11} /> Join Meeting <ExternalLink size={9} />
            </a>
          )}
          {session.status === 'accepted' && !session.meeting_link && (
            <span style={{ fontSize: 11, color: 'rgba(110,231,183,0.5)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <CheckCircle2 size={10} /> Confirmed — link coming soon
            </span>
          )}
          {canCancel && !confirmCancel && (
            <button onClick={() => setConfirmCancel(true)} style={{ marginTop: 8, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: 'DM Sans, sans-serif', padding: 0, transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fb7185'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
            >
              <XCircle size={11} /> Cancel session
            </button>
          )}
          <AnimatePresence>
            {confirmCancel && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <span style={{ fontSize: 11, color: '#fb7185', fontWeight: 500 }}>Cancel this?</span>
                <button onClick={() => { onCancel(session.session_id); setConfirmCancel(false); }} disabled={cancelling}
                  style={{ padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.3)', color: '#fb7185', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  {cancelling ? <Loader2 size={10} style={{ animation: 'spin 1s linear infinite' }} /> : 'Yes'}
                </button>
                <button onClick={() => setConfirmCancel(false)}
                  style={{ padding: '4px 12px', borderRadius: 100, fontSize: 11, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  Keep
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ── Section Header ────────────────────────────────────
function SectionHeader({ icon: Icon, label, count, accent, action, onAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `${accent}15`, border: `1px solid ${accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={14} style={{ color: accent }} />
        </div>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: 'rgba(255,255,255,0.9)' }}>{label}</div>
          {count !== undefined && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{count} {label.toLowerCase()}</div>}
        </div>
      </div>
      {action && (
        <button onClick={onAction} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: accent, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, opacity: 0.8, transition: 'opacity 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
        >
          {action} <ChevronRight size={13} />
        </button>
      )}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────
function EmptyState({ icon: Icon, title, desc, btnLabel, onBtn, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: `${color}10`, border: `1px solid ${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Icon size={22} style={{ color: `${color}60` }} />
      </div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>{title}</div>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', maxWidth: 260, lineHeight: 1.6, marginBottom: 20 }}>{desc}</p>
      {btnLabel && (
        <button className="btn-primary" onClick={onBtn}>{btnLabel} <ArrowRight size={13} /></button>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────
export default function StudentProfilePage() {
  const { getUserId, getName, getEmail } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [cancelling, setCancelling] = useState(false);
  const [sessionFilter, setSessionFilter] = useState('all');

  const userId = getUserId();
  const name = getName();
  const email = getEmail();

  useEffect(() => {
    if (!userId) return;
    fetchAll();
  }, [userId]);

  async function fetchAll() {
    try {
      const res = await resumeApi.getProfile(userId);
      setProfile(res.data?.profile || res.data || null);
    } catch { setProfile(null); }
    finally { setLoading(false); }

    try {
      const res = await mentorApi.getMySessions(userId);
      setSessions(res.data?.sessions || []);
    } catch { setSessions([]); }
    finally { setSessionsLoading(false); }
  }

  async function handleCancel(sessionId) {
    setCancelling(true);
    try {
      await mentorApi.cancelSession(sessionId, userId);
      setSessions(prev => prev.map(s => s.session_id === sessionId ? { ...s, status: 'cancelled' } : s));
    } catch {}
    finally { setCancelling(false); }
  }

  const skills = profile?.skills || [];
  const experience = profile?.experience || profile?.work_experience || [];
  const education = profile?.education || [];
  const score = profile?.ai_profile_score || 0;

  const filteredSessions = sessionFilter === 'all' ? sessions : sessions.filter(s => s.status === sessionFilter);
  const pendingCount = sessions.filter(s => s.status === 'pending').length;
  const confirmedCount = sessions.filter(s => s.status === 'accepted').length;

  const scoreColor = score >= 80 ? '#6ee7b7' : score >= 60 ? '#38bdf8' : '#fbbf24';
  const scoreLabel = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'skills', label: 'Skills', icon: Code, badge: skills.length },
    { id: 'experience', label: 'Experience', icon: Briefcase, badge: experience.length + education.length },
    { id: 'sessions', label: 'Sessions', icon: Calendar, badge: sessions.length },
  ];

  return (
    <div className="profile-root" style={{ position: 'relative', padding: '8px 0 48px', maxWidth: 860, margin: '0 auto' }}>
      <StyleInjector />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 20, borderRadius: 24, overflow: 'hidden', position: 'relative',
            background: 'linear-gradient(135deg, rgba(14,22,40,0.9) 0%, rgba(10,12,24,0.95) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 0 0 1px rgba(110,231,183,0.05), 0 40px 80px rgba(0,0,0,0.5)'
          }}
        >
          {/* Top shimmer line */}
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(110,231,183,0.5) 40%, rgba(56,189,248,0.4) 70%, transparent 100%)' }} />

          {/* Noise overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.02'/%3E%3C/svg%3E\")", pointerEvents: 'none', zIndex: 0, borderRadius: 'inherit' }} />

          {/* Glow orbs */}
          <div style={{ position: 'absolute', width: 300, height: 300, top: -80, right: -60, borderRadius: '50%', background: 'radial-gradient(circle, rgba(110,231,183,0.07), transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', width: 200, height: 200, bottom: -40, left: -40, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.05), transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, padding: '32px 32px 28px' }}>
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 28 }}>
              {/* Left: avatar + info */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                {loading
                  ? <div style={{ width: 80, height: 80, borderRadius: 18, background: 'rgba(255,255,255,0.05)' }} />
                  : <Avatar name={name} size={80} />
                }
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span className="section-label">Student Profile</span>
                  </div>
                  <motion.h1
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-display"
                    style={{ fontWeight: 800, fontSize: 28, color: 'rgba(255,255,255,0.95)', lineHeight: 1.1, marginBottom: 4 }}
                  >
                    {name || '—'}
                  </motion.h1>
                  {(profile?.title || profile?.current_title) && (
                    <div style={{ fontSize: 13, color: '#6ee7b7', fontWeight: 500, marginBottom: 10 }}>
                      {profile.title || profile.current_title}
                    </div>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    {email && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                        <Mail size={11} /> {email}
                      </span>
                    )}
                    {(profile?.phone || profile?.phone_number) && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                        <Phone size={11} /> {profile.phone || profile.phone_number}
                      </span>
                    )}
                    {(profile?.location || profile?.city) && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                        <MapPin size={11} /> {profile.location || profile.city}
                      </span>
                    )}
                  </div>
                  {(profile?.summary || profile?.bio) && (
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 10, lineHeight: 1.65, maxWidth: 460, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontStyle: 'italic' }}>
                      "{profile.summary || profile.bio}"
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Score */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                {loading
                  ? <div style={{ width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 size={24} style={{ color: '#6ee7b7', animation: 'spin 1s linear infinite' }} /></div>
                  : <ScoreArc score={score} />
                }
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 100, letterSpacing: '0.06em',
                  fontFamily: 'Syne, sans-serif',
                  color: scoreColor, background: `${scoreColor}12`, border: `1px solid ${scoreColor}25`
                }}>
                  {scoreLabel.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
              <StatPill icon={Code} label="Skills" value={skills.length} color="#38bdf8" delay={0.3} />
              <StatPill icon={Briefcase} label="Experience" value={experience.length} color="#a78bfa" delay={0.35} />
              <StatPill icon={GraduationCap} label="Education" value={education.length} color="#6ee7b7" delay={0.4} />
              <StatPill icon={Calendar} label="Sessions" value={sessions.length} color="#fbbf24" delay={0.45} />
            </div>

            {/* CTA */}
            <button className="btn-primary" onClick={() => router.push('/dashboard/resume')}>
              <FileText size={13} /> Update Resume
            </button>
          </div>
        </motion.div>

        {/* ── TAB BAR ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{ display: 'flex', gap: 6, padding: '6px', borderRadius: 50, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(16px)', marginBottom: 20, overflowX: 'auto' }}
          className="scrollbar-hide"
        >
          {tabs.map(t => (
            <button key={t.id} className={`tab-pill ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              <t.icon size={13} />
              {t.label}
              {t.badge > 0 && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 100, fontFamily: 'Syne, sans-serif',
                  background: activeTab === t.id ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
                  color: activeTab === t.id ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)'
                }}>{t.badge}</span>
              )}
            </button>
          ))}
        </motion.div>

        {/* ── TAB CONTENT ──────────────────────────────────── */}
        <AnimatePresence mode="wait">

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Skills preview */}
              {skills.length > 0 && (
                <div className="glass-card" style={{ padding: '24px 28px' }}>
                  <SectionHeader icon={Star} label="Top Skills" accent="#38bdf8" action="View all" onAction={() => setActiveTab('skills')} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {skills.slice(0, 15).map((s, i) => <SkillChip key={s} skill={s} index={i} />)}
                    {skills.length > 15 && (
                      <button onClick={() => setActiveTab('skills')} style={{
                        padding: '5px 13px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                        background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)',
                        color: '#38bdf8', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                      }}>+{skills.length - 15} more</button>
                    )}
                  </div>
                </div>
              )}

              {/* Recent experience */}
              {experience.length > 0 && (
                <div className="glass-card" style={{ padding: '24px 28px' }}>
                  <SectionHeader icon={Briefcase} label="Recent Experience" accent="#a78bfa" action="View all" onAction={() => setActiveTab('experience')} />
                  {experience.slice(0, 2).map((job, i) => (
                    <TimelineEntry key={i} index={i}
                      icon={Briefcase}
                      title={job.title || job.role || job.position || 'Role'}
                      subtitle={job.company || job.company_name || ''}
                      meta={job.duration || job.period || job.dates}
                      description={job.description || job.responsibilities}
                      accentColor="#a78bfa"
                      isLast={i === Math.min(experience.length, 2) - 1}
                    />
                  ))}
                </div>
              )}

              {/* Recent sessions */}
              {sessions.length > 0 && (
                <div className="glass-card" style={{ padding: '24px 28px' }}>
                  <SectionHeader icon={Calendar} label="Recent Sessions" accent="#fbbf24" action="View all" onAction={() => setActiveTab('sessions')} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {sessions.slice(0, 2).map((s, i) => <SessionCard key={s._id || i} session={s} onCancel={handleCancel} cancelling={cancelling} index={i} />)}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!loading && skills.length === 0 && experience.length === 0 && (
                <div className="glass-card">
                  <EmptyState icon={FileText} title="Your profile is empty" desc="Upload your resume to auto-populate your skills, experience, and education." btnLabel="Upload Resume" onBtn={() => router.push('/dashboard/resume')} color="#6ee7b7" />
                </div>
              )}
            </motion.div>
          )}

          {/* SKILLS */}
          {activeTab === 'skills' && (
            <motion.div key="skills" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
              <div className="glass-card" style={{ padding: '24px 28px' }}>
                <SectionHeader icon={Code} label="All Skills" count={skills.length} accent="#38bdf8" />
                {loading
                  ? <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.3)', padding: '32px 0' }}><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /><span style={{ fontSize: 13 }}>Extracting skills from your resume…</span></div>
                  : skills.length === 0
                  ? <EmptyState icon={Code} title="No skills yet" desc="Upload your resume to extract your skills automatically." btnLabel="Upload Resume" onBtn={() => router.push('/dashboard/resume')} color="#38bdf8" />
                  : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {skills.map((s, i) => <SkillChip key={s} skill={s} index={i} />)}
                    </div>
                }
              </div>
            </motion.div>
          )}

          {/* EXPERIENCE */}
          {activeTab === 'experience' && (
            <motion.div key="experience" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="glass-card" style={{ padding: '24px 28px' }}>
                <SectionHeader icon={Briefcase} label="Work Experience" count={experience.length} accent="#a78bfa" />
                {loading
                  ? <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.3)' }}><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /><span style={{ fontSize: 13 }}>Loading…</span></div>
                  : experience.length === 0
                  ? <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>No experience extracted yet.</p>
                  : experience.map((job, i) => (
                    <TimelineEntry key={i} index={i}
                      icon={Briefcase}
                      title={job.title || job.role || job.position || 'Role'}
                      subtitle={job.company || job.company_name || ''}
                      meta={job.duration || job.period || job.dates}
                      description={job.description || job.responsibilities}
                      accentColor="#a78bfa"
                      isLast={i === experience.length - 1}
                    />
                  ))
                }
              </div>
              <div className="glass-card" style={{ padding: '24px 28px' }}>
                <SectionHeader icon={GraduationCap} label="Education" count={education.length} accent="#6ee7b7" />
                {loading
                  ? <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.3)' }}><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /><span style={{ fontSize: 13 }}>Loading…</span></div>
                  : education.length === 0
                  ? <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>No education extracted yet.</p>
                  : education.map((edu, i) => (
                    <TimelineEntry key={i} index={i}
                      icon={GraduationCap}
                      title={edu.degree || edu.qualification || edu.course || 'Degree'}
                      subtitle={edu.institution || edu.school || edu.university || ''}
                      meta={edu.year || edu.graduation_year || edu.period}
                      accentColor="#6ee7b7"
                      isLast={i === education.length - 1}
                    />
                  ))
                }
              </div>
            </motion.div>
          )}

          {/* SESSIONS */}
          {activeTab === 'sessions' && (
            <motion.div key="sessions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
              <div className="glass-card" style={{ padding: '24px 28px' }}>
                <SectionHeader icon={Calendar} label="Session History" count={sessions.length} accent="#fbbf24" />

                {/* Stats strip */}
                {sessions.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                    {pendingCount > 0 && <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 100, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24' }}>{pendingCount} pending</span>}
                    {confirmedCount > 0 && <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 100, background: 'rgba(110,231,183,0.08)', border: '1px solid rgba(110,231,183,0.2)', color: '#6ee7b7' }}>{confirmedCount} confirmed</span>}
                  </div>
                )}

                {/* Filter pills */}
                {sessions.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Filter size={12} style={{ color: 'rgba(255,255,255,0.25)' }} />
                    {['all', 'pending', 'accepted', 'declined', 'cancelled'].map(f => (
                      <button key={f} onClick={() => setSessionFilter(f)} style={{
                        padding: '5px 12px', borderRadius: 100, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                        background: sessionFilter === f ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${sessionFilter === f ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
                        color: sessionFilter === f ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                        transition: 'all 0.15s', textTransform: 'capitalize'
                      }}>
                        {f === 'accepted' ? 'Confirmed' : f.charAt(0).toUpperCase() + f.slice(1)}
                        {f !== 'all' && <span style={{ marginLeft: 4, opacity: 0.6 }}>({sessions.filter(s => s.status === f).length})</span>}
                      </button>
                    ))}
                  </div>
                )}

                {sessionsLoading
                  ? <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.3)', padding: '32px 0' }}><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /><span style={{ fontSize: 13 }}>Loading sessions…</span></div>
                  : filteredSessions.length === 0 && sessions.length === 0
                  ? <EmptyState icon={Send} title="No sessions yet" desc="Request a session with a mentor to start your mentoring journey." btnLabel="Browse Mentors" onBtn={() => router.push('/dashboard/mentors')} color="#fbbf24" />
                  : filteredSessions.length === 0
                  ? <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.3)', padding: '24px 0' }}>No {sessionFilter} sessions.</p>
                  : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {filteredSessions.map((s, i) => <SessionCard key={s.session_id || s._id || i} session={s} onCancel={handleCancel} cancelling={cancelling} index={i} />)}
                    </div>
                }
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}