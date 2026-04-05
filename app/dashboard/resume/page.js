'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, CheckCircle2, AlertCircle,
  Sparkles, User, Mail, Phone, MapPin, Briefcase,
  GraduationCap, Star, Loader2, X,
  RefreshCw, Target, Zap, TrendingUp, AlertTriangle,
  ChevronDown, ChevronUp, Award, Search, Lightbulb,
  BarChart3, Shield
} from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { resumeApi } from '@/lib/api';

// ── Animated Background ──────────────────────────────
function PageBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
          top: -100, right: -50,
        }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
          bottom: -80, left: -80,
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}

// ── Upload Zone ──────────────────────────────────────
function UploadZone({ onUpload, uploading }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') onUpload(file);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !uploading && inputRef.current?.click()}
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
        ${dragging ? 'border-primary bg-primary/10 scale-[1.01]' : 'border-border/60 hover:border-primary/50 hover:bg-primary/5 bg-card/40'}
        ${uploading ? 'pointer-events-none' : ''}`}
    >
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/40 rounded-tl-xl" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/40 rounded-tr-xl" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/40 rounded-bl-xl" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/40 rounded-br-xl" />
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div key="uploading" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                <motion.div className="absolute inset-0 rounded-full border-2 border-primary/30" animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }} />
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-primary animate-spin" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg">Analyzing with AI...</p>
                <p className="text-sm text-muted-foreground mt-1">Deep analysis in progress — this takes ~15 seconds</p>
              </div>
              <div className="flex gap-1 mt-2">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-2 h-2 rounded-full bg-primary" animate={{ y: [0, -8, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex flex-col items-center gap-4">
              <motion.div animate={{ y: dragging ? -8 : 0 }} className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Upload className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <p className="font-semibold text-foreground text-lg">{dragging ? 'Drop it here!' : 'Drop your resume here'}</p>
                <p className="text-sm text-muted-foreground mt-1">or <span className="text-primary font-medium">click to browse</span> · PDF only</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/60 border border-border/40">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs text-muted-foreground">AI-powered deep analysis</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={handleFile} />
    </motion.div>
  );
}

// ── Score Ring ───────────────────────────────────────
function ScoreRing({ score }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 80) return '#10b981';
    if (s >= 65) return '#3b82f6';
    if (s >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getLabel = (s) => {
    if (s >= 80) return 'Excellent';
    if (s >= 65) return 'Good';
    if (s >= 50) return 'Average';
    return 'Needs Work';
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-border/30" />
          <motion.circle
            cx="60" cy="60" r={radius} fill="none"
            stroke={color} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold font-display"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
      <span className="text-sm font-semibold" style={{ color }}>{getLabel(score)}</span>
    </div>
  );
}

// ── Score Bar ────────────────────────────────────────
function ScoreBar({ label, score, color, reasoning, delay = 0 }) {
  const [showReason, setShowReason] = useState(false);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold" style={{ color }}>{score}/100</span>
          {reasoning && (
            <button onClick={() => setShowReason(!showReason)} className="text-muted-foreground hover:text-foreground transition-colors">
              {showReason ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-border/30 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay }}
        />
      </div>
      <AnimatePresence>
        {showReason && reasoning && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-muted-foreground bg-secondary/40 rounded-lg px-3 py-2 mt-1"
          >
            {reasoning}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Skill Badge ──────────────────────────────────────
function SkillBadge({ skill, delay = 0, variant = 'default' }) {
  const variants = {
    default: 'bg-secondary/60 border-border/50 text-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary',
    missing: 'bg-red-500/10 border-red-500/30 text-red-400',
    strength: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  };
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', bounce: 0.35 }}
      whileHover={{ scale: 1.07 }}
      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-default ${variants[variant]}`}
    >
      {skill}
    </motion.span>
  );
}

// ── Info Row ─────────────────────────────────────────
function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

// ── Experience Card ──────────────────────────────────
function ExperienceCard({ job, index }) {
  return (
    <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + index * 0.08 }} className="relative flex gap-4 pb-6 last:pb-0">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-500/20 z-10">
          <Briefcase className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="w-px flex-1 bg-border/50 mt-2" />
      </div>
      <div className="flex-1 pt-1 pb-4">
        <p className="font-semibold text-foreground text-sm">{job.title || job.role || job.position || job.job_title || 'Role'}</p>
        <p className="text-xs text-primary font-medium mt-0.5">{job.company || job.company_name || job.organization || ''}</p>
        {(job.duration || job.period || job.dates || job.start_date) && (
          <p className="text-xs text-muted-foreground mt-0.5">{job.duration || job.period || job.dates || `${job.start_date ?? ''} – ${job.end_date ?? 'Present'}`}</p>
        )}
        {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
          <ul className="mt-2 space-y-1">
            {job.responsibilities.slice(0, 3).map((r, i) => (
              <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                <span className="text-primary mt-0.5">•</span>{r}
              </li>
            ))}
          </ul>
        )}
        {Array.isArray(job.achievements) && job.achievements.length > 0 && (
          <ul className="mt-1.5 space-y-1">
            {job.achievements.map((a, i) => (
              <li key={i} className="text-xs text-emerald-400 flex gap-1.5">
                <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0" />{a}
              </li>
            ))}
          </ul>
        )}
        {typeof job.description === 'string' && (
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">{job.description}</p>
        )}
      </div>
    </motion.div>
  );
}

// ── Education Card ───────────────────────────────────
function EducationCard({ edu, index }) {
  return (
    <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + index * 0.08 }} className="relative flex gap-4 pb-6 last:pb-0">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20 z-10">
          <GraduationCap className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="w-px flex-1 bg-border/50 mt-2" />
      </div>
      <div className="flex-1 pt-1 pb-4">
        <p className="font-semibold text-foreground text-sm">{edu.degree || edu.qualification || edu.course || 'Degree'}</p>
        <p className="text-xs text-emerald-400 font-medium mt-0.5">{edu.institution || edu.school || edu.university || ''}</p>
        {(edu.year || edu.graduation_year || edu.period) && (
          <p className="text-xs text-muted-foreground mt-0.5">{edu.year || edu.graduation_year || edu.period}</p>
        )}
        {edu.score && <p className="text-xs text-muted-foreground mt-0.5">Score: {edu.score}</p>}
      </div>
    </motion.div>
  );
}

// ── Section Card wrapper ─────────────────────────────
function SectionCard({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({ icon: Icon, iconBg, iconColor, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div>
        <h3 className="font-display text-base font-bold">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────
export default function ResumePage() {
  const { getUserId } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const userId = getUserId();

  useEffect(() => { fetchProfile(); }, [userId]);

  async function fetchProfile() {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await resumeApi.getProfile(userId);
      setProfile(res.data);
    } catch (err) {
      if (err?.response?.status !== 404) setError('Failed to load profile. Please refresh.');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(file) {
    if (!userId) return;
    setUploading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      await resumeApi.upload(formData, userId);
      setSuccess('Resume analyzed successfully! Deep analysis complete.');
      await fetchProfile();
    } catch (err) {
      setError(err?.response?.data?.detail || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  const p = profile?.profile || profile || null;
  const hasProfile = !!(p && (p.name || p.skills || p.experience));

  const skills = p?.skills || [];
  const experience = p?.experience || p?.work_experience || [];
  const education = p?.education || [];
  const score = p?.ai_profile_score || 0;
  const scoreBreakdown = p?.score_breakdown || {};
  const scoreReasoning = p?.score_reasoning || {};
  const strengths = p?.strengths || [];
  const improvementAreas = p?.improvement_areas || [];
  const missingKeywords = p?.missing_keywords || [];
  const atsAnalysis = p?.ats_analysis || null;
  const sectionRewrites = p?.section_rewrites || null;
  const overallVerdict = p?.overall_verdict || '';

  // Score bar config
  const scoreBars = [
    { key: 'skills_score', label: 'Skills', color: '#3b82f6' },
    { key: 'projects_score', label: 'Projects', color: '#8b5cf6' },
    { key: 'experience_score', label: 'Experience', color: '#06b6d4' },
    { key: 'education_score', label: 'Education', color: '#10b981' },
    { key: 'impact_score', label: 'Impact & Achievements', color: '#f59e0b' },
    { key: 'ats_score', label: 'ATS Optimization', color: '#ec4899' },
    { key: 'completeness_score', label: 'Completeness', color: '#6366f1' },
  ].filter(b => scoreBreakdown[b.key] !== undefined);

  return (
    <>
      <PageBackground />
      <div className="relative max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-muted-foreground font-medium">Resume</span>
            </div>
            <h2 className="font-display text-3xl font-bold">Your Resume</h2>
            <p className="text-muted-foreground mt-1">Upload your PDF and let AI extract your profile</p>
          </div>
          {hasProfile && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('reupload')?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-secondary/40 hover:bg-secondary/80 text-sm font-medium transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Re-upload
            </motion.button>
          )}
        </motion.div>

        {/* Status messages */}
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />{success}
              <button onClick={() => setSuccess('')} className="ml-auto"><X className="w-4 h-4" /></button>
            </motion.div>
          )}
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
              <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Loading your profile...</p>
            </div>
          </div>
        ) : !hasProfile ? (
          <div className="max-w-2xl mx-auto">
            <UploadZone onUpload={handleUpload} uploading={uploading} />
            <p className="text-center text-xs text-muted-foreground mt-4">
              Your resume is processed securely. We extract skills, experience, and education.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {/* ── ROW 1: Profile + Score + Verdict ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Profile card */}
              <SectionCard delay={0.1} className="relative overflow-hidden">
                <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.12), transparent)' }} />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                <div className="relative flex flex-col items-center text-center mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 mb-3">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display text-lg font-bold">{p.name || p.full_name || 'Your Name'}</h3>
                  {p.target_role && <p className="text-sm text-primary font-medium mt-0.5">{p.target_role}</p>}
                  {p.experience_level && (
                    <span className="mt-2 px-3 py-1 rounded-full bg-secondary/60 text-xs font-medium capitalize">{p.experience_level}</span>
                  )}
                  {p.summary && <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">{p.summary}</p>}
                </div>
                <div className="relative space-y-0.5">
                  <InfoRow icon={Mail} label="Email" value={p.email} />
                  <InfoRow icon={Phone} label="Phone" value={p.phone || p.phone_number} />
                  <InfoRow icon={MapPin} label="Location" value={p.location || p.address || p.city} />
                  <InfoRow icon={Briefcase} label="Experience" value={p.total_experience_years != null ? `${p.total_experience_years} years` : null} />
                </div>
                <input id="reupload" type="file" accept=".pdf" className="hidden" onChange={(e) => { if (e.target.files[0]) handleUpload(e.target.files[0]); }} />
              </SectionCard>

              {/* AI Score card */}
              <SectionCard delay={0.15}>
                <SectionHeader icon={BarChart3} iconBg="bg-blue-500/15" iconColor="text-blue-400" title="AI Profile Score" subtitle="Honest industry benchmark" />
                <div className="flex justify-center mb-5">
                  <ScoreRing score={score} />
                </div>
                {scoreBars.length > 0 && (
                  <div className="space-y-3">
                    {scoreBars.map((bar, i) => (
                      <ScoreBar
                        key={bar.key}
                        label={bar.label}
                        score={scoreBreakdown[bar.key] || 0}
                        color={bar.color}
                        reasoning={scoreReasoning[bar.key.replace('_score', '_reasoning')]}
                        delay={0.1 + i * 0.05}
                      />
                    ))}
                  </div>
                )}
              </SectionCard>

              {/* Verdict + ATS card */}
              <div className="space-y-5">
                {overallVerdict && (
                  <SectionCard delay={0.2}>
                    <SectionHeader icon={Award} iconBg="bg-yellow-500/15" iconColor="text-yellow-400" title="Recruiter Verdict" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{overallVerdict}</p>
                  </SectionCard>
                )}
                {atsAnalysis && (
                  <SectionCard delay={0.25}>
                    <SectionHeader icon={Shield} iconBg="bg-emerald-500/15" iconColor="text-emerald-400" title="ATS Analysis" />
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${atsAnalysis.ats_friendly ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                        {atsAnalysis.ats_friendly ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                        {atsAnalysis.ats_friendly ? 'ATS Friendly' : 'ATS Issues Found'}
                      </div>
                      {atsAnalysis.keyword_density_score != null && (
                        <span className="text-xs text-muted-foreground">Keyword density: {atsAnalysis.keyword_density_score}/100</span>
                      )}
                    </div>
                    {Array.isArray(atsAnalysis.issues) && atsAnalysis.issues.length > 0 && (
                      <ul className="space-y-1.5">
                        {atsAnalysis.issues.map((issue, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />{issue}
                          </li>
                        ))}
                      </ul>
                    )}
                  </SectionCard>
                )}
              </div>
            </div>

            {/* ── ROW 2: Skills + Missing Keywords ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {skills.length > 0 && (
                <SectionCard delay={0.2}>
                  <SectionHeader icon={Star} iconBg="bg-yellow-500/15" iconColor="text-yellow-400" title="Skills" subtitle={`${skills.length} extracted by AI`} />
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => <SkillBadge key={`${skill}-${i}`} skill={skill} delay={0.02 * i} />)}
                  </div>
                </SectionCard>
              )}
              {missingKeywords.length > 0 && (
                <SectionCard delay={0.25}>
                  <SectionHeader icon={Search} iconBg="bg-red-500/15" iconColor="text-red-400" title="Missing Keywords" subtitle="Add these to pass ATS filters" />
                  <div className="flex flex-wrap gap-2">
                    {missingKeywords.map((kw, i) => <SkillBadge key={`${kw}-${i}`} skill={kw} delay={0.02 * i} variant="missing" />)}
                  </div>
                </SectionCard>
              )}
            </div>

            {/* ── ROW 3: Strengths + Improvements ── */}
            {(strengths.length > 0 || improvementAreas.length > 0) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {strengths.length > 0 && (
                  <SectionCard delay={0.25}>
                    <SectionHeader icon={TrendingUp} iconBg="bg-emerald-500/15" iconColor="text-emerald-400" title="Strengths" subtitle="What's working well" />
                    <ul className="space-y-2">
                      {strengths.map((s, i) => (
                        <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                          className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />{s}
                        </motion.li>
                      ))}
                    </ul>
                  </SectionCard>
                )}
                {improvementAreas.length > 0 && (
                  <SectionCard delay={0.3}>
                    <SectionHeader icon={AlertTriangle} iconBg="bg-amber-500/15" iconColor="text-amber-400" title="Improvement Areas" subtitle="Fix these to get more interviews" />
                    <ul className="space-y-2">
                      {improvementAreas.map((area, i) => (
                        <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                          className="flex items-start gap-2 text-sm text-muted-foreground">
                          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />{area}
                        </motion.li>
                      ))}
                    </ul>
                  </SectionCard>
                )}
              </div>
            )}

            {/* ── ROW 4: Section Rewrites ── */}
            {sectionRewrites && (sectionRewrites.summary || sectionRewrites.top_bullet_rewrite) && (
              <SectionCard delay={0.3}>
                <SectionHeader icon={Lightbulb} iconBg="bg-violet-500/15" iconColor="text-violet-400" title="AI Rewrite Suggestions" subtitle="Copy-paste ready improvements" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {sectionRewrites.summary && (
                    <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                      <p className="text-xs font-semibold text-violet-400 mb-2 flex items-center gap-1.5">
                        <Zap className="w-3 h-3" />Improved Summary
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{sectionRewrites.summary}</p>
                    </div>
                  )}
                  {sectionRewrites.top_bullet_rewrite && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <p className="text-xs font-semibold text-blue-400 mb-2 flex items-center gap-1.5">
                        <Zap className="w-3 h-3" />Stronger Bullet Point
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{sectionRewrites.top_bullet_rewrite}</p>
                    </div>
                  )}
                </div>
              </SectionCard>
            )}

            {/* ── ROW 5: Experience + Education ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {experience.length > 0 && (
                <SectionCard delay={0.3}>
                  <SectionHeader icon={Briefcase} iconBg="bg-violet-500/15" iconColor="text-violet-400" title="Experience" subtitle={`${experience.length} positions`} />
                  <div>
                    {experience.map((job, i) => <ExperienceCard key={i} job={job} index={i} />)}
                  </div>
                </SectionCard>
              )}
              {education.length > 0 && (
                <SectionCard delay={0.35}>
                  <SectionHeader icon={GraduationCap} iconBg="bg-emerald-500/15" iconColor="text-emerald-400" title="Education" subtitle={`${education.length} entries`} />
                  <div>
                    {education.map((edu, i) => <EducationCard key={i} edu={edu} index={i} />)}
                  </div>
                </SectionCard>
              )}
            </div>

            {/* Update resume card */}
            <SectionCard delay={0.35} className="border-dashed">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Update Resume</p>
                    <p className="text-xs text-muted-foreground">Upload a newer version to refresh your analysis</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById('reupload')?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 py-2.5 px-4 rounded-xl border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 transition-all disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? 'Uploading...' : 'Choose PDF'}
                </motion.button>
              </div>
            </SectionCard>

          </div>
        )}
      </div>
    </>
  );
}