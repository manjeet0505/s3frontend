'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  FileText, Briefcase, Users, TrendingUp,
  ArrowRight, Upload, Zap, CheckCircle2,
  Sparkles, Clock, ChevronRight, Loader2,
  AlertCircle, Target, Star
} from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { resumeApi, jobsApi, progressApi } from '@/lib/api';


function StatCard({ icon: Icon, label, value, sub, color, bg, border, loading, onClick }) {
  return (
    <motion.div
      whileHover={onClick ? { y: -2, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={`relative p-5 rounded-2xl border ${border} ${bg} backdrop-blur-sm overflow-hidden ${onClick ? 'cursor-pointer' : ''} transition-all group`}
    >
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${color.replace('text-', 'via-').replace('-400', '-500/40')} to-transparent`} />
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} border ${border}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        {onClick && (
          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-7 w-16 bg-secondary/60 rounded animate-pulse" />
          <div className="h-3 w-24 bg-secondary/40 rounded animate-pulse" />
        </div>
      ) : (
        <>
          <div className={`font-display text-3xl font-bold ${color} mb-1`}>
            {value ?? '—'}
          </div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        </>
      )}
    </motion.div>
  );
}

function SetupStep({ done, label, desc, href, router }) {
  return (
    <div
      onClick={() => !done && router.push(href)}
      className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
        done
          ? 'border-emerald-500/20 bg-emerald-500/5'
          : 'border-border/50 bg-secondary/20 hover:border-primary/30 cursor-pointer hover:bg-primary/5'
      }`}
    >
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
        done ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-secondary/60 border border-border/60'
      }`}>
        {done
          ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          : <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${done ? 'text-emerald-400' : 'text-foreground'}`}>{label}</p>
        <p className="text-xs text-muted-foreground truncate">{desc}</p>
      </div>
      {!done && <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
    </div>
  );
}

export default function DashboardPage() {
  const { getUserId, getName } = useAuth();
  const router = useRouter();

  const [resumeData, setResumeData] = useState(null);
  const [jobsData, setJobsData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = getUserId();
  const name = getName();

  useEffect(() => {
    if (userId) fetchAll();
  }, [userId]);

  async function fetchAll() {
    setLoading(true);

    const [resumeRes, jobsRes, progressRes] = await Promise.allSettled([
      resumeApi.getProfile(userId),
      jobsApi.list(userId),
      progressApi.get(userId),
    ]);

    if (resumeRes.status === 'fulfilled') setResumeData(resumeRes.value.data);
    if (jobsRes.status === 'fulfilled') setJobsData(jobsRes.value.data);
    if (progressRes.status === 'fulfilled') setProgressData(progressRes.value.data);

    setLoading(false);
  }

  // ── Derived values ─────────────────────────────────
  const skillCount = resumeData?.profile?.skills?.length ?? resumeData?.skills?.length ?? null;
  const targetRole = resumeData?.profile?.target_role ?? resumeData?.target_role ?? null;

  const jobCount = (() => {
    if (!jobsData) return null;
    if (Array.isArray(jobsData)) return jobsData.length;
    if (Array.isArray(jobsData?.jobs)) return jobsData.jobs.length;
    if (Array.isArray(jobsData?.matches)) return jobsData.matches.length;
    if (typeof jobsData?.total === 'number') return jobsData.total;
    if (typeof jobsData?.count === 'number') return jobsData.count;
    return null;
  })();

  // Mentor count saved after visiting Mentors page
  const mentorCount = resumeData?.mentor_count ?? null;

  const completionPercent = progressData?.summary?.completion_percent ?? null;
  const skillGapsTotal = progressData?.summary?.total_skills ?? null;
  const skillGapsDone = progressData?.summary?.completed ?? null;

  // Setup progress
  const hasResume = !!skillCount;
  const hasJobs = jobCount !== null && jobCount > 0;
  const hasMentors = mentorCount !== null && mentorCount > 0;
  const hasSkillGap = skillGapsTotal !== null && skillGapsTotal > 0;
  const setupDone = [hasResume, hasJobs, hasMentors, hasSkillGap].filter(Boolean).length;
  const setupPercent = Math.round((setupDone / 4) * 100);

  // Strong skills for the cloud
  const strongSkills = resumeData?.profile?.strong_skills
    ?? resumeData?.strong_skills
    ?? resumeData?.profile?.skills?.slice(0, 8)
    ?? [];

  // What to show as the primary CTA
  const ctaStep = !hasResume
    ? { label: 'Upload Your Resume', href: '/dashboard/resume', icon: Upload }
    : !hasJobs
    ? { label: 'Find Job Matches', href: '/dashboard/jobs', icon: Briefcase }
    : !hasMentors
    ? { label: 'Match with Mentors', href: '/dashboard/mentors', icon: Users }
    : !hasSkillGap
    ? { label: 'Run Skill Analysis', href: '/dashboard/skills', icon: Zap }
    : null;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Hero greeting */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(59,130,246,0.12), transparent)' }}
        />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">
              {greeting()},
            </p>
            <h2 className="font-display text-3xl font-bold">
              {name || 'Student'} 👋
            </h2>
            {targetRole && (
              <div className="flex items-center gap-2 mt-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400 font-medium">
                  Target: {targetRole}
                </span>
              </div>
            )}
          </div>

          {/* Setup progress */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Setup progress</span>
              <span className="text-xs font-bold text-foreground">{setupDone}/4</span>
            </div>
            <div className="w-40 h-2 rounded-full bg-secondary/60 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${setupPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
            {setupPercent === 100 && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                All systems active
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          icon={FileText}
          label="Resume Skills"
          value={skillCount}
          sub={skillCount ? 'skills extracted' : 'Upload resume first'}
          color="text-blue-400"
          bg="bg-blue-500/8"
          border="border-blue-500/20"
          loading={loading}
          onClick={() => router.push('/dashboard/resume')}
        />
        <StatCard
          icon={Briefcase}
          label="Job Matches"
          value={jobCount}
          sub={jobCount ? 'roles matched' : 'Scrape jobs first'}
          color="text-violet-400"
          bg="bg-violet-500/8"
          border="border-violet-500/20"
          loading={loading}
          onClick={() => router.push('/dashboard/jobs')}
        />
        <StatCard
          icon={Users}
          label="Mentor Matches"
          value={mentorCount}
          sub={mentorCount ? 'mentors matched' : 'Visit Mentors page'}
          color="text-emerald-400"
          bg="bg-emerald-500/8"
          border="border-emerald-500/20"
          loading={loading}
          onClick={() => router.push('/dashboard/mentors')}
        />
        <StatCard
          icon={TrendingUp}
          label="Skill Progress"
          value={completionPercent !== null ? `${completionPercent}%` : null}
          sub={
            skillGapsTotal
              ? `${skillGapsDone} of ${skillGapsTotal} gaps closed`
              : 'Run skill analysis'
          }
          color="text-orange-400"
          bg="bg-orange-500/8"
          border="border-orange-500/20"
          loading={loading}
          onClick={() => router.push('/dashboard/skills')}
        />
      </motion.div>

      {/* Main content row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Setup checklist — left 2/3 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-display text-base font-bold">Your Setup Journey</h3>
            <span className="ml-auto text-xs text-muted-foreground">{setupDone}/4 complete</span>
          </div>

          <div className="space-y-2.5">
            <SetupStep
              done={hasResume}
              label="Upload Resume"
              desc={hasResume ? `${skillCount} skills extracted` : 'Upload your PDF resume to get started'}
              href="/dashboard/resume"
              router={router}
            />
            <SetupStep
              done={hasJobs}
              label="Find Job Matches"
              desc={hasJobs ? `${jobCount} jobs matched to your profile` : 'Scrape and match jobs based on your skills'}
              href="/dashboard/jobs"
              router={router}
            />
            <SetupStep
              done={hasMentors}
              label="Match with Mentors"
              desc={hasMentors ? `${mentorCount} mentors matched` : 'Find mentors aligned with your goals'}
              href="/dashboard/mentors"
              router={router}
            />
            <SetupStep
              done={hasSkillGap}
              label="Run Skill Gap Analysis"
              desc={hasSkillGap ? `${skillGapsTotal} gaps identified, ${skillGapsDone} closed` : 'Identify what to learn to reach your target role'}
              href="/dashboard/skills"
              router={router}
            />
          </div>

          {/* CTA button */}
          {ctaStep && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(ctaStep.href)}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              <ctaStep.icon className="w-4 h-4" />
              {ctaStep.label}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}

          {!ctaStep && !loading && (
            <div className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              All steps complete — your dashboard is fully active!
            </div>
          )}
        </motion.div>

        {/* Right column */}
        <div className="space-y-5">

          {/* Skills cloud */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-yellow-400" />
              <h3 className="font-display text-sm font-bold">Strong Skills</h3>
            </div>

            {loading ? (
              <div className="flex flex-wrap gap-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-6 w-16 bg-secondary/60 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : strongSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {strongSkills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.04 }}
                    className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-medium"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Upload your resume to see your top skills here.
              </p>
            )}
          </motion.div>

          {/* Quick nav */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm"
          >
            <h3 className="font-display text-sm font-bold mb-3">Quick Navigate</h3>
            <div className="space-y-1.5">
              {[
                { icon: FileText, label: 'Resume', href: '/dashboard/resume', color: 'text-blue-400' },
                { icon: Briefcase, label: 'Job Matches', href: '/dashboard/jobs', color: 'text-violet-400' },
                { icon: Users, label: 'Mentors', href: '/dashboard/mentors', color: 'text-emerald-400' },
                { icon: TrendingUp, label: 'Skill Gap', href: '/dashboard/skills', color: 'text-orange-400' },
              ].map(item => (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all group"
                >
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  {item.label}
                  <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}