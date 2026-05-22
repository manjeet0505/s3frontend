'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Brain, Briefcase, Users, TrendingUp, ArrowRight, Sparkles, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

// Landing sections
import TrustedBy from './components/landing/TrustedBy';
import FeatureShowcase from './components/landing/FeatureShowcase';
import HowItWorks from './components/landing/HowItWorks';
import Testimonials from './components/landing/Testimonials';
import Pricing from './components/landing/Pricing';
import Footer from './components/Footer';

// ─── Typewriter hook ───────────────────────────────────────────────────────────
function useTypewriter(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    let timeout;
    if (!deleting && charIdx <= word.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
      setDisplay(word.slice(0, charIdx));
    } else if (!deleting && charIdx > word.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx >= 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
      setDisplay(word.slice(0, charIdx));
    } else {
      setDeleting(false);
      setWordIdx((w) => (w + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

// ─── AI Agents grid ────────────────────────────────────────────────────────────
const agents = [
  { icon: Brain,      label: 'Resume Agent',    desc: 'Multi-pass ATS scoring, keyword injection & full rewrite',  color: 'from-blue-500 to-cyan-400' },
  { icon: Briefcase,  label: 'Job Match Agent',  desc: 'Vector search across 2.4M+ jobs ranked by your fit score', color: 'from-violet-500 to-purple-400' },
  { icon: TrendingUp, label: 'Skill Gap Agent',  desc: 'Personalised learning roadmap with curated resources',      color: 'from-emerald-500 to-teal-400' },
  { icon: Users,      label: 'Mentor Agent',     desc: 'Connect with senior engineers at your target companies',    color: 'from-orange-500 to-amber-400' },
];

// ─── Stats bar ─────────────────────────────────────────────────────────────────
const stats = [
  { value: '12K+',  label: 'Students helped' },
  { value: '2.4M+', label: 'Jobs matched' },
  { value: '48K+',  label: 'Resumes scored' },
  { value: '73%',   label: 'Interview rate' },
  { value: '4.9★',  label: 'Avg rating' },
];

export default function LandingPage() {
  const roles = ['AI Engineer', 'Full Stack Dev', 'Backend Engineer', 'SDE-1', 'Frontend Dev'];
  const typed = useTypewriter(roles);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-slate-950/70">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 opacity-0 group-hover:opacity-40 blur transition-opacity duration-300" />
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <span className="font-bold text-white text-lg">S3 Dashboard</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/20 font-semibold">BETA</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16 overflow-hidden">
        {/* Background mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-indigo-500/5 blur-3xl" />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs text-blue-300 font-medium mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Now with LinkedIn Optimizer — AI rewrites your entire profile
            <ChevronRight className="w-3 h-3" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight"
          >
            Land Your Dream{' '}
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              {typed}
              <span className="animate-pulse">|</span>
            </span>
            <br />
            Role with AI
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Five specialised AI agents — resume scorer, job matcher, skill gap analyser, mock interviewer, and LinkedIn optimizer — working together so you get offers, not rejections.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/auth/signup"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold text-base hover:opacity-90 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              Start Free — No Credit Card <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/10 text-slate-300 font-medium text-base hover:bg-white/5 hover:text-white transition-all"
            >
              See how it works
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-3 sm:grid-cols-5 gap-4"
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-1.5 rounded-full bg-white/40" />
          </div>
        </motion.div>
      </section>

      {/* ── Trusted By ─────────────────────────────────────────────────────── */}
      <TrustedBy />

      {/* ── Feature Showcase ───────────────────────────────────────────────── */}
      <div id="features">
        <FeatureShowcase />
      </div>

      {/* ── AI Agents Grid ─────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-500 mb-4"
            >
              Under the hood
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white"
            >
              Meet your{' '}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">AI team</span>
            </motion.h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {agents.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-white/10 transition-all group"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{a.label}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{a.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <div id="how">
        <HowItWorks />
      </div>

      {/* ── Testimonials ───────────────────────────────────────────────────── */}
      <Testimonials />

      {/* ── Pricing ────────────────────────────────────────────────────────── */}
      <Pricing />

      {/* ── Final CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl border border-white/10 bg-gradient-to-b from-slate-800/50 to-slate-900/50 relative overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl" />
              <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-violet-500/10 blur-2xl" />
            </div>
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Ready to land your dream role?</h2>
              <p className="text-slate-400 mb-8 text-lg">Join 12,000+ students who stopped applying blindly and started landing interviews.</p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold text-base hover:opacity-90 transition-all shadow-lg shadow-blue-500/25 hover:-translate-y-0.5"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-slate-600 text-xs mt-4">No credit card required · Free plan forever</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}