// Simple in-memory rate limiter — works on Vercel serverless (per instance)
// For production scale, swap the store with Redis/Upstash

const store = new Map();

function getKey(ip, action) {
  return `${action}:${ip}`;
}

function cleanup(key, windowMs) {
  const record = store.get(key);
  if (!record) return;
  const now = Date.now();
  record.attempts = record.attempts.filter((t) => now - t < windowMs);
  if (record.attempts.length === 0) store.delete(key);
}

/**
 * Check rate limit for a given IP and action.
 * Returns { allowed: boolean, retryAfterSeconds: number }
 */
export function checkRateLimit(ip, action, maxAttempts, windowMs) {
  const key = getKey(ip, action);
  cleanup(key, windowMs);

  const now = Date.now();
  const record = store.get(key) || { attempts: [] };

  if (record.attempts.length >= maxAttempts) {
    const oldest = record.attempts[0];
    const retryAfter = Math.ceil((oldest + windowMs - now) / 1000);
    return { allowed: false, retryAfterSeconds: retryAfter };
  }

  record.attempts.push(now);
  store.set(key, record);
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Clear rate limit record (call after successful login to reset)
 */
export function clearRateLimit(ip, action) {
  const key = getKey(ip, action);
  store.delete(key);
}