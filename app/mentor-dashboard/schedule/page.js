'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, CheckCircle2, Plus,
  Loader2, Save, AlertCircle, RefreshCw,
  Sparkles, Info
} from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { mentorApi } from '@/lib/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

const DAY_COLORS = {
  Monday:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    text: 'text-blue-400',    active: 'border-blue-500/60 bg-blue-500/15 text-blue-400' },
  Tuesday:   { bg: 'bg-violet-500/10',  border: 'border-violet-500/20',  text: 'text-violet-400',  active: 'border-violet-500/60 bg-violet-500/15 text-violet-400' },
  Wednesday: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', active: 'border-emerald-500/60 bg-emerald-500/15 text-emerald-400' },
  Thursday:  { bg: 'bg-orange-500/10',  border: 'border-orange-500/20',  text: 'text-orange-400',  active: 'border-orange-500/60 bg-orange-500/15 text-orange-400' },
  Friday:    { bg: 'bg-pink-500/10',    border: 'border-pink-500/20',    text: 'text-pink-400',    active: 'border-pink-500/60 bg-pink-500/15 text-pink-400' },
  Saturday:  { bg: 'bg-teal-500/10',    border: 'border-teal-500/20',    text: 'text-teal-400',    active: 'border-teal-500/60 bg-teal-500/15 text-teal-400' },
  Sunday:    { bg: 'bg-red-500/10',     border: 'border-red-500/20',     text: 'text-red-400',     active: 'border-red-500/60 bg-red-500/15 text-red-400' },
};

function DayCard({ day, availability, onToggleDay, onToggleSlot }) {
  const colors = DAY_COLORS[day];
  const dayData = availability.find(a => a.day === day);
  const isActive = !!dayData;
  const selectedSlots = dayData?.slots || [];

  return (
    <motion.div
      layout
      className={`rounded-2xl border transition-all overflow-hidden ${
        isActive
          ? `${colors.bg} ${colors.border}`
          : 'border-border/40 bg-card/40'
      }`}
    >
      {/* Day header */}
      <button
        onClick={() => onToggleDay(day)}
        className="w-full flex items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            isActive ? `${colors.bg} ${colors.border} border` : 'bg-secondary/40 border border-border/40'
          }`}>
            <Calendar className={`w-4 h-4 ${isActive ? colors.text : 'text-muted-foreground'}`} />
          </div>
          <div className="text-left">
            <p className={`text-sm font-semibold transition-colors ${isActive ? colors.text : 'text-muted-foreground'}`}>
              {day}
            </p>
            {isActive && selectedSlots.length > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>
        </div>

        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          isActive
            ? `${colors.border} ${colors.bg}`
            : 'border-border'
        }`}>
          {isActive && <CheckCircle2 className={`w-3.5 h-3.5 ${colors.text}`} />}
        </div>
      </button>

      {/* Time slots */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <div className="h-px bg-border/40 mb-4" />
              <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Select available time slots
              </p>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map(slot => {
                  const selected = selectedSlots.includes(slot);
                  return (
                    <motion.button
                      key={slot}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onToggleSlot(day, slot)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selected
                          ? colors.active
                          : 'border-border/50 bg-secondary/40 text-muted-foreground hover:border-border'
                      }`}
                    >
                      {slot}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SchedulePage() {
  const { getUserId } = useAuth();
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [profile, setProfile] = useState(null);

  const userId = getUserId();

  useEffect(() => {
    if (userId) loadProfile();
  }, [userId]);

  async function loadProfile() {
    setLoading(true);
    setError('');
    try {
      const res = await mentorApi.getProfile(userId);
      setProfile(res.data);
      setAvailability(res.data?.availability || []);
    } catch {
      setError('Failed to load schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function toggleDay(day) {
    const exists = availability.find(a => a.day === day);
    if (exists) {
      setAvailability(availability.filter(a => a.day !== day));
    } else {
      setAvailability([...availability, { day, slots: [] }]);
    }
  }

  function toggleSlot(day, slot) {
    setAvailability(prev => prev.map(a => {
      if (a.day !== day) return a;
      const hasSlot = a.slots.includes(slot);
      return {
        ...a,
        slots: hasSlot
          ? a.slots.filter(s => s !== slot)
          : [...a.slots, slot].sort()
      };
    }));
  }

  async function handleSave() {
    if (!userId || !profile) return;
    setSaving(true);
    setError('');
    setSuccessMsg('');
    try {
      await mentorApi.setupProfile(userId, {
        ...profile,
        availability,
      });
      setSuccessMsg('Schedule saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch {
      setError('Failed to save schedule. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const totalSlots = availability.reduce((sum, a) => sum + a.slots.length, 0);
  const activeDays = availability.filter(a => a.slots.length > 0).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your schedule...</p>
        </div>
      </div>
    );
  }

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
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-muted-foreground font-medium">Availability</span>
          </div>
          <h2 className="font-display text-2xl font-bold">My Schedule</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Set your weekly availability so students can book sessions
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadProfile}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card/40 text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        {[
          { label: 'Active Days', value: activeDays, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Total Slots', value: totalSlots, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
          { label: 'Hrs / Week', value: totalSlots, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className={`flex flex-col items-center py-5 rounded-2xl border ${s.bg} ${s.border}`}
          >
            <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
            <span className="text-xs text-muted-foreground mt-1">{s.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Info tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-blue-500/8 border border-blue-500/20"
      >
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-400/80 leading-relaxed">
          Toggle a day to enable it, then select your available time slots.
          Students will see these slots when requesting a session with you.
          Remember to save after making changes.
        </p>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{successMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Day cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        {DAYS.map(day => (
          <DayCard
            key={day}
            day={day}
            availability={availability}
            onToggleDay={toggleDay}
            onToggleSlot={toggleSlot}
          />
        ))}
      </motion.div>

      {/* Save button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="sticky bottom-4"
      >
        <div className="flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {totalSlots === 0
                ? 'No slots selected yet'
                : `${totalSlots} slot${totalSlots > 1 ? 's' : ''} across ${activeDays} day${activeDays > 1 ? 's' : ''}`
              }
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={saving || totalSlots === 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-40 shadow-lg shadow-primary/25"
          >
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              : <><Save className="w-4 h-4" /> Save Schedule</>
            }
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}