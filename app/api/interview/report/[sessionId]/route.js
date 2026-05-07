// ═══════════════════════════════════════════════════════════════════════════
// FILE: app/api/interview/report/[sessionId]/route.js
// ═══════════════════════════════════════════════════════════════════════════
 
export async function GET_REPORT(request, { params }) {
  try {
    const token = getAuthToken(request);
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
 
    const { sessionId } = params;
    const res = await fetch(`${BACKEND}/interview/report/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[interview/report]', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}