import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { normalizeRole } from '../../_utils/auth';
import { checkRateLimit, clearRateLimit } from '../../_utils/rateLimit';

const uri = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB;
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    // ── Rate limit: 10 login attempts per IP per 15 minutes ───────────────
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '0.0.0.0';

    const limit = checkRateLimit(ip, 'login', 10, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { message: `Too many login attempts. Please try again in ${limit.retryAfterSeconds} seconds.` },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      );
    }

    const { email, password } = await request.json();

    // ── Input validation ──────────────────────────────────────────────────
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return NextResponse.json({ message: 'Email address is required' }, { status: 400 });
    }
    if (!password || typeof password !== 'string' || password.length === 0) {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 });
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = DB_NAME ? client.db(DB_NAME) : client.db();
    const usersCollection = db.collection('users');

    // ── Find user ─────────────────────────────────────────────────────────
    const user = await usersCollection.findOne({
      email: email.trim().toLowerCase(),
    });

    // ── Use same error for wrong email OR wrong password (vuln 12.9) ──────
    // Never say "email not found" vs "wrong password" — attacker can enumerate users
    if (!user) {
      await client.close();
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await client.close();
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const normalizedRole = normalizeRole(user?.role);

    // ── Generate sessionId — stored in DB, invalidates old sessions ───────
    const sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        role: normalizedRole,
        sessionId,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ── Save sessionId — logging in invalidates all previous sessions ─────
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date(), currentSessionId: sessionId, updatedAt: new Date() } }
    );

    await client.close();

    // ── Clear rate limit on successful login ──────────────────────────────
    clearRateLimit(ip, 'login');

    const redirectTo = normalizedRole === 'mentor' ? '/mentor-dashboard' : '/dashboard';

    // ── Build response — minimal user data, no sensitive fields ──────────
    // Never return: password, currentSessionId, internal IDs in body
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        name: user.name,
        email: user.email,
        role: normalizedRole,
      },
      redirectTo,
      // Still include token in body for existing localStorage logic in AuthModal
      // TODO: once HttpOnly cookie is fully adopted, remove token from body
      token,
    });

    // ── Set JWT as HttpOnly cookie (harder to steal via XSS) ─────────────
    response.cookies.set('authToken', token, {
      httpOnly: true,         // JS cannot read this cookie
      secure: true,           // HTTPS only
      sameSite: 'lax',        // CSRF protection
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    // ── Generic error message — never expose stack traces ─────────────────
    console.error('[Login] Error:', error);
    if (error.message?.includes('ECONNREFUSED') || error.message?.includes('ENOTFOUND')) {
      return NextResponse.json(
        { message: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }
    return NextResponse.json({ message: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}