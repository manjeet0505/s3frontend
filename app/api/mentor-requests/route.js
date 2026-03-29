import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      mentor_id,
      mentor_user_id,
      mentor_name,
      student_id,
      student_name,
      day,
      time_slot,
      topic,
    } = body;

    // Validate required fields
    if (!mentor_id || !student_id || !day || !time_slot || !topic) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // ── Fetch student AI profile to attach to session ──────────────────
    let student_profile = null;
    try {
      const profileRes = await fetch(
        `${BACKEND_URL}/resume/profile/${student_id}`
      );
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        // Extract only what mentor needs to see
        const p = profileData?.profile || profileData || {};
        student_profile = {
          name: p.name || student_name,
          target_role: p.target_role || p.domain || '',
          experience_level: p.experience_level || '',
          skills: (p.skills || []).slice(0, 15), // top 15 skills
          summary: p.summary || p.bio || '',
          education: p.education?.[0] || null,  // most recent education
          strong_skills: p.strong_skills || [],
          career_goals: p.career_goals || '',
          ai_profile_score: profileData?.ai_profile_score || 0,
        };
      }
    } catch (profileErr) {
      // Non-blocking — session still saves even if profile fetch fails
      console.warn('[mentor-requests] Could not fetch student profile:', profileErr.message);
    }

    // ── Forward to FastAPI backend with profile attached ───────────────
    const res = await fetch(`${BACKEND_URL}/mentor/session/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mentor_id,
        mentor_user_id: mentor_user_id || mentor_id,
        mentor_name,
        student_id,
        student_name,
        day,
        time_slot,
        topic,
        student_profile, // ← full AI profile attached
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.detail || 'Failed to send session request' },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      session_id: data.session_id,
      message: 'Session request sent successfully'
    });

  } catch (error) {
    console.error('[mentor-requests POST] Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get('student_id');

    if (!student_id) {
      return NextResponse.json({ message: 'student_id required' }, { status: 400 });
    }

    const res = await fetch(
      `${BACKEND_URL}/mentor/sessions/my?student_id=${student_id}`
    );
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.detail || 'Failed to fetch sessions' },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[mentor-requests GET] Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}