'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Shield } from 'lucide-react';

const sections = [
  { title: '1. Information We Collect', body: 'We collect information you provide directly — name, email, phone number, and resume data when you register. We also collect usage analytics to improve our services.' },
  { title: '2. How We Use Your Information', body: null, list: ['Provide AI-powered career intelligence services', 'Match you with relevant jobs and mentors', 'Analyse your resume and provide skill gap recommendations', 'Send important service notifications', 'Ensure platform security and prevent fraud'] },
  { title: '3. Data Storage & Security', body: 'Your data is stored in MongoDB Atlas with encryption at rest. Resume files are processed in memory and not stored permanently. JWT authentication with HttpOnly cookies protects your session. All communications use HTTPS.' },
  { title: '4. AI Processing', body: "Your resume text is sent to OpenAI's GPT-4o API for analysis, governed by OpenAI's data usage policies. We do not use your personal data to train AI models. Job matching uses vector embeddings stored in Qdrant." },
  { title: '5. Third-Party Services', body: 'We use: OpenAI (AI processing), MongoDB Atlas (database), Qdrant (vector search), Vercel (frontend hosting), Railway (backend hosting), Cloudflare (security). Each has its own privacy policy.' },
  { title: '6. Your Rights', body: 'You have the right to access, correct, or delete your personal data at any time. Contact us at mishramanjeet26@gmail.com. We will respond within 30 days.' },
  { title: '7. Data Retention', body: 'We retain your account data for as long as your account is active. You may request deletion at any time by contacting us.' },
  { title: '8. Contact', body: null, contact: 'mishramanjeet26@gmail.com' },
];

export default function PrivacyPage() {
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold">Privacy Policy</h1>
            <p className="text-slate-500 text-sm mt-0.5">Last updated: April 2026 · S3 Dashboard</p>
          </div>
        </motion.div>

        <div className="space-y-4">
          {sections.map((s, i) => (
            <motion.div key={s.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.5 }}
              className="p-6 rounded-2xl border border-white/5 bg-slate-900/60 hover:border-white/10 transition-colors">
              <h2 className="text-base font-bold text-white mb-3">{s.title}</h2>
              {s.body && <p className="text-sm text-slate-400 leading-relaxed">{s.body}</p>}
              {s.list && (
                <ul className="space-y-1.5">
                  {s.list.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {s.contact && (
                <p className="text-sm text-slate-400">For privacy questions, contact us at{' '}
                  <a href={`mailto:${s.contact}`} className="text-blue-400 hover:underline">{s.contact}</a>
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}