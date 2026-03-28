'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Sparkles, Briefcase, MapPin,
  Clock, ChevronRight, Loader2, RefreshCw,
  Send, X, Calendar, BookOpen, AlertCircle,
  CheckCircle2, Zap, ExternalLink, Github,
  Linkedin, Twitter, Globe, Star, Award
} from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { mentorsApi, mentorApi } from '@/lib/api';

// ── Background ───────────────────────────────────────
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
        animate={{ scale: [1, 1.1, 1] }}
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

// ── Skeleton ─────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="p-6 rounded-2xl border border-border/50 bg-card/60 animate-pulse space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-secondary/60" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-secondary/60 rounded w-36" />
          <div className="h-3 bg-secondary/60 rounded w-28" />
          <div className="h-3 bg-secondary/60 rounded w-20" />
        </div>
        <div className="w-14 h-14 rounded-full bg-secondary/60" />
      </div>
      <div className="h-16 bg-secondary/60 rounded-xl" />
      <div className="flex gap-2">
        {[1, 2, 3].map(i => <div key={i} className="h-6 w-20 bg-secondary/60 rounded-lg" />)}
      </div>
      <div className="h-10 bg-secondary/60 rounded-xl" />
    </div>
  );
}

// ── Avatar with photo or styled initials ─────────────
function MentorAvatar({ mentor, size = 'lg' }) {
  const [imgError, setImgError] = useState(false);
  const sizeClass = size === 'lg' ? 'w-16 h-16 text-2xl' : 'w-12 h-12 text-lg';

  const gradients = [
    'from-blue-500 to-indigo-600',
    'from-violet-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-600',
    'from-pink-500 to-rose-600',
  ];
  const gradient = gradients[(mentor.name?.charCodeAt(0) || 0) % gradients.length];

  if (mentor.photo && !imgError) {
    return (
      <div className={`${sizeClass} rounded-2xl overflow-hidden flex-shrink-0 shadow-lg`}>
        <img
          src={mentor.photo}
          alt={mentor.name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClass} rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg font-bold text-white`}>
      {mentor.name?.[0]?.toUpperCase()}
    </div>
  );
}

// ── Score Ring ────────────────────────────────────────
function ScoreRing({ score }) {
  const color =
    score >= 85 ? 'text-emerald-400' :
    score >= 70 ? 'text-blue-400' :
    'text-orange-400';
  const bg =
    score >= 85 ? 'bg-emerald-500/15 border-emerald-500/30' :
    score >= 70 ? 'bg-blue-500/15 border-blue-500/30' :
    'bg-orange-500/15 border-orange-500/30';
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 ${bg} flex-shrink-0`}>
      <svg className="absolute inset-0 -rotate-90" width="56" height="56">
        <circle cx="28" cy="28" r={radius} stroke="currentColor" strokeWidth="3" fill="none" className="text-border/30" />
        <motion.circle
          cx="28" cy="28" r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          className={color}
        />
      </svg>
      <span className={`text-xs font-bold ${color} relative z-10`}>{score}%</span>
    </div>
  );
}

// ── Social Links ──────────────────────────────────────
function SocialLinks({ mentor }) {
  const links = [
    { url: mentor.linkedin, icon: Linkedin, label: 'LinkedIn', color: 'hover:text-blue-400' },
    { url: mentor.twitter, icon: Twitter, label: 'Twitter', color: 'hover:text-sky-400' },
    { url: mentor.github, icon: Github, label: 'GitHub', color: 'hover:text-purple-400' },
    { url: mentor.website, icon: Globe, label: 'Website', color: 'hover:text-emerald-400' },
  ].filter(l => l.url);

  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {links.map(({ url, icon: Icon, label, color }) => (
        <motion.button
          key={label}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
          className={`p-1.5 rounded-lg bg-secondary/40 border border-border/40 text-muted-foreground ${color} transition-colors`}
          title={label}
        >
          <Icon className="w-3.5 h-3.5" />
        </motion.button>
      ))}
    </div>
  );
}

// ── Session Request Modal ─────────────────────────────
function SessionRequestModal({ mentor, studentId, studentName, onClose, onSuccess }) {
  const [form, setForm] = useState({ day: '', time_slot: '', topic: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const availability = mentor?.availability || [];
  const selectedDayData = availability.find(a => a.day === form.day);

  async function handleSubmit() {
  if (!form.day || !form.time_slot || !form.topic.trim()) {
    setError('Please fill in all fields');
    return;
  }
  setLoading(true);
  setError('');
  try {
    const payload = {
      mentor_id: String(mentor.mongo_id || mentor.email || ''),
      mentor_name: String(mentor.name || ''),
      student_id: String(studentId || ''),
      student_name: String(studentName || ''),
      day: String(form.day),
      time_slot: String(form.time_slot),
      topic: String(form.topic.trim()),
    };
    await mentorApi.requestSession(payload);
    onSuccess();
  } catch (err) {
    const detail = err?.response?.data?.detail;
    if (Array.isArray(detail)) {
      // Pydantic validation error — extract readable message
      setError(detail.map(d => d.msg).join(', '));
    } else if (typeof detail === 'string') {
      setError(detail);
    } else {
      setError('Failed to send request. Please try again.');
    }
  } finally {
    setLoading(false);
  }
}

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
        className="relative w-full max-w-md rounded-3xl border border-border/60 bg-card/98 backdrop-blur-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Top gradient */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.8), transparent 70%)' }}
        />

        <div className="p-6">
          {/* Header with mentor info */}
          <div className="relative flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <MentorAvatar mentor={mentor} size="sm" />
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-medium text-muted-foreground">Request a Session</span>
                </div>
                <h3 className="font-display text-lg font-bold">Book with {mentor.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {mentor.current_role} · {mentor.current_company}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-border hover:bg-secondary transition-colors text-muted-foreground flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Day selector */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Select Day</label>
              {availability.length === 0 ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/40 border border-border/30">
                  <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">No availability set yet. Try another mentor.</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {availability.map(a => (
                    <button
                      key={a.day}
                      onClick={() => setForm(f => ({ ...f, day: a.day, time_slot: '' }))}
                      className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all ${
                        form.day === a.day
                          ? 'border-primary bg-primary/15 text-primary shadow-sm shadow-primary/20'
                          : 'border-border/60 bg-secondary/30 text-muted-foreground hover:border-border hover:text-foreground'
                      }`}
                    >
                      {a.day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Time slots */}
            <AnimatePresence>
              {form.day && selectedDayData && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <label className="text-sm font-medium text-foreground mb-2 block">Select Time</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedDayData.slots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setForm(f => ({ ...f, time_slot: slot }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          form.time_slot === slot
                            ? 'border-primary bg-primary/15 text-primary'
                            : 'border-border/60 bg-secondary/30 text-muted-foreground hover:border-border'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Topic */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                What do you want to discuss?
              </label>
              <textarea
                value={form.topic}
                onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                placeholder="e.g. Resume review, career advice, React guidance, system design..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border/60 bg-secondary/30 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 resize-none transition-colors"
              />
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={loading || availability.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/25"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                : <><Send className="w-4 h-4" /> Send Request</>
              }
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Mentor Card ───────────────────────────────────────
function MentorCard({ mentor, index, onRequestSession }) {
  const [expanded, setExpanded] = useState(false);

  const availableDays = (mentor.availability || []).map(a => a.day.slice(0, 3));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-all overflow-hidden"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(59,130,246,0.08), transparent 65%)' }}
      />

      {/* Card body */}
      <div className="relative p-5">

        {/* ── Top row: Avatar + Info + Score ── */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <MentorAvatar mentor={mentor} size="lg" />
            {/* Online dot */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-card shadow-sm" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-bold text-foreground truncate leading-tight">
              {mentor.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Briefcase className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <p className="text-sm text-primary font-medium truncate">{mentor.current_role}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <p className="text-xs text-muted-foreground truncate">{mentor.current_company}</p>
            </div>
            {/* Social links */}
            <div className="mt-2">
              <SocialLinks mentor={mentor} />
            </div>
          </div>

          <ScoreRing score={mentor.match_score} />
        </div>

        {/* ── Domain + Experience + Availability ── */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-medium">
            {mentor.domain}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Award className="w-3.5 h-3.5" />
            {mentor.years_experience}y exp
          </div>
          {availableDays.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {availableDays.join(', ')}
            </div>
          )}
        </div>

        {/* ── AI Match Reason ── */}
        {mentor.why_match && (
          <div className="mb-4 p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/15">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-semibold text-blue-400">Why this match</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {mentor.why_match}
            </p>
          </div>
        )}

        {/* ── Skills ── */}
        {mentor.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {mentor.skills.slice(0, 6).map(skill => (
              <span
                key={skill}
                className="text-xs px-2 py-0.5 rounded-lg bg-secondary/60 border border-border/40 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                {skill}
              </span>
            ))}
            {mentor.skills.length > 6 && (
              <span className="text-xs px-2 py-0.5 rounded-lg bg-secondary/40 border border-border/30 text-muted-foreground">
                +{mentor.skills.length - 6} more
              </span>
            )}
          </div>
        )}

        {/* ── Expertise expand ── */}
        {mentor.expertise?.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <BookOpen className="w-3.5 h-3.5" />
            {expanded ? 'Hide expertise' : `${mentor.expertise.length} expertise areas`}
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
        )}

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-3"
            >
              <div className="flex flex-wrap gap-1.5 pt-1">
                {mentor.expertise.map(e => (
                  <span
                    key={e}
                    className="text-xs px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 font-medium"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bio snippet ── */}
        {mentor.bio && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4 italic border-l-2 border-border/40 pl-3">
            "{mentor.bio}"
          </p>
        )}

        {/* ── Request button ── */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onRequestSession(mentor)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
        >
          <Send className="w-4 h-4" />
          Request Session
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────
export default function MentorsPage() {
  const { getUserId, getName } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [cachedAt, setCachedAt] = useState(null);

  const userId = getUserId();
  const studentName = getName();

  useEffect(() => {
    if (userId) loadCached();
  }, [userId]);

  async function loadCached() {
    setLoading(true);
    setError('');
    try {
      const res = await mentorsApi.cached(userId);
      setMentors(res.data?.mentors || []);
      setCachedAt(res.data?.cached_at);
    } catch (err) {
      if (err?.response?.status === 404) {
        setMentors([]);
      } else {
        setError('Failed to load mentors. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function runMatch() {
    setRefreshing(true);
    setError('');
    try {
      const res = await mentorsApi.match(userId);
      setMentors(res.data?.mentors || []);
      setCachedAt(new Date().toISOString());
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        'Matching failed. Make sure your resume is uploaded first.'
      );
    } finally {
      setRefreshing(false);
    }
  }

  function handleSuccess() {
    const name = selectedMentor?.name;
    setSelectedMentor(null);
    setSuccessMsg(`Session request sent to ${name}! They'll respond soon.`);
    setTimeout(() => setSuccessMsg(''), 5000);
  }

  const isFirstTime = !loading && !error && mentors.length === 0;

  return (
    <>
      <PageBackground />

      <div className="relative max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-muted-foreground font-medium">AI-Matched Mentors</span>
            </div>
            <h2 className="font-display text-3xl font-bold">Your Mentor Matches</h2>
            <p className="text-muted-foreground mt-1">
              Matched using your resume skills and career goals via vector search + GPT-4o
            </p>
            {cachedAt && (
              <p className="text-xs text-muted-foreground mt-1 opacity-60">
                Last matched: {new Date(cachedAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {mentors.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runMatch}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card/40 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Matching...' : 'Refresh'}
            </motion.button>
          )}
        </motion.div>

        {/* Success toast */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{successMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Refreshing banner */}
        <AnimatePresence>
          {refreshing && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-primary/5 border border-primary/20"
            >
              <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-primary">Running mentor matching agent...</p>
                <p className="text-xs text-muted-foreground mt-0.5">Qdrant vector search + GPT-4o · takes ~15s</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Could not load mentors</p>
              <p className="text-xs mt-0.5 opacity-80">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* First time — no cache */}
        {isFirstTime && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 shadow-lg shadow-blue-500/10"
            >
              <Users className="w-9 h-9 text-blue-400" />
            </motion.div>
            <h3 className="font-display text-xl font-bold mb-2">No mentor matches yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-6">
              Run the AI matching agent to find mentors aligned with your skills and career goals.
              Results are saved — revisiting this page is instant after the first run.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runMatch}
              disabled={refreshing}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 hover:opacity-90 transition-all disabled:opacity-50"
            >
              {refreshing
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Matching...</>
                : <><Zap className="w-4 h-4" /> Find My Mentors</>
              }
            </motion.button>
          </motion.div>
        )}

        {/* Results */}
        {!loading && !error && mentors.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/8 border border-blue-500/20">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-blue-400 font-medium">
                  {mentors.length} mentors matched · Click Refresh to re-run
                </span>
              </div>
              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400" />
                  Avg {Math.round(mentors.reduce((a, m) => a + (m.match_score || 0), 0) / mentors.length)}% match
                </span>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {mentors.map((mentor, i) => (
                <MentorCard
                  key={mentor.email || i}
                  mentor={mentor}
                  index={i}
                  onRequestSession={setSelectedMentor}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Session Request Modal */}
      <AnimatePresence>
        {selectedMentor && (
          <SessionRequestModal
            mentor={selectedMentor}
            studentId={userId}
            studentName={studentName}
            onClose={() => setSelectedMentor(null)}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>
    </>
  );
}