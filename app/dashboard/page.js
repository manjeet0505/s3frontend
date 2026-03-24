'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  FileText, Briefcase, Users, TrendingUp,
  ArrowRight, Upload, Zap, CheckCircle2,
  Sparkles, Star, Activity
} from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { resumeApi, progressApi } from '@/lib/api';

const quickActions = [
  {
    label: 'Upload Resume',
    desc: 'Parse your resume with AI',
    icon: Upload,
    href: '/dashboard/resume',
    gradient: 'from-blue-500 to-indigo-500',
    shadow: 'shadow-blue-500/25',
    glow: 'rgba(59,130,246,0.15)',
    border: 'hover:border-blue-500/40',
  },
  {
    label: 'Find Jobs',
    desc: 'Match with top opportunities',
    icon: Briefcase,
    href: '/dashboard/jobs',
    gradient: 'from-violet-500 to-purple-500',
    shadow: 'shadow-violet-500/25',
    glow: 'rgba(139,92,246,0.15)',
    border: 'hover:border-violet-500/40',
  },
  {
    label: 'Meet Mentors',
    desc: 'Connect with industry experts',
    icon: Users,
    href: '/dashboard/mentors',
    gradient: 'from-emerald-500 to-teal-500',
    shadow: 'shadow-emerald-500/25',
    glow: 'rgba(16,185,129,0.15)',
    border: 'hover:border-emerald-500/40',
  },
  {
    label: 'Skill Gap',
    desc: 'Know what to learn next',
    icon: TrendingUp,
    href: '/dashboard/skills',
    gradient: 'from-orange-500 to-amber-500',
    shadow: 'shadow-orange-500/25',
    glow: 'rgba(249,115,22,0.15)',
    border: 'hover:border-orange-500/40',
  },
];

// Animated floating orbs in background
function DashboardBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
          top: -100,
          right: -100,
        }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
          bottom: -100,
          left: -100,
        }}
        animate={{ scale: [1, 1.15, 1], rotate: [0, -30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)',
          top: '40%',
          left: '40%',
        }}
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      />
      {/* Subtle grid */}
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

// Animated stat card
function StatCard({ icon: Icon, label, value, sub, gradient, glow, delay, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="relative p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden cursor-pointer group"
    >
      {/* Animated glow on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 30% 30%, ${glow}, transparent 65%)` }}
      />

      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${gradient} opacity-60`} />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
          <motion.p
            className="font-display text-4xl font-bold text-foreground"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2, type: 'spring', bounce: 0.4 }}
          >
            {value}
          </motion.p>
          {sub && <p className="text-xs text-muted-foreground mt-2">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

// Animated step
function StepItem({ icon: Icon, label, done, active, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
        done ? 'opacity-60' : active
          ? 'bg-primary/10 border border-primary/25 shadow-sm shadow-primary/10'
          : 'opacity-40'
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
        done ? 'bg-emerald-500/20' : active ? 'bg-primary/20' : 'bg-secondary'
      }`}>
        {done
          ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          : <Icon className={`w-4 h-4 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
        }
      </div>
      <span className={`text-sm font-medium flex-1 ${
        done ? 'line-through text-muted-foreground' : active ? 'text-foreground' : 'text-muted-foreground'
      }`}>
        {label}
      </span>
      {active && !done && (
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium"
        >
          Next
        </motion.span>
      )}
      {done && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
    </motion.div>
  );
}

// Animated skill badge
function SkillBadge({ skill, delay }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', bounce: 0.3 }}
      whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
      className="px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/50 text-xs font-medium text-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
    >
      {skill}
    </motion.span>
  );
}

export default function DashboardPage() {
  const { getUserId, getName } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState('');

  // Greeting based on time
  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setTime('Good morning');
    else if (h < 17) setTime('Good afternoon');
    else setTime('Good evening');
  }, []);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;
    async function fetchData() {
      try {
        const [profileRes, progressRes] = await Promise.allSettled([
          resumeApi.getProfile(userId),
          progressApi.get(userId),
        ]);
        if (profileRes.status === 'fulfilled') setProfile(profileRes.value.data);
        if (progressRes.status === 'fulfilled') setProgress(progressRes.value.data);
      } catch (_) {}
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  const hasResume = !!profile?.profile;
  const skills = profile?.profile?.skills || [];
  const completionPct = progress?.summary?.completion_percent || 0;
  const totalSkillGaps = progress?.summary?.total_skills || 0;
  const completedSkills = progress?.summary?.completed || 0;

  const steps = [
    { icon: Upload, label: 'Upload your resume', done: hasResume },
    { icon: Briefcase, label: 'Find job matches', done: false },
    { icon: Users, label: 'Connect with a mentor', done: false },
    { icon: TrendingUp, label: 'Analyze skill gaps', done: totalSkillGaps > 0 },
  ];
  const nextStepIdx = steps.findIndex(s => !s.done);

  const stats = [
    {
      icon: FileText,
      label: 'Resume Skills',
      value: loading ? '...' : skills.length || '0',
      sub: hasResume ? 'Skills extracted by AI' : 'Upload resume to start',
      gradient: 'from-blue-500 to-indigo-500',
      glow: 'rgba(59,130,246,0.2)',
      delay: 0.1,
      onClick: () => router.push('/dashboard/resume'),
    },
    {
      icon: Briefcase,
      label: 'Job Matches',
      value: '—',
      sub: 'Run job scraper first',
      gradient: 'from-violet-500 to-purple-500',
      glow: 'rgba(139,92,246,0.2)',
      delay: 0.18,
      onClick: () => router.push('/dashboard/jobs'),
    },
    {
      icon: Users,
      label: 'Mentor Matches',
      value: '5',
      sub: 'Ready to connect',
      gradient: 'from-emerald-500 to-teal-500',
      glow: 'rgba(16,185,129,0.2)',
      delay: 0.26,
      onClick: () => router.push('/dashboard/mentors'),
    },
    {
      icon: TrendingUp,
      label: 'Skill Progress',
      value: loading ? '...' : `${completionPct}%`,
      sub: `${completedSkills} of ${totalSkillGaps} gaps closed`,
      gradient: 'from-orange-500 to-amber-500',
      glow: 'rgba(249,115,22,0.2)',
      delay: 0.34,
      onClick: () => router.push('/dashboard/skills'),
    },
  ];

  return (
    <>
      <DashboardBackground />

      <div className="relative max-w-6xl mx-auto space-y-8">

        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden p-8"
        >
          {/* Banner glow */}
          <div
            className="absolute inset-0 opacity-40"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(59,130,246,0.12), transparent)' }}
          />
          {/* Animated accent */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.6), rgba(139,92,246,0.6), transparent)' }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </motion.div>
                <span className="text-sm text-muted-foreground font-medium">{time}</span>
              </div>
              <h2 className="font-display text-4xl font-bold mb-2">
                Hey, {getName()} 👋
              </h2>
              <p className="text-muted-foreground text-lg">
                {hasResume
                  ? `You have ${skills.length} skills extracted. Keep pushing forward!`
                  : "Let's get started — upload your resume to unlock everything."}
              </p>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              {!hasResume ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push('/dashboard/resume')}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold text-sm rounded-xl shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity"
                >
                  <Upload className="w-4 h-4" />
                  Upload Resume
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-400">Resume Analyzed</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Setup Progress</span>
              <span className="text-xs font-medium text-primary">
                {steps.filter(s => s.done).length}/{steps.length} steps
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"
                initial={{ width: 0 }}
                animate={{ width: `${(steps.filter(s => s.done).length / steps.length) * 100}%` }}
                transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display text-lg font-bold">Quick Actions</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Jump into any feature</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-yellow-400 font-medium">AI Powered</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, i) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.08 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push(action.href)}
                  className={`group relative flex items-center gap-3 p-4 rounded-xl border border-border/50 ${action.border} bg-secondary/20 hover:bg-secondary/40 transition-all text-left overflow-hidden`}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{ background: `radial-gradient(circle at 20% 50%, ${action.glow}, transparent 65%)` }}
                  />
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center flex-shrink-0 shadow-lg ${action.shadow} relative z-10`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="relative z-10 flex-1 overflow-hidden">
                    <p className="text-sm font-semibold text-foreground">{action.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{action.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all relative z-10" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Setup checklist */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-lg font-bold">Your Journey</h3>
              <div className="flex items-center gap-1">
                {steps.map((s, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      s.done ? 'bg-emerald-400' : i === nextStepIdx ? 'bg-primary w-3' : 'bg-border'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-5">
              {steps.filter(s => s.done).length === 0
                ? 'Start your career journey'
                : `${steps.filter(s => s.done).length} of ${steps.length} completed`}
            </p>

            <div className="space-y-2">
              {steps.map((step, i) => (
                <StepItem
                  key={step.label}
                  icon={step.icon}
                  label={step.label}
                  done={step.done}
                  active={i === nextStepIdx}
                  delay={0.5 + i * 0.08}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-5 pt-4 border-t border-border/40"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs text-muted-foreground">
                  {nextStepIdx === 0
                    ? 'Upload resume to begin'
                    : `${steps.length - nextStepIdx} steps remaining`}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Skills section — only when resume uploaded */}
        {hasResume && skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden relative"
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{ background: 'radial-gradient(ellipse 50% 80% at 100% 50%, rgba(59,130,246,0.08), transparent)' }}
            />
            <div className="relative flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold">Your Skills</h3>
                  <p className="text-xs text-muted-foreground">{skills.length} skills extracted from resume</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/dashboard/resume')}
                className="flex items-center gap-1.5 text-xs text-primary hover:opacity-80 transition-opacity font-medium"
              >
                View Full Profile <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="relative flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <SkillBadge key={skill} skill={skill} delay={0.55 + i * 0.03} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}