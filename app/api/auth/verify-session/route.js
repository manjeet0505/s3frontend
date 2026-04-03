import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB;
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ valid: false, message: 'No token provided' }, { status: 401 });
    }

    // 1. Decode the JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ valid: false, message: 'Invalid or expired token' }, { status: 401 });
    }

    // 2. Must have a sessionId embedded
    if (!decoded.sessionId || !decoded.userId) {
      return NextResponse.json({ valid: false, message: 'Malformed token' }, { status: 401 });
    }

    // 3. Check DB — does the sessionId still match?
    const client = new MongoClient(uri);
    await client.connect();
    const db = DB_NAME ? client.db(DB_NAME) : client.db();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { currentSessionId: 1, _id: 1 } }
    );

    await client.close();

    if (!user) {
      return NextResponse.json({ valid: false, message: 'User not found' }, { status: 401 });
    }

    if (user.currentSessionId !== decoded.sessionId) {
      // Session was replaced by a newer login (another device/tab logged in)
      return NextResponse.json(
        { valid: false, message: 'Session expired — logged in from another device' },
        { status: 401 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Session verify error:', error);
    return NextResponse.json({ valid: false, message: 'Internal server error' }, { status: 500 });
  }
}