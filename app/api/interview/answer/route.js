// ═══════════════════════════════════════════════════════════════════════════
// FILE: app/api/interview/answer/route.js
// ═══════════════════════════════════════════════════════════════════════════
// import { NextResponse } from 'next/server';
// import { getAuthToken } from '@/app/api/_utils/auth';
// const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
 
export async function POST_ANSWER(request) {
  try {
    const token = getAuthToken(request);
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
 
    const body = await request.json();
    const res = await fetch(`${BACKEND}/interview/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[interview/answer]', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
 