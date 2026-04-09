'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Mail, Lock, User, Phone, Sparkles, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import Link from 'next/link';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const IS_DEV = process.env.NODE_ENV === 'development';

// ─── Country codes ────────────────────────────────────────────────────────────
const COUNTRY_CODES = [
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+1',  country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'GB', flag: '🇬🇧' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+52', country: 'MX', flag: '🇲🇽' },
  { code: '+7',  country: 'RU', flag: '🇷🇺' },
  { code: '+27', country: 'ZA', flag: '🇿🇦' },
  { code: '+234', country: 'NG', flag: '🇳🇬' },
];

// ─── Validation ───────────────────────────────────────────────────────────────
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function validateName(name) {
  if (!name || name.trim().length === 0) return 'Full name is required';
  const trimmed = name.trim();
  if (trimmed.length < 3) return 'Name must be at least 3 characters';
  if (!/^[a-zA-Z\s'\-]+$/.test(trimmed)) return 'Name can only contain letters, spaces, hyphens and apostrophes';
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return 'Please enter your first and last name';
  if (parts.some(p => p.length < 2)) return 'Each part of your name must be at least 2 characters';
  return '';
}
function validateEmail(email) {
  if (!email || email.trim().length === 0) return 'Email address is required';
  if (!EMAIL_REGEX.test(email.trim())) return 'Please enter a valid email address';
  return '';
}
function validatePhone(phone) {
  if (!phone || phone.trim().length === 0) return 'Phone number is required';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 7) return 'Phone number is too short';
  if (digits.length > 15) return 'Phone number is too long';
  if (!/^[\d\s\-().]+$/.test(phone)) return 'Phone number contains invalid characters';
  return '';
}
function validatePassword(password, isSignup) {
  if (!password) return 'Password is required';
  if (isSignup) {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  } else {
    if (password.length < 6) return 'Password must be at least 6 characters';
  }
  return '';
}

// ─── Password strength ────────────────────────────────────────────────────────
function PasswordStrength({ password }) {
  if (!password) return null;
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-500'];
  const textColors = ['text-red-400', 'text-orange-400', 'text-yellow-400', 'text-emerald-400'];
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < strength ? colors[strength - 1] : 'bg-border'}`} />
        ))}
      </div>
      <p className={`text-xs ${strength > 0 ? textColors[strength - 1] : 'text-muted-foreground'}`}>
        {strength > 0 ? `${labels[strength - 1]} password` : ''}
      </p>
    </div>
  );
}

function FieldError({ error }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
          className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 shrink-0" style={{ fontSize: '9px' }}>!</span>
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function CountryCodeSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = COUNTRY_CODES.find(c => c.code === value) || COUNTRY_CODES[0];
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-3 rounded-l-xl border border-r-0 border-border bg-secondary/50 text-sm font-medium text-foreground hover:bg-secondary transition-colors whitespace-nowrap">
        <span>{selected.flag}</span>
        <span className="text-muted-foreground">{selected.code}</span>
        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className="absolute top-full left-0 mt-1 w-40 rounded-xl border border-border bg-card shadow-xl z-50 overflow-auto max-h-48">       
            {COUNTRY_CODES.map(c => (
              <button key={c.code + c.country} type="button"
                onClick={() => { onChange(c.code); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors text-left ${c.code === value ? 'bg-primary/10 text-primary' : 'text-foreground'}`}>
                <span>{c.flag}</span>
                <span className="text-muted-foreground">{c.code}</span>
                <span className="text-xs text-muted-foreground">{c.country}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main AuthModal ───────────────────────────────────────────────────────────
export default function AuthModal({ mode, onClose, onLogin, onModeChange }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [captchaToken, setCaptchaToken] = useState('');
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);

  const [formData, setFormData] = useState({
    email: '', password: '', name: '', phone: '', role: 'student',
  });

  // ── Multi-tab logout sync ──────────────────────────────────────────────────
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' && !e.newValue) window.location.assign('/');
      if (e.key === 'authToken' && e.newValue && e.oldValue && e.newValue !== e.oldValue) window.location.reload();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ── Render Turnstile widget (only in production) ───────────────────────────
  useEffect(() => {
    // Skip Turnstile entirely in development
    if (IS_DEV) return;
    if (!TURNSTILE_SITE_KEY || !turnstileRef.current) return;
    if (typeof window.turnstile === 'undefined') return;

    if (widgetIdRef.current) {
      window.turnstile.remove(widgetIdRef.current);
    }

    widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      theme: 'dark',
      size: 'invisible',
      callback: (token) => setCaptchaToken(token),
      'expired-callback': () => setCaptchaToken(''),
      'error-callback': () => setCaptchaToken(''),
    });

    return () => {
      if (widgetIdRef.current) {
        window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    if (touched[name]) validateField(name, value);
  };

  const validateField = (name, value) => {
    let err = '';
    if (name === 'name') err = validateName(value);
    if (name === 'email') err = validateEmail(value);
    if (name === 'phone') err = validatePhone(value);
    if (name === 'password') err = validatePassword(value, mode === 'signup');
    setFieldErrors(prev => ({ ...prev, [name]: err }));
    return err;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateAll = () => {
    const errors = {};
    if (mode === 'signup') {
      errors.name = validateName(formData.name);
      errors.phone = validatePhone(formData.phone);
    }
    errors.email = validateEmail(formData.email);
    errors.password = validatePassword(formData.password, mode === 'signup');
    setFieldErrors(errors);
    setTouched({ name: true, email: true, phone: true, password: true });
    return Object.values(errors).every(e => !e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateAll()) return;

    // ── Turnstile verification — SKIPPED in development ──────────────────────
    if (TURNSTILE_SITE_KEY && !IS_DEV) {
      let token = captchaToken;

      // If no token yet, execute the challenge
      if (!token && widgetIdRef.current !== null) {
        try {
          window.turnstile?.execute(widgetIdRef.current);
          // Wait up to 5s for token
          token = await new Promise((resolve) => {
            let attempts = 0;
            const interval = setInterval(() => {
              attempts++;
              const t = window.turnstile?.getResponse(widgetIdRef.current);
              if (t) { clearInterval(interval); resolve(t); }
              if (attempts > 50) { clearInterval(interval); resolve(''); }
            }, 100);
          });
        } catch {}
      }

      if (!token) {
        setError('Please complete the security check');
        return;
      }

      // Verify with our backend
      try {
        const captchaRes = await fetch('/api/auth/verify-captcha', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const captchaData = await captchaRes.json();
        if (!captchaData.success) {
          setError('Security check failed. Please try again.');
          window.turnstile?.reset(widgetIdRef.current);
          setCaptchaToken('');
          return;
        }
      } catch {
        setError('Security check failed. Please try again.');
        return;
      }
    }

    setIsLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const payload = mode === 'signup'
        ? { ...formData, phone: `${countryCode}${formData.phone.trim()}` }
        : { email: formData.email.trim(), password: formData.password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong');

      if (mode === 'login') {
        if (data?.token) {
          localStorage.setItem('authToken', data.token);
          document.cookie = `authToken=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
          localStorage.setItem('authEvent', `login:${Date.now()}`);
        }
        const computedRedirectTo = data?.redirectTo ||
          (typeof data?.user?.role === 'string' && data.user.role.toLowerCase() === 'mentor'
            ? '/mentor-dashboard' : '/dashboard');
        if (computedRedirectTo) { window.location.assign(computedRedirectTo); return; }
        onLogin(data.token, data.user);
        onClose();
      } else {
        onModeChange('login');
        setFormData({ email: '', password: '', name: '', phone: '', role: 'student' });
        setFieldErrors({});
        setTouched({});
        setError('Account created! Please sign in.');
      }
    } catch (err) {
      setError(err.message);
      if (!IS_DEV && widgetIdRef.current !== null) {
        window.turnstile?.reset(widgetIdRef.current);
        setCaptchaToken('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    onModeChange(mode === 'login' ? 'signup' : 'login');
    setFormData({ email: '', password: '', name: '', phone: '', role: 'student' });
    setFieldErrors({});
    setTouched({});
    setError('');
    setCaptchaToken('');
  };

  return (
    <>
      {/* Load Turnstile script — only in production */}
      {TURNSTILE_SITE_KEY && !IS_DEV && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
          onLoad={() => {
            if (turnstileRef.current && !widgetIdRef.current) {
              widgetIdRef.current = window.turnstile?.render(turnstileRef.current, {
                sitekey: TURNSTILE_SITE_KEY,
                theme: 'dark',
                size: 'invisible',
                callback: (token) => setCaptchaToken(token),
                'expired-callback': () => setCaptchaToken(''),
              });
            }
          }}
        />
      )}

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
            className="relative w-full max-w-md rounded-3xl border border-border/60 bg-card/90 backdrop-blur-xl shadow-2xl p-8 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.6), transparent 70%)' }} />

            {/* Header */}
            <div className="relative flex justify-between items-center mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">S3 Dashboard</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  {mode === 'login' ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {mode === 'login' ? 'Sign in to your account to continue' : 'Start your AI-powered career journey'}
                </p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl border border-border hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative space-y-4" noValidate>

              {/* Role selector */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">I am a</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['student', 'mentor'].map(r => (
                      <button key={r} type="button"
                        onClick={() => setFormData(prev => ({ ...prev, role: r }))}
                        className={`py-3 rounded-xl border text-sm font-medium transition-all capitalize ${
                          formData.role === r ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-secondary/30 text-muted-foreground hover:border-border/80 hover:text-foreground'
                        }`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Name */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name <span className="text-red-400">*</span></label>   
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} onBlur={handleBlur}
                      placeholder="e.g. Manjeet Mishra"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm ${fieldErrors.name && touched.name ? 'border-red-500/60' : 'border-border'}`} />
                  </div>
                  <FieldError error={touched.name ? fieldErrors.name : ''} />
                </div>
              )}

              {/* Phone */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone Number <span className="text-red-400">*</span></label>
                  <div className="flex">
                    <CountryCodeSelect value={countryCode} onChange={setCountryCode} />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} onBlur={handleBlur}
                      placeholder="9876543210"
                      className={`flex-1 px-4 py-3 rounded-r-xl border bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm ${fieldErrors.phone && touched.phone ? 'border-red-500/60' : 'border-border'}`} />
                  </div>
                  <FieldError error={touched.phone ? fieldErrors.phone : ''} />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address <span className="text-red-400">*</span></label> 
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} onBlur={handleBlur}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm ${fieldErrors.email && touched.email ? 'border-red-500/60' : 'border-border'}`} />
                </div>
                <FieldError error={touched.email ? fieldErrors.email : ''} />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-foreground">Password <span className="text-red-400">*</span></label>
                  {mode === 'login' && (
                    <Link href="/forgot-password" onClick={onClose}
                      className="text-xs text-primary hover:opacity-80 transition-opacity font-medium">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password}
                    onChange={handleInputChange} onBlur={handleBlur}
                    placeholder={mode === 'signup' ? 'Min 8 chars, 1 uppercase, 1 number' : 'Enter your password'}
                    className={`w-full pl-10 pr-12 py-3 rounded-xl border bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm ${fieldErrors.password && touched.password ? 'border-red-500/60' : 'border-border'}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <FieldError error={touched.password ? fieldErrors.password : ''} />
                {mode === 'signup' && <PasswordStrength password={formData.password} />}
              </div>

              {/* Turnstile container — only rendered in production */}
              {TURNSTILE_SITE_KEY && !IS_DEV && <div ref={turnstileRef} />}

              {/* Global error/success */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className={`px-4 py-3 rounded-xl text-sm border ${
                      error.includes('created') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button type="submit" disabled={isLoading}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg shadow-primary/25 mt-2">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (mode === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            {/* Mode switch */}
            <div className="relative mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                <button onClick={switchMode} className="ml-2 text-primary hover:opacity-80 font-medium transition-opacity">
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50" /></div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-card text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              {['Google', 'GitHub'].map(provider => (
                <button key={provider} type="button"
                  className="py-2.5 rounded-xl border border-border bg-secondary/30 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border/80 transition-all">
                  {provider}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}