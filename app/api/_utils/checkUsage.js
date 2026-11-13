// frontend/app/api/_utils/checkUsage.js
// ─── Usage checker + incrementer ─────────────────────────────────────────────
// Usage:
//   const result = await checkUsage(userId, 'resumeUploads', db);
//   if (!result.allowed) return NextResponse.json(result.error, { status: 402 });

import { ObjectId } from 'mongodb';
import {
  PLAN_LIMITS,
  LIMIT_MESSAGES,
  isAdmin,
  isPlanActive,
  todayStr,
  monthStr,
} from './planLimits';

// Default usage object for new/existing users missing the field
export const DEFAULT_USAGE = {
  resumeUploads: 0,
  jobMatchesToday: 0,
  jobMatchesDate: '',
  skillGapCount: 0,
  skillGapMonth: '',
  linkedinRuns: 0,
  mockInterviewCount: 0,
  mockInterviewMonth: '',
};

// ─── Main function ────────────────────────────────────────────────────────────
export async function checkUsage(userId, feature, usersCollection) {
  // 1. Fetch fresh user from DB (JWT might be stale after upgrade)
  const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    return {
      allowed: false,
      error: { message: 'User not found', code: 'USER_NOT_FOUND' },
    };
  }

  // 2. ADMIN BYPASS — unlimited everything
  if (isAdmin(user.email) || user.isAdmin === true) {
    return { allowed: true, user };
  }

  // 3. PRO / ELITE bypass — check plan is active
  if (isPlanActive(user)) {
    // Still increment for analytics but always allow
    await incrementUsage(userId, feature, user.usage || DEFAULT_USAGE, usersCollection);
    return { allowed: true, user };
  }

  // 4. FREE plan — check limits
  const usage = user.usage || DEFAULT_USAGE;
  const limits = PLAN_LIMITS.free;

  let currentCount = 0;
  let limit = 0;

  switch (feature) {
    case 'resumeUploads':
      currentCount = usage.resumeUploads || 0;
      limit = limits.resumeUploads;
      break;

    case 'jobMatchesToday':
      // Reset if date changed
      if (usage.jobMatchesDate !== todayStr()) {
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $set: { 'usage.jobMatchesToday': 0, 'usage.jobMatchesDate': todayStr() } }
        );
        currentCount = 0;
      } else {
        currentCount = usage.jobMatchesToday || 0;
      }
      limit = limits.jobMatchesToday;
      break;

    case 'skillGapMonthly':
      // Reset if month changed
      if (usage.skillGapMonth !== monthStr()) {
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $set: { 'usage.skillGapCount': 0, 'usage.skillGapMonth': monthStr() } }
        );
        currentCount = 0;
      } else {
        currentCount = usage.skillGapCount || 0;
      }
      limit = limits.skillGapMonthly;
      break;

    case 'linkedinRuns':
      currentCount = usage.linkedinRuns || 0;
      limit = limits.linkedinRuns;
      break;

    case 'mockInterviewMonthly':
      // Reset if month changed
      if (usage.mockInterviewMonth !== monthStr()) {
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $set: { 'usage.mockInterviewCount': 0, 'usage.mockInterviewMonth': monthStr() } }
        );
        currentCount = 0;
      } else {
        currentCount = usage.mockInterviewCount || 0;
      }
      limit = limits.mockInterviewMonthly;
      break;

    case 'mentorBooking':
      if (!limits.mentorBooking) {
        return {
          allowed: false,
          error: {
            message: LIMIT_MESSAGES.mentorBooking,
            code: 'LIMIT_REACHED',
            feature: 'mentorBooking',
            upgrade_url: '/#pricing',
            current_plan: 'free',
          },
        };
      }
      return { allowed: true, user };

    default:
      return { allowed: true, user };
  }

  // 5. Over limit?
  if (currentCount >= limit) {
    return {
      allowed: false,
      error: {
        message: LIMIT_MESSAGES[feature] || 'Plan limit reached.',
        code: 'LIMIT_REACHED',
        feature,
        used: currentCount,
        limit,
        upgrade_url: '/#pricing',
        current_plan: user.plan || 'free',
      },
    };
  }

  // 6. Under limit — increment and allow
  await incrementUsage(userId, feature, usage, usersCollection);
  return { allowed: true, user };
}

// ─── Increment helper ─────────────────────────────────────────────────────────
async function incrementUsage(userId, feature, usage, usersCollection) {
  const today = todayStr();
  const month = monthStr();

  const updates = {};

  switch (feature) {
    case 'resumeUploads':
      updates['usage.resumeUploads'] = (usage.resumeUploads || 0) + 1;
      break;
    case 'jobMatchesToday':
      updates['usage.jobMatchesToday'] = (usage.jobMatchesToday || 0) + 1;
      updates['usage.jobMatchesDate'] = today;
      break;
    case 'skillGapMonthly':
      updates['usage.skillGapCount'] = (usage.skillGapCount || 0) + 1;
      updates['usage.skillGapMonth'] = month;
      break;
    case 'linkedinRuns':
      updates['usage.linkedinRuns'] = (usage.linkedinRuns || 0) + 1;
      break;
    case 'mockInterviewMonthly':
      updates['usage.mockInterviewCount'] = (usage.mockInterviewCount || 0) + 1;
      updates['usage.mockInterviewMonth'] = month;
      break;
  }

  if (Object.keys(updates).length > 0) {
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updates }
    );
  }
}