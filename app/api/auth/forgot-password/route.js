import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const uri = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB;
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://s3frontend-seven.vercel.app';

// ── Rate limit store (in-memory) ──────────────────────────────────────────────
const resetAttempts = new Map();

function checkResetLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const max = 3; // max 3 reset emails per IP per hour
  const record = resetAttempts.get(ip) || { attempts: [] };
  record.attempts = record.attempts.filter(t => now - t < windowMs);
  if (record.attempts.length >= max) {
    const retryAfter = Math.ceil((record.attempts[0] + windowMs - now) / 1000);
    return { allowed: false, retryAfter };
  }
  record.attempts.push(now);
  resetAttempts.set(ip, record);
  return { allowed: true };
}

// ── Email template ────────────────────────────────────────────────────────────
function buildResetEmail(resetUrl, name) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background:#0f1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1117;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#1a1d27;border-radius:16px;border:1px solid #2a2d3a;overflow:hidden;max-width:560px;width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a5f,#1a1d27);padding:32px 40px;text-align:center;border-bottom:1px solid #2a2d3a;">
              <div style="display:inline-flex;align-items:center;gap:10px;">
                <div style="width:36px;height:36px;background:linear-gradient(135deg,#3b82f6,#6366f1);border-radius:10px;display:inline-block;line-height:36px;text-align:center;">
                  <span style="color:white;font-size:18px;">✦</span>
                </div>
                <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.5px;">S3 Dashboard</span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0 0 8px;letter-spacing:-0.5px;">
                Reset your password
              </h1>
              <p style="color:#9ca3af;font-size:15px;line-height:1.6;margin:0 0 28px;">
                Hi ${name}, we received a request to reset the password for your S3 Dashboard account.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:0 0 28px;">
                    <a href="${resetUrl}" 
                       style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#6366f1);color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:12px;letter-spacing:0.2px;">
                      Reset Password →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Warning box -->
              <div style="background:#1f2937;border:1px solid #374151;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
                <p style="color:#9ca3af;font-size:13px;margin:0;line-height:1.6;">
                  ⏱ This link expires in <strong style="color:#f3f4f6;">1 hour</strong>.<br>
                  🔒 If you didn't request this, you can safely ignore this email — your password won't change.
                </p>
              </div>

              <!-- Fallback URL -->
              <p style="color:#6b7280;font-size:12px;margin:0;line-height:1.6;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color:#3b82f6;word-break:break-all;">${resetUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid #2a2d3a;">
              <p style="color:#4b5563;font-size:12px;margin:0;text-align:center;line-height:1.6;">
                S3 Dashboard · AI-Powered Career Intelligence Platform<br>
                This email was sent to ${name}. If you have questions, contact support.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function POST(request) {
  try {
    // ── Rate limit ────────────────────────────────────────────────────────
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '0.0.0.0';

    const limit = checkResetLimit(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { message: `Too many reset attempts. Try again in ${Math.ceil(limit.retryAfter / 60)} minutes.` },
        { status: 429 }
      );
    }

    const { email } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ message: 'Valid email address is required' }, { status: 400 });
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = DB_NAME ? client.db(DB_NAME) : client.db();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({
      email: email.trim().toLowerCase(),
    });

    // ── Always return same message — prevents user enumeration ────────────
    // Don't reveal whether email exists or not
    const GENERIC_MSG = 'If an account exists with that email, a reset link has been sent.';

    if (!user) {
      await client.close();
      return NextResponse.json({ message: GENERIC_MSG });
    }

    // ── Generate secure reset token ───────────────────────────────────────
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          resetTokenHash,
          resetTokenExpiry,
          updatedAt: new Date(),
        },
      }
    );

    await client.close();

    // ── Send email ────────────────────────────────────────────────────────
    const resetUrl = `${APP_URL}/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"S3 Dashboard" <${GMAIL_USER}>`,
      to: user.email,
      subject: 'Reset your S3 Dashboard password',
      html: buildResetEmail(resetUrl, user.name),
    });

    return NextResponse.json({ message: GENERIC_MSG });
  } catch (error) {
    console.error('[ForgotPassword] Error:', error);
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}