'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { mentorApi } from '@/lib/api';

export default function MentorDashboardGate() {
  const { getUserId, isMentor, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    // Not a mentor → send to student dashboard
    if (!isMentor()) {
      router.push('/dashboard');
      return;
    }

    const userId = getUserId();
    if (!userId) return;

    // Check if mentor profile is set up
    mentorApi.getProfile(userId)
      .then(() => {
        // Profile exists → go to main mentor dashboard
        router.push('/mentor-dashboard/home');
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          // No profile yet → go to setup
          router.push('/mentor-dashboard/setup');
        } else {
          // Backend down etc → still try setup
          router.push('/mentor-dashboard/setup');
        }
      });
  }, [authLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>
  );
}