import Link from 'next/link';
import { Sparkles, Shield } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — S3 Dashboard',
  description: 'Privacy Policy for S3 Dashboard',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
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
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Last updated: April 2026</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p className="leading-relaxed">We collect information you provide directly to us, including your name, email address, phone number, and resume data when you register and use S3 Dashboard. We also collect usage data and analytics to improve our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>To provide and improve our AI-powered career intelligence services</li>
              <li>To match you with relevant job opportunities and mentors</li>
              <li>To analyze your resume and provide skill gap recommendations</li>
              <li>To send you important service notifications</li>
              <li>To ensure platform security and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Storage and Security</h2>
            <p className="leading-relaxed">Your data is stored securely in MongoDB Atlas with encryption at rest. Resume files are processed in memory and not stored permanently. We use JWT authentication with HttpOnly cookies to protect your session. All API communications use HTTPS.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. AI Processing</h2>
            <p className="leading-relaxed">Your resume text is sent to OpenAI's GPT-4o API for analysis. This data is processed according to OpenAI's data usage policies. We do not use your personal data to train AI models. Job matching uses vector embeddings stored in Qdrant vector database.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Third-Party Services</h2>
            <p className="leading-relaxed">We use the following third-party services: OpenAI (AI processing), MongoDB Atlas (database), Qdrant (vector search), Vercel (hosting), Railway (backend hosting), Cloudflare (security). Each service has its own privacy policy governing their data use.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Your Rights</h2>
            <p className="leading-relaxed">You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at mishramanjeet26@gmail.com. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Data Retention</h2>
            <p className="leading-relaxed">We retain your account data for as long as your account is active. Resume analysis data is retained to power your career intelligence features. You may request deletion of your data at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Contact Us</h2>
            <p className="leading-relaxed">For privacy-related questions, contact us at{' '}
              <a href="mailto:mishramanjeet26@gmail.com" className="text-primary hover:underline">
                mishramanjeet26@gmail.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}