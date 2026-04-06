import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const uri = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB;

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    // ── Validate inputs ───────────────────────────────────────────────────
    if (!token || typeof token !== 'string' || token.length < 10) {
      return NextResponse.json({ message: 'Invalid or missing reset token' }, { status: 400 });
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 });
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json({ message: 'Password must contain at least one uppercase letter' }, { status: 400 });
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json({ message: 'Password must contain at least one number' }, { status: 400 });
    }

    // ── Hash token and look it up ─────────────────────────────────────────
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const client = new MongoClient(uri);
    await client.connect();
    const db = DB_NAME ? client.db(DB_NAME) : client.db();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({
      resetTokenHash,
      resetTokenExpiry: { $gt: new Date() }, // token must not be expired
    });

    if (!user) {
      await client.close();
      return NextResponse.json(
        { message: 'Reset link is invalid or has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // ── Hash new password ─────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);

    // ── Update password and clear reset token ─────────────────────────────
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        $unset: {
          resetTokenHash: '',
          resetTokenExpiry: '',
          currentSessionId: '', // invalidate all active sessions
        },
      }
    );

    await client.close();

    return NextResponse.json({
      message: 'Password reset successfully. You can now sign in with your new password.',
    });
  } catch (error) {
    console.error('[ResetPassword] Error:', error);
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}