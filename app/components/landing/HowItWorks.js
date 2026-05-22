'use client';
import { motion } from 'framer-motion';
import { Upload, Cpu, Trophy } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Your Resume',
    description: 'Drop your PDF or paste your LinkedIn URL. Our parser extracts every section with 99% accuracy using GPT-4o.',
    tags: ['PDF / DOCX', 'LinkedIn import', 'Auto-parse'],
    color: 'from-blue-500 to-cyan-400',
    glow: 'shadow-blue-500/20',
  },
  {
    number: '02',
    icon: Cpu,
    title: 'AI Matches & Guides You',
    description: 'Five specialised AI agents activate — scoring your resume, matching 2.4M+ jobs, mapping skill gaps, and optimising your LinkedIn.',
    tags: ['5 AI agents', 'Real-time analysis', 'Personalised roadmap'],
    color: 'from-violet-500 to-purple-400',
    glow: 'shadow-violet-500/20',
  },
  {
    number: '03',
    icon: Trophy,
    title: 'Land Your Dream Role',
    description: 'Apply with a tailored resume, ace mock interviews, connect with mentors, and track every application in your Kanban board.',
    tags: ['1-click apply', 'Mock interviews', 'Mentor network'],
    color: 'from-emerald-500 to-teal-400',
    glow: 'shadow-emerald-500/20',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-500 mb-4"
          >
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            Three steps to your{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              next offer
            </span>
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line — desktop only */}
          <div className="hidden md:block absolute top-16 left-[16.5%] right-[16.5%] h-px">
            <div className="w-full h-full bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-emerald-500/30" />
            {/* Animated dot */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg"
              animate={{ left: ['0%', '100%', '0%'] }}
              transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Icon circle */}
                  <div className="relative mb-8">
                    {/* Glow ring */}
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`} />
                    <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl ${step.glow}`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    {/* Number badge — positioned outside the circle */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-slate-400">{step.number}</span>
                    </div>
                  </div>

                  {/* Card */}
                  <div className="w-full p-6 rounded-2xl bg-slate-900/60 border border-white/5 group-hover:border-white/10 transition-colors duration-300 hover:shadow-xl hover:-translate-y-1 transform transition-transform">
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-5">{step.description}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${step.color} bg-opacity-10 text-white/70 border border-white/10`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}