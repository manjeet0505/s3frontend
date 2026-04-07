'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield } from 'lucide-react';
import Link from 'next/link';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50"
        >
          <div className="relative p-5 rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl">
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 0%, rgba(59,130,246,0.15), transparent 70%)' }}
            />

            <div className="relative">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">We use cookies</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We use cookies to improve your experience, analyze site usage, and assist in our marketing. By continuing, you agree to our{' '}
                    <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                  </p>
                </div>
                <button
                  onClick={decline}
                  className="p-1 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={accept}
                  className="flex-1 py-2 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  Accept All
                </button>
                <button
                  onClick={decline}
                  className="flex-1 py-2 px-4 rounded-xl border border-border/60 bg-secondary/30 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}