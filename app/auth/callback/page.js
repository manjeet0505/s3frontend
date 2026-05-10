'use client';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const to = searchParams.get('to') || '/dashboard';
    const cookies = document.cookie.split(';');
    const syncCookie = cookies.find(c => c.trim().startsWith('oauth_sync='));
    const token = syncCookie?.split('=')?.[1]?.trim();
    if (token) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('authEvent', `login:${Date.now()}`);
      document.cookie = 'oauth_sync=; max-age=0; path=/auth/callback';
    }
    router.replace(to);
  }, []);

  return null;
}

export default function OAuthCallbackPage() {
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
      <Suspense fallback={null}>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}