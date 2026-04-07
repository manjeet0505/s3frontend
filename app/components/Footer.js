'use client';

import { motion } from 'framer-motion';
import { Sparkles, Shield, FileText, Cookie, Mail, Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

const footerLinks = {
  Product: [
    { label: 'Overview', href: '/dashboard' },
    { label: 'Resume Analysis', href: '/dashboard/resume' },
    { label: 'Job Matches', href: '/dashboard/jobs' },
    { label: 'Mentor Connect', href: '/dashboard/mentors' },
    { label: 'Skill Gap', href: '/dashboard/skills' },
  ],
  Company: [
    { label: 'About LilByte', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Blog', href: '/blog' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

const socials = [
  {
    icon: Github,
    href: 'https://github.com/manjeet0505',
    label: 'GitHub',
  },
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/manjeet-mishra-175705260',
    label: 'LinkedIn',
  },
  {
    icon: Twitter,
    href: 'https://x.com/mishramanjeet26',
    label: 'Twitter / X',
  },
  {
    icon: Mail,
    href: 'mailto:lilbyteorg@gmail.com',
    label: 'Email',
  },
];

const techStack = ['FastAPI', 'Next.js 14', 'GPT-4o', 'Qdrant', 'MongoDB'];

export default function Footer() {
  return (
    <footer className="relative border-t border-border/40 bg-card/30 backdrop-blur-sm">
      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* LilByte brand */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                A product by
              </span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-black text-xl text-foreground tracking-tight">
                Lil<span className="text-primary">Byte</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold">
                Startup
              </span>
            </div>

            {/* S3 Dashboard sub-brand */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-base text-foreground">S3 Dashboard</span>
              <span className="text-xs text-muted-foreground">by LilByte</span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-5">
              AI-powered career intelligence platform helping students land their dream roles faster
              with resume analysis, smart job matching, and expert mentorship.
            </p>

            {/* Tech stack badges */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {techStack.map(tech => (
                <span
                  key={tech}
                  className="text-xs px-2 py-0.5 rounded-md bg-primary/8 border border-primary/15 text-primary/80 font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  className="w-8 h-8 rounded-lg border border-border/60 bg-secondary/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                  aria-label={label}
                  title={label}
                >
                  <Icon className="w-3.5 h-3.5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact emails row */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 rounded-2xl border border-border/30 bg-secondary/20">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="text-xs text-muted-foreground">General:</span>
            <a
              href="mailto:lilbyteorg@gmail.com"
              className="text-xs text-primary hover:underline font-medium"
            >
              lilbyteorg@gmail.com
            </a>
          </div>
          <div className="w-px h-4 bg-border/40 hidden sm:block self-center" />
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Founder:</span>
            <a
              href="mailto:mishramanjeet26@gmail.com"
              className="text-xs text-foreground hover:text-primary transition-colors font-medium"
            >
              mishramanjeet26@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/40 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()}{' '}
              <span className="font-semibold text-foreground">LilByte</span>.
              {' '}S3 Dashboard — All rights reserved. Built by{' '}
              <a
                href="https://www.linkedin.com/in/manjeet-mishra-175705260"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Manjeet Kumar Mishra
              </a>
              .
            </p>

            <div className="flex items-center gap-4">
              <Link href="/privacy" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Shield className="w-3 h-3" />
                Privacy
              </Link>
              <Link href="/terms" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <FileText className="w-3 h-3" />
                Terms
              </Link>
              <Link href="/cookies" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Cookie className="w-3 h-3" />
                Cookies
              </Link>
              <Link href="/contact" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-3 h-3" />
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}