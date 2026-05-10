'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Sparkles, Zap, Shield, Crown,
  CheckCircle2, AlertCircle, ChevronDown, ChevronUp,
  Copy, Check, X, RefreshCw, ArrowLeft,
  Briefcase, GraduationCap, User, Code, Target,
  TrendingUp, Award, Eye, EyeOff, AlertTriangle
} from 'lucide-react';

/* ─── Global Styles ─────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  .resume-root * { box-sizing: border-box; }

  .resume-root {
    font-family: 'DM Sans', sans-serif;
    background: #050510;
    min-height: 100vh;
    color: #e8e8f8;
    position: relative;
    overflow-x: hidden;
  }

  .dot-grid {
    background-image: radial-gradient(rgba(0, 229, 203, 0.12) 1px, transparent 1px);
    background-size: 32px 32px;
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%);
  }

  .glow-orb {
    position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
    filter: blur(120px); opacity: 0.12;
  }

  .syne { font-family: 'Syne', sans-serif; }
  .mono { font-family: 'JetBrains Mono', monospace; }

  .glass-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    backdrop-filter: blur(12px);
  }

  .glass-card:hover {
    border-color: rgba(0,229,203,0.2);
    background: rgba(255,255,255,0.04);
    transition: all 0.2s;
  }

  .upload-zone {
    border: 1.5px dashed rgba(0,229,203,0.35);
    border-radius: 20px;
    background: rgba(0,229,203,0.03);
    transition: all 0.3s;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .upload-zone:hover, .upload-zone.drag-over {
    border-color: rgba(0,229,203,0.7);
    background: rgba(0,229,203,0.07);
  }
  .upload-zone::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(0,229,203,0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  .score-ring-wrap {
    filter: drop-shadow(0 0 20px rgba(0,229,203,0.3));
  }

  .dim-bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .section-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    transition: all 0.25s;
    overflow: hidden;
    position: relative;
  }
  .section-card:hover {
    transform: translateY(-2px);
    border-color: rgba(0,229,203,0.25);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }

  .improve-btn {
    background: linear-gradient(135deg, rgba(0,229,203,0.15), rgba(0,229,203,0.05));
    border: 1px solid rgba(0,229,203,0.3);
    color: #00e5cb;
    border-radius: 8px;
    padding: 6px 14px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }
  .improve-btn:hover {
    background: rgba(0,229,203,0.2);
    border-color: #00e5cb;
    box-shadow: 0 0 16px rgba(0,229,203,0.2);
  }

  .variation-card {
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    transition: all 0.25s;
    overflow: hidden;
  }
  .variation-card:hover {
    background: rgba(255,255,255,0.05);
  }
  .variation-card.selected {
    border-color: rgba(0,229,203,0.5);
    background: rgba(0,229,203,0.04);
  }

  .copy-btn {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 8px 16px;
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .copy-btn:hover {
    border-color: rgba(255,255,255,0.25);
    color: #fff;
    background: rgba(255,255,255,0.1);
  }
  .copy-btn.copied {
    border-color: rgba(16,185,129,0.5);
    color: #10b981;
    background: rgba(16,185,129,0.08);
  }

  .scan-line {
    height: 2px;
    background: linear-gradient(90deg, transparent, #00e5cb, transparent);
    animation: scanline 2s linear infinite;
  }
  @keyframes scanline {
    0%   { transform: translateY(0); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateY(400px); opacity: 0; }
  }

  .pulse-ring {
    animation: pulseRing 2s ease-out infinite;
  }
  @keyframes pulseRing {
    0%   { transform: scale(1);   opacity: 0.7; }
    100% { transform: scale(1.6); opacity: 0; }
  }

  .shimmer {
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }

  .drawer-backdrop {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.65);
    backdrop-filter: blur(4px);
    z-index: 50;
  }

  .drawer-panel {
    position: fixed;
    top: 0; right: 0; bottom: 0;
    width: min(640px, 92vw);
    background: #0b0b1a;
    border-left: 1px solid rgba(255,255,255,0.08);
    z-index: 51;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
`;

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

const DIMENSION_META = {
  contact_info:          { label: 'Contact Info',    icon: User,       weight: '5%'  },
  professional_summary:  { label: 'Summary',         icon: FileText,   weight: '10%' },
  work_experience:       { label: 'Experience',      icon: Briefcase,  weight: '35%' },
  skills_section:        { label: 'Skills',          icon: Code,       weight: '15%' },
  education:             { label: 'Education',       icon: GraduationCap, weight: '10%' },
  ats_optimization:      { label: 'ATS Score',       icon: Target,     weight: '25%' },
};

function scoreColor(s) {
  if (s >= 80) return '#10b981';
  if (s >= 65) return '#00e5cb';
  if (s >= 50) return '#f59e0b';
  if (s >= 35) return '#f97316';
  return '#f43f5e';
}

function scoreGrade(s) {
  if (s >= 85) return 'A';
  if (s >= 75) return 'B+';
  if (s >= 65) return 'B';
  if (s >= 55) return 'C+';
  if (s >= 40) return 'C';
  return 'D';
}

/* ─── Score Ring ─────────────────────────────────────────────────────────────── */
function ScoreRing({ score, label, ringColor, animated = true }) {
  const [displayed, setDisplayed] = useState(animated ? 0 : score);
  const R = 78, C = 2 * Math.PI * R;
  const pct = displayed / 100;

  useEffect(() => {
    if (!animated) return;
    let start = null;
    const duration = 1600;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setDisplayed(Math.round(ease * score));
      if (p < 1) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [score, animated]);

  return (
    <div className="score-ring-wrap" style={{ position: 'relative', display: 'inline-block' }}>
      <svg width="196" height="196" viewBox="0 0 196 196">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Track */}
        <circle cx="98" cy="98" r={R} fill="none"
          stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        {/* Fill */}
        <circle cx="98" cy="98" r={R} fill="none"
          stroke={ringColor || scoreColor(score)}
          strokeWidth="10"
          strokeDasharray={C}
          strokeDashoffset={C - pct * C}
          strokeLinecap="round"
          transform="rotate(-90 98 98)"
          filter="url(#glow)"
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
        {/* Score */}
        <text x="98" y="90" textAnchor="middle"
          fill="#f0f0ff" fontSize="44"
          fontFamily="JetBrains Mono, monospace" fontWeight="700">
          {displayed}
        </text>
        <text x="98" y="110" textAnchor="middle"
          fill="rgba(240,240,255,0.4)" fontSize="11"
          fontFamily="DM Sans, sans-serif" letterSpacing="2">
          /100
        </text>
        <text x="98" y="130" textAnchor="middle"
          fill={ringColor || scoreColor(score)} fontSize="13"
          fontFamily="Syne, sans-serif" fontWeight="600">
          {label}
        </text>
      </svg>
    </div>
  );
}

/* ─── Dimension Bar ──────────────────────────────────────────────────────────── */
function DimensionBar({ dimKey, dimData, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const meta = DIMENSION_META[dimKey] || { label: dimKey, icon: Target, weight: '' };
  const Icon = meta.icon;
  const score = dimData?.score ?? 0;
  const color = scoreColor(score);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), delay + 200);
    return () => clearTimeout(t);
  }, [score, delay]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: `rgba(${color === '#10b981' ? '16,185,129' : color === '#00e5cb' ? '0,229,203' : color === '#f59e0b' ? '245,158,11' : '244,63,94'},0.12)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon size={14} color={color} />
          </div>
          <span style={{ fontSize: 13, color: 'rgba(240,240,255,0.75)', fontWeight: 500 }}>
            {meta.label}
          </span>
          <span style={{ fontSize: 10, color: 'rgba(240,240,255,0.3)', fontFamily: 'JetBrains Mono' }}>
            {meta.weight}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color
          }}>{score}</span>
          <span style={{
            fontSize: 10, fontFamily: 'Syne', fontWeight: 700,
            color, background: `${color}18`, padding: '1px 6px', borderRadius: 4
          }}>{scoreGrade(score)}</span>
        </div>
      </div>
      <div style={{
        height: 5, borderRadius: 4,
        background: 'rgba(255,255,255,0.05)',
        overflow: 'hidden'
      }}>
        <div className="dim-bar-fill" style={{
          width: `${width}%`,
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          boxShadow: `0 0 8px ${color}60`
        }} />
      </div>
      {dimData?.feedback && (
        <p style={{ fontSize: 11, color: 'rgba(240,240,255,0.4)', margin: 0, lineHeight: 1.5 }}>
          {dimData.feedback}
        </p>
      )}
    </div>
  );
}

/* ─── Section Card ───────────────────────────────────────────────────────────── */
function SectionCard({ section, targetRole, jobDescription, onImproveStart }) {
  const score = section.score ?? 50;
  const color = scoreColor(score);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="section-card" style={{ borderLeftColor: color, borderLeftWidth: 3 }}>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="syne" style={{ fontSize: 14, fontWeight: 700, color: '#e8e8f8' }}>
              {section.name}
            </span>
            <span style={{
              fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 700, color,
              background: `${color}15`, padding: '2px 7px', borderRadius: 4
            }}>{score}</span>
          </div>
          <button className="improve-btn" onClick={() => onImproveStart(section)}>
            <Sparkles size={12} />
            Improve
          </button>
        </div>

        {section.issues?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {section.issues.slice(0, expanded ? undefined : 2).map((issue, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <AlertTriangle size={11} color="#f59e0b" style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'rgba(240,240,255,0.55)', lineHeight: 1.5 }}>{issue}</span>
              </div>
            ))}
            {section.issues.length > 2 && (
              <button onClick={() => setExpanded(!expanded)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(0,229,203,0.7)', fontSize: 11, textAlign: 'left', padding: 0,
                display: 'flex', alignItems: 'center', gap: 4, marginTop: 2
              }}>
                {expanded ? <ChevronUp size={11}/> : <ChevronDown size={11}/>}
                {expanded ? 'Show less' : `+${section.issues.length - 2} more`}
              </button>
            )}
          </div>
        )}

        {section.quick_wins?.length > 0 && (
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {section.quick_wins.slice(0, 2).map((win, i) => (
              <span key={i} style={{
                fontSize: 10, color: 'rgba(0,229,203,0.7)',
                background: 'rgba(0,229,203,0.06)', border: '1px solid rgba(0,229,203,0.15)',
                padding: '2px 7px', borderRadius: 4
              }}>✦ {win}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Variation Card ─────────────────────────────────────────────────────────── */
const VARIATION_ICONS = { shield: Shield, zap: Zap, crown: Crown };

function VariationCard({ variation, isSelected, onSelect }) {
  const [copied, setCopied] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const Icon = VARIATION_ICONS[variation.icon] || Sparkles;
  const accent = variation.accent || '#00e5cb';

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(variation.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`variation-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      style={{ borderColor: isSelected ? `${accent}50` : undefined }}
    >
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: isSelected ? `${accent}08` : 'transparent'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: `${accent}18`,
              border: `1px solid ${accent}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Icon size={15} color={accent} />
            </div>
            <div>
              <div className="syne" style={{ fontSize: 14, fontWeight: 700, color: '#e8e8f8' }}>
                {variation.label}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(240,240,255,0.4)' }}>{variation.tagline}</div>
            </div>
          </div>
          <div style={{
            fontSize: 10, color: accent, background: `${accent}15`,
            padding: '3px 8px', borderRadius: 6, fontFamily: 'JetBrains Mono', fontWeight: 600
          }}>
            {variation.ats_boost}
          </div>
        </div>
      </div>

      {/* Improvements */}
      {variation.what_changed?.length > 0 && (
        <div style={{ padding: '10px 16px', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {variation.what_changed.map((change, i) => (
            <span key={i} style={{
              fontSize: 10, color: 'rgba(240,240,255,0.6)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              padding: '3px 8px', borderRadius: 5
            }}>✓ {change}</span>
          ))}
        </div>
      )}

      {/* Content Preview */}
      <div style={{ padding: '0 16px 14px' }}>
        <button
          onClick={(e) => { e.stopPropagation(); setShowContent(!showContent); }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: `${accent}99`, fontSize: 11, padding: 0,
            display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8
          }}
        >
          {showContent ? <EyeOff size={11} /> : <Eye size={11} />}
          {showContent ? 'Hide rewrite' : 'Preview rewrite'}
        </button>

        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10, padding: 12, marginBottom: 10,
                fontSize: 12, color: 'rgba(240,240,255,0.75)',
                lineHeight: 1.7, whiteSpace: 'pre-wrap',
                maxHeight: 200, overflowY: 'auto'
              }}>
                {variation.content}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: 'rgba(240,240,255,0.3)' }}>
            Best for: {variation.best_for}
          </span>
          <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Improvement Drawer ─────────────────────────────────────────────────────── */
function ImprovementDrawer({ section, targetRole, jobDescription, onClose }) {
  const [loading, setLoading]     = useState(true);
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState(null);
  const [selected, setSelected]   = useState(null);
  const [jdVisible, setJdVisible] = useState(false);

  useEffect(() => {
    if (!section) return;
    fetchImprovements();
  }, [section]);

  const fetchImprovements = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/resume/improve-section`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section_name: section.name,
          section_content: section.raw_content || '',
          target_role: targetRole || 'Professional',
          job_description: jobDescription || null
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed');
      setResult(data.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="drawer-backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="drawer-panel"
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        {/* Panel Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, background: '#0b0b1a', zIndex: 2
        }}>
          <div>
            <div className="syne" style={{ fontSize: 16, fontWeight: 700, color: '#e8e8f8' }}>
              ✦ AI Rewrite Studio
            </div>
            <div style={{ fontSize: 12, color: 'rgba(240,240,255,0.4)', marginTop: 2 }}>
              {section?.name} · 3 variations generated
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={fetchImprovements} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)'
            }}>
              <RefreshCw size={14} />
            </button>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)'
            }}>
              <X size={14} />
            </button>
          </div>
        </div>

        <div style={{ padding: 24, flex: 1 }}>
          {/* Original Issues */}
          {result?.original_issues?.length > 0 && (
            <div style={{
              background: 'rgba(244,63,94,0.06)',
              border: '1px solid rgba(244,63,94,0.15)',
              borderRadius: 12, padding: 14, marginBottom: 20
            }}>
              <div style={{ fontSize: 11, color: '#f43f5e', fontFamily: 'Syne', fontWeight: 700,
                marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Issues Found
              </div>
              {result.original_issues.map((iss, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 5 }}>
                  <span style={{ color: '#f43f5e', fontSize: 13, flexShrink: 0 }}>✕</span>
                  <span style={{ fontSize: 12, color: 'rgba(240,240,255,0.65)', lineHeight: 1.5 }}>{iss}</span>
                </div>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="shimmer" style={{
                  height: 120, borderRadius: 14,
                  background: 'rgba(255,255,255,0.03)'
                }} />
              ))}
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <div className="mono" style={{ fontSize: 12, color: 'rgba(0,229,203,0.6)' }}>
                  ✦ Generating 3 AI variations...
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{
              background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)',
              borderRadius: 12, padding: 16, textAlign: 'center'
            }}>
              <AlertCircle size={24} color="#f43f5e" style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 13, color: '#f43f5e' }}>{error}</div>
              <button onClick={fetchImprovements} className="improve-btn" style={{ margin: '12px auto 0' }}>
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          )}

          {/* Variations */}
          {result && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {result.variations?.map((v) => (
                <VariationCard
                  key={v.id}
                  variation={v}
                  isSelected={selected === v.id}
                  onSelect={() => setSelected(v.id === selected ? null : v.id)}
                />
              ))}

              {/* Pro Tip */}
              {result.pro_tip && (
                <div style={{
                  background: 'rgba(0,229,203,0.05)',
                  border: '1px solid rgba(0,229,203,0.15)',
                  borderRadius: 12, padding: 14, marginTop: 4
                }}>
                  <div style={{ fontSize: 11, color: '#00e5cb', fontFamily: 'Syne', fontWeight: 700,
                    marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    ✦ Pro Tip
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(240,240,255,0.65)', margin: 0, lineHeight: 1.6 }}>
                    {result.pro_tip}
                  </p>
                </div>
              )}

              {/* Keywords */}
              {result.keywords_to_add?.length > 0 && (
                <div style={{ marginTop: 4 }}>
                  <div style={{ fontSize: 11, color: 'rgba(240,240,255,0.4)', marginBottom: 8,
                    fontFamily: 'Syne', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Keywords to Add
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {result.keywords_to_add.map((kw, i) => (
                      <span key={i} style={{
                        fontSize: 11, color: '#f59e0b',
                        background: 'rgba(245,158,11,0.08)',
                        border: '1px solid rgba(245,158,11,0.2)',
                        padding: '3px 9px', borderRadius: 5, fontFamily: 'JetBrains Mono'
                      }}>{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

/* ─── Scanning Animation ─────────────────────────────────────────────────────── */
const SCAN_STEPS = [
  'Extracting resume structure...',
  'Analyzing work experience bullets...',
  'Counting metrics and achievements...',
  'Evaluating ATS compatibility...',
  'Scoring 6 resume dimensions...',
  'Generating improvement insights...',
];

function ScanningScreen() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep(s => Math.min(s + 1, SCAN_STEPS.length - 1)), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      minHeight: '70vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 40, padding: 40
    }}>
      {/* Animated ring */}
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <div className="pulse-ring" style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '2px solid rgba(0,229,203,0.4)'
        }} />
        <div style={{
          position: 'absolute', inset: 8, borderRadius: '50%',
          border: '2px solid rgba(0,229,203,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <FileText size={36} color="#00e5cb" />
        </div>
        <div className="scan-line" style={{
          position: 'absolute', top: 0, left: 0, right: 0
        }} />
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 320 }}>
        {SCAN_STEPS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i <= step ? 1 : 0.2, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
              background: i < step ? 'rgba(16,185,129,0.2)' : i === step ? 'rgba(0,229,203,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${i < step ? '#10b981' : i === step ? '#00e5cb' : 'rgba(255,255,255,0.1)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {i < step && <Check size={10} color="#10b981" />}
              {i === step && (
                <div style={{
                  width: 6, height: 6, borderRadius: '50%', background: '#00e5cb',
                  animation: 'pulseRing 1s ease-out infinite'
                }} />
              )}
            </div>
            <span className="mono" style={{
              fontSize: 12,
              color: i < step ? '#10b981' : i === step ? '#00e5cb' : 'rgba(240,240,255,0.2)'
            }}>{s}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────────── */
export default function ResumeAnalyzerPage() {
  const [phase, setPhase]             = useState('upload');   // upload | scanning | results
  const [dragging, setDragging]       = useState(false);
  const [file, setFile]               = useState(null);
  const [jdText, setJdText]           = useState('');
  const [showJD, setShowJD]           = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError]             = useState(null);
  const [improveSection, setImproveSection] = useState(null);
  const fileRef = useRef();

  const userId = (() => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return 'demo_user';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || 'demo_user';
  } catch { return 'demo_user'; }
})();

  /* ── Load saved analysis on mount (persists across navigation) ── */
  useEffect(() => {
    try {
      const saved   = localStorage.getItem('s3_resume_analysis');
      const savedJD = localStorage.getItem('s3_resume_jd');
      if (saved) {
        const parsed = JSON.parse(saved);
        setAnalysisData(parsed);
        setPhase('results');
      }
      if (savedJD) {
        setJdText(savedJD);
        setShowJD(true);
      }
    } catch (_) { /* ignore corrupt data */ }
  }, []);

  /* ── Upload + Analyze ── */
  const handleAnalyze = async (f) => {
    const chosenFile = f || file;
    if (!chosenFile) return;
    setPhase('scanning');
    setError(null);

    try {
      const form = new FormData();
      form.append('file', chosenFile);
      form.append('user_id', userId);
      if (jdText.trim().length > 50) form.append('job_description', jdText.trim());

      const res  = await fetch(`${API_BASE}/resume/analyze`, { method: 'POST', body: form });
      const json = await res.json();
      console.log('[DEBUG] API response:', json);        
      console.log('[DEBUG] json.data:', json?.data); 
      if (!res.ok) throw new Error(json.detail || 'Analysis failed');
      if (!json.success) throw new Error(json.error || 'Analysis failed');

      setAnalysisData(json.data);
      setPhase('results');
       localStorage.setItem('s3_resume_analysis', JSON.stringify(json.data));
      if (jdText.trim()) localStorage.setItem('s3_resume_jd', jdText.trim());
    } catch (e) {
      setError(e.message);
      setPhase('upload');
    }
  };

  /* ── Drag & Drop ── */
  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === 'application/pdf') { setFile(f); handleAnalyze(f); }
  }, [jdText]);

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); handleAnalyze(f); }
  };

  const d = analysisData;
  const dims = d?.dimensions || {};

  return (
    <div className="resume-root">
      <style>{GLOBAL_CSS}</style>

      {/* Background effects */}
      <div className="dot-grid" />
      <div className="glow-orb" style={{ width: 600, height: 600, top: -200, left: -200, background: '#00e5cb' }} />
      <div className="glow-orb" style={{ width: 400, height: 400, bottom: -100, right: -100, background: '#7c3aed' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {phase === 'results' && (
              <button onClick={() => setPhase('upload')} style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '8px 12px', cursor: 'pointer', color: 'rgba(240,240,255,0.6)',
                display: 'flex', alignItems: 'center', gap: 6, fontSize: 13
              }}>
                <ArrowLeft size={14} /> Back
              </button>
            )}
            <div>
              <h1 className="syne" style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#f0f0ff' }}>
                Resume Intelligence
              </h1>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(240,240,255,0.4)', marginTop: 2 }}>
                {phase === 'upload' ? '6-dimensional AI analysis · Real market scoring' :
                 phase === 'scanning' ? 'Deep scanning in progress...' :
                 `${d?.target_role || 'Resume'} · ${d?.experience_years || 0} yrs experience`}
              </p>
            </div>
          </div>

          {phase === 'results' && (
            <button
              onClick={() => { setPhase('upload'); setFile(null); setAnalysisData(null); localStorage.removeItem('s3_resume_analysis'); localStorage.removeItem('s3_resume_jd');  }}
              style={{
                background: 'rgba(0,229,203,0.08)', border: '1px solid rgba(0,229,203,0.25)',
                borderRadius: 10, padding: '8px 16px', cursor: 'pointer', color: '#00e5cb',
                display: 'flex', alignItems: 'center', gap: 7, fontSize: 13,
                fontFamily: 'DM Sans', fontWeight: 500
              }}
            >
              <RefreshCw size={13} /> Re-analyze
            </button>
          )}
        </div>

        {/* ══ UPLOAD PHASE ══ */}
        <AnimatePresence mode="wait">
          {phase === 'upload' && (
            <motion.div key="upload"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            >
              {/* Error banner */}
              {error && (
                <div style={{
                  background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)',
                  borderRadius: 12, padding: '12px 16px', marginBottom: 20,
                  display: 'flex', alignItems: 'center', gap: 10
                }}>
                  <AlertCircle size={16} color="#f43f5e" />
                  <span style={{ fontSize: 13, color: '#f43f5e' }}>{error}</span>
                </div>
              )}

              {/* Upload Zone */}
              <div
                className={`upload-zone ${dragging ? 'drag-over' : ''}`}
                style={{ padding: '60px 40px', textAlign: 'center' }}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
              >
                <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={onFileChange} />

                <motion.div
                  animate={{ y: dragging ? -8 : 0 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
                >
                  <div style={{
                    width: 72, height: 72, borderRadius: 20,
                    background: 'rgba(0,229,203,0.08)',
                    border: '1px solid rgba(0,229,203,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative'
                  }}>
                    <Upload size={28} color="#00e5cb" />
                    <div style={{
                      position: 'absolute', inset: -8, borderRadius: 28,
                      border: '1px dashed rgba(0,229,203,0.2)',
                      animation: 'pulseRing 3s ease-out infinite'
                    }} />
                  </div>

                  <div>
                    <p className="syne" style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#f0f0ff' }}>
                      {file ? file.name : 'Drop your resume here'}
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(240,240,255,0.4)' }}>
                      {file ? 'Click to change · PDF only' : 'or click to browse · PDF only'}
                    </p>
                  </div>

                  {file && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAnalyze(); }}
                      style={{
                        background: 'linear-gradient(135deg, #00e5cb, #00b8a3)',
                        border: 'none', borderRadius: 12,
                        padding: '12px 32px', cursor: 'pointer',
                        color: '#050510', fontSize: 14,
                        fontFamily: 'Syne, sans-serif', fontWeight: 700,
                        display: 'flex', alignItems: 'center', gap: 8,
                        boxShadow: '0 0 24px rgba(0,229,203,0.3)'
                      }}
                    >
                      <Sparkles size={15} /> Analyze Resume
                    </button>
                  )}
                </motion.div>
              </div>

              {/* JD Toggle */}
              <div style={{ marginTop: 16 }}>
                <button
                  onClick={() => setShowJD(!showJD)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(0,229,203,0.6)', fontSize: 13,
                    display: 'flex', alignItems: 'center', gap: 6, padding: 4,
                    fontFamily: 'DM Sans'
                  }}
                >
                  {showJD ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {showJD ? 'Hide job description' : '+ Paste job description for JD match %'}
                </button>

                <AnimatePresence>
                  {showJD && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden', marginTop: 10 }}
                    >
                      <textarea
                        value={jdText}
                        onChange={e => setJdText(e.target.value)}
                        placeholder="Paste the job description here to get JD match percentage and missing keywords..."
                        style={{
                          width: '100%', minHeight: 130,
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 12, padding: 14,
                          color: 'rgba(240,240,255,0.75)', fontSize: 13,
                          fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6,
                          resize: 'vertical', outline: 'none'
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Feature tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
                {['6 Scoring Dimensions', 'ATS Analysis', 'JD Match %', 'AI Section Rewrites', 'Zero Hallucinations'].map(f => (
                  <span key={f} style={{
                    fontSize: 11, color: 'rgba(240,240,255,0.4)',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    padding: '4px 10px', borderRadius: 20
                  }}>✦ {f}</span>
                ))}
              </div>
            </motion.div>
          )}

          {/* ══ SCANNING PHASE ══ */}
          {phase === 'scanning' && (
            <motion.div key="scanning"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <ScanningScreen />
            </motion.div>
          )}

          {/* ══ RESULTS PHASE ══ */}
          {phase === 'results' && d && (
            <motion.div key="results"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Score + Dimensions Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, marginBottom: 20 }}>

                {/* Score Ring Card */}
                <div className="glass-card" style={{
                  padding: 24, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 12
                }}>
                  <ScoreRing
                    score={d.overall_score}
                    label={d.label}
                    ringColor={d.ring_color}
                  />
                  <div style={{ textAlign: 'center' }}>
                    <div className="mono" style={{ fontSize: 11, color: 'rgba(240,240,255,0.3)',
                      textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Overall Score
                    </div>
                    {d.ats_score !== undefined && (
                      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6,
                        justifyContent: 'center' }}>
                        <Target size={12} color="#f59e0b" />
                        <span className="mono" style={{ fontSize: 12, color: '#f59e0b' }}>
                          ATS: {d.ats_score}/100
                        </span>
                      </div>
                    )}
                    {d.jd_match !== null && d.jd_match !== undefined && (
                      <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6,
                        justifyContent: 'center' }}>
                        <TrendingUp size={12} color="#a78bfa" />
                        <span className="mono" style={{ fontSize: 12, color: '#a78bfa' }}>
                          JD Match: {d.jd_match}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dimensions */}
                <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="syne" style={{ fontSize: 13, fontWeight: 700, color: 'rgba(240,240,255,0.5)',
                    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
                    Dimension Breakdown
                  </div>
                  {Object.entries(dims).map(([key, val], i) => (
                    <DimensionBar key={key} dimKey={key} dimData={val} delay={i * 100} />
                  ))}
                </div>
              </div>

              {/* Strengths + Critical Fixes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                {/* Strengths */}
                <div className="glass-card" style={{ padding: 20 }}>
                  <div className="syne" style={{ fontSize: 12, fontWeight: 700, color: '#10b981',
                    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
                    ✦ Top Strengths
                  </div>
                  {d.strengths?.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                      <CheckCircle2 size={13} color="#10b981" style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'rgba(240,240,255,0.7)', lineHeight: 1.5 }}>{s}</span>
                    </div>
                  ))}
                </div>

                {/* Critical Fixes */}
                <div className="glass-card" style={{ padding: 20 }}>
                  <div className="syne" style={{ fontSize: 12, fontWeight: 700, color: '#f43f5e',
                    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
                    ⚠ Critical Fixes
                  </div>
                  {d.critical_fixes?.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                      <AlertCircle size={13} color="#f43f5e" style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'rgba(240,240,255,0.7)', lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* JD Keywords */}
              {(d.jd_matched_keywords?.length > 0 || d.jd_missing_keywords?.length > 0) && (
                <div className="glass-card" style={{ padding: 20, marginBottom: 20 }}>
                  <div className="syne" style={{ fontSize: 12, fontWeight: 700, color: 'rgba(240,240,255,0.5)',
                    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
                    JD Keyword Analysis
                  </div>
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    {d.jd_matched_keywords?.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, color: '#10b981', marginBottom: 7 }}>Matched Keywords</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {d.jd_matched_keywords.slice(0, 15).map((k, i) => (
                            <span key={i} style={{
                              fontSize: 11, color: '#10b981', background: 'rgba(16,185,129,0.08)',
                              border: '1px solid rgba(16,185,129,0.2)', padding: '2px 8px', borderRadius: 5,
                              fontFamily: 'JetBrains Mono'
                            }}>{k}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {d.jd_missing_keywords?.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, color: '#f43f5e', marginBottom: 7 }}>Missing Keywords</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {d.jd_missing_keywords.slice(0, 15).map((k, i) => (
                            <span key={i} style={{
                              fontSize: 11, color: '#f43f5e', background: 'rgba(244,63,94,0.06)',
                              border: '1px solid rgba(244,63,94,0.2)', padding: '2px 8px', borderRadius: 5,
                              fontFamily: 'JetBrains Mono'
                            }}>{k}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Section Cards */}
              {d.sections?.length > 0 && (
                <div>
                  <div className="syne" style={{ fontSize: 13, fontWeight: 700, color: 'rgba(240,240,255,0.5)',
                    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
                    Section Analysis · Click "Improve" for AI rewrites
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                    {d.sections.map((section, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <SectionCard
                          section={section}
                          targetRole={d.target_role}
                          jobDescription={jdText}
                          onImproveStart={setImproveSection}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── IMPROVEMENT DRAWER ── */}
      <AnimatePresence>
        {improveSection && (
          <ImprovementDrawer
            section={improveSection}
            targetRole={d?.target_role}
            jobDescription={jdText}
            onClose={() => setImproveSection(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}