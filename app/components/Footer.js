'use client';
import { motion } from 'framer-motion';
import { Sparkles, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import Link from 'next/link';

const product = [
  { label: 'Resume Scorer',      href: '/dashboard/resume' },
  { label: 'Job Matcher',        href: '/dashboard/jobs' },
  { label: 'Skill Gap AI',       href: '/dashboard/skills' },
  { label: 'Mock Interview',     href: '/dashboard/interview' },
  { label: 'LinkedIn Optimizer', href: '/dashboard/linkedin' },
  { label: 'Mentor Connect',     href: '/dashboard/mentors' },
];

const company = [
  { label: 'About',   href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const legal = [
  { label: 'Privacy Policy',   href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy',    href: '/cookies' },
];

const socials = [
  { icon: Github,   href: 'https://github.com/manjeet0505',                          label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/manjeet-mishra-175705260',    label: 'LinkedIn' },
  { icon: Twitter,  href: 'https://x.com/mishramanjeet26',                           label: 'Twitter' },
  { icon: Mail,     href: 'mailto:mishramanjeet26@gmail.com',                        label: 'Email' },
];

const tech = ['Next.js 14', 'FastAPI', 'GPT-4o', 'Qdrant', 'MongoDB'];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-slate-950 overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 pt-14 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3 group w-fit">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 opacity-0 group-hover:opacity-60 blur transition-opacity duration-300" />
                <Sparkles className="relative w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-sm">S3 Dashboard</span>
                <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/20 font-semibold align-middle">BETA</span>
              </div>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed mb-5 max-w-[200px]">
              AI-powered career intelligence. Resume to offer letter, faster.
            </p>
            {/* Tech badges */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {tech.map(t => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.06] bg-white/[0.03] text-slate-500">{t}</span>
              ))}
            </div>
            {/* Socials */}
            <div className="flex gap-2">
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-8 h-8 rounded-lg border border-white/[0.06] bg-white/[0.03] flex items-center justify-center text-slate-500 hover:text-white hover:border-white/20 hover:bg-white/[0.07] transition-all">
                  <s.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-4">Product</p>
            <ul className="space-y-2.5">
              {product.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-slate-500 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-4">Company</p>
            <ul className="space-y-2.5">
              {company.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-slate-500 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-4">Legal</p>
            <ul className="space-y-2.5">
              {legal.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-slate-500 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            © 2026 <strong className="text-slate-500">S3 Dashboard</strong> — All rights reserved. Built by{' '}
            <a href="https://www.linkedin.com/in/manjeet-mishra-175705260" target="_blank" rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 transition-colors">Manjeet Kumar Mishra</a>.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <Link href="/privacy"  className="hover:text-slate-400 transition-colors">Privacy</Link>
            <Link href="/terms"    className="hover:text-slate-400 transition-colors">Terms</Link>
            <Link href="/cookies"  className="hover:text-slate-400 transition-colors">Cookies</Link>
            <Link href="/contact"  className="hover:text-slate-400 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}