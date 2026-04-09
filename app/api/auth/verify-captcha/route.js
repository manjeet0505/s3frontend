import { NextResponse } from 'next/server';

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false, message: 'CAPTCHA token missing' }, { status: 400 });
    }

    // ── Guard: secret key must exist ─────────────────────────────────────────
    if (!TURNSTILE_SECRET) {
      console.error('[Turnstile] TURNSTILE_SECRET_KEY is not set in environment variables');
      return NextResponse.json({ success: false, message: 'Server misconfiguration' }, { status: 500 });
    }

    const formData = new URLSearchParams();
    formData.append('secret', TURNSTILE_SECRET);
    formData.append('response', token);

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const data = await verifyRes.json();

    // ── Log the FULL Cloudflare response so you can see error-codes ──────────
    console.log('[Turnstile] Cloudflare response:', JSON.stringify(data));

    if (!data.success) {
      // data['error-codes'] tells you exactly what went wrong, e.g.:
      // 'invalid-input-secret'  → wrong secret key on Vercel
      // 'invalid-input-response' → bad/expired token
      // 'timeout-or-duplicate'  → token already used or too old
      console.error('[Turnstile] Verification failed. Error codes:', data['error-codes']);
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