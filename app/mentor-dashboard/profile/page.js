'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircle, Briefcase, Star, BookOpen,
  Loader2, Save, AlertCircle, CheckCircle2,
  Sparkles, Building, Clock, X
} from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { mentorApi } from '@/lib/api';

const DOMAINS = [
  'Software Engineering', 'Data Science', 'Machine Learning', 'Web Development',
  'Mobile Development', 'DevOps', 'Cybersecurity', 'Product Management',
  'UI/UX Design', 'Cloud Computing', 'Blockchain', 'Game Development'
];

function TagInput({ label, placeholder, values, onChange }) {
  const [input, setInput] = useState('');

  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput('');
  };

  const remove = (val) => onChange(values.filter(v => v !== val));

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-border/60 bg-secondary/30 min-h-[52px]">
        {values.map(v => (
          <span
            key={v}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium"
          >
            {v}
            <button onClick={() => remove(v)}>
              <X className="w-3 h-3 hover:text-red-400 transition-colors" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={values.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <p className="text-xs text-muted-foreground">Press Enter to add</p>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-display text-lg font-bold">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

export default function EditProfilePage() {
  const { getUserId, getName } = useAuth();
  const [form, setForm] = useState({
    name: '',
    domain: '',
    current_role: '',
    current_company: '',
    years_experience: '',
    bio: '',
    skills: [],
    expertise: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const userId = getUserId();
  const name = getName();

  useEffect(() => {
    if (userId) loadProfile();
  }, [userId]);

  async function loadProfile() {
    setLoading(true);
    try {
      const res = await mentorApi.getProfile(userId);
      const p = res.data;
      setForm({
        name: p.name || name || '',
        domain: p.domain || '',
        current_role: p.current_role || '',
        current_company: p.current_company || '',
        years_experience: String(p.years_experience || ''),
        bio: p.bio || '',
        skills: p.skills || [],
        expertise: p.expertise || [],
      });
    } catch {
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  async function handleSave() {
    if (!form.domain || !form.current_role || !form.current_company || !form.bio) {
      setError('Please fill in all required fields.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccessMsg('');
    try {
      await mentorApi.setupProfile(userId, {
        ...form,
        years_experience: parseInt(form.years_experience) || 0,
        is_active: true,
      });
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch {
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your profile...</p>
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
      >
        <div className="flex items-center gap-2 mb-1">
          <UserCircle className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground font-medium">Mentor Profile</span>
        </div>
        <h2 className="font-display text-2xl font-bold">Edit Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Keep your profile updated so students get accurate matches
        </p>
      </motion.div>

      {/* Profile preview card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(59,130,246,0.2), transparent)' }}
        />
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/25 flex-shrink-0">
            {(form.name || name)?.[0]?.toUpperCase() || 'M'}
          </div>
          <div>
            <h3 className="font-display text-xl font-bold">{form.name || name}</h3>
            <p className="text-sm text-primary font-medium mt-0.5">
              {form.current_role || 'Your Role'} · {form.current_company || 'Your Company'}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              {form.domain && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">
                  {form.domain}
                </span>
              )}
              {form.years_experience && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {form.years_experience} yrs
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Alerts */}
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

      {/* Basic Info */}
      <Section title="Basic Information" icon={Briefcase}>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Domain <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DOMAINS.map(d => (
                <button
                  key={d}
                  onClick={() => update('domain', d)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all text-left ${
                    form.domain === d
                      ? 'border-primary/60 bg-primary/10 text-primary'
                      : 'border-border/60 bg-secondary/30 text-muted-foreground hover:border-border hover:text-foreground'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Current Role <span className="text-red-400">*</span>
              </label>
              <input
                value={form.current_role}
                onChange={e => update('current_role', e.target.value)}
                placeholder="e.g. Senior Engineer"
                className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-secondary/30 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Company <span className="text-red-400">*</span>
              </label>
              <input
                value={form.current_company}
                onChange={e => update('current_company', e.target.value)}
                placeholder="e.g. Google"
                className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-secondary/30 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Years of Experience
            </label>
            <div className="flex gap-2 flex-wrap">
              {['1', '2', '3', '5', '7', '10', '15', '15+'].map(y => (
                <button
                  key={y}
                  onClick={() => update('years_experience', y)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    form.years_experience === y
                      ? 'border-primary/60 bg-primary/10 text-primary'
                      : 'border-border/60 bg-secondary/30 text-muted-foreground hover:border-border'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Bio */}
      <Section title="About You" icon={UserCircle}>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Bio <span className="text-red-400">*</span>
            <span className="text-muted-foreground font-normal ml-1">(min 50 chars)</span>
          </label>
          <textarea
            value={form.bio}
            onChange={e => update('bio', e.target.value)}
            placeholder="Tell students about your background, what you're passionate about, and how you can help them grow..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-border/60 bg-secondary/30 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 resize-none transition-colors"
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-muted-foreground">Be genuine — students read this before requesting sessions</p>
            <p className={`text-xs ${form.bio.length >= 50 ? 'text-emerald-400' : 'text-muted-foreground'}`}>
              {form.bio.length}/50 min
            </p>
          </div>
        </div>
      </Section>

      {/* Skills */}
      <Section title="Skills & Expertise" icon={Star}>
        <div className="space-y-5">
          <TagInput
            label="Skills"
            placeholder="Type a skill and press Enter..."
            values={form.skills}
            onChange={v => update('skills', v)}
          />
          <TagInput
            label="Expertise Areas"
            placeholder="e.g. System Design, React, ML Pipelines..."
            values={form.expertise}
            onChange={v => update('expertise', v)}
          />
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/15">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-xs font-semibold text-primary">Matching Tip</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              More specific skills and expertise = better student matches.
              Add tools, frameworks, and concepts you can teach — not just broad categories.
            </p>
          </div>
        </div>
      </Section>

      {/* Save */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="sticky bottom-4"
      >
        <div className="flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-xl">
          <p className="text-sm text-muted-foreground">
            Changes are saved to your public profile and re-embedded in Qdrant
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/25"
          >
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              : <><Save className="w-4 h-4" /> Save Profile</>
            }
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}