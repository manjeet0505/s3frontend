'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, FileText } from 'lucide-react';

const sections = [
  { title: '1. Acceptance of Terms', body: 'By accessing or using S3 Dashboard ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service. These terms apply to all users including students, mentors, and visitors.' },
  { title: '2. Description of Service', body: null, list: ['Resume parsing and AI-generated profile analysis', 'AI-powered job matching using vector search technology', 'Mentor matching and session booking', 'Skill gap analysis and learning recommendations', 'LinkedIn profile optimisation and rewriting', 'Mock interview practice with AI feedback'], note: 'The Service is in active development. Features may change, be added, or removed at any time.' },
  { title: '3. User Accounts', body: null, list: ['You must provide accurate, complete, and current information when creating an account.', 'You are responsible for maintaining the confidentiality of your credentials.', 'You may not share your account or create accounts on behalf of others.', 'You must be at least 16 years of age to use this Service.', 'S3 Dashboard reserves the right to suspend or terminate accounts that violate these terms.'] },
  { title: '4. Acceptable Use', body: 'You agree not to: upload false or fraudulent resume information, impersonate any person, use the Service for unlawful purposes, attempt unauthorised access to our systems, scrape or systematically extract data, transmit spam or malware, or harass other users including mentors and students.' },
  { title: '5. Mentor and Student Responsibilities', body: 'Mentors agree to provide honest, professional guidance and to honour confirmed session commitments. Mentors are independent contributors, not employees of S3 Dashboard. Students agree to treat mentors respectfully and attend confirmed sessions. Repeated no-shows may result in account restrictions.' },
  { title: '6. AI-Generated Content Disclaimer', body: 'S3 Dashboard uses AI to generate career recommendations, job matches, skill assessments, and interview feedback. This content is for informational purposes only. S3 Dashboard does not guarantee the accuracy or suitability of AI-generated recommendations. AI outputs are not professional career counselling advice.' },
  { title: '7. Intellectual Property', body: 'All content, features, and functionality of S3 Dashboard are protected by applicable intellectual property laws. You retain ownership of your resume and personal data. By uploading your resume, you grant S3 Dashboard a limited licence to process it solely for providing the Service to you.' },
  { title: '8. Limitation of Liability', body: 'S3 Dashboard is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service, including loss of employment opportunities or data. Our total liability shall not exceed the amount you paid in the past 12 months.' },
  { title: '9. Changes to Terms', body: 'S3 Dashboard reserves the right to modify these Terms at any time. We will notify users of material changes via email or in-app notice. Continued use after changes constitutes your acceptance of the updated Terms.' },
  { title: '10. Contact', body: null, contact: 'mishramanjeet26@gmail.com' },
];

export default function TermsPage() {
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold">Terms of Service</h1>
            <p className="text-slate-500 text-sm mt-0.5">Last updated: April 2026 · S3 Dashboard</p>
          </div>
        </motion.div>

        <div className="space-y-4">
          {sections.map((s, i) => (
            <motion.div key={s.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.04, duration: 0.5 }}
              className="p-6 rounded-2xl border border-white/5 bg-slate-900/60 hover:border-white/10 transition-colors">
              <h2 className="text-base font-bold text-white mb-3">{s.title}</h2>
              {s.body && <p className="text-sm text-slate-400 leading-relaxed">{s.body}</p>}
              {s.list && (
                <ul className="space-y-1.5 mb-3">
                  {s.list.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {s.note && <p className="text-xs text-slate-500 mt-2 italic">{s.note}</p>}
              {s.contact && (
                <p className="text-sm text-slate-400">Questions about these Terms? Contact us at{' '}
                  <a href={`mailto:${s.contact}`} className="text-violet-400 hover:underline">{s.contact}</a>
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}