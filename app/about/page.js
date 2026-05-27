'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Zap, Users, Target, Heart, Code2, ArrowRight, Github, Linkedin, Twitter, Mail, Brain } from 'lucide-react';

export default function AboutPage() {
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white">S3 Dashboard</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/20 font-semibold">BETA</span>
          </Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">

        {/* Hero */}
        <motion.div {...fadeUp()} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs text-blue-300 font-medium mb-6">
            <Zap className="w-3 h-3" /> Student-Built · AI-Powered
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-5 leading-tight">
            About{' '}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              S3 Dashboard
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            An AI career intelligence platform built by a student, for students — because landing your dream role
            shouldn't depend on who you know.
          </p>
        </motion.div>

        {/* Story */}
        <motion.div {...fadeUp(0.1)} className="relative p-8 rounded-3xl border border-white/5 bg-slate-900/60 mb-8 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Heart className="w-4 h-4 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold">The Story</h2>
          </div>
          <div className="space-y-4 text-slate-400 leading-relaxed relative">
            <p>
              S3 Dashboard was built by <strong className="text-white">Manjeet Kumar Mishra</strong>, a final-year
              CS student at MDU who experienced firsthand how broken the job search process is — hundreds of
              applications, zero feedback, and no clear path forward.
            </p>
            <p>
              The idea: what if AI could act as a career co-pilot for every student? Not just a resume checker —
              a full intelligence system that scores your resume, matches you to 2.4M+ jobs via vector search,
              maps your skill gaps with a personalised roadmap, optimises your LinkedIn, and connects you with
              mentors at your target companies.
            </p>
            <p>
              Built on <strong className="text-white">Next.js 14, FastAPI, GPT-4o, Qdrant, and MongoDB</strong> —
              published IEEE research (ICAICS-26) backing the architecture. This is what S3 stands for:
              <strong className="text-white"> Student Success System</strong>.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <div className="grid sm:grid-cols-3 gap-5 mb-8">
          {[
            { icon: Target, title: 'Student-First', desc: 'Everything is designed for students — affordable, accessible, genuinely useful.', color: 'from-blue-500 to-cyan-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5' },
            { icon: Code2, title: 'AI-Native', desc: "Not AI bolted on. Built from the ground up with intelligence at the core using GPT-4o + vector search.", color: 'from-violet-500 to-purple-400', border: 'border-violet-500/20', bg: 'bg-violet-500/5' },
            { icon: Users, title: 'Community-Driven', desc: 'Real students, real mentors, real feedback. Built on what the community actually needs.', color: 'from-emerald-500 to-teal-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
          ].map((v, i) => (
            <motion.div key={v.title} {...fadeUp(i * 0.1)} className={`p-6 rounded-2xl border ${v.border} ${v.bg}`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-4`}>
                <v.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">{v.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Founder */}
        <motion.div {...fadeUp(0.1)} className="relative p-8 rounded-3xl border border-white/5 bg-slate-900/60 mb-8 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          <h2 className="text-xl font-bold mb-6">The Builder</h2>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-lg shadow-blue-500/20">
              M
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Manjeet Kumar Mishra</h3>
              <p className="text-blue-400 text-sm font-medium mb-1">Founder & Full-Stack AI Engineer</p>
              <p className="text-xs text-slate-500 mb-3">University Rank 1 · MDU · IEEE Published · CGPA 8.0</p>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Building S3 Dashboard while preparing for SDE-1 and AI Engineer roles. Published IEEE research on
                LLM-based chatbot architecture (ICAICS-26). Passionate about making career intelligence accessible
                to every student, not just those with connections.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/manjeet-mishra-175705260' },
                  { icon: Twitter,  label: 'Twitter/X', href: 'https://x.com/mishramanjeet26' },
                  { icon: Github,   label: 'GitHub',   href: 'https://github.com/manjeet0505' },
                  { icon: Mail,     label: 'Email',    href: 'mailto:mishramanjeet26@gmail.com' },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-slate-400 hover:text-white hover:border-white/20 transition-all">
                    <s.icon className="w-3 h-3" /> {s.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Platform features */}
        <motion.div {...fadeUp(0.1)} className="p-8 rounded-3xl border border-white/5 bg-slate-900/60 mb-8">
          <h2 className="text-xl font-bold mb-5">What S3 Dashboard Does</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { name: 'Resume Scorer', status: 'Live', desc: 'Multi-pass ATS scoring + full AI rewrite', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
              { name: 'Job Matcher', status: 'Live', desc: 'Vector search across 2.4M+ jobs by fit score', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
              { name: 'Skill Gap AI', status: 'Live', desc: 'Personalised learning roadmap with resources', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
              { name: 'LinkedIn Optimizer', status: 'Live', desc: 'Triple-pass profile rewrite + keyword injection', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
              { name: 'Mock Interview', status: 'Live', desc: 'Role-specific Q&A with AI feedback + scoring', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
              { name: 'Mentor Connect', status: 'Live', desc: 'Match with senior engineers at target companies', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
            ].map(p => (
              <div key={p.name} className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-white text-sm">{p.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${p.color}`}>{p.status}</span>
                  </div>
                  <p className="text-xs text-slate-500">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeUp(0.1)} className="text-center p-10 rounded-3xl border border-white/5 bg-gradient-to-b from-slate-800/50 to-slate-900/50 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500/8 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-violet-500/8 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-2xl font-bold mb-3">Want to collaborate or give feedback?</h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm">
              Always open to partnerships, feedback, and conversations with people who want to make
              career intelligence accessible to every student.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a href="mailto:mishramanjeet26@gmail.com"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-blue-500/20">
                Get in Touch <ArrowRight className="w-4 h-4" />
              </a>
              <Link href="/contact"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
                Contact Page
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}