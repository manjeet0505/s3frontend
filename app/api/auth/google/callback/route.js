import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const REDIRECT_URI = `${APP_URL}/api/auth/google/callback`;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB;
const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const storedState = request.cookies.get('oauth_state')?.value;

  // User denied access
  if (error) {
    return NextResponse.redirect(`${APP_URL}/?auth=login&error=access_denied`);
  }

  // CSRF check
  if (!state || !storedState || state !== storedState) {
    return NextResponse.redirect(`${APP_URL}/?auth=login&error=invalid_state`);
  }

  if (!code) {
    return NextResponse.redirect(`${APP_URL}/?auth=login&error=no_code`);
  }

  let client;
  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokens.access_token) {
      throw new Error('No access token received from Google');
    }

    // Get user profile from Google
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await profileRes.json();

    if (!profile.email) {
      throw new Error('No email returned from Google');
    }

    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = DB_NAME ? client.db(DB_NAME) : client.db();
    const usersCollection = db.collection('users');

    // Find existing user by email
    let user = await usersCollection.findOne({
      email: profile.email.toLowerCase(),
    });

    if (!user) {
      // New user — create account
      const newUser = {
        name: profile.name || profile.email.split('@')[0],
        email: profile.email.toLowerCase(),
        password: null,
        phone: '',
        role: 'student',
        authProvider: 'google',
        providerId: String(profile.id),
        avatar: profile.picture || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        profile: {
          avatar: profile.picture || null,
          bio: '',
          skills: [],
          experience: [],
          education: [],
        },
      };
      const result = await usersCollection.insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };
    } else if (!user.authProvider) {
      // Existing manual-signup user — link Google to their account
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            authProvider: 'google',
            providerId: String(profile.id),
            avatar: profile.picture || user.avatar || null,
            updatedAt: new Date(),
          },
        }
      );
    }

    // Generate JWT — same format as manual login
    const sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || 'student',
        sessionId,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Save session
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          lastLogin: new Date(),
          currentSessionId: sessionId,
          updatedAt: new Date(),
        },
      }
    );

    await client.close();

    const redirectTo = user.role === 'mentor' ? '/mentor-dashboard' : '/dashboard';

    // Redirect to sync page which stores token in localStorage
    const response = NextResponse.redirect(
      `${APP_URL}/auth/callback?to=${redirectTo}`
    );

    // HttpOnly cookie — for middleware session protection
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    // Short-lived readable cookie — for client to sync to localStorage
    response.cookies.set('oauth_sync', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60, // 60 seconds only
      path: '/auth/callback',
    });

    // Clear CSRF state cookie
    response.cookies.set('oauth_state', '', { maxAge: 0, path: '/' });

    return response;
  } catch (err) {
    console.error('[Google OAuth Callback]', err);
    if (client) await client.close().catch(() => {});
    return NextResponse.redirect(`${APP_URL}/?auth=login&error=oauth_failed`);
  }
}