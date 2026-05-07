import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/_utils/auth';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request) {
  try {
    const { user, response } = requireAuth(request);
    if (response) return response;

    const body = await request.json();
    const res = await fetch(`${BACKEND}/interview/abandon?user_id=${user.userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[interview/abandon]', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}