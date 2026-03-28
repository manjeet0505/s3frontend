'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, FileText,
  Briefcase, GraduationCap, Star,
  Calendar, AlertCircle, Clock,
  Loader2, Sparkles, ChevronRight,
  Send, MessageCircle, ExternalLink,
  TrendingUp, Award, CheckCircle2,
  Code, Layers, Database, Globe,
  BookOpen, Activity, ArrowRight
} from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { resumeApi, mentorApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

// ── Animated Background ───────────────────────────────
function PageBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div className="absolute rounded-full blur-3xl"
        style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', top: -150, right: -100 }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 20, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div className="absolute rounded-full blur-3xl"
        style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)', bottom: -100, left: -100 }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />
      <div className="absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: `linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)`, backgroundSize: '60px 60px' }}
      />
    </div>
  );
}

// ── Score Ring ────────────────────────────────────────
function ScoreRing({ score, size = 96 }) {
  const radius = (size / 2) - 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#34d399' : score >= 60 ? '#60a5fa' : '#f59e0b';
  const glow = score >= 80 ? 'rgba(52,211,153,0.3)' : score >= 60 ? 'rgba(96,165,250,0.3)' : 'rgba(245,158,11,0.3)';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="7" fill="none" />
        <motion.circle
          cx={size/2} cy={size/2} r={radius}
          stroke={color}
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
          style={{ filter: `drop-shadow(0 0 8px ${glow})` }}
        />
      </svg>
      <div className="text-center z-10">
        <motion.p
          className="font-black leading-none"
          style={{ color, fontSize: size * 0.26 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring', bounce: 0.4 }}
        >
          {score}
        </motion.p>
        <p className="text-[10px] text-white/50 mt-0.5">/ 100</p>
      </div>
    </div>
  );
}

// ── Skill Tag ─────────────────────────────────────────
function SkillTag({ skill, index }) {
  const colors = [
    'bg-blue-500/10 border-blue-500/20 text-blue-300',
    'bg-violet-500/10 border-violet-500/20 text-violet-300',
    'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
    'bg-orange-500/10 border-orange-500/20 text-orange-300',
    'bg-pink-500/10 border-pink-500/20 text-pink-300',
    'bg-teal-500/10 border-teal-500/20 text-teal-300',
  ];
  const c = colors[index % colors.length];
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.03 * index, type: 'spring', bounce: 0.3 }}
      whileHover={{ scale: 1.06, y: -1 }}
      className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-default transition-all ${c}`}
    >
      {skill}
    </motion.span>
  );
}

// ── Timeline Item ─────────────────────────────────────
function TimelineItem({ icon: Icon, title, subtitle, meta, description, color, isLast, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.1 }}
      className="relative flex gap-5"
    >
      {/* Line */}
      {!isLast && (
        <div className="absolute left-5 top-10 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, rgba(99,102,241,0.3), transparent)' }} />
      )}
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg z-10 ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-bold text-foreground text-sm">{title}</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: '#818cf8' }}>{subtitle}</p>
          </div>
          {meta && (
            <span className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0 mt-0.5 px-2.5 py-1 rounded-full bg-secondary/40 border border-border/30">
              <Clock className="w-3 h-3" />
              {meta}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">{description}</p>
        )}
      </div>
    </motion.div>
  );
}

// ── Session Card ──────────────────────────────────────
function SessionCard({ session, index }) {
  const statusMap = {
    pending: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', dot: 'bg-yellow-400', label: 'Pending' },
    accepted: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400', label: 'Confirmed' },
    declined: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-400', label: 'Declined' },
  };
  const s = statusMap[session.status] || statusMap.pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index }}
      className="group relative p-4 rounded-2xl border border-border/40 bg-card/40 hover:bg-card/70 hover:border-border/70 backdrop-blur-sm transition-all overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="flex items-start gap-4">
        {/* Mentor avatar */}
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-md shadow-blue-500/20">
          {session.mentor_name?.[0]?.toUpperCase() || 'M'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="font-bold text-foreground text-sm truncate">{session.mentor_name}</p>
            <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-semibold flex-shrink-0 ${s.color} ${s.bg} ${s.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {session.day}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {session.time_slot}
            </div>
          </div>
          {session.topic && (
            <div className="flex items-start gap-1.5 mt-2 p-2 rounded-lg bg-secondary/30 border border-border/20">
              <MessageCircle className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground italic line-clamp-1">"{session.topic}"</p>
            </div>
          )}
          {session.meeting_link && session.status === 'accepted' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => window.open(session.meeting_link, '_blank', 'noopener,noreferrer')}
              className="flex items-center gap-1.5 mt-2 text-xs text-primary font-semibold hover:opacity-80 transition-opacity"
            >
              <ExternalLink className="w-3 h-3" />
              Join Meeting
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Tab Button ────────────────────────────────────────
function TabBtn({ label, icon: Icon, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
        active
          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
      {badge > 0 && (
        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${active ? 'bg-white/20 text-white' : 'bg-primary/20 text-primary'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

// ── Stat Card ─────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, bg, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl border ${bg} backdrop-blur-sm text-center`}
    >
      <Icon className={`w-4 h-4 ${color}`} />
      <motion.p
        className={`text-2xl font-black ${color}`}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.15, type: 'spring', bounce: 0.4 }}
      >
        {value}
      </motion.p>
      <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
    </motion.div>
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

  const skills = profile?.skills || [];
  const experience = profile?.experience || profile?.work_experience || [];
  const education = profile?.education || [];
  const score = profile?.ai_profile_score || 0;
  const pendingSessions = sessions.filter(s => s.status === 'pending');
  const acceptedSessions = sessions.filter(s => s.status === 'accepted');
  const declinedSessions = sessions.filter(s => s.status === 'declined');

  // Group skills into chunks of ~10 for visual variety
  const skillGroups = skills.reduce((acc, skill, i) => {
    const g = Math.floor(i / 10);
    if (!acc[g]) acc[g] = [];
    acc[g].push(skill);
    return acc;
  }, []);

  const scoreColor = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-blue-400' : 'text-yellow-400';
  const scoreLabel = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work';

  return (
    <>
      <PageBackground />

      <div className="relative max-w-5xl mx-auto space-y-0 pb-8">

        {/* ── Hero Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(99,102,241,0.1) 50%, rgba(139,92,246,0.08) 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            boxShadow: '0 0 60px rgba(59,130,246,0.08)',
          }}
        >
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), rgba(139,92,246,0.6), transparent)' }} />
          {/* Decorative circles */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%)' }} />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08), transparent 70%)' }} />

          <div className="relative p-8">
            <div className="flex items-start justify-between gap-6 flex-wrap">

              {/* Left — Avatar + Info */}
              <div className="flex items-center gap-6">
                {/* Avatar with animated ring */}
                <div className="relative flex-shrink-0">
                  <motion.div
                    className="absolute -inset-1.5 rounded-2xl opacity-60"
                    style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.5), rgba(139,92,246,0.5))' }}
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <div
                    className="relative w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-2xl"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', margin: '2px' }}
                  >
                    {name?.[0]?.toUpperCase() || 'S'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-card shadow-lg" />
                </div>

                {/* Name + details */}
                <div>
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-black text-3xl text-foreground"
                  >
                    {name}
                  </motion.h2>
                  {(profile?.title || profile?.current_title) && (
                    <p className="text-primary font-semibold text-sm mt-0.5">
                      {profile.title || profile.current_title}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {email && (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="w-3.5 h-3.5" /> {email}
                      </span>
                    )}
                    {(profile?.phone || profile?.phone_number) && (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="w-3.5 h-3.5" /> {profile.phone || profile.phone_number}
                      </span>
                    )}
                    {(profile?.location || profile?.city) && (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" /> {profile.location || profile.city}
                      </span>
                    )}
                  </div>
                  {(profile?.summary || profile?.bio) && (
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-lg line-clamp-2 italic">
                      "{profile.summary || profile.bio}"
                    </p>
                  )}
                </div>
              </div>

              {/* Right — Score Ring */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">AI Score</span>
                </div>
                {loading
                  ? <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  : <ScoreRing score={score} size={100} />
                }
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  score >= 80 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : score >= 60 ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                  : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                }`}>
                  {scoreLabel}
                </span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
              {[
                { icon: Code, label: 'Skills', value: skills.length, color: 'text-blue-400', bg: 'border-blue-500/20 bg-blue-500/5', delay: 0.3 },
                { icon: Briefcase, label: 'Experience', value: experience.length, color: 'text-violet-400', bg: 'border-violet-500/20 bg-violet-500/5', delay: 0.35 },
                { icon: GraduationCap, label: 'Education', value: education.length, color: 'text-emerald-400', bg: 'border-emerald-500/20 bg-emerald-500/5', delay: 0.4 },
                { icon: Calendar, label: 'Sessions', value: sessions.length, color: 'text-orange-400', bg: 'border-orange-500/20 bg-orange-500/5', delay: 0.45 },
              ].map(s => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* Update Resume CTA */}
          <div className="relative px-8 pb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/dashboard/resume')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/30 bg-primary/10 text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <FileText className="w-4 h-4" />
              Update Resume
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </motion.div>

        {/* ── Tab Navigation ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 p-1.5 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm mb-6"
        >
          <TabBtn label="Overview" icon={Activity} active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <TabBtn label="Skills" icon={Code} active={activeTab === 'skills'} onClick={() => setActiveTab('skills')} badge={skills.length} />
          <TabBtn label="Experience" icon={Briefcase} active={activeTab === 'experience'} onClick={() => setActiveTab('experience')} badge={experience.length + education.length} />
          <TabBtn label="Sessions" icon={Calendar} active={activeTab === 'sessions'} onClick={() => setActiveTab('sessions')} badge={sessions.length} />
        </motion.div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              {/* Top skills preview */}
              <div className="p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                      <Star className="w-4 h-4 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-foreground">Top Skills</h3>
                  </div>
                  <button onClick={() => setActiveTab('skills')} className="flex items-center gap-1 text-xs text-primary hover:opacity-80 transition-opacity font-medium">
                    View all <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.slice(0, 15).map((skill, i) => <SkillTag key={skill} skill={skill} index={i} />)}
                  {skills.length > 15 && (
                    <button onClick={() => setActiveTab('skills')} className="px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
                      +{skills.length - 15} more
                    </button>
                  )}
                </div>
              </div>

              {/* Recent experience */}
              {experience.length > 0 && (
                <div className="p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-violet-400" />
                      </div>
                      <h3 className="font-bold text-foreground">Recent Experience</h3>
                    </div>
                    <button onClick={() => setActiveTab('experience')} className="flex items-center gap-1 text-xs text-primary hover:opacity-80 transition-opacity font-medium">
                      View all <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {experience.slice(0, 2).map((job, i) => (
                    <TimelineItem
                      key={i} index={i}
                      icon={Briefcase}
                      title={job.title || job.role || job.position || 'Role'}
                      subtitle={job.company || job.company_name || ''}
                      meta={job.duration || job.period || job.dates}
                      description={job.description || job.responsibilities}
                      color="bg-gradient-to-br from-violet-500 to-purple-600"
                      isLast={i === Math.min(experience.length, 2) - 1}
                    />
                  ))}
                </div>
              )}

              {/* Recent sessions */}
              {sessions.length > 0 && (
                <div className="p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-orange-400" />
                      </div>
                      <h3 className="font-bold text-foreground">Recent Sessions</h3>
                    </div>
                    <button onClick={() => setActiveTab('sessions')} className="flex items-center gap-1 text-xs text-primary hover:opacity-80 transition-opacity font-medium">
                      View all <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {sessions.slice(0, 2).map((session, i) => <SessionCard key={session._id || i} session={session} index={i} />)}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!loading && skills.length === 0 && experience.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <FileText className="w-7 h-7 text-primary/60" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Your profile is empty</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mb-5">Upload your resume to automatically populate your profile with skills, experience, and education.</p>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    onClick={() => router.push('/dashboard/resume')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25"
                  >
                    <FileText className="w-4 h-4" />
                    Upload Resume
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}

          {/* SKILLS TAB */}
          {activeTab === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center">
                  <Code className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">All Skills</h3>
                  <p className="text-xs text-muted-foreground">{skills.length} skills extracted by AI from your resume</p>
                </div>
              </div>
              {loading ? (
                <div className="flex items-center gap-3 text-muted-foreground py-8">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Extracting skills...</span>
                </div>
              ) : skills.length === 0 ? (
                <div className="flex items-center gap-3 p-5 rounded-xl bg-secondary/30 border border-border/30">
                  <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">No skills yet. Upload your resume to extract them automatically.</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => <SkillTag key={skill} skill={skill} index={i} />)}
                </div>
              )}
            </motion.div>
          )}

          {/* EXPERIENCE TAB */}
          {activeTab === 'experience' && (
            <motion.div
              key="experience"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              {/* Work Experience */}
              <div className="p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Work Experience</h3>
                    <p className="text-xs text-muted-foreground">{experience.length} positions</p>
                  </div>
                </div>
                {loading ? (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Loading...</span>
                  </div>
                ) : experience.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No experience extracted yet.</p>
                ) : (
                  <div>
                    {experience.map((job, i) => (
                      <TimelineItem
                        key={i} index={i}
                        icon={Briefcase}
                        title={job.title || job.role || job.position || 'Role'}
                        subtitle={job.company || job.company_name || ''}
                        meta={job.duration || job.period || job.dates}
                        description={job.description || job.responsibilities}
                        color="bg-gradient-to-br from-violet-500 to-purple-600"
                        isLast={i === experience.length - 1}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Education */}
              <div className="p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Education</h3>
                    <p className="text-xs text-muted-foreground">{education.length} entries</p>
                  </div>
                </div>
                {loading ? (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Loading...</span>
                  </div>
                ) : education.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No education extracted yet.</p>
                ) : (
                  <div>
                    {education.map((edu, i) => (
                      <TimelineItem
                        key={i} index={i}
                        icon={GraduationCap}
                        title={edu.degree || edu.qualification || edu.course || 'Degree'}
                        subtitle={edu.institution || edu.school || edu.university || ''}
                        meta={edu.year || edu.graduation_year || edu.period}
                        color="bg-gradient-to-br from-emerald-500 to-teal-600"
                        isLast={i === education.length - 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* SESSIONS TAB */}
          {activeTab === 'sessions' && (
            <motion.div
              key="sessions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

              {/* Session stats strip */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">Session History</h3>
                  <p className="text-xs text-muted-foreground">{sessions.length} total sessions</p>
                </div>
                {sessions.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-semibold">
                      {pendingSessions.length} pending
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                      {acceptedSessions.length} confirmed
                    </span>
                  </div>
                )}
              </div>

              {sessionsLoading ? (
                <div className="flex items-center gap-3 text-muted-foreground py-8">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Loading sessions...</span>
                </div>
              ) : sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                    <Send className="w-6 h-6 text-blue-400/60" />
                  </div>
                  <p className="font-bold text-foreground mb-1">No sessions yet</p>
                  <p className="text-xs text-muted-foreground mb-5 max-w-xs">
                    Request a session with a mentor to start your mentoring journey
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push('/dashboard/mentors')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 hover:opacity-90 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                    Browse Mentors
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session, i) => (
                    <SessionCard key={session._id || i} session={session} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}