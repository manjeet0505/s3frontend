'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Sparkles, Briefcase, MapPin,
  Clock, ChevronRight, Loader2, RefreshCw,
  Send, X, Calendar, BookOpen, AlertCircle,
  CheckCircle2, Zap
} from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { mentorsApi } from '@/lib/api';

function SkeletonCard() {
  return (
    <div className="p-6 rounded-2xl border border-border/50 bg-card/60 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-secondary/60" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-secondary/60 rounded w-32" />
          <div className="h-3 bg-secondary/60 rounded w-24" />
          <div className="h-3 bg-secondary/60 rounded w-20" />
        </div>
        <div className="w-16 h-8 bg-secondary/60 rounded-full" />
      </div>
      <div className="h-16 bg-secondary/60 rounded-xl mb-4" />
      <div className="flex gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-6 w-16 bg-secondary/60 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

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
      const res = await fetch('/api/mentor-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentor_id: mentor.mongo_id || mentor.email,
          mentor_name: mentor.name,
          student_id: studentId,
          student_name: studentName,
          day: form.day,
          time_slot: form.time_slot,
          topic: form.topic,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to send request');
      }
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to send request. Try again.');
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
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
        className="relative w-full max-w-md rounded-3xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl p-6 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.6), transparent 70%)' }}
        />
        <div className="relative flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-medium text-muted-foreground">Request a Session</span>
            </div>
            <h3 className="font-display text-xl font-bold">Book with {mentor.name}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {mentor.current_role} · {mentor.current_company}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-border hover:bg-secondary transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Select Day</label>
            {availability.length === 0 ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/40 border border-border/30">
                <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <p className="text-sm text-muted-foreground">No availability set yet. Try another mentor.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availability.map(a => (
                  <button
                    key={a.day}
                    onClick={() => setForm(f => ({ ...f, day: a.day, time_slot: '' }))}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                      form.day === a.day
                        ? 'border-primary bg-primary/15 text-primary'
                        : 'border-border/60 bg-secondary/30 text-muted-foreground hover:border-border'
                    }`}
                  >
                    {a.day.slice(0, 3)}
                  </button>
                ))}
              </div>
            )}
          </div>

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

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              What do you want to discuss?
            </label>
            <textarea
              value={form.topic}
              onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
              placeholder="e.g. Resume review, career advice, guidance on React or system design..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border/60 bg-secondary/30 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 resize-none transition-colors"
            />
          </div>

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
      </motion.div>
    </motion.div>
  );
}

function MentorCard({ mentor, index, onRequestSession }) {
  const [expanded, setExpanded] = useState(false);

  const scoreColor =
    mentor.match_score >= 85
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      : mentor.match_score >= 70
      ? 'text-blue-400 bg-blue-500/10 border-blue-500/30'
      : 'text-orange-400 bg-orange-500/10 border-orange-500/30';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group relative p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-all overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(59,130,246,0.07), transparent 70%)' }}
      />

      <div className="relative">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/25">
              {mentor.name?.[0]?.toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-card" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-bold text-foreground truncate">{mentor.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Briefcase className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <p className="text-sm text-muted-foreground truncate">{mentor.current_role}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <p className="text-xs text-muted-foreground truncate">{mentor.current_company}</p>
            </div>
          </div>

          <div className={`flex-shrink-0 px-3 py-1.5 rounded-full border text-sm font-bold ${scoreColor}`}>
            {mentor.match_score}%
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-medium">
            {mentor.domain}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {mentor.years_experience} yrs experience
          </div>
        </div>

        {mentor.why_match && (
          <div className="mb-4 p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/15">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-semibold text-blue-400">Why this match</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{mentor.why_match}</p>
          </div>
        )}

        {mentor.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {mentor.skills.slice(0, 5).map(skill => (
              <span key={skill} className="text-xs px-2 py-0.5 rounded-lg bg-secondary/60 border border-border/40 text-muted-foreground">
                {skill}
              </span>
            ))}
            {mentor.skills.length > 5 && (
              <span className="text-xs px-2 py-0.5 rounded-lg bg-secondary/60 border border-border/40 text-muted-foreground">
                +{mentor.skills.length - 5} more
              </span>
            )}
          </div>
        )}

        {mentor.expertise?.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <BookOpen className="w-3.5 h-3.5" />
            {expanded ? 'Hide expertise' : `View ${mentor.expertise.length} expertise areas`}
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
        )}

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="flex flex-wrap gap-1.5">
                {mentor.expertise.map(e => (
                  <span key={e} className="text-xs px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 font-medium">
                    {e}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onRequestSession(mentor)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
        >
          <Send className="w-4 h-4" />
          Request Session
        </motion.button>
      </div>
    </motion.div>
  );
}

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

  // On mount — load CACHED results only (fast, no agent)
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
      const status = err?.response?.status;
      if (status === 404) {
        // No cache yet — show "Find Mentors" CTA, no error
        setMentors([]);
      } else {
        setError('Failed to load mentors. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  // On Refresh click — runs full agent, saves results, reloads
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
    <div className="max-w-5xl mx-auto space-y-6">

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
          <h2 className="font-display text-2xl font-bold">Your Mentor Matches</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Matched using your resume skills and career goals via vector search + GPT-4o
          </p>
          {cachedAt && (
            <p className="text-xs text-muted-foreground mt-1 opacity-60">
              Last matched: {new Date(cachedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Refresh only visible when matches exist */}
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
            className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-primary/8 border border-primary/20"
          >
            <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-primary">Running mentor matching agent...</p>
              <p className="text-xs text-muted-foreground mt-0.5">Qdrant vector search + GPT-4o — takes ~15 seconds</p>
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

      {/* First time — no cache yet */}
      {isFirstTime && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center mb-5">
            <Users className="w-9 h-9 text-blue-400" />
          </div>
          <h3 className="font-display text-xl font-bold mb-2">No mentor matches yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-6">
            Run the AI matching agent to find mentors aligned with your skills and career goals.
            This runs once and results are saved — revisiting this page is instant.
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/8 border border-blue-500/20 w-fit"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs text-blue-400 font-medium">
              {mentors.length} mentors matched · Click Refresh to re-run
            </span>
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
    </div>
  );
}