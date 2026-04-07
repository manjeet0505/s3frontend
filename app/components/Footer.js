'use client';

import { motion } from 'framer-motion';
import { Sparkles, Github, Linkedin, Twitter, Mail, Shield, FileText, Cookie, Phone } from 'lucide-react';
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
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '/blog' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

const socials = [
  { icon: Github, href: 'https://github.com/manjeet0505', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/manjeet-mishra', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Mail, href: 'mailto:mishramanjeet26@gmail.com', label: 'Email' },
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
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-foreground">S3 Dashboard</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-5">
              AI-powered career intelligence platform helping students land their dream roles faster with resume analysis, job matching, and expert mentorship.
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
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  className="w-8 h-8 rounded-lg border border-border/60 bg-secondary/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                  aria-label={label}
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

        {/* Divider */}
        <div className="border-t border-border/40 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} S3 Dashboard by{' '}
              <a
                href="https://linkedin.com/in/manjeet-mishra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Manjeet Kumar Mishra
              </a>
              . All rights reserved.
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
              <a href="mailto:mishramanjeet26@gmail.com" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-3 h-3" />
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}