'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircle, Briefcase, Star, BookOpen,
  Loader2, Save, AlertCircle, CheckCircle2,
  Sparkles, Clock, X, Camera, User,
  Github, Linkedin, Twitter, Globe, Plus
} from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { mentorApi } from '@/lib/api';

const DOMAINS = [
  'Software Engineering', 'Data Science', 'Machine Learning', 'Web Development',
  'Mobile Development', 'DevOps', 'Cybersecurity', 'Product Management',
  'UI/UX Design', 'Cloud Computing', 'Blockchain', 'Game Development'
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00'
];

// ── Photo Upload ──────────────────────────────────────
function PhotoUpload({ currentPhoto, onUpload, uploading }) {
  const [preview, setPreview] = useState(currentPhoto || null);
  const inputRef = useRef();

  useEffect(() => {
    if (currentPhoto) setPreview(currentPhoto);
  }, [currentPhoto]);

  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(file);
    onUpload(file);
  }

  return (
    <div className="flex items-center gap-6">
      {/* Circle preview */}
      <div className="relative flex-shrink-0">
        <div
          className="w-24 h-24 rounded-full overflow-hidden border-4 border-border/60 bg-secondary/40 flex items-center justify-center cursor-pointer group shadow-xl"
          onClick={() => !uploading && inputRef.current?.click()}
        >
          {preview ? (
            <img src={preview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-10 h-10 text-muted-foreground" />
          )}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
            {uploading
              ? <Loader2 className="w-6 h-6 text-white animate-spin" />
              : <Camera className="w-6 h-6 text-white" />
            }
          </div>
        </div>
        <button
          onClick={() => !uploading && inputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary border-2 border-card flex items-center justify-center shadow-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {uploading
            ? <Loader2 className="w-3 h-3 text-white animate-spin" />
            : <Camera className="w-3 h-3 text-white" />
          }
        </button>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground mb-1">Profile Photo</p>
        <p className="text-xs text-muted-foreground mb-3">
          JPG, PNG or WebP · Max 5MB<br />
          Shown to students on your mentor card
        </p>
        <button
          onClick={() => !uploading && inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/60 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-all disabled:opacity-50"
        >
          <Camera className="w-3.5 h-3.5" />
          {uploading ? 'Uploading...' : preview ? 'Change Photo' : 'Upload Photo'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={e => handleFile(e.target.files[0])}
      />
    </div>
  );
}

// ── Tag Input ─────────────────────────────────────────
function TagInput({ label, placeholder, values, onChange, color = 'primary' }) {
  const [input, setInput] = useState('');

  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput('');
  };

  const remove = (val) => onChange(values.filter(v => v !== val));

  const colorMap = {
    primary: 'bg-primary/10 border-primary/20 text-primary',
    violet: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-border/60 bg-secondary/30 min-h-[52px]">
        {values.map(v => (
          <span
            key={v}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${colorMap[color]}`}
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

// ── Social Link Field ─────────────────────────────────
function SocialField({ icon: Icon, label, value, onChange, placeholder, color }) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-2 block">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/60 bg-secondary/30 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
        />
      </div>
    </div>
  );
}

// ── Availability Builder ──────────────────────────────
function AvailabilityBuilder({ availability, onChange }) {
  function toggleDay(day) {
    const exists = availability.find(a => a.day === day);
    if (exists) {
      onChange(availability.filter(a => a.day !== day));
    } else {
      onChange([...availability, { day, slots: [] }]);
    }
  }

  function toggleSlot(day, slot) {
    onChange(availability.map(a => {
      if (a.day !== day) return a;
      const slots = a.slots.includes(slot)
        ? a.slots.filter(s => s !== slot)
        : [...a.slots, slot].sort();
      return { ...a, slots };
    }));
  }

  return (
    <div className="space-y-4">
      {/* Day pills */}
      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">Available Days</label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map(day => {
            const active = availability.find(a => a.day === day);
            return (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  active
                    ? 'border-primary bg-primary/15 text-primary shadow-sm shadow-primary/10'
                    : 'border-border/60 bg-secondary/30 text-muted-foreground hover:border-border hover:text-foreground'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots per selected day */}
      {availability.map(({ day, slots }) => (
        <motion.div
          key={day}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border border-primary/20 bg-primary/5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <p className="text-xs font-semibold text-primary">{day}</p>
            <span className="text-xs text-muted-foreground">
              {slots.length > 0 ? `${slots.length} slot${slots.length > 1 ? 's' : ''} selected` : 'No slots selected'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TIME_SLOTS.map(slot => (
              <button
                key={slot}
                onClick={() => toggleSlot(day, slot)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  slots.includes(slot)
                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                    : 'border-border/40 bg-secondary/30 text-muted-foreground hover:border-border hover:text-foreground'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </motion.div>
      ))}

      {availability.length === 0 && (
        <p className="text-xs text-muted-foreground italic">
          Select days above to set your available time slots
        </p>
      )}
    </div>
  );
}

// ── Section Card ──────────────────────────────────────
function Section({ title, icon: Icon, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
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

// ── Main Page ─────────────────────────────────────────
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
    linkedin: '',
    twitter: '',
    github: '',
    website: '',
    photo: '',
    availability: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
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
        linkedin: p.linkedin || '',
        twitter: p.twitter || '',
        github: p.github || '',
        website: p.website || '',
        photo: p.photo || '',
        availability: p.availability || [],
      });
    } catch {
      // 404 = new mentor, start fresh — no error shown
    } finally {
      setLoading(false);
    }
  }

  async function handlePhotoUpload(file) {
    setUploadingPhoto(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await mentorApi.uploadPhoto(userId, formData);
      const url = res.data.photo_url;
      setForm(f => ({ ...f, photo: url }));
    } catch (err) {
      setError('Photo upload failed. Make sure Cloudinary is configured in .env');
    } finally {
      setUploadingPhoto(false);
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
      setSuccessMsg('Profile saved and re-embedded in Qdrant! Students can now find you.');
      setTimeout(() => setSuccessMsg(''), 4000);
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
    <div className="max-w-3xl mx-auto space-y-6 pb-16">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <UserCircle className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground font-medium">Mentor Profile</span>
        </div>
        <h2 className="font-display text-2xl font-bold">Edit Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Keep your profile updated so students get accurate matches
        </p>
      </motion.div>

      {/* Live preview card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(59,130,246,0.2), transparent)' }}
        />
        <div className="relative flex items-center gap-4">
          {/* Photo or initials */}
          {form.photo ? (
            <img src={form.photo} alt="Profile" className="w-16 h-16 rounded-2xl object-cover shadow-lg flex-shrink-0" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0">
              {(form.name || name)?.[0]?.toUpperCase() || 'M'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl font-bold truncate">{form.name || name}</h3>
            <p className="text-sm text-primary font-medium mt-0.5 truncate">
              {form.current_role || 'Your Role'} · {form.current_company || 'Your Company'}
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
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
            {/* Social links preview */}
            {(form.linkedin || form.twitter || form.github || form.website) && (
              <div className="flex items-center gap-2 mt-2">
                {form.linkedin && <Linkedin className="w-3.5 h-3.5 text-blue-400" />}
                {form.twitter && <Twitter className="w-3.5 h-3.5 text-sky-400" />}
                {form.github && <Github className="w-3.5 h-3.5 text-purple-400" />}
                {form.website && <Globe className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Alerts */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm flex-1">{error}</p>
            <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
          </motion.div>
        )}
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{successMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Photo Section ── */}
      <Section title="Profile Photo" icon={Camera} delay={0.07}>
        <PhotoUpload
          currentPhoto={form.photo}
          onUpload={handlePhotoUpload}
          uploading={uploadingPhoto}
        />
      </Section>

      {/* ── Basic Info ── */}
      <Section title="Basic Information" icon={Briefcase} delay={0.1}>
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

      {/* ── Social Links — NEW ── */}
      <Section title="Social Links" icon={Globe} delay={0.13}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SocialField
            icon={Linkedin} label="LinkedIn" color="text-blue-400"
            value={form.linkedin} onChange={v => update('linkedin', v)}
            placeholder="https://linkedin.com/in/yourname"
          />
          <SocialField
            icon={Github} label="GitHub" color="text-purple-400"
            value={form.github} onChange={v => update('github', v)}
            placeholder="https://github.com/yourname"
          />
          <SocialField
            icon={Twitter} label="Twitter / X" color="text-sky-400"
            value={form.twitter} onChange={v => update('twitter', v)}
            placeholder="https://twitter.com/yourname"
          />
          <SocialField
            icon={Globe} label="Website" color="text-emerald-400"
            value={form.website} onChange={v => update('website', v)}
            placeholder="https://yoursite.com"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Social links appear on your mentor card so students can learn more about you
        </p>
      </Section>

      {/* ── About You ── */}
      <Section title="About You" icon={UserCircle} delay={0.16}>
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

      {/* ── Skills ── */}
      <Section title="Skills & Expertise" icon={Star} delay={0.19}>
        <div className="space-y-5">
          <TagInput
            label="Skills"
            placeholder="Type a skill and press Enter..."
            values={form.skills}
            onChange={v => update('skills', v)}
            color="primary"
          />
          <TagInput
            label="Expertise Areas"
            placeholder="e.g. System Design, React, ML Pipelines..."
            values={form.expertise}
            onChange={v => update('expertise', v)}
            color="violet"
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

      {/* ── Availability — NEW ── */}
      <Section title="Availability" icon={Clock} delay={0.22}>
        <AvailabilityBuilder
          availability={form.availability}
          onChange={v => update('availability', v)}
        />
        <p className="text-xs text-muted-foreground mt-3">
          Students see your available days when booking a session
        </p>
      </Section>

      {/* ── Sticky Save Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="sticky bottom-4"
      >
        <div className="flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-card/90 backdrop-blur-xl shadow-xl">
          <p className="text-sm text-muted-foreground">
            Saved profiles are re-embedded in Qdrant for student matching
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