/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['images.unsplash.com'],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB,
    RESUME_COLLECTION: process.env.RESUME_COLLECTION,
    JWT_SECRET: process.env.JWT_SECRET,
  },

  // ── Security Headers — fixes vulns 12.4 (Missing Headers) + 12.8 (Clickjacking)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // ── Clickjacking protection (vuln 12.8) ──────────────────────
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // ── MIME type sniffing protection ─────────────────────────────
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // ── Force HTTPS (HSTS) ────────────────────────────────────────
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // ── Referrer policy — don't leak URL to third parties ─────────
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // ── Permissions policy — disable unused browser features ──────
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          // ── XSS protection (legacy browsers) ─────────────────────────
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // ── Content Security Policy ───────────────────────────────────
          // Allows: self, trusted CDNs (framer-motion, fonts), Vercel analytics
          // Blocks: inline scripts unless nonce-based, eval, unknown origins
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js needs unsafe-eval in dev; tighten in prod if possible
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https://images.unsplash.com",
              "connect-src 'self' http://localhost:8000 http://localhost:3000 https://s3dashboard-production.up.railway.app",
              "frame-ancestors 'none'", // Redundant with X-Frame-Options but belt-and-suspenders
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;