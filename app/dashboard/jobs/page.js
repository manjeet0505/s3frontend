'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, MapPin, DollarSign, Zap, ExternalLink,
  ChevronDown, ChevronUp, Loader2, Sparkles, AlertCircle,
  RefreshCw, Wifi, CheckCircle2, X, TrendingUp, Star,
  Bookmark, BookmarkCheck, GripVertical, Trash2,
  Building2, Clock, Target, Award, Filter, BarChart3,
  Globe, Users, Laptop, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';

const API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:8000';

/* ─── CSS ───────────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap');
.jobs-root { font-family:'DM Sans',sans-serif; min-height:100vh; position:relative; }
.syne { font-family:'Syne',sans-serif; }
.mono { font-family:'JetBrains Mono',monospace; }

.tab-pill {
  padding:8px 20px; border-radius:10px; font-size:13px; font-weight:500;
  border:1px solid rgba(255,255,255,0.08); cursor:pointer; transition:all 0.2s;
  background:rgba(255,255,255,0.03); color:rgba(240,240,255,0.5);
}
.tab-pill.active {
  background:rgba(139,92,246,0.15); border-color:rgba(139,92,246,0.4);
  color:#a78bfa;
}

.job-card {
  background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
  border-radius:16px; overflow:hidden; position:relative;
  transition:all 0.25s; cursor:default;
}
.job-card:hover {
  border-color:rgba(139,92,246,0.3);
  background:rgba(255,255,255,0.05);
  transform:translateY(-2px);
  box-shadow:0 12px 40px rgba(0,0,0,0.4);
}
.job-card::before {
  content:''; position:absolute; top:0; left:0; right:0; height:1px;
}

.filter-btn {
  padding:6px 14px; border-radius:8px; font-size:12px; font-weight:500;
  border:1px solid rgba(255,255,255,0.08); cursor:pointer;
  background:rgba(255,255,255,0.03); color:rgba(240,240,255,0.5);
  transition:all 0.2s; display:flex; align-items:center; gap:5px;
}
.filter-btn.active {
  background:rgba(139,92,246,0.12); border-color:rgba(139,92,246,0.35);
  color:#a78bfa;
}
.filter-btn:hover { border-color:rgba(255,255,255,0.15); color:rgba(240,240,255,0.8); }

.match-ring-svg { filter:drop-shadow(0 0 8px var(--ring-glow)); }

.save-btn {
  border:none; background:rgba(255,255,255,0.06); border-radius:8px;
  padding:7px; cursor:pointer; transition:all 0.2s; color:rgba(240,240,255,0.4);
  display:flex; align-items:center;
}
.save-btn:hover { background:rgba(139,92,246,0.15); color:#a78bfa; }
.save-btn.saved { background:rgba(16,185,129,0.12); color:#10b981; }

.apply-btn {
  background:linear-gradient(135deg,#7c3aed,#6d28d9); border:none;
  color:#fff; border-radius:10px; padding:9px 18px; font-size:13px;
  font-weight:600; cursor:pointer; transition:all 0.2s;
  display:flex; align-items:center; gap:6px; font-family:'DM Sans';
}
.apply-btn:hover { opacity:0.88; box-shadow:0 0 20px rgba(124,58,237,0.4); }

/* Kanban */
.kanban-col {
  background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06);
  border-radius:14px; min-height:200px; flex:1; min-width:0;
  transition:background 0.2s;
}
.kanban-col.drag-over { background:rgba(139,92,246,0.06); border-color:rgba(139,92,246,0.3); }
.kanban-card {
  background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
  border-radius:10px; padding:12px; margin:8px; cursor:grab;
  transition:all 0.2s; user-select:none;
}
.kanban-card:hover { border-color:rgba(139,92,246,0.25); background:rgba(255,255,255,0.06); }
.kanban-card.dragging { opacity:0.5; cursor:grabbing; }

.stat-pill {
  background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);
  border-radius:10px; padding:12px 16px; display:flex; align-items:center; gap:10px;
}

@keyframes scoreIn { from{stroke-dashoffset:var(--dash-total)} to{stroke-dashoffset:var(--dash-offset)} }
.score-arc { animation:scoreIn 1.2s cubic-bezier(0.16,1,0.3,1) forwards; }
`;

/* ─── Match Ring ────────────────────────────────────────────────────────────── */
function MatchRing({ score, size = 64 }) {
  const R = (size / 2) - 5;
  const C = 2 * Math.PI * R;
  const offset = C - (score / 100) * C;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#a78bfa' : '#f59e0b';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      className="match-ring-svg" style={{ '--ring-glow': color }}>
      <circle cx={size/2} cy={size/2} r={R} fill="none"
        stroke="rgba(255,255,255,0.06)" strokeWidth="5"/>
      <circle cx={size/2} cy={size/2} r={R} fill="none"
        stroke={color} strokeWidth="5"
        strokeDasharray={C}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{
          '--dash-total': C, '--dash-offset': offset,
          strokeDashoffset: C,
          animation: 'scoreIn 1.2s cubic-bezier(0.16,1,0.3,1) forwards'
        }}/>
      <text x={size/2} y={size/2 + 1} textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize={size < 56 ? 10 : 13}
        fontFamily="JetBrains Mono" fontWeight="600">{score}%</text>
    </svg>
  );
}

/* ─── Job Type Badge ─────────────────────────────────────────────────────────── */
const TYPE_CONFIG = {
  internship: { color:'#10b981', bg:'rgba(16,185,129,0.1)', border:'rgba(16,185,129,0.25)', label:'Intern', icon: '🎓' },
  remote:     { color:'#06b6d4', bg:'rgba(6,182,212,0.1)',  border:'rgba(6,182,212,0.25)',  label:'Remote', icon: '🌐' },
  fulltime:   { color:'#a78bfa', bg:'rgba(167,139,250,0.1)',border:'rgba(167,139,250,0.25)',label:'Full-time', icon: '💼' },
  parttime:   { color:'#f59e0b', bg:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.25)', label:'Part-time', icon: '⏰' },
  contractor: { color:'#f97316', bg:'rgba(249,115,22,0.1)', border:'rgba(249,115,22,0.25)', label:'Contract', icon: '📋' },
};

function TypeBadge({ type }) {
  const cfg = TYPE_CONFIG[type?.toLowerCase()] || TYPE_CONFIG.fulltime;
  return (
    <span style={{
      fontSize:11, fontWeight:500, color:cfg.color,
      background:cfg.bg, border:`1px solid ${cfg.border}`,
      padding:'2px 8px', borderRadius:6
    }}>{cfg.icon} {cfg.label}</span>
  );
}

/* ─── 2-Skills-Away Nudge ────────────────────────────────────────────────────── */
function SkillsNudge({ missing, score }) {
  if (!missing?.length || score >= 90) return null;
  const needed = missing.slice(0, 2);
  return (
    <div style={{
      marginTop:10, padding:'8px 12px', borderRadius:8,
      background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.15)',
      display:'flex', alignItems:'center', gap:8
    }}>
      <Target size={12} color="#f59e0b"/>
      <span style={{ fontSize:11, color:'rgba(240,240,255,0.6)' }}>
        Learn <strong style={{color:'#f59e0b'}}>{needed.join(' + ')}</strong>
        {' '}to hit {Math.min(score + 15, 98)}% match
      </span>
    </div>
  );
}

/* ─── Job Card ───────────────────────────────────────────────────────────────── */
function JobCard({ job, index, savedIds, onSave }) {
  const [expanded, setExpanded] = useState(false);
  const score    = typeof job.match_score === 'number'
    ? Math.round(job.match_score > 1 ? job.match_score : job.match_score * 100) : 0;
  const overlap  = job.skill_overlap || [];
  const missing  = job.missing_skills || [];
  const overlapP = job.skill_overlap_percent || 0;
  const isSaved  = savedIds.has(job._savedId || `${job.title}-${job.company}`);

  const topColor = score >= 80 ? 'rgba(16,185,129,0.8)'
    : score >= 60 ? 'rgba(167,139,250,0.8)' : 'rgba(245,158,11,0.6)';

  return (
    <motion.div
      className="job-card"
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: index * 0.05, duration:0.35 }}
      style={{ '--top-color': topColor }}
    >
      <div style={{ height:1, background:`linear-gradient(90deg,transparent,${topColor},transparent)` }}/>
      <div style={{ padding:'16px 18px' }}>
        {/* Header row */}
        <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 }}>
          {/* Company avatar */}
          <div style={{
            width:42, height:42, borderRadius:12, flexShrink:0,
            background:'linear-gradient(135deg,#7c3aed,#4f46e5)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#fff', fontWeight:700, fontSize:16
          }}>
            {job.company?.[0]?.toUpperCase() || 'J'}
          </div>

          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
              <div style={{ minWidth:0 }}>
                <div className="syne" style={{ fontSize:14, fontWeight:700, color:'#f0f0ff', lineHeight:1.3 }}>
                  {job.title}
                </div>
                <div style={{ fontSize:12, color:'#a78bfa', fontWeight:500, marginTop:2 }}>
                  {job.company}
                </div>
              </div>
              <MatchRing score={score} size={52}/>
            </div>

            {/* Meta row */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:8, alignItems:'center' }}>
              {job.location && (
                <span style={{ display:'flex', alignItems:'center', gap:3, fontSize:11, color:'rgba(240,240,255,0.4)' }}>
                  <MapPin size={10}/>{job.location}
                </span>
              )}
              {job.salary && job.salary !== 'Not - disclosed' && (
                <span style={{ display:'flex', alignItems:'center', gap:3, fontSize:11, color:'rgba(240,240,255,0.4)' }}>
                  <DollarSign size={10}/>{job.salary}
                </span>
              )}
              <TypeBadge type={job.job_type || job.employment_type}/>
              {job.is_remote && (
                <span style={{ fontSize:11, color:'#06b6d4', background:'rgba(6,182,212,0.08)',
                  border:'1px solid rgba(6,182,212,0.2)', padding:'2px 7px', borderRadius:5 }}>
                  🌐 Remote
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Why it fits */}
        {job.why_this_fits && (
          <div style={{
            padding:'8px 12px', borderRadius:8,
            background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.12)',
            display:'flex', gap:8, marginBottom:10
          }}>
            <Sparkles size={12} color="#a78bfa" style={{ flexShrink:0, marginTop:1 }}/>
            <p style={{ fontSize:12, color:'rgba(240,240,255,0.6)', margin:0, lineHeight:1.5 }}>
              {job.why_this_fits}
            </p>
          </div>
        )}

        {/* Skill overlap bar */}
        {overlapP > 0 && (
          <div style={{ marginBottom:8 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ fontSize:11, color:'rgba(240,240,255,0.4)' }}>Skill overlap</span>
              <span className="mono" style={{ fontSize:11, color:'#a78bfa' }}>{overlapP}%</span>
            </div>
            <div style={{ height:4, borderRadius:4, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
              <motion.div
                initial={{ width:0 }}
                animate={{ width:`${overlapP}%` }}
                transition={{ delay: 0.3 + index * 0.04, duration:0.9 }}
                style={{ height:'100%', borderRadius:4,
                  background:'linear-gradient(90deg,#7c3aed,#a78bfa)' }}
              />
            </div>
          </div>
        )}

        {/* 2-skills nudge */}
        <SkillsNudge missing={missing} score={score}/>

        {/* Expand toggle */}
        <button onClick={() => setExpanded(!expanded)} style={{
          background:'none', border:'none', cursor:'pointer', marginTop:8,
          color:'rgba(139,92,246,0.6)', fontSize:12, display:'flex',
          alignItems:'center', gap:4, padding:0, fontFamily:'DM Sans'
        }}>
          {expanded ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
          {expanded ? 'Less' : 'Details + Skills'}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
              exit={{ height:0, opacity:0 }} transition={{ duration:0.22 }}
              style={{ overflow:'hidden' }}
            >
              <div style={{ paddingTop:12, display:'flex', flexDirection:'column', gap:10 }}>
                {overlap.length > 0 && (
                  <div>
                    <div style={{ fontSize:11, color:'#10b981', marginBottom:5, display:'flex', alignItems:'center', gap:4 }}>
                      <CheckCircle2 size={11}/>You have ({overlap.length})
                    </div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                      {overlap.map((s,i) => (
                        <span key={i} style={{ fontSize:10, color:'#10b981',
                          background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)',
                          padding:'2px 7px', borderRadius:5 }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {missing.length > 0 && (
                  <div>
                    <div style={{ fontSize:11, color:'#f59e0b', marginBottom:5, display:'flex', alignItems:'center', gap:4 }}>
                      <TrendingUp size={11}/>Learn ({missing.length})
                    </div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                      {missing.map((s,i) => (
                        <span key={i} style={{ fontSize:10, color:'#f59e0b',
                          background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)',
                          padding:'2px 7px', borderRadius:5 }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {job.description && (
                  <p style={{ fontSize:12, color:'rgba(240,240,255,0.45)', margin:0, lineHeight:1.6 }}>
                    {job.description.slice(0, 240)}…
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action row */}
        <div style={{ display:'flex', gap:8, marginTop:12, paddingTop:12,
          borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          {job.url && (
            <button className="apply-btn" style={{ flex:1 }}
              onClick={() => window.open(job.url, '_blank', 'noopener,noreferrer')}>
              Apply Now <ExternalLink size={12}/>
            </button>
          )}
          <button
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={() => onSave(job)}
            title={isSaved ? 'Saved!' : 'Save to tracker'}
          >
            {isSaved ? <BookmarkCheck size={16}/> : <Bookmark size={16}/>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Kanban Column ──────────────────────────────────────────────────────────── */
const COL_CONFIG = {
  saved:        { label:'Saved',       color:'#a78bfa', bg:'rgba(167,139,250,0.12)' },
  applied:      { label:'Applied',     color:'#60a5fa', bg:'rgba(96,165,250,0.12)'  },
  interviewing: { label:'Interviewing',color:'#f59e0b', bg:'rgba(245,158,11,0.12)'  },
  offer:        { label:'Offer 🎉',    color:'#10b981', bg:'rgba(16,185,129,0.12)'  },
  rejected:     { label:'Rejected',    color:'#f43f5e', bg:'rgba(244,63,94,0.12)'   },
};

function KanbanColumn({ status, cards, onDrop, onStatusChange, onDelete, draggingId, setDraggingId }) {
  const cfg       = COL_CONFIG[status];
  const [over, setOver] = useState(false);

  return (
    <div
      className={`kanban-col ${over ? 'drag-over' : ''}`}
      onDragOver={e => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={e => { e.preventDefault(); setOver(false); onDrop(status); }}
    >
      {/* Col header */}
      <div style={{ padding:'12px 14px 8px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span className="syne" style={{ fontSize:12, fontWeight:700, color:cfg.color, textTransform:'uppercase', letterSpacing:'0.06em' }}>
            {cfg.label}
          </span>
          <span style={{ fontSize:11, color:'rgba(240,240,255,0.3)',
            background:'rgba(255,255,255,0.05)', padding:'1px 7px', borderRadius:5 }}>
            {cards.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div style={{ padding:'4px 0', minHeight:120 }}>
        {cards.map(card => (
          <div
            key={card.id}
            className={`kanban-card ${draggingId === card.id ? 'dragging' : ''}`}
            draggable
            onDragStart={() => setDraggingId(card.id)}
            onDragEnd={() => setDraggingId(null)}
            style={{ borderLeft:`3px solid ${cfg.color}` }}
          >
            <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
              <GripVertical size={12} color="rgba(240,240,255,0.2)" style={{ marginTop:2, flexShrink:0 }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'#e8e8f8',
                  whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {card.title}
                </div>
                <div style={{ fontSize:11, color:'rgba(240,240,255,0.45)', marginTop:1 }}>
                  {card.company}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:6, flexWrap:'wrap' }}>
                  {card.match_score > 0 && (
                    <span className="mono" style={{ fontSize:10, color:'#a78bfa' }}>{card.match_score}%</span>
                  )}
                  <TypeBadge type={card.job_type}/>
                  {/* Days since added */}
                  {card.added_at && (
                    <span style={{ fontSize:10, color:'rgba(240,240,255,0.3)', display:'flex', alignItems:'center', gap:2 }}>
                      <Clock size={9}/>
                      {Math.floor((Date.now() - new Date(card.added_at)) / 86400000)}d
                    </span>
                  )}
                </div>
                {card.notes && (
                  <div style={{ marginTop:6, fontSize:11, color:'rgba(240,240,255,0.4)',
                    fontStyle:'italic', lineHeight:1.4 }}>
                    {card.notes.slice(0, 80)}{card.notes.length > 80 ? '…' : ''}
                  </div>
                )}
              </div>
              <button onClick={() => onDelete(card.id)} style={{
                background:'none', border:'none', cursor:'pointer',
                color:'rgba(240,240,255,0.2)', padding:2, flexShrink:0
              }}>
                <Trash2 size={12}/>
              </button>
            </div>
            {/* Move buttons */}
            <div style={{ display:'flex', gap:4, marginTop:8, flexWrap:'wrap' }}>
              {Object.keys(COL_CONFIG).filter(s => s !== status).map(s => (
                <button key={s} onClick={() => onStatusChange(card.id, s)} style={{
                  fontSize:10, padding:'2px 7px', borderRadius:5, cursor:'pointer',
                  background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
                  color:'rgba(240,240,255,0.4)', fontFamily:'DM Sans',
                  transition:'all 0.15s'
                }}>→ {COL_CONFIG[s].label}</button>
              ))}
            </div>
          </div>
        ))}
        {cards.length === 0 && (
          <div style={{ padding:'20px 14px', textAlign:'center',
            fontSize:11, color:'rgba(240,240,255,0.2)' }}>
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Funnel Stats ───────────────────────────────────────────────────────────── */
function FunnelStats({ stats }) {
  if (!stats || !stats.total) return null;
  const cols = [
    { key:'saved',        label:'Saved',        color:'#a78bfa' },
    { key:'applied',      label:'Applied',      color:'#60a5fa' },
    { key:'interviewing', label:'Interviewing', color:'#f59e0b' },
    { key:'offer',        label:'Offers',       color:'#10b981' },
    { key:'rejected',     label:'Rejected',     color:'#f43f5e' },
  ];
  return (
    <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:20 }}>
      {cols.map(c => (
        <div key={c.key} className="stat-pill" style={{ flex:1, minWidth:90 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:c.color, flexShrink:0 }}/>
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:c.color, fontFamily:'JetBrains Mono' }}>
              {stats[c.key] || 0}
            </div>
            <div style={{ fontSize:11, color:'rgba(240,240,255,0.4)' }}>{c.label}</div>
          </div>
        </div>
      ))}
      {stats.response_rate !== undefined && (
        <div className="stat-pill" style={{ flex:1, minWidth:110 }}>
          <BarChart3 size={16} color="#10b981"/>
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:'#10b981', fontFamily:'JetBrains Mono' }}>
              {stats.response_rate}%
            </div>
            <div style={{ fontSize:11, color:'rgba(240,240,255,0.4)' }}>Response rate</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────────── */
export default function JobsPage() {
  const { getUserId } = useAuth();
  const userId = getUserId();

  const [tab,      setTab]      = useState('matches');
  const [jobs,     setJobs]     = useState([]);
  const [apps,     setApps]     = useState([]);
  const [appStats, setAppStats] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [scraping, setScraping] = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [filter,   setFilter]   = useState('all');
  const [savedIds, setSavedIds] = useState(new Set());
  const [draggingId, setDraggingId] = useState(null);
  const dragCardRef = useRef(null);

  const stats = {
    total:    jobs.length ? (jobs[0]?.total_scanned || jobs.length) : 0,
    matches:  jobs.length,
    avgScore: jobs.length
      ? Math.round(jobs.reduce((a, j) => a + (j.match_score || 0), 0) / jobs.length)
      : 0,
  };

  useEffect(() => { if (userId) { loadCachedJobs(); loadApplications(); } }, [userId]);

  async function loadCachedJobs() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/jobs/cached?user_id=${userId}`);
      if (!res.ok) throw new Error('no cache');
      const data = await res.json();
      setJobs(Array.isArray(data.matches) ? data.matches : []);
    } catch { setJobs([]); }
    finally { setLoading(false); }
  }

  async function loadApplications() {
    try {
      const [appsRes, statsRes] = await Promise.all([
        fetch(`${API}/jobs/applications?user_id=${userId}`),
        fetch(`${API}/jobs/applications/stats?user_id=${userId}`),
      ]);
      if (appsRes.ok) {
        const d = await appsRes.json();
        setApps(d.applications || []);
        const ids = new Set((d.applications || []).map(a => `${a.title}-${a.company}`));
        setSavedIds(ids);
      }
      if (statsRes.ok) setAppStats(await statsRes.json());
    } catch {}
  }

  async function handleScrapeAndMatch() {
    if (!userId || scraping) return;
    setScraping(true); setError(''); setSuccess('');
    try {
      const res  = await fetch(`${API}/jobs/scrape-and-match?user_id=${userId}`, { method:'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Matching failed');
      const matches = data.matches || [];
      setJobs(matches);
      setSuccess(`Found ${matches.length} job matches!`);
      setTimeout(() => setSuccess(''), 5000);
    } catch (e) {
      setError(e.message || 'Job matching failed. Please try again.');
    } finally { setScraping(false); }
  }

  async function handleSaveJob(job) {
    const key = `${job.title}-${job.company}`;
    if (savedIds.has(key)) return;
    try {
      const res = await fetch(`${API}/jobs/applications`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          user_id:     userId,
          title:       job.title,
          company:     job.company,
          url:         job.url || '',
          match_score: job.match_score || 0,
          job_type:    job.job_type || 'fulltime',
          location:    job.location || '',
          salary:      job.salary || '',
          status:      'saved',
        }),
      });
      if (res.ok) {
        setSavedIds(prev => new Set([...prev, key]));
        await loadApplications();
        setSuccess('Saved to tracker!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch {}
  }

  async function handleStatusChange(appId, newStatus) {
    try {
      await fetch(`${API}/jobs/applications/${appId}?user_id=${userId}`, {
        method:'PATCH',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setApps(prev => prev.map(a => a.id === appId ? {...a, status: newStatus} : a));
      setAppStats(prev => prev ? {
        ...prev,
        [apps.find(a => a.id === appId)?.status]: (prev[apps.find(a => a.id === appId)?.status] || 1) - 1,
        [newStatus]: (prev[newStatus] || 0) + 1,
      } : prev);
    } catch {}
  }

  async function handleDelete(appId) {
    try {
      await fetch(`${API}/jobs/applications/${appId}?user_id=${userId}`, { method:'DELETE' });
      setApps(prev => prev.filter(a => a.id !== appId));
    } catch {}
  }

  function handleKanbanDrop(targetStatus) {
    if (!draggingId || !dragCardRef.current) return;
    handleStatusChange(draggingId, targetStatus);
    dragCardRef.current = null;
  }

  // Filter jobs
  const FILTERS = [
    { key:'all',         label:'All',        count: jobs.length },
    { key:'fulltime',    label:'Full-time',  count: jobs.filter(j => (j.job_type||'fulltime') === 'fulltime').length },
    { key:'internship',  label:'Internship', count: jobs.filter(j => j.job_type === 'internship').length },
    { key:'remote',      label:'Remote',     count: jobs.filter(j => j.job_type === 'remote' || j.is_remote).length },
    { key:'top',         label:'Top 80%+',   count: jobs.filter(j => (j.match_score||0) >= 80).length },
  ];

  const filtered = filter === 'all' ? jobs
    : filter === 'top' ? jobs.filter(j => (j.match_score||0) >= 80)
    : filter === 'remote' ? jobs.filter(j => j.job_type === 'remote' || j.is_remote)
    : jobs.filter(j => (j.job_type || 'fulltime') === filter);

  // Kanban grouped
  const kanbanCols = {
    saved:        apps.filter(a => a.status === 'saved'),
    applied:      apps.filter(a => a.status === 'applied'),
    interviewing: apps.filter(a => a.status === 'interviewing'),
    offer:        apps.filter(a => a.status === 'offer'),
    rejected:     apps.filter(a => a.status === 'rejected'),
  };

  return (
    <div className="jobs-root" style={{ background:'#050510', minHeight:'100vh', padding:'28px 24px' }}>
      <style>{CSS}</style>

      {/* ── Header ── */}
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
        style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
            <Briefcase size={16} color="#a78bfa"/>
            <span style={{ fontSize:12, color:'rgba(240,240,255,0.4)', fontWeight:500 }}>Career Intelligence</span>
          </div>
          <h1 className="syne" style={{ margin:0, fontSize:26, fontWeight:800, color:'#f0f0ff' }}>
            Job Matches
          </h1>
          <p style={{ margin:'4px 0 0', fontSize:13, color:'rgba(240,240,255,0.35)' }}>
            AI-matched via Qdrant vector search + GPT-4o scoring
          </p>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          {jobs.length > 0 && (
            <button onClick={handleScrapeAndMatch} disabled={scraping} style={{
              display:'flex', alignItems:'center', gap:6, padding:'8px 16px',
              borderRadius:10, border:'1px solid rgba(255,255,255,0.1)',
              background:'rgba(255,255,255,0.04)', color:'rgba(240,240,255,0.6)',
              fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'DM Sans'
            }}>
              {scraping ? <Loader2 size={14} className="animate-spin"/> : <RefreshCw size={14}/>}
              {scraping ? 'Matching…' : 'Refresh'}
            </button>
          )}
        </div>
      </motion.div>

      {/* ── Toasts ── */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
              borderRadius:10, background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.25)',
              marginBottom:16, fontSize:13, color:'#10b981' }}>
            <CheckCircle2 size={15}/>
            {success}
            <button onClick={() => setSuccess('')} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#10b981' }}>
              <X size={14}/>
            </button>
          </motion.div>
        )}
        {error && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
              borderRadius:10, background:'rgba(244,63,94,0.08)', border:'1px solid rgba(244,63,94,0.2)',
              marginBottom:16, fontSize:13, color:'#f43f5e' }}>
            <AlertCircle size={15}/>
            {error}
            <button onClick={() => setError('')} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#f43f5e' }}>
              <X size={14}/>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Stats row ── */}
      {!loading && jobs.length > 0 && (
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
          style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
          {[
            { icon: Briefcase, label:'Jobs Scanned',    value: stats.total,           color:'#a78bfa' },
            { icon: Star,      label:'Top Matches',     value: jobs.length,           color:'#60a5fa' },
            { icon: TrendingUp,label:'Avg Match Score', value: `${stats.avgScore}%`,  color:'#10b981' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
              transition={{delay: 0.05 * i}} className="stat-pill">
              <div style={{ width:34, height:34, borderRadius:9,
                background:`${s.color}15`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <s.icon size={16} color={s.color}/>
              </div>
              <div>
                <div style={{ fontSize:11, color:'rgba(240,240,255,0.4)' }}>{s.label}</div>
                <div className="mono" style={{ fontSize:18, fontWeight:600, color:s.color }}>{s.value}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ── Tabs ── */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        <button className={`tab-pill ${tab === 'matches' ? 'active' : ''}`} onClick={() => setTab('matches')}>
          <span style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Sparkles size={13}/>AI Matches
            {jobs.length > 0 && (
              <span style={{ background:'rgba(139,92,246,0.2)', color:'#a78bfa',
                fontSize:10, padding:'1px 6px', borderRadius:4 }}>{jobs.length}</span>
            )}
          </span>
        </button>
        <button className={`tab-pill ${tab === 'tracker' ? 'active' : ''}`} onClick={() => setTab('tracker')}>
          <span style={{ display:'flex', alignItems:'center', gap:6 }}>
            <BookmarkCheck size={13}/>My Applications
            {apps.length > 0 && (
              <span style={{ background:'rgba(16,185,129,0.15)', color:'#10b981',
                fontSize:10, padding:'1px 6px', borderRadius:4 }}>{apps.length}</span>
            )}
          </span>
        </button>
      </div>

      {/* ══ TAB: AI MATCHES ══ */}
      {tab === 'matches' && (
        <>
          {/* Scraping banner */}
          <AnimatePresence>
            {scraping && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 18px',
                  borderRadius:12, background:'rgba(139,92,246,0.06)',
                  border:'1px solid rgba(139,92,246,0.2)', marginBottom:16 }}>
                <Loader2 size={16} color="#a78bfa" style={{ animation:'spin 1s linear infinite' }}/>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:'#a78bfa' }}>Running job matching agent…</div>
                  <div style={{ fontSize:12, color:'rgba(240,240,255,0.4)', marginTop:2 }}>
                    Scraping JSearch → Qdrant embedding → GPT-4o ranking (~30–60s)
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading skeleton */}
          {loading && !scraping && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ height:180, borderRadius:16,
                  background:'rgba(255,255,255,0.03)', animation:'pulse 2s infinite' }}/>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !scraping && jobs.length === 0 && (
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
              style={{ display:'flex', flexDirection:'column', alignItems:'center',
                justifyContent:'center', padding:'80px 0', textAlign:'center' }}>
              <div style={{
                width:80, height:80, borderRadius:20, marginBottom:24,
                background:'linear-gradient(135deg,#7c3aed,#4f46e5)',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 20px 60px rgba(124,58,237,0.3)'
              }}>
                <Zap size={36} color="#fff"/>
              </div>
              <h3 className="syne" style={{ fontSize:20, fontWeight:700, color:'#f0f0ff', margin:'0 0 8px' }}>
                No Job Matches Yet
              </h3>
              <p style={{ fontSize:13, color:'rgba(240,240,255,0.4)', maxWidth:360, lineHeight:1.6, marginBottom:28 }}>
                Click below to scrape live jobs from JSearch and match them to your
                profile using AI + Qdrant vector search.
              </p>
              <button onClick={handleScrapeAndMatch} disabled={scraping} style={{
                display:'flex', alignItems:'center', gap:8, padding:'12px 28px',
                background:'linear-gradient(135deg,#7c3aed,#6d28d9)', border:'none',
                borderRadius:12, color:'#fff', fontSize:14, fontWeight:700,
                cursor:'pointer', fontFamily:'Syne', boxShadow:'0 0 30px rgba(124,58,237,0.35)'
              }}>
                <Zap size={18}/> Find My Job Matches
              </button>
            </motion.div>
          )}

          {/* Job grid */}
          {!loading && jobs.length > 0 && (
            <>
              {/* Filter bar */}
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:18 }}>
                {FILTERS.map(f => (
                  <button key={f.key} className={`filter-btn ${filter === f.key ? 'active' : ''}`}
                    onClick={() => setFilter(f.key)}>
                    {f.label}
                    {f.count > 0 && (
                      <span style={{ fontSize:10, background:'rgba(255,255,255,0.08)',
                        padding:'1px 5px', borderRadius:4 }}>{f.count}</span>
                    )}
                  </button>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div style={{ textAlign:'center', padding:'40px 0',
                  fontSize:13, color:'rgba(240,240,255,0.3)' }}>No jobs match this filter.</div>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:14 }}>
                  {filtered.map((job, i) => (
                    <JobCard key={`${job.title}-${job.company}-${i}`}
                      job={job} index={i} savedIds={savedIds} onSave={handleSaveJob}/>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ══ TAB: MY APPLICATIONS (KANBAN) ══ */}
      {tab === 'tracker' && (
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}>
          <FunnelStats stats={appStats}/>

          {apps.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 0' }}>
              <BookmarkCheck size={40} color="rgba(240,240,255,0.15)" style={{ marginBottom:12 }}/>
              <div className="syne" style={{ fontSize:16, color:'rgba(240,240,255,0.4)', marginBottom:8 }}>
                No applications tracked yet
              </div>
              <p style={{ fontSize:13, color:'rgba(240,240,255,0.25)', maxWidth:320, margin:'0 auto' }}>
                Click the bookmark icon on any job card to save it here.
              </p>
            </div>
          ) : (
            <div style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:8 }}>
              {Object.keys(COL_CONFIG).map(status => (
                <div key={status} style={{ minWidth:220, flex:'0 0 220px' }}>
                  <KanbanColumn
                    status={status}
                    cards={kanbanCols[status]}
                    draggingId={draggingId}
                    setDraggingId={(id) => { setDraggingId(id); dragCardRef.current = id; }}
                    onDrop={handleKanbanDrop}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}