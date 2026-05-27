'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Mail, Github, Linkedin, Twitter, MessageSquare, Clock, ArrowRight, Zap } from 'lucide-react';

export default function ContactPage() {
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white">S3 Dashboard</span>
          </Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">← Back to Home</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">

        {/* Hero */}
        <motion.div {...fadeUp()} className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 mb-6 shadow-lg shadow-blue-500/20">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Get in <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
            Bug report, partnership idea, feedback, or just want to say hi — reach out directly.
          </p>
        </motion.div>

        {/* Email cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <motion.div {...fadeUp(0.1)} className="relative p-6 rounded-2xl border border-white/5 bg-slate-900/60 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">General Enquiries</p>
                <p className="text-[10px] text-slate-500">S3 Dashboard</p>
              </div>
            </div>
            <a href="mailto:mishramanjeet26@gmail.com" className="text-sm text-blue-400 hover:underline font-medium block mb-2">
              mishramanjeet26@gmail.com
            </a>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3 h-3" /> Response within 24–48 hours
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.15)} className="relative p-6 rounded-2xl border border-white/5 bg-slate-900/60 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Founder Direct</p>
                <p className="text-[10px] text-slate-500">Manjeet Kumar Mishra</p>
              </div>
            </div>
            <a href="mailto:mishramanjeet26@gmail.com" className="text-sm text-violet-400 hover:underline font-medium block mb-2">
              mishramanjeet26@gmail.com
            </a>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3 h-3" /> Best for partnerships & feedback
            </div>
          </motion.div>
        </div>

        {/* Socials */}
        <motion.div {...fadeUp(0.2)} className="p-6 rounded-2xl border border-white/5 bg-slate-900/60 mb-8">
          <h2 className="text-sm font-bold text-white mb-4">Find Us Online</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Github,   label: 'GitHub',     sub: '@manjeet0505',       href: 'https://github.com/manjeet0505',        hover: 'hover:border-white/20' },
              { icon: Linkedin, label: 'LinkedIn',   sub: 'Manjeet Mishra',     href: 'https://www.linkedin.com/in/manjeet-mishra-175705260', hover: 'hover:border-blue-500/40' },
              { icon: Twitter,  label: 'Twitter / X',sub: '@mishramanjeet26',   href: 'https://x.com/mishramanjeet26',         hover: 'hover:border-sky-500/40' },
              { icon: Mail,     label: 'Email',      sub: 'Drop a message',     href: 'mailto:mishramanjeet26@gmail.com',      hover: 'hover:border-violet-500/40' },
            ].map(s => (
              <a key={s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 bg-white/[0.02] text-center transition-all ${s.hover} hover:bg-white/[0.05]`}>
                <s.icon className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs font-semibold text-white">{s.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[90px]">{s.sub}</p>
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Use cases */}
        <motion.div {...fadeUp(0.25)} className="p-6 rounded-2xl border border-white/5 bg-slate-900/60 mb-8">
          <h2 className="text-sm font-bold text-white mb-4">What to Contact Us For</h2>
          <div className="space-y-2">
            {[
              { label: 'Bug reports', desc: "Something broken? Tell us exactly what happened." },
              { label: 'Feature requests', desc: 'Have an idea to make S3 Dashboard better?' },
              { label: 'Mentor applications', desc: 'Want to become a mentor on the platform?' },
              { label: 'Partnership & investment', desc: 'Interested in collaborating on S3 Dashboard?' },
              { label: 'Press & media', desc: 'Writing about S3 Dashboard or the project?' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.3)} className="text-center">
          <a href="mailto:mishramanjeet26@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-blue-500/20">
            Send a Message <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </main>
    </div>
  );
}