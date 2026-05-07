import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/_utils/auth';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(request) {
  try {
    const { user, response } = requireAuth(request);
    if (response) return response;

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || 10;
    const skip = searchParams.get('skip') || 0;

    const res = await fetch(
      `${BACKEND}/interview/sessions?user_id=${user.userId}&limit=${limit}&skip=${skip}`
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[interview/sessions]', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}