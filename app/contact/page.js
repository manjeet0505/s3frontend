import Link from 'next/link';
import { Sparkles, Mail, Github, Linkedin, Twitter, MessageSquare, Clock, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Contact — S3 Dashboard by LilByte',
  description: 'Get in touch with the LilByte team.',
};

export default function ContactPage() {
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

      <main className="max-w-3xl mx-auto px-6 py-14">

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-5">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Get in Touch</h1>
          <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
            Whether you have a question, a bug report, a partnership idea, or just want to say hi —
            we'd love to hear from you.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* General */}
          <div className="p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">General Enquiries</p>
                <p className="text-[10px] text-muted-foreground">LilByte Team</p>
              </div>
            </div>
            <a
              href="mailto:lilbyteorg@gmail.com"
              className="text-sm text-primary hover:underline font-medium block mb-2"
            >
              lilbyteorg@gmail.com
            </a>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              Response within 24–48 hours
            </div>
          </div>

          {/* Founder */}
          <div className="p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Mail className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Founder Direct</p>
                <p className="text-[10px] text-muted-foreground">Manjeet Kumar Mishra</p>
              </div>
            </div>
            <a
              href="mailto:mishramanjeet26@gmail.com"
              className="text-sm text-violet-400 hover:underline font-medium block mb-2"
            >
              mishramanjeet26@gmail.com
            </a>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              Best for partnerships & feedback
            </div>
          </div>
        </div>

        {/* Social links */}
        <div className="p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm mb-8">
          <h2 className="text-sm font-bold text-foreground mb-4">Find Us Online</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                icon: Github,
                label: 'GitHub',
                sub: '@manjeet0505',
                href: 'https://github.com/manjeet0505',
                color: 'hover:border-foreground/40',
              },
              {
                icon: Linkedin,
                label: 'LinkedIn',
                sub: 'Manjeet Mishra',
                href: 'https://www.linkedin.com/in/manjeet-mishra-175705260',
                color: 'hover:border-blue-500/40',
              },
              {
                icon: Twitter,
                label: 'Twitter / X',
                sub: '@mishramanjeet26',
                href: 'https://x.com/mishramanjeet26',
                color: 'hover:border-sky-500/40',
              },
              {
                icon: Mail,
                label: 'Email',
                sub: 'lilbyteorg@gmail.com',
                href: 'mailto:lilbyteorg@gmail.com',
                color: 'hover:border-primary/40',
              },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-border/40 bg-secondary/20 text-center transition-all ${s.color} hover:bg-secondary/40`}
              >
                <s.icon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs font-semibold text-foreground">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[90px]">{s.sub}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Use cases */}
        <div className="p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm mb-8">
          <h2 className="text-sm font-bold text-foreground mb-4">What to Contact Us For</h2>
          <div className="space-y-2.5">
            {[
              { label: 'Bug reports', desc: 'Something broken? Tell us exactly what happened.' },
              { label: 'Feature requests', desc: 'Have an idea to make S3 Dashboard better?' },
              { label: 'Mentor applications', desc: 'Want to become a mentor on the platform?' },
              { label: 'Partnership & investment', desc: 'Interested in collaborating with LilByte?' },
              { label: 'Press & media', desc: 'Writing about S3 Dashboard or LilByte?' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg border border-border/20 bg-secondary/20">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="mailto:lilbyteorg@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/25"
          >
            Send us an Email
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </main>
    </div>
  );
}