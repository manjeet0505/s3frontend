'use client';
import { motion } from 'framer-motion';

const companies = [
  'Google', 'Microsoft', 'Razorpay', 'Zerodha', 'Flipkart',
  'Zomato', 'Swiggy', 'PhonePe', 'CRED', 'Meesho',
  'Paytm', 'Ola', 'Nykaa', 'BrowserStack', 'Freshworks',
];

export default function TrustedBy() {
  return (
    <section className="py-14 relative overflow-hidden border-y border-white/5">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-slate-950 pointer-events-none" />

      <div className="text-center mb-8">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-500">
          Students placed at top companies
        </p>
      </div>

      {/* Marquee wrapper */}
      <div className="relative flex overflow-hidden gap-0">
        {/* Fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        {[0, 1].map((i) => (
          <motion.div
            key={i}
            className="flex gap-12 items-center shrink-0 pr-12"
            animate={{ x: ['0%', '-100%'] }}
            transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
          >
            {companies.map((name) => (
              <span
                key={name}
                className="text-slate-400 font-semibold text-sm tracking-wide whitespace-nowrap hover:text-white transition-colors duration-300 cursor-default select-none px-1"
              >
                {name}
              </span>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}