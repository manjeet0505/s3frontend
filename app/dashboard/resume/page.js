'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Upload, FileText, CheckCircle2, AlertCircle,
  Sparkles, User, Mail, Phone, MapPin, Briefcase,
  GraduationCap, Star, ArrowRight, Loader2, X,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { resumeApi } from '@/lib/api';

// ── Animated Background ──────────────────────────────
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
        animate={{ scale: [1, 1.1, 1], rotate: [0, 30, 0] }}
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

// ── Upload Zone ──────────────────────────────────────
function UploadZone({ onUpload, uploading }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') onUpload(file);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !uploading && inputRef.current?.click()}
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
        ${dragging
          ? 'border-primary bg-primary/10 scale-[1.01]'
          : 'border-border/60 hover:border-primary/50 hover:bg-primary/5 bg-card/40'
        } ${uploading ? 'pointer-events-none' : ''}`}
    >
      {/* Animated corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/40 rounded-tl-xl" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/40 rounded-tr-xl" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/40 rounded-bl-xl" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/40 rounded-br-xl" />

      <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative w-16 h-16">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/30"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-primary animate-spin" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg">Analyzing with AI...</p>
                <p className="text-sm text-muted-foreground mt-1">Extracting skills, experience & more</p>
              </div>
              <div className="flex gap-1 mt-2">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ y: dragging ? -8 : 0 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25"
              >
                <Upload className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <p className="font-semibold text-foreground text-lg">
                  {dragging ? 'Drop it here!' : 'Drop your resume here'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or <span className="text-primary font-medium">click to browse</span> · PDF only
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/60 border border-border/40">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs text-muted-foreground">AI-powered parsing in seconds</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={handleFile} />
    </motion.div>
  );
}

// ── Skill Badge ──────────────────────────────────────
function SkillBadge({ skill, delay = 0 }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', bounce: 0.35 }}
      whileHover={{ scale: 1.07 }}
      className="px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/50 text-xs font-medium text-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
    >
      {skill}
    </motion.span>
  );
}

// ── Info Row ─────────────────────────────────────────
function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

// ── Experience Card ──────────────────────────────────
function ExperienceCard({ job, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.08 }}
      className="relative flex gap-4 pb-6 last:pb-0"
    >
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-500/20 z-10">
          <Briefcase className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="w-px flex-1 bg-border/50 mt-2" />
      </div>
      <div className="flex-1 pt-1 pb-4">
        {/* FIX: added fallbacks for all possible field names your agent might return */}
        <p className="font-semibold text-foreground text-sm">
          {job.title || job.role || job.position || job.job_title || 'Role'}
        </p>
        <p className="text-xs text-primary font-medium mt-0.5">
          {job.company || job.company_name || job.organization || ''}
        </p>
        {(job.duration || job.period || job.dates || job.start_date) && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {job.duration || job.period || job.dates || `${job.start_date ?? ''} – ${job.end_date ?? 'Present'}`}
          </p>
        )}
        {(job.description || job.responsibilities || job.summary) && (
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">
            {job.description || job.responsibilities || job.summary}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ── Education Card ───────────────────────────────────
function EducationCard({ edu, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.08 }}
      className="relative flex gap-4 pb-6 last:pb-0"
    >
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20 z-10">
          <GraduationCap className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="w-px flex-1 bg-border/50 mt-2" />
      </div>
      <div className="flex-1 pt-1 pb-4">
        {/* FIX: added fallbacks for all possible field names */}
        <p className="font-semibold text-foreground text-sm">
          {edu.degree || edu.qualification || edu.course || edu.field_of_study || 'Degree'}
        </p>
        <p className="text-xs text-emerald-400 font-medium mt-0.5">
          {edu.institution || edu.school || edu.university || edu.college || ''}
        </p>
        {(edu.year || edu.graduation_year || edu.period || edu.duration) && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {edu.year || edu.graduation_year || edu.period || edu.duration}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────────────
export default function ResumePage() {
  const { getUserId } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // FIX: call getUserId() once at top level, not inside async functions
  const userId = getUserId();

  useEffect(() => {
    fetchProfile();
  }, [userId]); // FIX: depend on userId so it re-fetches if userId changes

  async function fetchProfile() {
    if (!userId) {
      setLoading(false); // FIX: stop loading spinner if no userId
      return;
    }
    setLoading(true);
    try {
      const res = await resumeApi.getProfile(userId);
      setProfile(res.data);
    } catch (err) {
      // 404 = no resume yet, that's fine — just show upload zone
      if (err?.response?.status !== 404) {
        setError('Failed to load profile. Please refresh.');
      }
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(file) {
    if (!userId) return;
    setUploading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      // FIX: pass userId as second arg (goes as query param ?user_id=)
      // NOT in formData — your FastAPI uses Query(...) not Form(...)
      await resumeApi.upload(formData, userId);
      setSuccess('Resume parsed successfully! Your profile is ready.');
      await fetchProfile();
    } catch (err) {
      setError(err?.response?.data?.detail || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  // FIX: your backend returns the profile directly (not nested under profile.profile)
  // GET /resume/profile/{user_id} returns the MongoDB doc directly
  // so we try both shapes to be safe
  const p = profile?.profile || profile || null;
  const hasProfile = !!(p && (p.name || p.skills || p.experience));

  const skills = p?.skills || [];
  const experience = p?.experience || p?.work_experience || [];
  const education = p?.education || [];

  return (
    <>
      <PageBackground />

      <div className="relative max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-muted-foreground font-medium">Resume</span>
            </div>
            <h2 className="font-display text-3xl font-bold">Your Resume</h2>
            <p className="text-muted-foreground mt-1">
              Upload your PDF and let AI extract your profile
            </p>
          </div>
          {hasProfile && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('reupload')?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-secondary/40 hover:bg-secondary/80 text-sm font-medium transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Re-upload
            </motion.button>
          )}
        </motion.div>

        {/* Status messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium"
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              {success}
              <button onClick={() => setSuccess('')} className="ml-auto">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
              <button onClick={() => setError('')} className="ml-auto">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Loading your profile...</p>
            </div>
          </div>
        ) : !hasProfile ? (
          /* ── No resume yet — show upload zone ── */
          <div className="max-w-2xl mx-auto">
            <UploadZone onUpload={handleUpload} uploading={uploading} />
            <p className="text-center text-xs text-muted-foreground mt-4">
              Your resume is processed securely. We extract skills, experience, and education.
            </p>
          </div>
        ) : (
          /* ── Profile view ── */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left column */}
            <div className="space-y-5">

              {/* Profile card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-40"
                  style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.12), transparent)' }}
                />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                <div className="relative flex flex-col items-center text-center mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 mb-3">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display text-lg font-bold">
                    {p.name || p.full_name || 'Your Name'}
                  </h3>
                  {(p.title || p.current_title || p.job_title) && (
                    <p className="text-sm text-primary font-medium mt-0.5">
                      {p.title || p.current_title || p.job_title}
                    </p>
                  )}
                  {(p.summary || p.bio || p.about) && (
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">
                      {p.summary || p.bio || p.about}
                    </p>
                  )}
                </div>

                <div className="relative space-y-0.5">
                  <InfoRow icon={Mail} label="Email" value={p.email} />
                  <InfoRow icon={Phone} label="Phone" value={p.phone || p.phone_number} />
                  <InfoRow icon={MapPin} label="Location" value={p.location || p.address || p.city} />
                </div>
              </motion.div>

              {/* Hidden re-upload input */}
              <input
                id="reupload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files[0]) handleUpload(e.target.files[0]);
                }}
              />

              {/* Update resume card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-5 rounded-2xl border border-dashed border-border/60 bg-card/40 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <RefreshCw className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Update Resume</p>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Upload a newer version to refresh your profile
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById('reupload')?.click()}
                  disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 transition-all disabled:opacity-50"
                >
                  {uploading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Upload className="w-4 h-4" />
                  }
                  {uploading ? 'Uploading...' : 'Choose PDF'}
                </motion.button>
              </motion.div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-2 space-y-5">

              {/* Skills */}
              {skills.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/15 flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold">Skills</h3>
                      <p className="text-xs text-muted-foreground">{skills.length} extracted by AI</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                      <SkillBadge key={`${skill}-${i}`} skill={skill} delay={0.02 * i} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Experience */}
              {experience.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold">Experience</h3>
                      <p className="text-xs text-muted-foreground">{experience.length} positions</p>
                    </div>
                  </div>
                  <div>
                    {experience.map((job, i) => (
                      <ExperienceCard key={i} job={job} index={i} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold">Education</h3>
                      <p className="text-xs text-muted-foreground">{education.length} entries</p>
                    </div>
                  </div>
                  <div>
                    {education.map((edu, i) => (
                      <EducationCard key={i} edu={edu} index={i} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Empty state */}
              {skills.length === 0 && experience.length === 0 && education.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <AlertCircle className="w-10 h-10 text-muted-foreground mb-3" />
                  <p className="font-medium text-foreground">Couldn't extract details</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try re-uploading a cleaner PDF version
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}