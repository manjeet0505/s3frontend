import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      mentor_id,      // mongo_id from Qdrant payload — matches mentor's JWT userId
      mentor_user_id, // same as mentor_id, stored as separate field for query flexibility
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
        { message: 'Missing required fields: mentor_id, student_id, day, time_slot, topic' },
        { status: 400 }
      );
    }

    // Forward to FastAPI backend
    const res = await fetch(`${BACKEND_URL}/mentor/session/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mentor_id,
        mentor_user_id: mentor_user_id || mentor_id, // always save both
        mentor_name,
        student_id,
        student_name,
        day,
        time_slot,
        topic,
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
    console.error('[mentor-requests] Error:', error);
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