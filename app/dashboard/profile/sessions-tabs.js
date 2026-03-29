'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, MessageCircle, ExternalLink,
  CheckCircle2, XCircle, AlertCircle, Loader2,
  Send, ChevronRight, Video, Trash2, Filter
} from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { mentorApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    dot: 'bg-yellow-400',
  },
  accepted: {
    label: 'Confirmed',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  declined: {
    label: 'Declined',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    dot: 'bg-red-400',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-muted-foreground',
    bg: 'bg-secondary/40',
    border: 'border-border/40',
    dot: 'bg-muted-foreground',
  },
};

function SessionCard({ session, userId, onCancel, cancelling }) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const s = STATUS_CONFIG[session.status] || STATUS_CONFIG.pending;
  const canCancel = session.status === 'pending' || session.status === 'accepted';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative p-4 rounded-2xl border transition-all overflow-hidden ${
        session.status === 'accepted'
          ? 'border-emerald-500/20 bg-emerald-500/5'
          : session.status === 'cancelled' || session.status === 'declined'
          ? 'border-border/30 bg-secondary/20 opacity-60'
          : 'border-border/40 bg-card/40 hover:bg-card/70 hover:border-border/70'
      } backdrop-blur-sm`}
    >
      {/* Top accent */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${
        session.status === 'accepted' ? 'via-emerald-500/40'
        : session.status === 'pending' ? 'via-yellow-500/30'
        : 'via-border/20'
      } to-transparent`} />

      <div className="flex items-start gap-4">
        {/* Mentor avatar */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-md ${
          session.status === 'accepted'
            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20'
            : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/20'
        }`}>
          {session.mentor_name?.[0]?.toUpperCase() || 'M'}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <p className="font-bold text-foreground text-sm truncate">{session.mentor_name}</p>
            <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-semibold flex-shrink-0 ${s.color} ${s.bg} ${s.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </span>
          </div>

          {/* Schedule */}
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {session.day}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {session.time_slot}
            </div>
          </div>

          {/* Topic */}
          {session.topic && (
            <div className="flex items-start gap-1.5 mb-2 p-2 rounded-lg bg-secondary/30 border border-border/20">
              <MessageCircle className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground italic line-clamp-1">"{session.topic}"</p>
            </div>
          )}

          {/* Meeting link — show when confirmed */}
          {session.status === 'accepted' && session.meeting_link && (
            <motion.a
              href={session.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-1.5 mt-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all"
            >
              <Video className="w-3.5 h-3.5" />
              Join Meeting Room
              <ExternalLink className="w-3 h-3" />
            </motion.a>
          )}

          {/* Confirmed but no meeting link yet */}
          {session.status === 'accepted' && !session.meeting_link && (
            <p className="text-xs text-emerald-400/70 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Confirmed — mentor will add meeting link soon
            </p>
          )}

          {/* Cancel button */}
          {canCancel && !confirmCancel && (
            <button
              onClick={() => setConfirmCancel(true)}
              className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-red-400 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancel session
            </button>
          )}

          {/* Cancel confirmation */}
          <AnimatePresence>
            {confirmCancel && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-2 flex items-center gap-2"
              >
                <p className="text-xs text-red-400 font-medium">Cancel this session?</p>
                <button
                  onClick={() => {
                    onCancel(session.session_id);
                    setConfirmCancel(false);
                  }}
                  disabled={cancelling}
                  className="px-3 py-1 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/25 transition-all disabled:opacity-50"
                >
                  {cancelling ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Yes, cancel'}
                </button>
                <button
                  onClick={() => setConfirmCancel(false)}
                  className="px-3 py-1 rounded-lg border border-border/60 text-muted-foreground text-xs hover:text-foreground transition-colors"
                >
                  Keep it
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function SessionsTab({ userId }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (userId) loadSessions();
  }, [userId]);

  async function loadSessions() {
    setLoading(true);
    try {
      const res = await mentorApi.getMySessions(userId);
      setSessions(res.data?.sessions || []);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(sessionId) {
    setCancelling(true);
    setError('');
    try {
      await mentorApi.cancelSession(sessionId, userId);
      setSessions(prev => prev.map(s =>
        s.session_id === sessionId ? { ...s, status: 'cancelled' } : s
      ));
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to cancel session.');
    } finally {
      setCancelling(false);
    }
  }

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'accepted', label: 'Confirmed' },
    { key: 'declined', label: 'Declined' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const filtered = filter === 'all'
    ? sessions
    : sessions.filter(s => s.status === filter);

  const pending = sessions.filter(s => s.status === 'pending').length;
  const confirmed = sessions.filter(s => s.status === 'accepted').length;

  return (
    <div className="space-y-4">

      {/* Stats strip */}
      {sessions.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-bold text-foreground">{sessions.length} total sessions</span>
          </div>
          {pending > 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-semibold">
              {pending} pending
            </span>
          )}
          {confirmed > 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
              {confirmed} confirmed
            </span>
          )}
        </div>
      )}

      {/* Filter tabs */}
      {sessions.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                filter === f.key
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border/50 text-muted-foreground hover:text-foreground bg-secondary/30'
              }`}
            >
              {f.label}
              {f.key !== 'all' && (
                <span className="ml-1 opacity-70">
                  ({sessions.filter(s => s.status === f.key).length})
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 text-muted-foreground py-8">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading sessions...</span>
        </div>
      )}

      {/* Sessions list */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((session, i) => (
            <SessionCard
              key={session.session_id || session._id || i}
              session={session}
              userId={userId}
              onCancel={handleCancel}
              cancelling={cancelling}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && sessions.length === 0 && (
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
      )}

      {/* Filter empty state */}
      {!loading && filtered.length === 0 && sessions.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">
          No {filter} sessions found.
        </p>
      )}
    </div>
  );
}