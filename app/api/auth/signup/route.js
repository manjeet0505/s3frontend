import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { normalizeRole } from '../../_utils/auth';

const uri = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB;

// ─── Validation helpers ───────────────────────────────────────────────────────
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function validateSignupInput({ name, email, password, phone }) {
  // Name
  if (!name || typeof name !== 'string' || name.trim().length === 0)
    return 'Full name is required';
  const trimmedName = name.trim();
  if (trimmedName.length < 3)
    return 'Name must be at least 3 characters';
  if (!/^[a-zA-Z\s'\-]+$/.test(trimmedName))
    return 'Name can only contain letters, spaces, hyphens and apostrophes';
  const nameParts = trimmedName.split(/\s+/).filter(Boolean);
  if (nameParts.length < 2)
    return 'Please enter your first and last name';
  if (nameParts.some(p => p.length < 2))
    return 'Each part of your name must be at least 2 characters';

  // Email
  if (!email || typeof email !== 'string' || email.trim().length === 0)
    return 'Email address is required';
  if (!EMAIL_REGEX.test(email.trim()))
    return 'Please enter a valid email address';

  // Password
  if (!password || typeof password !== 'string')
    return 'Password is required';
  if (password.length < 8)
    return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password))
    return 'Password must contain at least one uppercase letter';
  if (!/[0-9]/.test(password))
    return 'Password must contain at least one number';

  // Phone — strip country code prefix, check digits
  if (!phone || typeof phone !== 'string' || phone.trim().length === 0)
    return 'Phone number is required';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 7)
    return 'Phone number is too short';
  if (digits.length > 15)
    return 'Phone number is too long';

  return null; // no error
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, role } = body;

    // ── Server-side validation ─────────────────────────────────────────────
    const validationError = validateSignupInput({ name, email, password, phone });
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    const normalizedRole = normalizeRole(role);

    // ── Connect to MongoDB ─────────────────────────────────────────────────
    const client = new MongoClient(uri);
    await client.connect();
    const db = DB_NAME ? client.db(DB_NAME) : client.db();
    const usersCollection = db.collection('users');

    // ── Duplicate email check ──────────────────────────────────────────────
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

    // ── Hash password ──────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);

    // ── Create user ────────────────────────────────────────────────────────
    const newUser = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      phone: phone.trim(),
      role: normalizedRole,
      createdAt: new Date(),
      updatedAt: new Date(),
      profile: {
        avatar: null,
        bio: '',
        skills: [],
        experience: [],
        education: [],
      },
    };

    const result = await usersCollection.insertOne(newUser);
    await client.close();

    return NextResponse.json(
      { message: 'Account created successfully', userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    if (error.message?.includes('ECONNREFUSED') || error.message?.includes('ENOTFOUND')) {
      return NextResponse.json(
        { message: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}