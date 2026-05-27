'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Cookie } from 'lucide-react';

const cookieData = [
  { name: 'authToken', type: 'Essential', purpose: 'Keeps you logged in. Contains your JWT authentication token.', duration: '7 days', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { name: 'theme', type: 'Preference', purpose: 'Remembers your dark/light mode preference.', duration: '1 year', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { name: 'cookie-consent', type: 'Essential', purpose: "Stores your cookie consent decision so we don't ask again.", duration: '1 year', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
];

export default function CookiesPage() {
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

      <main className="max-w-4xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Cookie className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold">Cookie Policy</h1>
            <p className="text-slate-500 text-sm mt-0.5">Last updated: April 2026 · S3 Dashboard</p>
          </div>
        </motion.div>

        <div className="space-y-4">
          {/* What are cookies */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="p-6 rounded-2xl border border-white/5 bg-slate-900/60 hover:border-white/10 transition-colors">
            <h2 className="text-base font-bold text-white mb-3">What Are Cookies?</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. They help the site
              remember your preferences, keep you logged in, and improve your experience. S3 Dashboard uses
              a minimal set of cookies — strictly necessary for the platform to function.
            </p>
          </motion.div>

          {/* Cookie table */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
            className="p-6 rounded-2xl border border-white/5 bg-slate-900/60 hover:border-white/10 transition-colors">
            <h2 className="text-base font-bold text-white mb-4">Cookies We Use</h2>
            <div className="space-y-3">
              {cookieData.map(cookie => (
                <div key={cookie.name} className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.02]">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <code className="text-xs px-2 py-0.5 rounded bg-white/5 text-white font-mono">{cookie.name}</code>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${cookie.color}`}>{cookie.type}</span>
                    <span className="text-xs text-slate-500 ml-auto">Expires: {cookie.duration}</span>
                  </div>
                  <p className="text-xs text-slate-400">{cookie.purpose}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* What we don't use */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl border border-white/5 bg-slate-900/60 hover:border-white/10 transition-colors">
            <h2 className="text-base font-bold text-white mb-3">What We Do NOT Use</h2>
            <ul className="space-y-2">
              {['Advertising or tracking cookies', 'Third-party analytics cookies (e.g. Google Analytics)', 'Cross-site tracking cookies', 'Fingerprinting or behavioural profiling', 'We do not sell cookie data to third parties'].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* localStorage */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            className="p-6 rounded-2xl border border-white/5 bg-slate-900/60 hover:border-white/10 transition-colors">
            <h2 className="text-base font-bold text-white mb-3">localStorage Usage</h2>
            <p className="text-sm text-slate-400 mb-3">In addition to cookies, S3 Dashboard uses localStorage for:</p>
            <div className="space-y-2">
              {[{ key: 'authToken', use: 'Your authentication token for API calls' }, { key: 'theme', use: 'Your dark/light mode preference' }].map(item => (
                <div key={item.key} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <code className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded flex-shrink-0">{item.key}</code>
                  <p className="text-xs text-slate-400">{item.use}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Managing cookies */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl border border-white/5 bg-slate-900/60 hover:border-white/10 transition-colors">
            <h2 className="text-base font-bold text-white mb-3">Managing Cookies</h2>
            <p className="text-sm text-slate-400 mb-3">Control cookies through your browser settings. Note: disabling essential cookies prevents login.</p>
            <div className="grid grid-cols-2 gap-3">
              {[{ browser: 'Chrome', url: 'chrome://settings/cookies' }, { browser: 'Firefox', url: 'about:preferences#privacy' }, { browser: 'Safari', url: 'Preferences → Privacy' }, { browser: 'Edge', url: 'edge://settings/cookies' }].map(b => (
                <div key={b.browser} className="p-3 rounded-lg border border-white/[0.04] bg-white/[0.02]">
                  <p className="font-medium text-white text-xs mb-0.5">{b.browser}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{b.url}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }}
            className="p-6 rounded-2xl border border-white/5 bg-slate-900/60 hover:border-white/10 transition-colors">
            <h2 className="text-base font-bold text-white mb-3">Contact</h2>
            <p className="text-sm text-slate-400">Questions about our cookie use? Contact us at{' '}
              <a href="mailto:mishramanjeet26@gmail.com" className="text-amber-400 hover:underline">mishramanjeet26@gmail.com</a>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}