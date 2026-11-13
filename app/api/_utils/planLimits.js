// frontend/app/api/_utils/planLimits.js
// ─── Single source of truth for all plan limits ───────────────────────────────

export const PLAN_LIMITS = {
  free: {
    resumeUploads: 2,        // total ever
    jobMatchesToday: 10,     // resets daily
    skillGapMonthly: 1,      // resets monthly
    linkedinRuns: 1,         // total ever
    mockInterviewMonthly: 3, // resets monthly
    mentorBooking: false,    // not allowed
  },
  pro: {
    resumeUploads: Infinity,
    jobMatchesToday: Infinity,
    skillGapMonthly: Infinity,
    linkedinRuns: Infinity,
    mockInterviewMonthly: Infinity,
    mentorBooking: true,
  },
  elite: {
    resumeUploads: Infinity,
    jobMatchesToday: Infinity,
    skillGapMonthly: Infinity,
    linkedinRuns: Infinity,
    mockInterviewMonthly: Infinity,
    mentorBooking: true,
  },
};

// Human-readable feature names for error messages
export const FEATURE_LABELS = {
  resumeUploads:       'Resume uploads',
  jobMatchesToday:     'Job matches',
  skillGapMonthly:     'Skill gap analysis',
  linkedinRuns:        'LinkedIn optimizer',
  mockInterviewMonthly:'Mock interviews',
  mentorBooking:       'Mentor booking',
};

// What the free limit is (for upgrade message)
export const LIMIT_MESSAGES = {
  resumeUploads:       'You have used all 2 free resume uploads.',
  jobMatchesToday:     'You have reached your 10 job matches for today.',
  skillGapMonthly:     'You have used your 1 free skill gap analysis this month.',
  linkedinRuns:        'You have used your 1 free LinkedIn optimization.',
  mockInterviewMonthly:'You have used all 3 free mock interview sessions this month.',
  mentorBooking:       'Mentor booking is available on Pro and Elite plans.',
};

// Admin emails — these users bypass ALL limits
// Add your email here — never expose this to frontend
export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

// ─── Helper: is this user an admin? ──────────────────────────────────────────
export function isAdmin(userEmail) {
  return ADMIN_EMAILS.includes(userEmail?.toLowerCase());
}

// ─── Helper: is plan valid (not expired)? ────────────────────────────────────
export function isPlanActive(user) {
  if (!user?.plan || user.plan === 'free') return false;
  if (!user?.planExpiry) return true; // no expiry = lifetime
  return new Date(user.planExpiry) > new Date();
}

// ─── Helper: today's date string YYYY-MM-DD ──────────────────────────────────
export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// ─── Helper: current month string YYYY-MM ────────────────────────────────────
export function monthStr() {
  return new Date().toISOString().slice(0, 7);
}