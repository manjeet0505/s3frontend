import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { normalizeRole } from '../../_utils/auth';

const uri = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB;
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // ── Input validation ───────────────────────────────────────────────────
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return NextResponse.json({ message: 'Email address is required' }, { status: 400 });
    }
    if (!password || typeof password !== 'string' || password.length === 0) {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 });
    }

    // ── Connect to MongoDB ─────────────────────────────────────────────────
    const client = new MongoClient(uri);
    await client.connect();
    const db = DB_NAME ? client.db(DB_NAME) : client.db();
    const usersCollection = db.collection('users');

    // ── Find user ──────────────────────────────────────────────────────────
    const user = await usersCollection.findOne({
      email: email.trim().toLowerCase(),
    });
    if (!user) {
      await client.close();
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // ── Verify password ────────────────────────────────────────────────────
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await client.close();
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const normalizedRole = normalizeRole(user?.role);

    // ── Generate new session token ─────────────────────────────────────────
    // sessionId is a random value stored in the JWT and in the DB.
    // When a new login happens, sessionId changes → old JWTs become invalid.
    const sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        role: normalizedRole,
        sessionId, // ← included in token for session validation
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ── Save sessionId to DB (invalidates all previous sessions) ──────────
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          lastLogin: new Date(),
          currentSessionId: sessionId, // only the latest session is valid
          updatedAt: new Date(),
        },
      }
    );

    await client.close();

    // ── Return response ────────────────────────────────────────────────────
    const { password: _, ...userWithoutPassword } = user;
    const userForResponse = {
      ...userWithoutPassword,
      _id: userWithoutPassword._id.toString(),
      role: normalizedRole,
    };

    const redirectTo =
      normalizedRole === 'mentor' ? '/mentor-dashboard' : '/dashboard';

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: userForResponse,
      redirectTo,
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error.message?.includes('ECONNREFUSED') || error.message?.includes('ENOTFOUND')) {
      return NextResponse.json(
        { message: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}