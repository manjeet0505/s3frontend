'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const plans = [
  {
    id: 'free',
    name: 'Free',
    icon: Zap,
    monthlyPrice: 0,
    yearlyPrice: 0,
    color: 'from-slate-600 to-slate-500',
    badge: null,
    description: 'Get started and see what AI-powered job search feels like.',
    features: [
      'Resume upload & parse (3 resumes)',
      '5 job matches per day',
      'Basic skill gap analysis',
      'ATS score check',
      'Community access',
    ],
    cta: 'Get Started Free',
    ctaStyle: 'border border-white/10 text-white hover:bg-white/5',
    razorpayId: null,
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Sparkles,
    monthlyPrice: 299,
    yearlyPrice: 199,
    color: 'from-blue-500 to-violet-500',
    badge: 'Most Popular',
    description: 'Everything you need to land interviews at top companies.',
    features: [
      'Unlimited resume uploads & scoring',
      'Unlimited job matches',
      'Full skill gap roadmap + resources',
      'LinkedIn profile optimizer (3-pass)',
      'Mock interview (all round types)',
      'Mentor connect (3 sessions/mo)',
      'Kanban job tracker',
      'Priority email support',
    ],
    cta: 'Start Pro — ₹299/mo',
    ctaStyle: 'bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:opacity-90',
    razorpayId: 'plan_pro_monthly',
  },
  {
    id: 'elite',
    name: 'Elite',
    icon: Crown,
    monthlyPrice: 799,
    yearlyPrice: 549,
    color: 'from-amber-500 to-orange-400',
    badge: 'Best Value',
    description: 'Full-throttle career acceleration with priority everything.',
    features: [
      'Everything in Pro',
      'Unlimited mentor sessions',
      'Career roadmap (personalised)',
      'Weekly digest & job alerts',
      'Resume co-writing with AI coach',
      'LinkedIn rewrite (unlimited)',
      'Dedicated career advisor',
      'Interview performance analytics',
    ],
    cta: 'Start Elite — ₹799/mo',
    ctaStyle: 'bg-gradient-to-r from-amber-500 to-orange-400 text-white hover:opacity-90',
    razorpayId: 'plan_elite_monthly',
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  const router = useRouter();

  const handlePayment = async (plan) => {
    if (!plan.razorpayId) {
      router.push('/auth/signup');
      return;
    }

    // Load Razorpay script dynamically
    const res = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: plan.id, billing: yearly ? 'yearly' : 'monthly' }),
    });

    if (!res.ok) {
      // Fallback — redirect to signup if payment API not set up yet
      router.push('/auth/signup');
      return;
    }

    const order = await res.json();

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);
    script.onload = () => {
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'S3 Dashboard',
        description: `${plan.name} Plan — ${yearly ? 'Yearly' : 'Monthly'}`,
        order_id: order.id,
        theme: { color: '#6366f1' },
        handler: (response) => {
          // Verify on backend
          fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          }).then(() => router.push('/dashboard?upgraded=true'));
        },
      });
      rzp.open();
    };
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden" id="pricing">
      {/* BG */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-500 mb-4"
          >
            Simple pricing
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Invest in your{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              career
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-lg mx-auto mb-8"
          >
            Less than the cost of one rejected interview attempt. Cancel anytime.
          </motion.p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-full bg-slate-800/60 border border-white/10">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${!yearly ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${yearly ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              Yearly
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">-33%</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
            const isPro = plan.id === 'pro';

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-6 border transition-all duration-300 ${
                  isPro
                    ? 'bg-gradient-to-b from-slate-800/80 to-slate-900/80 border-blue-500/30 shadow-xl shadow-blue-500/10 scale-105'
                    : 'bg-slate-900/60 border-white/5 hover:border-white/10'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${plan.color}`}>
                    {plan.badge}
                  </div>
                )}

                {/* Icon + name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                    <Icon className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
                  </div>
                  <span className="text-white font-bold text-lg">{plan.name}</span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  {price === 0 ? (
                    <p className="text-4xl font-bold text-white">Free</p>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-white">₹</span>
                      <span className="text-4xl font-bold text-white">{price}</span>
                      <span className="text-slate-500 text-sm">/mo</span>
                    </div>
                  )}
                  {yearly && price > 0 && (
                    <p className="text-xs text-emerald-400 mt-1">Billed ₹{price * 12}/year — save ₹{(plan.monthlyPrice - price) * 12}/yr</p>
                  )}
                </div>

                <p className="text-slate-400 text-sm mb-6">{plan.description}</p>

                {/* Features */}
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 bg-gradient-to-br ${plan.color} rounded-full p-0.5 text-white`} />
                      <span className="text-slate-300 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handlePayment(plan)}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-slate-600 text-xs mt-8">
          Secure payments via Razorpay · Cancel anytime · No hidden fees
        </p>
      </div>
    </section>
  );
}