'use client';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Frontend Engineer @ Razorpay',
    avatar: 'PS',
    color: 'from-blue-500 to-cyan-400',
    stars: 5,
    text: "S3 Dashboard rewrote my resume and bumped my ATS score from 54 to 91. Got 3 interview calls within a week of applying. The LinkedIn optimizer alone is worth it — my profile views tripled.",
    tag: 'Resume + LinkedIn',
  },
  {
    name: 'Arjun Mehta',
    role: 'SDE-1 @ Zerodha',
    avatar: 'AM',
    color: 'from-violet-500 to-purple-400',
    stars: 5,
    text: "The job matching is insane. I was applying to 50+ jobs manually and getting zero calls. S3 matched me to roles actually matching my stack and I had an offer in 3 weeks. System design mock interviews helped a ton.",
    tag: 'Job Matching',
  },
  {
    name: 'Neha Gupta',
    role: 'AI Engineer @ CRED',
    avatar: 'NG',
    color: 'from-emerald-500 to-teal-400',
    stars: 5,
    text: "The skill gap analyser told me exactly what to learn for AI Engineer roles. LangChain, LangGraph, Vector DBs — with curated resources and a 6-week roadmap. Followed it and cracked my dream role.",
    tag: 'Skill Gap AI',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-500 mb-4"
          >
            Student stories
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            Real students.{' '}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Real offers.
            </span>
          </motion.h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="relative p-6 rounded-2xl bg-slate-900/70 border border-white/5 hover:border-white/10 transition-colors group overflow-hidden"
            >
              {/* Gradient corner */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${t.color} opacity-10 rounded-bl-3xl`} />

              {/* Quote icon */}
              <Quote className="w-6 h-6 text-white/10 mb-4" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-slate-300 text-sm leading-relaxed mb-6">"{t.text}"</p>

              {/* Tag */}
              <span className={`inline-block text-xs px-2.5 py-1 rounded-full bg-gradient-to-r ${t.color} bg-opacity-10 text-white/60 border border-white/10 mb-6`}>
                {t.tag}
              </span>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                  <span className="text-xs font-bold text-white">{t.avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-500 text-sm">
            Join <span className="text-white font-semibold">12,000+</span> students who landed offers with S3 Dashboard
          </p>
        </motion.div>
      </div>
    </section>
  );
}