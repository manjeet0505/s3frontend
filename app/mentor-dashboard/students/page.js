'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, CheckCircle2, Calendar, Clock,
  Loader2, Video, MessageSquare, Star,
  RefreshCw, AlertCircle, BookOpen, TrendingUp
} from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { mentorApi } from '@/lib/api';

function SkeletonCard() {
  return (
    <div className="p-6 rounded-2xl border border-border/50 bg-card/60 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-secondary/60" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-secondary/60 rounded w-32" />
          <div className="h-3 bg-secondary/60 rounded w-48" />
          <div className="h-3 bg-secondary/60 rounded w-24" />
        </div>
      </div>
      <div className="h-12 bg-secondary/60 rounded-xl" />
    </div>
  );
}

function StudentCard({ session, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group relative p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm hover:border-emerald-500/30 transition-all overflow-hidden"
    >
      {/* Top shimmer */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(16,185,129,0.06), transparent 70%)' }}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/25">
              {session.student_name?.[0]?.toUpperCase() || 'S'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-card" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-bold text-foreground">
              {session.student_name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>Session: {session.day} at {session.time_slot}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
                Active
              </span>
            </div>
          </div>

          {/* Session confirmed badge */}
          <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-semibold">Confirmed</span>
          </div>
        </div>

        {/* Topic */}
        {session.topic && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-secondary/40 border border-border/30 mb-4">
            <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-0.5">Session Topic</p>
              <p className="text-sm text-foreground leading-relaxed">{session.topic}</p>
            </div>
          </div>
        )}

        {/* Meeting link */}
        {session.meeting_link && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.open(session.meeting_link, '_blank')}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 text-sm font-semibold hover:bg-violet-500/20 transition-all mb-3"
          >
            <Video className="w-4 h-4" />
            Join Meeting Room
          </motion.button>
        )}

        {/* Expand for notes */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          {expanded ? 'Hide session notes' : 'Add session notes'}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3">
                <textarea
                  placeholder="Add private notes about this student's progress, goals, areas to focus on..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-secondary/30 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-violet-500/50 resize-none transition-colors"
                />
                <div className="flex justify-end mt-2">
                  <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity">
                    Save Notes
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function MyStudentsPage() {
  const { getUserId } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = getUserId();

  useEffect(() => {
    if (userId) loadStudents();
  }, [userId]);

  async function loadStudents() {
    setLoading(true);
    setError('');
    try {
      const res = await mentorApi.getIncomingSessions(userId);
      const all = res.data?.sessions || [];
      // Only show accepted sessions = active students
      setStudents(all.filter(s => s.status === 'accepted'));
    } catch {
      setError('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-muted-foreground font-medium">Active Students</span>
          </div>
          <h2 className="font-display text-2xl font-bold">My Students</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Students with confirmed sessions you are currently mentoring
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadStudents}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card/40 text-sm font-medium text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </motion.button>
      </motion.div>

      {/* Stats */}
      {!loading && students.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4"
        >
          {[
            { icon: Users, label: 'Active Students', value: students.length, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
            { icon: Calendar, label: 'Sessions This Week', value: students.length, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
            { icon: TrendingUp, label: 'Completion Rate', value: '100%', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className={`flex flex-col items-center py-5 rounded-2xl border ${s.bg} ${s.border}`}
            >
              <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
              <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
              <span className="text-xs text-muted-foreground mt-1">{s.label}</span>
            </motion.div>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Student cards */}
      {!loading && students.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {students.map((session, i) => (
            <StudentCard
              key={session.session_id || i}
              session={session}
              index={i}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && students.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-5">
            <Users className="w-9 h-9 text-emerald-400" />
          </div>
          <h3 className="font-display text-xl font-bold mb-2">No active students yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Accept session requests from the Requests page and your students will appear here.
          </p>
        </motion.div>
      )}
    </div>
  );
}