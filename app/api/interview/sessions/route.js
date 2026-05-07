// ═══════════════════════════════════════════════════════════════════════════
// FILE: app/api/interview/sessions/route.js
// ═══════════════════════════════════════════════════════════════════════════
 
export async function GET_SESSIONS(request) {
  try {
    const token = getAuthToken(request);
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
 
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || 10;
    const skip = searchParams.get('skip') || 0;
 
    const res = await fetch(`${BACKEND}/interview/sessions?limit=${limit}&skip=${skip}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[interview/sessions]', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
 