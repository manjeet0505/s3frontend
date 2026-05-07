// ═══════════════════════════════════════════════════════════════════════════
// FILE: app/api/interview/abandon/route.js
// ═══════════════════════════════════════════════════════════════════════════
 
export async function POST_ABANDON(request) {
  try {
    const token = getAuthToken(request);
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
 
    const body = await request.json();
    const res = await fetch(`${BACKEND}/interview/abandon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[interview/abandon]', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}