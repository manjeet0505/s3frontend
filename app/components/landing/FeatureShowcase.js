'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Briefcase, TrendingUp, Brain, Linkedin, CheckCircle2, ArrowRight, Zap, Star } from 'lucide-react';

const features = [
  {
    id: 'resume',
    label: 'Resume Scorer',
    icon: FileText,
    color: 'from-blue-500 to-cyan-400',
    accent: '#3b82f6',
    headline: 'Score. Optimize. Land Interviews.',
    description: 'Multi-pass AI analysis scores every section of your resume — ATS keywords, impact verbs, metrics density — then rewrites it for your target role.',
    stats: [{ label: 'ATS Score', value: '92/100' }, { label: 'Keywords', value: '34 added' }, { label: 'Impact verbs', value: '+18' }],
    mockup: 'resume',
  },
  {
    id: 'jobs',
    label: 'Job Matcher',
    icon: Briefcase,
    color: 'from-violet-500 to-purple-400',
    accent: '#8b5cf6',
    headline: '2.4M+ Jobs. Matched to You.',
    description: 'Vector-search powered job matching ranks roles by fit score, highlights skill gaps per listing, and tracks your entire pipeline in a Kanban board.',
    stats: [{ label: 'Match score', value: '97%' }, { label: 'Jobs found', value: '2.4M+' }, { label: 'Time saved', value: '8 hrs/wk' }],
    mockup: 'jobs',
  },
  {
    id: 'skills',
    label: 'Skill Gap AI',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-400',
    accent: '#10b981',
    headline: 'Know Exactly What to Learn.',
    description: 'Compares your current skills against top job descriptions. Builds a personalised learning roadmap with resources, timelines, and priority order.',
    stats: [{ label: 'Gaps found', value: '7 skills' }, { label: 'Resources', value: '42 curated' }, { label: 'Timeline', value: '6 weeks' }],
    mockup: 'skills',
  },
  {
    id: 'interview',
    label: 'Mock Interview',
    icon: Brain,
    color: 'from-orange-500 to-amber-400',
    accent: '#f97316',
    headline: 'Practice Until You're Unbeatable.',
    description: 'Role-specific question banks, real-time AI feedback on your answers, confidence scoring, and a STAR-method coach built in.',
    stats: [{ label: 'Questions', value: '1,200+' }, { label: 'Avg score gain', value: '+34%' }, { label: 'Rounds covered', value: '6 types' }],
    mockup: 'interview',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn AI',
    icon: Linkedin,
    color: 'from-sky-500 to-blue-400',
    accent: '#0ea5e9',
    headline: 'Turn Your Profile Into a Magnet.',
    description: 'Triple-pass analysis scores headline, about, and experience sections. Full AI rewrite with before/after diff, keyword injection, and ATS term optimization.',
    stats: [{ label: 'Profile score', value: '94/100' }, { label: 'Keywords', value: '+28' }, { label: 'Recruiter views', value: '+3.2x' }],
    mockup: 'linkedin',
  },
];

const MockupResume = () => (
  <div className="space-y-3">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs text-slate-400">Analyzing resume…</span>
      </div>
      <span className="text-xs font-bold text-blue-400">92 / 100</span>
    </div>
    {['ATS Keywords', 'Impact Verbs', 'Metrics Density', 'Section Structure', 'Readability'].map((label, i) => (
      <div key={label}>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400">{label}</span>
          <span className="text-white font-semibold">{[88, 95, 76, 100, 91][i]}%</span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${[88, 95, 76, 100, 91][i]}%` }}
            transition={{ delay: i * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    ))}
    <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
      <p className="text-xs text-blue-300 font-medium">✓ 34 keywords added for "Senior Frontend Engineer"</p>
    </div>
  </div>
);

const MockupJobs = () => (
  <div className="space-y-2">
    {[
      { role: 'Frontend Engineer', company: 'Razorpay', match: 97, tag: 'Top Match' },
      { role: 'React Developer', company: 'Zerodha', match: 91, tag: 'Great Fit' },
      { role: 'Full Stack SDE-1', company: 'CRED', match: 87, tag: 'Good Fit' },
    ].map((job, i) => (
      <motion.div
        key={job.company}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 }}
        className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-white/5 hover:border-violet-500/30 transition-colors group"
      >
        <div>
          <p className="text-sm font-semibold text-white">{job.role}</p>
          <p className="text-xs text-slate-400">{job.company}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">{job.tag}</span>
          <span className="text-sm font-bold text-violet-400">{job.match}%</span>
        </div>
      </motion.div>
    ))}
    <div className="text-center pt-2">
      <span className="text-xs text-slate-500">+2,400,000 more jobs matched</span>
    </div>
  </div>
);

const MockupSkills = () => (
  <div className="space-y-2">
    <p className="text-xs text-slate-400 mb-3">Skills you need for <span className="text-emerald-400">AI Engineer @ Google</span></p>
    {[
      { skill: 'LangChain / LangGraph', priority: 'Critical', have: false },
      { skill: 'FastAPI', priority: 'High', have: true },
      { skill: 'Vector Databases', priority: 'High', have: false },
      { skill: 'Docker + K8s', priority: 'Medium', have: false },
      { skill: 'Next.js 14', priority: 'Have it', have: true },
    ].map((item, i) => (
      <motion.div
        key={item.skill}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.1 }}
        className="flex items-center justify-between py-2 border-b border-white/5"
      >
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${item.have ? 'bg-emerald-400' : 'bg-orange-400'}`} />
          <span className="text-xs text-slate-300">{item.skill}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          item.priority === 'Critical' ? 'bg-red-500/15 text-red-300' :
          item.priority === 'High' ? 'bg-orange-500/15 text-orange-300' :
          item.priority === 'Have it' ? 'bg-emerald-500/15 text-emerald-300' :
          'bg-slate-500/15 text-slate-400'
        }`}>{item.priority}</span>
      </motion.div>
    ))}
  </div>
);

const MockupInterview = () => (
  <div className="space-y-3">
    <div className="p-3 rounded-xl bg-slate-800/60 border border-orange-500/20">
      <p className="text-xs text-orange-400 font-semibold mb-1">Round: System Design</p>
      <p className="text-sm text-white">"Design a URL shortener that handles 100M requests/day."</p>
    </div>
    <div className="p-3 rounded-xl bg-slate-800/40 border border-white/5">
      <p className="text-xs text-slate-400 mb-2">AI Feedback on your answer:</p>
      <div className="space-y-1">
        {['Mentioned scalability ✓', 'Cache layer identified ✓', 'Missing: Rate limiting ✗', 'Missing: Database sharding ✗'].map((f, i) => (
          <p key={i} className={`text-xs ${f.includes('✓') ? 'text-emerald-400' : 'text-red-400'}`}>{f}</p>
        ))}
      </div>
    </div>
    <div className="flex items-center justify-between p-2 rounded-lg bg-orange-500/10">
      <span className="text-xs text-orange-300">Confidence Score</span>
      <span className="text-sm font-bold text-orange-400">74/100 → Improve</span>
    </div>
  </div>
);

const MockupLinkedin = () => (
  <div className="space-y-3">
    <div>
      <p className="text-xs text-slate-400 mb-1">Headline — Before</p>
      <p className="text-xs text-slate-500 line-through p-2 rounded bg-slate-800/40">"Computer Science Student at MDU"</p>
    </div>
    <div>
      <p className="text-xs text-sky-400 mb-1">Headline — After ✨</p>
      <p className="text-xs text-white p-2 rounded bg-sky-500/10 border border-sky-500/20">"AI Engineer & Full Stack Dev | Next.js · FastAPI · LangChain | Building S3 Dashboard | IEEE Published"</p>
    </div>
    <div className="flex gap-2 flex-wrap pt-1">
      {['LangChain', 'GPT-4', 'FastAPI', 'Next.js', 'RAG', 'LLM'].map(kw => (
        <span key={kw} className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">{kw}</span>
      ))}
    </div>
    <div className="flex items-center justify-between p-2 rounded-lg bg-sky-500/10">
      <span className="text-xs text-sky-300">Profile Score</span>
      <span className="text-sm font-bold text-sky-400">47 → 94</span>
    </div>
  </div>
);

const mockupMap = {
  resume: MockupResume,
  jobs: MockupJobs,
  skills: MockupSkills,
  interview: MockupInterview,
  linkedin: MockupLinkedin,
};

export default function FeatureShowcase() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(0);
      setActive((p) => (p + 1) % features.length);
    }, 4500);
    const prog = setInterval(() => {
      setProgress((p) => Math.min(p + 1, 100));
    }, 45);
    return () => { clearInterval(interval); clearInterval(prog); };
  }, [active]);

  const feat = features[active];
  const Icon = feat.icon;
  const MockupComp = mockupMap[feat.id];

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* BG glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl bg-gradient-to-br ${feat.color} transition-all duration-1000`} />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-slate-400 mb-6"
          >
            <Zap className="w-3 h-3 text-yellow-400" />
            See it in action
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">land the role</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-xl mx-auto"
          >
            Five AI agents working together — from your resume to your offer letter.
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {features.map((f, i) => {
            const TabIcon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => { setActive(i); setProgress(0); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                  active === i
                    ? 'text-white border-white/20 bg-white/10'
                    : 'text-slate-400 border-white/5 bg-white/0 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Main showcase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={feat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            {/* Left — text */}
            <div className="space-y-6">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${feat.color} bg-opacity-10`}>
                <Icon className="w-4 h-4 text-white" />
                <span className="text-xs font-semibold text-white">{feat.label}</span>
              </div>
              <h3 className="text-3xl font-bold text-white leading-tight">{feat.headline}</h3>
              <p className="text-slate-400 text-base leading-relaxed">{feat.description}</p>

              {/* Stats */}
              <div className="flex gap-6">
                {feat.stats.map((s) => (
                  <div key={s.label}>
                    <p className={`text-2xl font-bold bg-gradient-to-r ${feat.color} bg-clip-text text-transparent`}>{s.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Auto-cycling features</p>
                <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden w-48">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${feat.color}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right — mockup window */}
            <div className="relative">
              <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${feat.color} opacity-20 blur-sm`} />
              <div className="relative rounded-2xl bg-slate-900 border border-white/10 overflow-hidden">
                {/* Window chrome */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-slate-800/50">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                  <div className="flex-1 mx-4">
                    <div className="h-4 rounded bg-slate-700/50 text-xs flex items-center px-2 text-slate-500">
                      s3-dashboard.ai/{feat.id}
                    </div>
                  </div>
                </div>
                {/* Content */}
                <div className="p-5 min-h-[280px]">
                  <MockupComp />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}