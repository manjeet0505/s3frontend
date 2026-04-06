import { NextResponse } from 'next/server';

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false, message: 'CAPTCHA token missing' }, { status: 400 });
    }

    const formData = new URLSearchParams();
    formData.append('secret', TURNSTILE_SECRET);
    formData.append('response', token);

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const data = await verifyRes.json();

    if (!data.success) {
      return NextResponse.json(
        { success: false, message: 'CAPTCHA verification failed. Please try again.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Turnstile] Error:', error);
    return NextResponse.json(
      { success: false, message: 'CAPTCHA verification error' },
      { status: 500 }
    );
  }
}