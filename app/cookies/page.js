import Link from 'next/link';
import { Sparkles, Cookie } from 'lucide-react';

export const metadata = {
  title: 'Cookie Policy — S3 Dashboard by LilByte',
  description: 'Cookie Policy for S3 Dashboard, a product by LilByte.',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">S3 Dashboard</span>
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-14">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Cookie className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cookie Policy</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Last updated: April 2026 · S3 Dashboard by LilByte
            </p>
          </div>
        </div>

        <div className="space-y-6 text-muted-foreground">

          <section className="p-6 rounded-2xl border border-border/30 bg-card/40">
            <h2 className="text-lg font-bold text-foreground mb-3">What Are Cookies?</h2>
            <p className="text-sm leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. They help the
              website remember your preferences, keep you logged in, and improve your experience.
              S3 Dashboard uses a minimal set of cookies strictly necessary for the platform to function.
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-border/30 bg-card/40">
            <h2 className="text-lg font-bold text-foreground mb-4">Cookies We Use</h2>

            {/* Cookie table */}
            <div className="space-y-3">
              {[
                {
                  name: 'authToken',
                  type: 'Essential',
                  purpose: 'Keeps you logged in across browser sessions. Contains your JWT authentication token.',
                  duration: '7 days',
                  color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                },
                {
                  name: 'theme',
                  type: 'Preference',
                  purpose: 'Remembers your dark/light mode preference.',
                  duration: '1 year',
                  color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                },
                {
                  name: 'cookie-consent',
                  type: 'Essential',
                  purpose: 'Stores your cookie consent decision so we don\'t ask again.',
                  duration: '1 year',
                  color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                },
              ].map(cookie => (
                <div key={cookie.name} className="p-4 rounded-xl border border-border/30 bg-secondary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-xs px-2 py-0.5 rounded bg-secondary/60 text-foreground font-mono">
                      {cookie.name}
                    </code>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${cookie.color}`}>
                      {cookie.type}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      Expires: {cookie.duration}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{cookie.purpose}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="p-6 rounded-2xl border border-border/30 bg-card/40">
            <h2 className="text-lg font-bold text-foreground mb-3">What We Do NOT Use</h2>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>We do not use advertising or tracking cookies</li>
              <li>We do not use third-party analytics cookies (e.g. Google Analytics)</li>
              <li>We do not sell cookie data to third parties</li>
              <li>We do not use cross-site tracking cookies</li>
              <li>We do not use fingerprinting or behavioral profiling</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl border border-border/30 bg-card/40">
            <h2 className="text-lg font-bold text-foreground mb-3">localStorage Usage</h2>
            <p className="text-sm leading-relaxed mb-3">
              In addition to cookies, S3 Dashboard uses your browser's localStorage for:
            </p>
            <div className="space-y-2">
              {[
                { key: 'authToken', use: 'Your authentication token for API calls' },
                { key: 'theme', use: 'Your dark/light mode preference' },
              ].map(item => (
                <div key={item.key} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/20">
                  <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded flex-shrink-0">
                    {item.key}
                  </code>
                  <p className="text-xs text-muted-foreground">{item.use}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="p-6 rounded-2xl border border-border/30 bg-card/40">
            <h2 className="text-lg font-bold text-foreground mb-3">Managing Cookies</h2>
            <p className="text-sm leading-relaxed mb-3">
              You can control cookies through your browser settings. Note that disabling essential
              cookies will prevent you from logging in and using the platform.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { browser: 'Chrome', url: 'chrome://settings/cookies' },
                { browser: 'Firefox', url: 'about:preferences#privacy' },
                { browser: 'Safari', url: 'Preferences → Privacy' },
                { browser: 'Edge', url: 'edge://settings/cookies' },
              ].map(b => (
                <div key={b.browser} className="p-3 rounded-lg border border-border/30 bg-secondary/20">
                  <p className="font-medium text-foreground text-xs mb-0.5">{b.browser}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">{b.url}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="p-6 rounded-2xl border border-border/30 bg-card/40">
            <h2 className="text-lg font-bold text-foreground mb-3">Contact</h2>
            <p className="text-sm leading-relaxed">
              Questions about our cookie use? Contact us at{' '}
              <a href="mailto:lilbyteorg@gmail.com" className="text-primary hover:underline">
                lilbyteorg@gmail.com
              </a>
              .
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}