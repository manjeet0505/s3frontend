'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  User, Briefcase, Star, BookOpen, Clock,
  Plus, X, ChevronRight, Loader2, CheckCircle2,
  Sparkles, AlertCircle
} from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { mentorApi } from '@/lib/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

const DOMAINS = [
  'Software Engineering', 'Data Science', 'Machine Learning', 'Web Development',
  'Mobile Development', 'DevOps', 'Cybersecurity', 'Product Management',
  'UI/UX Design', 'Cloud Computing', 'Blockchain', 'Game Development'
];

function PageBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          top: -100, right: -50,
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
          bottom: -80, left: -80,
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
    </div>
  );
}

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <motion.div
            animate={{
              width: i === current ? 24 : 8,
              backgroundColor: i <= current ? 'rgb(139,92,246)' : 'rgb(55,65,81)'
            }}
            className="h-2 rounded-full"
            transition={{ duration: 0.3 }}
          />
        </div>
      ))}
    </div>
  );
}

function TagInput({ label, placeholder, values, onChange, suggestions = [] }) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = suggestions.filter(s =>
    s.toLowerCase().includes(input.toLowerCase()) && !values.includes(s)
  );

  const add = (val) => {
    const v = val.trim();
    if (v && !values.includes(v)) {
      onChange([...values, v]);
    }
    setInput('');
    setShowSuggestions(false);
  };

  const remove = (val) => onChange(values.filter(v => v !== val));

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-border/60 bg-card/40 min-h-[48px]">
          {values.map(v => (
            <span key={v} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-400 text-xs font-medium">
              {v}
              <button onClick={() => remove(v)}><X className="w-3 h-3" /></button>
            </span>
          ))}
          <input
            value={input}
            onChange={e => { setInput(e.target.value); setShowSuggestions(true); }}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add(input))}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder={values.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <AnimatePresence>
          {showSuggestions && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border border-border/60 bg-card shadow-xl overflow-hidden"
            >
              {filtered.slice(0, 5).map(s => (
                <button
                  key={s}
                  onMouseDown={() => add(s)}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary/60 text-foreground transition-colors"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function MentorSetupPage() {
  const { getUserId, getName, isMentor, loading: authLoading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    domain: '',
    current_role: '',
    current_company: '',
    years_experience: '',
    bio: '',
    skills: [],
    expertise: [],
    availability: [],
  });

  const userId = getUserId();
  const name = getName();

  useEffect(() => {
    if (!authLoading && !isMentor()) {
      router.push('/dashboard');
    }
  }, [authLoading]);

  // Check if mentor profile already complete
  useEffect(() => {
    if (!userId) return;
    mentorApi.getProfile(userId)
      .then(() => router.push('/mentor-dashboard'))
      .catch(() => {}); // 404 = not set up yet, stay on page
  }, [userId]);

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const toggleSlot = (day, slot) => {
    const existing = form.availability.find(a => a.day === day);
    if (existing) {
      const newSlots = existing.slots.includes(slot)
        ? existing.slots.filter(s => s !== slot)
        : [...existing.slots, slot];
      if (newSlots.length === 0) {
        update('availability', form.availability.filter(a => a.day !== day));
      } else {
        update('availability', form.availability.map(a =>
          a.day === day ? { ...a, slots: newSlots } : a
        ));
      }
    } else {
      update('availability', [...form.availability, { day, slots: [slot] }]);
    }
  };

  const isSlotSelected = (day, slot) => {
    const a = form.availability.find(a => a.day === day);
    return a?.slots.includes(slot) || false;
  };

  const canProceed = () => {
    if (step === 0) return form.domain && form.current_role && form.current_company && form.years_experience;
    if (step === 1) return form.bio.length >= 50 && form.skills.length >= 3;
    if (step === 2) return form.expertise.length >= 1;
    if (step === 3) return form.availability.length >= 1;
    return true;
  };

  async function handleSubmit() {
    if (!userId) return;
    setSaving(true);
    setError('');
    try {
      await mentorApi.setupProfile(userId, {
        ...form,
        name,
        years_experience: parseInt(form.years_experience),
      });
      router.push('/mentor-dashboard');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const steps = [
    {
      title: 'Basic Info',
      icon: Briefcase,
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Domain / Field</label>
            <div className="grid grid-cols-2 gap-2">
              {DOMAINS.map(d => (
                <button
                  key={d}
                  onClick={() => update('domain', d)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all text-left ${
                    form.domain === d
                      ? 'border-violet-500/60 bg-violet-500/15 text-violet-400'
                      : 'border-border/60 bg-card/40 text-muted-foreground hover:border-border'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Current Role</label>
              <input
                value={form.current_role}
                onChange={e => update('current_role', e.target.value)}
                placeholder="e.g. Senior Engineer"
                className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-card/40 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-violet-500/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Company</label>
              <input
                value={form.current_company}
                onChange={e => update('current_company', e.target.value)}
                placeholder="e.g. Google"
                className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-card/40 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-violet-500/50"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Years of Experience</label>
            <div className="flex gap-2">
              {[1, 2, 3, 5, 7, 10, 15, '15+'].map(y => (
                <button
                  key={y}
                  onClick={() => update('years_experience', String(y))}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    form.years_experience === String(y)
                      ? 'border-violet-500/60 bg-violet-500/15 text-violet-400'
                      : 'border-border/60 bg-card/40 text-muted-foreground hover:border-border'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'About You',
      icon: User,
      content: (
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Bio <span className="text-muted-foreground font-normal">(min 50 chars)</span>
            </label>
            <textarea
              value={form.bio}
              onChange={e => update('bio', e.target.value)}
              placeholder="Tell students about your background, what you're passionate about, and how you can help them grow..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card/40 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-violet-500/50 resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">{form.bio.length} / 50 min chars</p>
          </div>
          <TagInput
            label="Your Skills"
            placeholder="Type a skill and press Enter..."
            values={form.skills}
            onChange={v => update('skills', v)}
          />
        </div>
      )
    },
    {
      title: 'Expertise',
      icon: Star,
      content: (
        <div className="space-y-5">
          <p className="text-sm text-muted-foreground">
            What specific areas can you mentor students in? Be specific — this helps us match you with the right students.
          </p>
          <TagInput
            label="Areas of Expertise"
            placeholder="e.g. System Design, React, ML Pipelines..."
            values={form.expertise}
            onChange={v => update('expertise', v)}
          />
          <div className="p-4 rounded-xl bg-violet-500/8 border border-violet-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <p className="text-sm font-medium text-violet-400">Tips for great expertise tags</p>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Be specific: "React Hooks" beats "Frontend"</li>
              <li>• Include tools: "Docker", "Kubernetes", "AWS"</li>
              <li>• Include concepts: "System Design", "DSA", "Clean Code"</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'Availability',
      icon: Clock,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select the days and time slots when you're available for mentoring sessions.
          </p>
          <div className="space-y-3">
            {DAYS.map(day => {
              const dayData = form.availability.find(a => a.day === day);
              const isExpanded = !!dayData;
              return (
                <div key={day} className="rounded-xl border border-border/50 bg-card/40 overflow-hidden">
                  <button
                    onClick={() => {
                      if (isExpanded) {
                        update('availability', form.availability.filter(a => a.day !== day));
                      } else {
                        update('availability', [...form.availability, { day, slots: [] }]);
                      }
                    }}
                    className="w-full flex items-center justify-between px-4 py-3"
                  >
                    <span className="text-sm font-medium text-foreground">{day}</span>
                    <div className="flex items-center gap-2">
                      {dayData?.slots.length > 0 && (
                        <span className="text-xs text-violet-400 font-medium">
                          {dayData.slots.length} slot{dayData.slots.length > 1 ? 's' : ''}
                        </span>
                      )}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isExpanded ? 'border-violet-500 bg-violet-500' : 'border-border'
                      }`}>
                        {isExpanded && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 flex flex-wrap gap-2">
                          {TIME_SLOTS.map(slot => (
                            <button
                              key={slot}
                              onClick={() => toggleSlot(day, slot)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                isSlotSelected(day, slot)
                                  ? 'border-violet-500/60 bg-violet-500/15 text-violet-400'
                                  : 'border-border/60 bg-secondary/40 text-muted-foreground hover:border-border'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )
    }
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageBackground />
      <div className="relative max-w-2xl mx-auto px-4 py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/25 mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">
            Welcome, {name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Set up your mentor profile so students can find and connect with you
          </p>
          <div className="flex justify-center mt-4">
            <StepIndicator current={step} total={steps.length} />
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="relative p-8 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center">
              {(() => { const Icon = steps[step].icon; return <Icon className="w-4 h-4 text-violet-400" />; })()}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Step {step + 1} of {steps.length}</p>
              <h2 className="font-display text-lg font-bold">{steps[step].title}</h2>
            </div>
          </div>

          {steps[step].content}

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="px-4 py-2.5 rounded-xl border border-border/60 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-all disabled:opacity-0"
            >
              Back
            </button>

            {step < steps.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-40 shadow-lg shadow-primary/20"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={!canProceed() || saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-40 shadow-lg shadow-violet-500/25"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Launch My Profile'}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}