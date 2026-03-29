'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox, CheckCircle2, XCircle, Clock,
  Loader2, ChevronDown, ChevronUp,
  Video, Calendar, MessageSquare,
  AlertCircle, RefreshCw, User,
  Code, Target, GraduationCap,
  Star, Sparkles, ExternalLink
} from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { mentorApi } from '@/lib/api';

function SkeletonCard() {
  return (
    <div className="p-6 rounded-2xl border border-border/50 bg-card/60 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-secondary/60" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-secondary/60 rounded w-36" />
          <div className="h-3 bg-secondary/60 rounded w-24" />
        </div>
        <div className="w-20 h-7 bg-secondary/60 rounded-full" />
      </div>
      <div className="h-16 bg-secondary/60 rounded-xl" />
    </div>
  );
}

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    dot: 'bg-yellow-400',
  },
  accepted: {
    label: 'Accepted',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  declined: {
    label: 'Declined',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    dot: 'bg-red-400',
  },
};

// ── Student Profile Card (shown inside request) ───────
function StudentProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="mt-3 p-4 rounded-xl bg-secondary/30 border border-border/30 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2 pb-2 border-b border-border/30">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary">Student AI Profile</span>
          {profile.ai_profile_score > 0 && (
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold">
              Score: {profile.ai_profile_score}/100
            </span>
          )}
        </div>

        {/* Target role + experience */}
        <div className="grid grid-cols-2 gap-2">
          {profile.target_role && (
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">Target Role</p>
                <p className="text-xs font-semibold text-foreground">{profile.target_role}</p>
              </div>
            </div>
          )}
          {profile.experience_level && (
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">Level</p>
                <p className="text-xs font-semibold text-foreground">{profile.experience_level}</p>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        {profile.summary && (
          <div className="flex items-start gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 italic">
              "{profile.summary}"
            </p>
          </div>
        )}

        {/* Skills */}
        {profile.skills?.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                Skills ({profile.skills.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.slice(0, 10).map(skill => (
                <span
                  key={skill}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium"
                >
                  {skill}
                </span>
              ))}
              {profile.skills.length > 10 && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-secondary/60 text-muted-foreground">
                  +{profile.skills.length - 10} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Career goals */}
        {profile.career_goals && (
          <div className="flex items-start gap-2">
            <Star className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] text-muted-foreground mb-0.5">Career Goals</p>
              <p className="text-xs text-foreground leading-relaxed">{profile.career_goals}</p>
            </div>
          </div>
        )}

        {/* Education */}
        {profile.education && (
          <div className="flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground">Education</p>
              <p className="text-xs font-medium text-foreground">
                {profile.education.degree || profile.education.qualification || 'Degree'} —{' '}
                {profile.education.institution || profile.education.school || ''}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Request Card ──────────────────────────────────────
function RequestCard({ session, onAccept, onDecline, responding }) {
  const [expanded, setExpanded] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const status = statusConfig[session.status] || statusConfig.pending;
  const hasProfile = !!session.student_profile;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden"
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${
        session.status === 'accepted' ? 'via-emerald-500/50'
        : session.status === 'declined' ? 'via-red-500/50'
        : 'via-yellow-500/50'
      } to-transparent`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-4 mb-4">
          {/* Student avatar */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg shadow-violet-500/20">
            {session.student_name?.[0]?.toUpperCase() || 'S'}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground text-base">{session.student_name}</h3>
              {/* Profile badge */}
              {hasProfile && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold">
                  Profile attached
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                {session.day} at {session.time_slot}
              </div>
              {session.student_profile?.target_role && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Target className="w-3.5 h-3.5" />
                  {session.student_profile.target_role}
                </div>
              )}
            </div>
          </div>

          {/* Status badge */}
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold flex-shrink-0 ${status.color} ${status.bg} ${status.border}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        {/* Topic */}
        {session.topic && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-secondary/40 border border-border/30 mb-3">
            <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Topic</p>
              <p className="text-sm text-foreground leading-relaxed">{session.topic}</p>
            </div>
          </div>
        )}

        {/* Student profile toggle */}
        {hasProfile && (
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-1.5 text-xs text-primary hover:opacity-80 transition-opacity mb-2 font-medium"
          >
            <User className="w-3.5 h-3.5" />
            {showProfile ? 'Hide student profile' : 'View student profile'}
            {showProfile
              ? <ChevronUp className="w-3.5 h-3.5" />
              : <ChevronDown className="w-3.5 h-3.5" />
            }
          </button>
        )}

        <AnimatePresence>
          {showProfile && (
            <StudentProfileCard profile={session.student_profile} />
          )}
        </AnimatePresence>

        {/* Meeting link for accepted sessions */}
        {session.status === 'accepted' && session.meeting_link && (
          <a
            href={session.meeting_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors mb-3 font-medium mt-2"
          >
            <Video className="w-4 h-4" />
            Join Meeting Room
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Actions for pending sessions */}
        {session.status === 'pending' && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3 mt-2"
            >
              {expanded
                ? <><ChevronUp className="w-3.5 h-3.5" /> Hide actions</>
                : <><ChevronDown className="w-3.5 h-3.5" /> Respond to request</>
              }
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 pt-1">
                    {/* Meeting link input */}
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1.5 block">
                        Meeting Link
                        <span className="text-muted-foreground font-normal ml-1">
                          (Google Meet, Zoom, or any link)
                        </span>
                      </label>
                      <input
                        value={meetingLink}
                        onChange={e => setMeetingLink(e.target.value)}
                        placeholder="https://meet.google.com/... or Zoom link"
                        className="w-full px-3 py-2.5 rounded-xl border border-border/60 bg-secondary/40 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-violet-500/50 transition-colors"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1">
                        This link will be shared with the student when you accept.
                      </p>
                    </div>

                    {/* Accept / Decline buttons */}
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onAccept(session.session_id, meetingLink)}
                        disabled={responding}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                      >
                        {responding
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <CheckCircle2 className="w-4 h-4" />
                        }
                        Accept
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onDecline(session.session_id)}
                        disabled={responding}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-all disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Decline
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────
export default function RequestsPage() {
  const { getUserId } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responding, setResponding] = useState(false);
  const [filter, setFilter] = useState('all');

  const userId = getUserId();

  useEffect(() => {
    if (userId) loadSessions();
  }, [userId]);

  async function loadSessions() {
    setLoading(true);
    setError('');
    try {
      const res = await mentorApi.getIncomingSessions(userId);
      setSessions(res.data?.sessions || []);
    } catch {
      setError('Failed to load session requests.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept(sessionId, meetingLink) {
    setResponding(true);
    try {
      await mentorApi.respondToSession(sessionId, 'accepted', meetingLink || null);
      setSessions(prev => prev.map(s =>
        s.session_id === sessionId
          ? { ...s, status: 'accepted', meeting_link: meetingLink }
          : s
      ));
    } catch {
      setError('Failed to accept session. Try again.');
    } finally {
      setResponding(false);
    }
  }

  async function handleDecline(sessionId) {
    setResponding(true);
    try {
      await mentorApi.respondToSession(sessionId, 'declined');
      setSessions(prev => prev.map(s =>
        s.session_id === sessionId ? { ...s, status: 'declined' } : s
      ));
    } catch {
      setError('Failed to decline session. Try again.');
    } finally {
      setResponding(false);
    }
  }

  const filters = ['all', 'pending', 'accepted', 'declined'];
  const pending = sessions.filter(s => s.status === 'pending');
  const filtered = filter === 'all' ? sessions : sessions.filter(s => s.status === filter);

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Inbox className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-muted-foreground font-medium">Session Requests</span>
          </div>
          <h2 className="font-display text-2xl font-bold">Incoming Requests</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Review student profiles and respond to session requests
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadSessions}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card/40 text-sm font-medium text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </motion.button>
      </motion.div>

      {/* Stats row */}
      {!loading && sessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: 'Pending', value: sessions.filter(s => s.status === 'pending').length, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
            { label: 'Accepted', value: sessions.filter(s => s.status === 'accepted').length, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
            { label: 'Declined', value: sessions.filter(s => s.status === 'declined').length, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className={`flex flex-col items-center py-4 rounded-2xl border ${s.bg} ${s.border}`}
            >
              <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
              <span className="text-xs text-muted-foreground mt-1">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Filter tabs */}
      {!loading && sessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2"
        >
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                filter === f
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border/60 text-muted-foreground hover:text-foreground bg-card/40'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'pending' && pending.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-bold">
                  {pending.length}
                </span>
              )}
            </button>
          ))}
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Request cards */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((session, i) => (
            <RequestCard
              key={session.session_id || i}
              session={session}
              onAccept={handleAccept}
              onDecline={handleDecline}
              responding={responding}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-violet-500/10 flex items-center justify-center mb-5">
            <Inbox className="w-9 h-9 text-violet-400" />
          </div>
          <h3 className="font-display text-xl font-bold mb-2">No requests yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            When students discover your profile and request sessions, they'll appear here
            with their full AI profile attached.
          </p>
        </motion.div>
      )}
    </div>
  );
}