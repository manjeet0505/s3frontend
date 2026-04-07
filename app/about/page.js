import Link from 'next/link';
import { Sparkles, Zap, Users, Target, Heart, Code2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About LilByte — The Startup Behind S3 Dashboard',
  description: 'LilByte is a student-founded startup building AI-powered tools to help students accelerate their careers.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">S3 Dashboard</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">by LilByte</span>
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-14">

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            Student-Founded Startup
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight">
            About <span className="text-primary">LilByte</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're building AI-powered tools that help students stop guessing and start growing —
            from resume to job offer, smarter and faster.
          </p>
        </div>

        {/* Story */}
        <div className="p-8 rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Our Story</h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              LilByte was founded by <strong className="text-foreground">Manjeet Kumar Mishra</strong>,
              a student who experienced firsthand how hard it is to navigate the job market without the right guidance —
              endless applications, no feedback, and no clear path forward.
            </p>
            <p>
              The idea was simple: what if AI could act as a career co-pilot for every student?
              Not just a resume checker, but a full intelligence system that understands your skills,
              finds your best-fit jobs, connects you with the right mentors, and tells you exactly what to learn next.
            </p>
            <p>
              <strong className="text-foreground">S3 Dashboard</strong> is our first product —
              a student success platform built on FastAPI, Next.js, GPT-4o, and Qdrant vector search.
              It's more than a tool. It's a career co-pilot.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {[
            {
              icon: Target,
              title: 'Student-First',
              desc: 'Everything we build is designed for students — affordable, accessible, and genuinely useful.',
              color: 'text-blue-400',
              bg: 'bg-blue-500/10 border-blue-500/20',
            },
            {
              icon: Code2,
              title: 'AI-Native',
              desc: 'We don\'t bolt AI onto existing tools. We build from the ground up with intelligence at the core.',
              color: 'text-violet-400',
              bg: 'bg-violet-500/10 border-violet-500/20',
            },
            {
              icon: Users,
              title: 'Community-Driven',
              desc: 'Real students, real mentors, real feedback. We build what the community actually needs.',
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/20',
            },
          ].map(v => (
            <div key={v.title} className={`p-5 rounded-2xl border ${v.bg}`}>
              <v.icon className={`w-6 h-6 ${v.color} mb-3`} />
              <h3 className="font-bold text-foreground mb-1.5">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Founder */}
        <div className="p-8 rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
          <h2 className="text-xl font-bold text-foreground mb-6">The Founder</h2>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-lg shadow-blue-500/25">
              M
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">Manjeet Kumar Mishra</h3>
              <p className="text-primary text-sm font-medium mb-3">Founder & Developer — LilByte</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Full-stack developer and AI enthusiast building tools that actually solve problems for students.
                Passionate about making career intelligence accessible to everyone, not just those with connections.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://www.linkedin.com/in/manjeet-mishra-175705260"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-secondary/30 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                >
                  LinkedIn ↗
                </a>
                <a
                  href="https://x.com/mishramanjeet26"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-secondary/30 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                >
                  Twitter / X ↗
                </a>
                <a
                  href="https://github.com/manjeet0505"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-secondary/30 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                >
                  GitHub ↗
                </a>
                <a
                  href="mailto:mishramanjeet26@gmail.com"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-secondary/30 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                >
                  Email ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* What we're building */}
        <div className="p-8 rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm mb-8">
          <h2 className="text-xl font-bold text-foreground mb-5">What We're Building</h2>
          <div className="space-y-3">
            {[
              { name: 'S3 Dashboard', status: 'Live', desc: 'AI career intelligence platform for students', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
              { name: 'LilByte API', status: 'Coming Soon', desc: 'Career intelligence API for developers and institutions', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
              { name: 'LilByte Mobile', status: 'Planned', desc: 'Native mobile app for on-the-go career tracking', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
            ].map(p => (
              <div key={p.name} className="flex items-center gap-4 p-4 rounded-xl border border-border/30 bg-secondary/20">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-foreground text-sm">{p.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${p.color}`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-10 rounded-3xl border border-primary/20 bg-primary/5">
          <h2 className="text-2xl font-bold text-foreground mb-3">Want to collaborate or invest?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            We're always open to partnerships, feedback, and conversations with people who want to make
            career intelligence accessible to every student.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href="mailto:lilbyteorg@gmail.com"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/25"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
            >
              Contact Page
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}