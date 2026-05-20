'use client';

import { motion } from 'framer-motion';
import { Sparkles, Shield, FileText, Cookie, Mail, Github, Linkedin, Twitter, Zap } from 'lucide-react';
import Link from 'next/link';

const footerLinks = {
  Product: [
    { label: 'Overview',            href: '/dashboard' },
    { label: 'Resume Analysis',     href: '/dashboard/resume' },
    { label: 'Job Matches',         href: '/dashboard/jobs' },
    { label: 'Mentor Connect',      href: '/dashboard/mentors' },
    { label: 'Skill Gap',           href: '/dashboard/skills' },
    { label: 'LinkedIn Optimizer',  href: '/dashboard/linkedin' },
  ],
  Company: [
    { label: 'About',      href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Blog',       href: '/blog' },
  ],
  Legal: [
    { label: 'Privacy Policy',   href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy',    href: '/cookies' },
  ],
};

const socials = [
  { icon: Github,   href: 'https://github.com/manjeet0505',                       label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/manjeet-mishra-175705260', label: 'LinkedIn' },
  { icon: Twitter,  href: 'https://x.com/mishramanjeet26',                        label: 'Twitter / X' },
  { icon: Mail,     href: 'mailto:mishramanjeet26@gmail.com',                     label: 'Email' },
];

const techStack = ['FastAPI', 'Next.js 14', 'GPT-4o', 'Qdrant', 'MongoDB'];

export default function Footer() {
  return (
    <footer className="relative border-t border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden">

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/3 w-80 h-80 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,1), transparent 70%)' }} />
        <div className="absolute top-0 right-1/4 w-56 h-56 rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,1), transparent 70%)' }} />
      </div>

      {/* Top gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.6), rgba(139,92,246,0.4), transparent)' }} />

      <div className="relative max-w-6xl mx-auto px-6">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-14 border-b border-border/30">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-blue-500/20 animate-ping" style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl text-foreground tracking-tight leading-none">
                    S3 <span className="text-primary">Dashboard</span>
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold">Beta</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" /> AI-powered career intelligence
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-5">
              Helping students land their dream roles faster — with resume analysis,
              smart job matching, skill gap insights, and expert mentorship.
            </p>

            {/* Tech badges */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {techStack.map(tech => (
                <span key={tech} className="text-xs px-2.5 py-1 rounded-lg border font-medium"
                  style={{ background: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.15)', color: 'rgba(147,197,253,0.9)' }}>
                  {tech}
                </span>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.08 }} whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl border border-border/60 bg-secondary/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
                  aria-label={label}>
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="inline-block w-4 h-px"
                  style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.8), transparent)' }} />
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors group flex items-center gap-1.5">
                      <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-200 opacity-0 group-hover:opacity-100" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()}{' '}
              <span className="font-semibold text-foreground">S3 Dashboard</span>
              {' '}— All rights reserved. Built by{' '}
              <a href="https://www.linkedin.com/in/manjeet-mishra-175705260" target="_blank" rel="noopener noreferrer"
                className="text-primary hover:underline font-medium">
                Manjeet Kumar Mishra
              </a>.
            </p>
            <div className="flex items-center gap-4">
              {[
                { href: '/privacy', icon: Shield,  label: 'Privacy' },
                { href: '/terms',   icon: FileText, label: 'Terms' },
                { href: '/cookies', icon: Cookie,   label: 'Cookies' },
                { href: '/contact', icon: Mail,     label: 'Contact' },
              ].map(({ href, icon: Icon, label }) => (
                <Link key={label} href={href}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <Icon className="w-3 h-3" /> {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}