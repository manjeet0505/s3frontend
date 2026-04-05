import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { normalizeRole } from '../../_utils/auth';
import { checkRateLimit } from '../../_utils/rateLimit';

const uri = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB;

// ── Allowed roles — NEVER accept anything outside this list ──────────────────
const ALLOWED_ROLES = ['student', 'mentor'];

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function validateSignupInput({ name, email, password, phone }) {
  if (!name || typeof name !== 'string' || name.trim().length === 0)
    return 'Full name is required';
  const trimmedName = name.trim();
  if (trimmedName.length < 3) return 'Name must be at least 3 characters';
  if (!/^[a-zA-Z\s'\-]+$/.test(trimmedName))
    return 'Name can only contain letters, spaces, hyphens and apostrophes';
  const nameParts = trimmedName.split(/\s+/).filter(Boolean);
  if (nameParts.length < 2) return 'Please enter your first and last name';
  if (nameParts.some((p) => p.length < 2))
    return 'Each part of your name must be at least 2 characters';
  if (!email || typeof email !== 'string' || email.trim().length === 0)
    return 'Email address is required';
  if (!EMAIL_REGEX.test(email.trim())) return 'Please enter a valid email address';
  if (!password || typeof password !== 'string') return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  if (!phone || typeof phone !== 'string' || phone.trim().length === 0)
    return 'Phone number is required';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 7) return 'Phone number is too short';
  if (digits.length > 15) return 'Phone number is too long';
  return null;
}

export async function POST(request) {
  try {
    // ── Rate limit: 5 signups per IP per hour ─────────────────────────────
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '0.0.0.0';

    const limit = checkRateLimit(ip, 'signup', 5, 60 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { message: `Too many signup attempts. Please try again in ${limit.retryAfterSeconds} seconds.` },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      );
    }

    const body = await request.json();
    const { name, email, password, phone, role } = body;

    // ── CRITICAL: Role whitelist — block admin/superuser/any elevated role ─
    const requestedRole = typeof role === 'string' ? role.trim().toLowerCase() : '';
    const safeRole = ALLOWED_ROLES.includes(requestedRole) ? requestedRole : 'student';
    const normalizedRole = normalizeRole(safeRole);

    // ── Validate input ────────────────────────────────────────────────────
    const validationError = validateSignupInput({ name, email, password, phone });
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = DB_NAME ? client.db(DB_NAME) : client.db();
    const usersCollection = db.collection('users');

    const existingUser = await usersCollection.findOne({
      email: email.trim().toLowerCase(),
    });
    if (existingUser) {
      await client.close();
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      phone: phone.trim(),
      role: normalizedRole,
      createdAt: new Date(),
      updatedAt: new Date(),
      profile: { avatar: null, bio: '', skills: [], experience: [], education: [] },
    };

    await usersCollection.insertOne(newUser);
    await client.close();

    // ── Never return userId — prevents user ID disclosure (vuln 12.9) ─────
    return NextResponse.json({ message: 'Account created successfully' }, { status: 201 });
  } catch (error) {
    console.error('[Signup] Error:', error);
    if (error.message?.includes('ECONNREFUSED') || error.message?.includes('ENOTFOUND')) {
      return NextResponse.json(
        { message: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }
    return NextResponse.json({ message: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}