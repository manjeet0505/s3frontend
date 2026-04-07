import Link from 'next/link';
import { Sparkles, FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service — S3 Dashboard by LilByte',
  description: 'Terms of Service for S3 Dashboard, a product by LilByte.',
};

export default function TermsPage() {
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
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Last updated: April 2026 · S3 Dashboard by LilByte
            </p>
          </div>
        </div>

        <div className="space-y-8 text-muted-foreground">

          <section className="p-6 rounded-2xl border border-border/30 bg-card/40">
            <h2 className="text-lg font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p className="leading-relaxed text-sm">
              By accessing or using S3 Dashboard ("the Service"), a product of LilByte, you agree to be bound
              by these Terms of Service. If you do not agree to these terms, please do not use the Service.
              These terms apply to all users including students, mentors, and visitors.
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-border/30 bg-card/40">
            <h2 className="text-lg font-bold text-foreground mb-3">2. Description of Service</h2>
            <p className="leading-relaxed text-sm mb-3">
              S3 Dashboard is an AI-powered career intelligence platform that provides:
            </p>
            <ul className="space-y-1.5 text-sm list-disc list-inside">
              <li>Resume parsing and AI-generated profile analysis</li>
              <li>AI-powered job matching using vector search technology</li>
              <li>Mentor matching and session booking</li>
              <li>Skill gap analysis and learning recommendations</li>
              <li>Progress tracking for career development</li>
            </ul>
            <p className="leading-relaxed text-sm mt-3">
              The Service is currently in active development. Features may change, be added, or removed at any time.
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-border/30 bg-card/40">
            <h2 className="text-lg font-bold text-foreground mb-3">3. User Accounts</h2>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>You must provide accurate, complete, and current information when creating an account.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You may not share your account with others or create accounts on behalf of other individuals.</li>
              <li>You must be at least 16 years of age to use this Service.</li>
              <li>LilByte reserves the right to suspend or terminate accounts that violate these terms.</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl border border-border/30 bg-card/40">
            <h2 className="text-lg font-bold text-foreground mb-3">4. Acceptable Use</h2>
            <p className="text-sm mb-3">You agree not to:</p>
            <ul className="space-y-1.5 text-sm list-disc list-inside">
              <li>Upload false, misleading, or fraudulent resume information</li>
              <li>Impersonate any person or entity</li>
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Scrape, crawl, or systematically extract data from the Service</li>
              <li>Transmit spam, malware, or harmful content</li>
              <li>Harass, abuse, or harm other users including mentors and students</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl border border-border/30 bg-card/40">
            <h2 className="text-lg font-bold text-foreground mb-3">5. Mentor and Student Responsibilities</h2>
            <p className="text-sm leading-relaxed mb-3">
              <strong className="text-foreground">Mentors</strong> agree to provide honest, professional guidance
              and to honor confirmed session commitments. Mentors are independent contributors and not employees of LilByte.
            </p>
            <p className="text-sm leading-relaxed">
              <strong className="text-foreground">Students</strong> agree to treat mentors respectfully and to
              attend confirmed sessions. Repeated no-shows may result in account restrictions.
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-border/30 bg-card/40">
            <h2 className="text-lg font-bold text-foreground mb-3">6. AI-Generated Content Disclaimer</h2>
            <p className="text-sm leading-relaxed">
              S3 Dashboard uses AI to generate career recommendations, job matches, skill assessments, and mentor
              explanations. This content is provided for informational purposes only. LilByte does not guarantee
              the accuracy, completeness, or suitability of AI-generated recommendations. Job availability,
              mentor qualifications, and skill assessments should be independently verified. AI outputs are
              not professional career counseling advice.
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-border/30 bg-card/40">
            <h2 className="text-lg font-bold text-foreground mb-3">7. Intellectual Property</h2>
            <p className="text-sm leading-relaxed">
              All content, features, and functionality of S3 Dashboard — including but not limited to text,
              graphics, logos, and software — are the property of LilByte and protected by applicable
              intellectual property laws. You retain ownership of your resume and personal data.
              By uploading your resume, you grant LilByte a limited license to process it solely for
              providing the Service to you.
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-border/30 bg-card/40">
            <h2 className="text-lg font-bold text-foreground mb-3">8. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed">
              LilByte and S3 Dashboard are provided "as is" without warranties of any kind. LilByte shall
              not be liable for any indirect, incidental, special, or consequential damages arising from
              your use of the Service, including but not limited to loss of employment opportunities,
              career outcomes, or data loss. Our total liability shall not exceed the amount you paid
              for the Service in the past 12 months.
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-border/30 bg-card/40">
            <h2 className="text-lg font-bold text-foreground mb-3">9. Changes to Terms</h2>
            <p className="text-sm leading-relaxed">
              LilByte reserves the right to modify these Terms at any time. We will notify users of material
              changes via email or an in-app notice. Continued use of the Service after changes constitutes
              your acceptance of the updated Terms.
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-border/30 bg-card/40">
            <h2 className="text-lg font-bold text-foreground mb-3">10. Contact</h2>
            <p className="text-sm leading-relaxed">
              For questions about these Terms, contact LilByte at{' '}
              <a href="mailto:lilbyteorg@gmail.com" className="text-primary hover:underline">
                lilbyteorg@gmail.com
              </a>{' '}
              or reach the founder directly at{' '}
              <a href="mailto:mishramanjeet26@gmail.com" className="text-primary hover:underline">
                mishramanjeet26@gmail.com
              </a>
              .
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}