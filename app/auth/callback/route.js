'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const to = searchParams.get('to') || '/dashboard';

    // Read the short-lived oauth_sync cookie and store token in localStorage
    const cookies = document.cookie.split(';');
    const syncCookie = cookies.find(c => c.trim().startsWith('oauth_sync='));
    const token = syncCookie?.split('=')?.[1]?.trim();

    if (token) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('authEvent', `login:${Date.now()}`);
      // Immediately clear the cookie
      document.cookie = 'oauth_sync=; max-age=0; path=/auth/callback';
    }

    router.replace(to);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: 'var(--background)' }}>
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      </div>
      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
        Signing you in…
      </p>
    </div>
  );
}