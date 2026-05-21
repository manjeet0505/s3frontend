'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Brain, Briefcase, Users, TrendingUp, ArrowRight, Sparkles,
  ChevronRight, Moon, Sun, Zap, Upload, Search, Trophy,
  Star, Quote, CheckCircle, Linkedin
} from 'lucide-react';
import { useTheme } from 'next-themes';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

// ── Data ────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Brain,
    title: 'AI Resume Parser',
    desc: 'Upload your resume and get an intelligent profile built instantly with skill extraction and gap analysis.',
    gradient: 'from-blue-500 to-indigo-500',
    glow: 'rgba(59,130,246,0.15)',
  },
  {
    icon: Briefcase,
    title: 'Smart Job Matching',
    desc: 'Vector-powered job matching that finds roles perfectly aligned with your skills and career goals.',
    gradient: 'from-violet-500 to-purple-500',
    glow: 'rgba(139,92,246,0.15)',
  },
  {
    icon: Users,
    title: 'Mentor Connect',
    desc: 'Get matched with industry mentors based on your domain, target role, and skill level.',
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.15)',
  },
  {
    icon: TrendingUp,
    title: 'Skill Gap Tracker',
    desc: 'Know exactly what to learn next with prioritized skill gaps, resources and estimated timelines.',
    gradient: 'from-orange-500 to-amber-500',
    glow: 'rgba(249,115,22,0.15)',
  },
];

const stats = [
  { value: '4', label: 'AI Agents' },
  { value: '5+', label: 'Mentors' },
  { value: '100+', label: 'Job Matches' },
  { value: '95%', label: 'Accuracy' },
];

const steps = [
  {
    step: '01',
    icon: Upload,
    title: 'Upload Your Resume',
    desc: 'Drop your PDF resume. Our AI parser instantly extracts skills, experience, and builds your career profile in seconds.',
    color: 'from-blue-500 to-indigo-500',
    glow: 'rgba(59,130,246,0.2)',
    tags: ['PDF Upload', 'Auto-parse', 'Skill Extraction'],
  },
  {
    step: '02',
    icon: Search,
    title: 'Get Matched & Guided',
    desc: 'AI agents match you to jobs, identify skill gaps, and connect you with mentors — all personalised to your profile.',
    color: 'from-violet-500 to-purple-500',
    glow: 'rgba(139,92,246,0.2)',
    tags: ['Job Matching', 'Skill Gap', 'Mentor Connect'],
  },
  {
    step: '03',
    icon: Trophy,
    title: 'Land Your Dream Role',
    desc: 'Practice interviews, optimize your LinkedIn, track applications and walk into offers with confidence.',
    color: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.2)',
    tags: ['Mock Interview', 'LinkedIn AI', 'Offer Tracker'],
  },
];

const testimonials = [
  {
    name: 'Aryan Sharma',
    role: 'SDE-1 @ Razorpay',
    avatar: 'A',
    gradient: 'from-blue-500 to-indigo-600',
    rating: 5,
    text: 'S3 Dashboard found me a 94% match job at Razorpay within 2 weeks of uploading my resume. The skill gap feature told me exactly what to learn — I got the offer in 3 rounds.',
  },
  {
    name: 'Priya Nair',
    role: 'Data Analyst @ Zerodha',
    avatar: 'P',
    gradient: 'from-violet-500 to-purple-600',
    rating: 5,
    text: 'The mentor connect feature paired me with someone who had the exact same career path I wanted. One session changed my entire interview approach. Highly recommend.',
  },
  {
    name: 'Rahul Verma',
    role: 'Full Stack Dev @ Freshworks',
    avatar: 'R',
    gradient: 'from-emerald-500 to-teal-600',
    rating: 5,
    text: 'I was applying blindly for months. After using the AI resume scorer and LinkedIn optimizer, I started getting callbacks within days. The interview agent is incredibly realistic.',
  },
];

const companies = [
  'Google', 'Microsoft', 'Razorpay', 'Zerodha',
  'Freshworks', 'Swiggy', 'PhonePe', 'Atlassian',
];

// ── Background components ────────────────────────────────────────────────────

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, hsl(224,25%,8%) 100%)' }} />
    </div>
  );
}

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div className="absolute w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', top: '-100px', left: '10%' }}
        animate={{ y: [0, 30, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute w-[400px] h-[400px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)', top: '100px', right: '5%' }}
        animate={{ y: [0, -25, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />
      <motion.div className="absolute w-[300px] h-[300px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', bottom: '20%', left: '30%' }}
        animate={{ y: [0, 20, 0], x: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }} />
    </div>
  );
}

function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 10 + 8,
    delay: Math.random() * 5,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full bg-blue-400/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px` }}
          animate={{ y: [0, -40, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }} />
      ))}
    </div>
  );
}

// ── Hero visual ──────────────────────────────────────────────────────────────

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto mt-16 max-w-3xl"
    >
      <div className="absolute inset-0 rounded-3xl blur-3xl opacity-20"
        style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }} />
      <div className="relative rounded-3xl border border-border/60 bg-card/80 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border/40">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="px-3 py-1 rounded-lg bg-secondary/60 text-xs text-muted-foreground font-mono">
              s3-dashboard.vercel.app
            </div>
          </div>
        </div>
        <div className="p-6 grid grid-cols-3 gap-4">
          {[
            { label: 'Match Score', value: '94%', color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Jobs Found', value: '47', color: 'text-violet-400', bg: 'bg-violet-500/10' },
            { label: 'Skill Gaps', value: '4', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          ].map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className={`${stat.bg} rounded-xl p-3 border border-border/30`}>
              <div className={`text-2xl font-bold font-display ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
          <div className="col-span-2 rounded-xl bg-secondary/30 border border-border/30 p-3">
            <div className="text-xs font-medium text-muted-foreground mb-3">Top Job Matches</div>
            {[
              { role: 'Full Stack Developer', company: 'Razorpay', score: 94 },
              { role: 'SDE-1 Backend', company: 'Zerodha', score: 88 },
              { role: 'React Developer', company: 'Freshworks', score: 82 },
            ].map((job, i) => (
              <motion.div key={job.role}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + i * 0.1 }}
                className="flex items-center justify-between py-1.5">
                <div>
                  <div className="text-xs font-medium">{job.role}</div>
                  <div className="text-xs text-muted-foreground">{job.company}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full bg-border overflow-hidden">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      initial={{ width: 0 }} animate={{ width: `${job.score}%` }}
                      transition={{ delay: 1.2 + i * 0.1, duration: 0.8 }} />
                  </div>
                  <span className="text-xs text-blue-400 font-medium">{job.score}%</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="rounded-xl bg-secondary/30 border border-border/30 p-3">
            <div className="text-xs font-medium text-muted-foreground mb-3">Mentor Match</div>
            {['Priya S.', 'Rahul K.'].map((name, i) => (
              <motion.div key={name} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1.1 + i * 0.15 }}
                className="flex items-center gap-2 py-1.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {name[0]}
                </div>
                <div className="text-xs">{name}</div>
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }} />
      </div>
    </motion.div>
  );
}

// ── Theme toggle ─────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-xl border border-border hover:bg-secondary transition-colors">
      {theme === 'dark'
        ? <Sun className="w-4 h-4 text-muted-foreground" />
        : <Moon className="w-4 h-4 text-muted-foreground" />}
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [authModal, setAuthModal] = useState(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, -40]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <GridBackground />
      <FloatingOrbs />
      <Particles />

      {/* ── Navbar ── */}
      <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-20 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg">S3 Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button onClick={() => setAuthModal('login')}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </button>
          <button onClick={() => setAuthModal('signup')}
            className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-primary/25">
            Get Started
          </button>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <motion.section style={{ y: heroY }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm text-sm text-muted-foreground mb-8">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span>Powered by GPT-4o · Qdrant · FastAPI</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
          Your AI-Powered<br />
          <span className="gradient-text">Career Intelligence</span><br />
          Platform
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload your resume. Get matched with jobs and mentors.
          Identify skill gaps. Track your growth — all powered by AI agents built for serious students.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-4">
          <button onClick={() => setAuthModal('signup')}
            className="group flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-2xl hover:opacity-90 transition-all hover:scale-105 shadow-xl shadow-primary/30">
            Start for Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={() => setAuthModal('login')}
            className="flex items-center gap-2 px-8 py-4 border border-border rounded-2xl font-medium hover:bg-secondary transition-colors backdrop-blur-sm">
            Sign In <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-12 mt-14">
          {stats.map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }} className="text-center">
              <div className="font-display text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
        <HeroVisual />
      </motion.section>

      {/* ── Trusted by bar ── */}
      <section className="relative z-10 border-y border-border/30 bg-card/20 backdrop-blur-sm py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-5">
            Students placed at top companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {companies.map((name, i) => (
              <motion.span key={name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-sm font-semibold text-muted-foreground/60 hover:text-muted-foreground transition-colors cursor-default tracking-wide">
                {name}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-3 block">Simple Process</span>
          <h2 className="font-display text-4xl font-bold mb-4">From Resume to Offer in 3 Steps</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            No fluff, no complexity. Upload once, let AI do the heavy lifting.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line desktop */}
          <div className="hidden md:block absolute top-16 left-[16.5%] right-[16.5%] h-px"
            style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.4), rgba(139,92,246,0.4), rgba(16,185,129,0.4))' }} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative flex flex-col items-center text-center group">

                {/* Step icon */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-xl mb-0 z-10 relative group-hover:scale-110 transition-transform duration-300`}
                    style={{ boxShadow: `0 0 30px ${s.glow}` }}>
                    <s.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border-2 border-primary/40 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{i + 1}</span>
                  </div>
                </div>

                <h3 className="font-display text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4 max-w-xs">{s.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {s.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-secondary/60 border border-border/40 text-muted-foreground">
                      <CheckCircle className="w-3 h-3 text-primary" /> {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold mb-4">4 AI Agents Working For You</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Each agent is purpose-built, connected, and powered by GPT-4o and vector search.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div key={feature.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group p-6 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all cursor-default relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: `radial-gradient(circle at 50% 0%, ${feature.glow}, transparent 70%)` }} />
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-3 block">Student Stories</span>
          <h2 className="font-display text-4xl font-bold mb-4">Real Students, Real Offers</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Don't take our word for it — hear from students who landed their dream roles.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative p-6 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all group overflow-hidden">

              {/* Quote icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-5">"{t.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-primary">{t.role}</p>
                </div>
                <Linkedin className="w-4 h-4 text-muted-foreground/40 ml-auto" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative rounded-3xl border border-border/60 bg-card/50 backdrop-blur-sm p-16 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-30"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(59,130,246,0.15), transparent)' }} />
          <div className="relative">
            <h2 className="font-display text-4xl font-bold mb-4">Ready to accelerate your career?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
              Join students already using S3 Dashboard to land their dream roles faster.
            </p>
            <button onClick={() => setAuthModal('signup')}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-2xl hover:opacity-90 transition-all hover:scale-105 shadow-xl shadow-primary/30">
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </section>

      {authModal && (
        <AuthModal mode={authModal} onClose={() => setAuthModal(null)}
          onLogin={() => setAuthModal(null)} onModeChange={(mode) => setAuthModal(mode)} />
      )}
      <Footer />
    </div>
  );
}