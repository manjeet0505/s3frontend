import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/_utils/auth';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(request, { params }) {
  try {
    const { user, response } = requireAuth(request);
    if (response) return response;

    const { sessionId } = params;
    const res = await fetch(
      `${BACKEND}/interview/report/${sessionId}?user_id=${user.userId}`
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[interview/report]', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}