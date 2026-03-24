'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, MapPin, DollarSign, Zap,
  ExternalLink, ChevronDown, ChevronUp, Loader2,
  Sparkles, AlertCircle, RefreshCw, Wifi, CheckCircle2,
  X, TrendingUp, Star
} from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { jobsApi } from '@/lib/api';

function PageBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)',
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

function ScoreRing({ score }) {
  const color =
    score >= 80 ? 'text-emerald-400' :
    score >= 60 ? 'text-yellow-400' :
    'text-orange-400';
  const bg =
    score >= 80 ? 'bg-emerald-500/15 border-emerald-500/30' :
    score >= 60 ? 'bg-yellow-500/15 border-yellow-500/30' :
    'bg-orange-500/15 border-orange-500/30';

  return (
    <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 ${bg} flex-shrink-0`}>
      <span className={`text-lg font-bold ${color}`}>{score}%</span>
      <span className="text-[9px] text-muted-foreground">match</span>
    </div>
  );
}

function JobCard({ job, index }) {
  const [expanded, setExpanded] = useState(false);

  const score = job.match_score || job.similarity_score || 0;
  const scoreNum = typeof score === 'number' ? Math.round(score > 1 ? score : score * 100) : 0;
  const overlap = job.skill_overlap || [];
  const missing = job.missing_skills || [];
  const overlapPct = job.skill_overlap_percent || 0;

  const typeColor = {
    FULLTIME: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    PARTTIME: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    INTERN: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    CONTRACTOR: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  }[job.employment_type] || 'bg-secondary text-muted-foreground border-border';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden group hover:border-border transition-all"
    >
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-60"
        style={{
          background: scoreNum >= 80
            ? 'linear-gradient(90deg, transparent, rgba(16,185,129,0.8), transparent)'
            : scoreNum >= 60
            ? 'linear-gradient(90deg, transparent, rgba(234,179,8,0.8), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(139,92,246,0.8), transparent)'
        }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(circle at 0% 0%, rgba(139,92,246,0.06), transparent 60%)' }}
      />

      <div className="relative p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-500/20 text-white font-bold text-sm">
            {job.company?.[0]?.toUpperCase() || 'J'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground text-base leading-tight truncate">
                  {job.title}
                </h3>
                <p className="text-sm text-primary font-medium mt-0.5">{job.company}</p>
              </div>
              <ScoreRing score={scoreNum} />
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2.5">
              {job.location && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {job.location}
                </div>
              )}
              {job.salary && job.salary !== 'Not - disclosed' && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <DollarSign className="w-3 h-3" />
                  {job.salary}
                </div>
              )}
              {job.is_remote && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400">
                  <Wifi className="w-3 h-3" />
                  Remote
                </span>
              )}
              {job.employment_type && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColor}`}>
                  {job.employment_type}
                </span>
              )}
            </div>
          </div>
        </div>

        {job.why_this_fits && (
          <div className="mt-4 flex gap-2.5 p-3 rounded-xl bg-primary/5 border border-primary/15">
            <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">{job.why_this_fits}</p>
          </div>
        )}

        {overlapPct > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">Skill overlap</span>
              <span className="text-xs font-medium text-primary">{overlapPct}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${overlapPct}%` }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.8 }}
              />
            </div>
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {expanded ? 'Less details' : 'More details'}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {overlap.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-emerald-400 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Skills you have ({overlap.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {overlap.map((s, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {missing.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-orange-400 mb-2 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Skills to learn ({missing.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {missing.map((s, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/25 text-orange-400">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {job.description && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Job Description</p>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                      {job.description}
                    </p>
                  </div>
                )}

                {job.skills_required?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Required Qualifications</p>
                    <ul className="space-y-1">
                      {job.skills_required.map((s, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-border mt-1.5 flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {job.url && (
          <div className="mt-4 pt-4 border-t border-border/40">
            <button
              onClick={() => window.open(job.url, '_blank', 'noopener,noreferrer')}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            >
              Apply Now
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function EmptyState({ onScrape, scraping }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto"
    >
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-xl shadow-violet-500/25 mb-6">
        <Briefcase className="w-9 h-9 text-white" />
      </div>
      <h3 className="font-display text-xl font-bold mb-2">No Job Matches Yet</h3>
      <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
        Click below to scrape live jobs from JSearch and match them to your profile using AI + Qdrant vector search.
      </p>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onScrape}
        disabled={scraping}
        className="flex items-center gap-2.5 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:opacity-90 transition-all disabled:opacity-60"
      >
        {scraping
          ? <Loader2 className="w-5 h-5 animate-spin" />
          : <Zap className="w-5 h-5" />
        }
        {scraping ? 'Finding your matches...' : 'Find My Job Matches'}
      </motion.button>
      {scraping && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-xs text-muted-foreground"
        >
          Scraping JSearch → Embedding with Qdrant → Ranking with GPT-4o...
        </motion.p>
      )}
    </motion.div>
  );
}

export default function JobsPage() {
  const { getUserId } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState(null);

  const userId = getUserId();

  async function handleScrapeAndMatch() {
    if (!userId) return;
    setScraping(true);
    setError('');
    setSuccess('');
    try {
      const res = await jobsApi.scrapeAndMatch(userId);
      const matches = res.data?.matches || [];
      setJobs(matches);
      setStats({
        total: res.data?.total_scraped,
        matches: matches.length,
      });
      setSuccess(`Found ${matches.length} job matches for you!`);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Scraping failed. Make sure your resume is uploaded.');
    } finally {
      setScraping(false);
    }
  }

  async function fetchJobs() {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await jobsApi.match(userId);
      if (res.data?.matches?.length > 0) {
        setJobs(res.data.matches);
        setStats({
          total: res.data.total_jobs_scanned,
          matches: res.data.matches.length,
        });
      }
    } catch (err) {
      console.log('No existing matches, showing empty state');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, [userId]);

  const filtered = filter === 'all' ? jobs :
    filter === 'remote' ? jobs.filter(j => j.is_remote) :
    filter === 'top' ? jobs.filter(j => (j.match_score || 0) >= 80) :
    jobs.filter(j => j.employment_type === filter);

  const avgScore = jobs.length
    ? Math.round(jobs.reduce((a, j) => a + (j.match_score || 0), 0) / jobs.length)
    : 0;

  return (
    <>
      <PageBackground />

      <div className="relative max-w-6xl mx-auto space-y-6">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-muted-foreground font-medium">Job Matches</span>
            </div>
            <h2 className="font-display text-3xl font-bold">Find Your Matches</h2>
            <p className="text-muted-foreground mt-1">
              AI-powered job matching using your resume + Qdrant vector search
            </p>
          </div>

          {jobs.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleScrapeAndMatch}
              disabled={scraping}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-secondary/40 hover:bg-secondary/80 text-sm font-medium transition-all disabled:opacity-50"
            >
              {scraping
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <RefreshCw className="w-3.5 h-3.5" />
              }
              Refresh Matches
            </motion.button>
          )}
        </motion.div>

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
              <p className="text-sm text-muted-foreground">Loading job matches...</p>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState onScrape={handleScrapeAndMatch} scraping={scraping} />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { icon: Briefcase, label: 'Jobs Scanned', value: stats?.total || '—', color: 'text-violet-400', bg: 'bg-violet-500/10' },
                { icon: Star, label: 'Top Matches', value: jobs.length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { icon: TrendingUp, label: 'Avg Match Score', value: `${avgScore}%`, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm"
                >
                  <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 flex-wrap"
            >
              {[
                { key: 'all', label: 'All Matches' },
                { key: 'top', label: '🔥 Top Matches (80%+)' },
                { key: 'remote', label: '🌐 Remote Only' },
                { key: 'FULLTIME', label: 'Full Time' },
                { key: 'INTERN', label: 'Internships' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    filter === f.key
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-card/40'
                  }`}
                >
                  {f.label}
                  {f.key === 'all' && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px]">
                      {jobs.length}
                    </span>
                  )}
                </button>
              ))}
            </motion.div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-sm">
                No jobs match this filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.map((job, i) => (
                  <JobCard key={`${job.title}-${job.company}-${i}`} job={job} index={i} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}